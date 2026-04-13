'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '../../lib/api';
import { useToast } from '../../components/Toast';

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    open: 'badge-success', screening: 'badge-warning', completed: 'badge-info', draft: 'badge-neutral',
  };
  return styles[status] || 'badge-neutral';
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res: any = await apiClient.get('/jobs');
        setJobs(res.data?.data || []);
      } catch (err: any) {
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex items-center justify-center min-h-[50vh]">
        <svg className="animate-spin h-8 w-8 text-[#09090b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in relative">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Job Pipelines</h1>
          <p className="text-sm text-[#71717a] mt-1">Manage your active recruitment positions</p>
        </div>
        <Link href="/jobs/create" className="btn-primary">+ New Job</Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-[#a1a1aa] uppercase tracking-wider border-b border-[#e4e4e7]">
              <th className="px-6 py-3 font-medium">Position</th>
              <th className="px-6 py-3 font-medium">Department</th>
              <th className="px-6 py-3 font-medium">Location</th>
              <th className="px-6 py-3 font-medium">Candidates</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Posted</th>
              <th className="px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-[#71717a]">
                  No active jobs found. Create your first listing to start recruiting.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job._id || job.id} className="table-row">
                  <td className="px-6 py-4 font-medium">{job.title}</td>
                  <td className="px-6 py-4 text-[#71717a] text-sm">{job.department}</td>
                  <td className="px-6 py-4 text-[#71717a] text-sm">{job.location}</td>
                  <td className="px-6 py-4 text-sm">{job.candidates?.length || 0}</td>
                  <td className="px-6 py-4"><span className={`badge ${statusBadge(job.status || 'open')}`}>{job.status || 'open'}</span></td>
                  <td className="px-6 py-4 text-[#a1a1aa] text-sm">{new Date(job.createdAt).toLocaleDateString() || 'Recently'}</td>
                  <td className="px-6 py-4"><Link href={`/jobs/${job._id || job.id}`} className="text-sm font-medium hover:underline">View →</Link></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
