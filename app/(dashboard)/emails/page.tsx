'use client';

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import apiClient from '../../lib/api';
import { useToast } from '../../components/Toast';
import { getApiErrorMessage } from '../../lib/errors';
import type { Job } from '../../lib/types';

// EmailJS config — set these in .env.local / Vercel env vars
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

interface ShortlistedCandidate {
  _id: string;
  rank: number;
  overallScore: number;
  candidate: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export default function EmailsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [nextSteps, setNextSteps] = useState('We will be in touch shortly with further details about the interview process.');
  const [progress, setProgress] = useState({ sent: 0, total: 0 });
  const toast = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await apiClient.get<{ data?: Job[] }>('/jobs');
        const allJobs = res.data?.data || [];
        setJobs(allJobs);
        if (allJobs.length > 0) setSelectedJob(allJobs[0]._id || '');
      } catch {
        toast.error('Failed to load job pipelines');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [toast]);

  const handleSend = async () => {
    if (!selectedJob) {
      toast.error('Please select a job pipeline');
      return;
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast.error('EmailJS is not configured. Please set NEXT_PUBLIC_EMAILJS_* environment variables.');
      return;
    }

    setSending(true);
    setSent(false);

    try {
      // Fetch shortlisted candidates for this job
      const res = await apiClient.get<{ data?: { results?: ShortlistedCandidate[] } }>(`/screening/${selectedJob}?shortlistOnly=true`);
      const results: ShortlistedCandidate[] = res.data?.data?.results || [];
      const job = jobs.find(j => j._id === selectedJob);

      const eligible = results.filter(r => r.candidate?.email);

      if (eligible.length === 0) {
        toast.error('No shortlisted candidates with email addresses found.');
        setSending(false);
        return;
      }

      setProgress({ sent: 0, total: eligible.length });

      let sentCount = 0;
      let failCount = 0;

      for (const result of eligible) {
        const candidateName = [result.candidate.firstName, result.candidate.lastName].filter(Boolean).join(' ') || 'Candidate';

        try {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              to_name: candidateName,
              to_email: result.candidate.email,
              job_title: job?.title || 'the position',
              company_name: 'our company',
              rank: result.rank,
              score: result.overallScore,
              next_steps: nextSteps,
            },
            EMAILJS_PUBLIC_KEY
          );
          sentCount++;
          setProgress(p => ({ ...p, sent: sentCount }));
        } catch (err) {
          console.error(`Failed to send to ${result.candidate.email}:`, err);
          failCount++;
        }

        // Small delay between sends
        await new Promise(r => setTimeout(r, 300));
      }

      if (sentCount > 0) {
        toast.success(`${sentCount} email${sentCount > 1 ? 's' : ''} sent successfully${failCount > 0 ? `, ${failCount} failed` : ''}`);
        setSent(true);
      } else {
        toast.error('All emails failed to send. Check your EmailJS configuration.');
      }
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to fetch shortlisted candidates.'));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto flex items-center justify-center min-h-[50vh]">
        <svg className="animate-spin h-8 w-8 text-[#09090b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Communications</h1>
        <p className="text-sm text-[#71717a] mt-1">Notify shortlisted candidates from screened pipelines</p>
      </div>

      <div className="card p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Select Job Pipeline</label>
          {jobs.length === 0 ? (
            <p className="text-sm text-[#a1a1aa]">No jobs found. Create a job first.</p>
          ) : (
            <select
              value={selectedJob}
              onChange={(e) => { setSelectedJob(e.target.value); setSent(false); }}
              className="input w-full bg-white"
            >
              {jobs.map(j => (
                <option key={j._id} value={j._id}>{j.title} — {j.shortlistSize || 0} shortlisted</option>
              ))}
            </select>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Next Steps Message</label>
          <textarea
            value={nextSteps}
            onChange={(e) => setNextSteps(e.target.value)}
            rows={3}
            className="input w-full resize-none"
            placeholder="Describe what happens next for shortlisted candidates..."
          />
        </div>

        <div className="bg-[#fafafa] border border-[#e4e4e7] rounded-lg p-6 space-y-3">
          <h3 className="font-medium text-sm">What happens when you send?</h3>
          <ul className="text-sm text-[#71717a] space-y-2 list-disc pl-4">
            <li>System fetches the AI-determined shortlist for this job</li>
            <li>Sends each shortlisted candidate a personalized notification via EmailJS</li>
            <li>Emails are sent directly from your browser — no SMTP required</li>
          </ul>
        </div>

        {sending && progress.total > 0 && (
          <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-lg p-4 text-sm text-[#0369a1]">
            Sending {progress.sent} / {progress.total} emails...
          </div>
        )}

        {sent ? (
          <div className="bg-[#dcfce7] border border-[#bbf7d0] text-[#166534] rounded-lg p-4 text-sm text-center font-medium">
            ✓ Emails dispatched successfully to all shortlisted candidates
          </div>
        ) : (
          <button
            onClick={handleSend}
            disabled={sending || jobs.length === 0}
            className="btn-primary w-full disabled:opacity-50"
          >
            {sending ? `Sending ${progress.sent}/${progress.total}...` : 'Send Notification Emails'}
          </button>
        )}
      </div>
    </div>
  );
}
