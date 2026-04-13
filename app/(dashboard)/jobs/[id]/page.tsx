'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '../../../lib/api';
import { useToast } from '../../../components/Toast';

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    open: 'badge-success', screening: 'badge-warning', completed: 'badge-info', draft: 'badge-neutral',
  };
  return styles[status] || 'badge-neutral';
};

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const toast = useToast();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [screening, setScreening] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      try {
        const res: any = await apiClient.get(`/jobs/${id}`);
        setJob(res.data?.data || null);
      } catch (err: any) {
        const msg = err.response?.data?.error || 'Failed to load job details';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleRunScreening = async () => {
    setScreening(true);
    try {
      await apiClient.post(`/screening/${id}`);
      toast.success('AI Screening started successfully!');
      setTimeout(() => router.push(`/screening/${id}`), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to start screening');
    } finally {
      setScreening(false);
    }
  };

  if (loading || !job) {
    return (
      <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        {loading ? (
          <svg className="animate-spin h-8 w-8 text-[#09090b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <div className="text-center">
            <p className="text-[#71717a] mb-2">Job not found</p>
            <Link href="/jobs" className="text-sm font-medium hover:underline">← Back to Jobs</Link>
          </div>
        )}
      </div>
    );
  }

  const weights = job.scoringWeights || {};

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <Link href="/jobs" className="text-sm text-[#71717a] hover:text-black mb-4 inline-block">← Back to Jobs</Link>
      
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-sm text-[#71717a] mt-1">{job.department || 'General'} · {job.location || 'Remote'}</p>
        </div>
        <span className={`badge ${statusBadge(job.status || 'open')} text-sm`}>{job.status || 'open'}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="stat-card"><p className="text-sm text-[#71717a]">Candidates</p><p className="text-2xl font-bold">{job.totalApplicants || job.candidates?.length || 0}</p></div>
        <div className="stat-card"><p className="text-sm text-[#71717a]">Target Shortlist</p><p className="text-2xl font-bold">{job.shortlistSize || 0}</p></div>
        <div className="stat-card"><p className="text-sm text-[#71717a]">Required Skills</p><p className="text-2xl font-bold">{job.requiredSkills?.length || 0}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Description */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">Description</h2>
          <p className="text-sm text-[#71717a] leading-relaxed">{job.description || 'No description provided.'}</p>
          
          <h3 className="font-medium text-sm pt-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills?.length > 0 ? (
              job.requiredSkills.map((s: string) => (
                <span key={s} className="badge badge-neutral">{s}</span>
              ))
            ) : (
              <span className="text-sm text-[#a1a1aa]">No skills specified</span>
            )}
          </div>
        </div>

        {/* Scoring Weights */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">AI Scoring Weights</h2>
          <div className="space-y-3">
            {Object.keys(weights).length > 0 ? (
              Object.entries(weights).map(([key, value]: [string, any]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm text-[#71717a] capitalize w-28">{key}</span>
                  <div className="flex-1 h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#09090b] rounded-full" style={{ width: `${value}%` }} />
                  </div>
                  <span className="text-sm font-medium w-10 text-right">{value}%</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#a1a1aa]">Default AI weights will be applied</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <button className="btn-primary disabled:opacity-50 flex items-center gap-2" onClick={handleRunScreening} disabled={screening}>
          {screening ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running...
            </>
          ) : 'Run AI Screening'}
        </button>
        <Link href={`/screening/${id}`} className="btn-outline">View Screening Results</Link>
      </div>
    </div>
  );
}
