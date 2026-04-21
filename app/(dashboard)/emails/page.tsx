'use client';

import { useState, useEffect } from 'react';
import apiClient from '../../lib/api';
import { useToast } from '../../components/Toast';
import { getApiErrorMessage } from '../../lib/errors';
import type { Job } from '../../lib/types';

export default function EmailsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
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
    setSending(true);
    try {
      const res = await apiClient.post<{ message?: string }>(`/emails/shortlist/${selectedJob}`);
      toast.success(res.data?.message || 'Emails dispatched successfully!');
      setSent(true);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Email dispatch is currently disabled. SMTP is not configured.'));
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
            <select value={selectedJob} onChange={(e) => { setSelectedJob(e.target.value); setSent(false); }} className="input w-full bg-white">
              {jobs.map(j => <option key={j._id} value={j._id}>{j.title} — {j.shortlistSize || 0} shortlisted</option>)}
            </select>
          )}
        </div>

        <div className="bg-[#fafafa] border border-[#e4e4e7] rounded-lg p-6 space-y-3">
          <h3 className="font-medium text-sm">What happens when you send?</h3>
          <ul className="text-sm text-[#71717a] space-y-2 list-disc pl-4">
            <li>System extracts the AI-determined shortlist for this job</li>
            <li>Generates personalized &ldquo;Next Steps&rdquo; emails for each candidate</li>
            <li>Sends each shortlisted candidate a clear and professional update</li>
          </ul>
        </div>

        {sent ? (
          <div className="bg-[#dcfce7] border border-[#bbf7d0] text-[#166534] rounded-lg p-4 text-sm text-center font-medium">
            ✓ Emails dispatched successfully to all shortlisted candidates
          </div>
        ) : (
          <button onClick={handleSend} disabled={sending || jobs.length === 0} className="btn-primary w-full disabled:opacity-50">
            {sending ? 'Dispatching...' : 'Send Notification Emails'}
          </button>
        )}
      </div>
    </div>
  );
}
