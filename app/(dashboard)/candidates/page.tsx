'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import apiClient from '../../lib/api';
import { useToast } from '../../components/Toast';
import { getApiErrorMessage } from '../../lib/errors';
import type { Candidate, Job } from '../../lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://axios-2mom.onrender.com/api' : 'http://localhost:5000/api');

const getToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? match[1] : null;
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const fetchCandidates = useCallback(async () => {
    try {
      const res = await apiClient.get<{ data?: Candidate[] }>('/candidates');
      setCandidates(res.data?.data || []);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to load candidates'));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await apiClient.get<{ data?: Job[] }>('/jobs');
        const allJobs = res.data?.data || [];
        setJobs(allJobs);
        if (allJobs.length > 0) setSelectedJob(allJobs[0]._id || '');
      } catch {
        console.error('Failed to load jobs');
      }
    };
    fetchJobs();
    fetchCandidates();
  }, [fetchCandidates]);

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedJob) { toast.error('Select a job pipeline first'); return; }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('spreadsheet', file);

      const token = getToken();
      const res = await fetch(`${BASE_URL}/candidates/upload/${selectedJob}`, {
        method: 'POST',
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw { response: { data } };

      toast.success(data.message || `${data.count || 0} candidates imported!`);
      fetchCandidates();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to upload file'));
    } finally {
      setUploading(false);
      if (csvInputRef.current) csvInputRef.current.value = '';
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedJob) { toast.error('Select a job pipeline first'); return; }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const token = getToken();
      const res = await fetch(`${BASE_URL}/candidates/resume/${selectedJob}`, {
        method: 'POST',
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw { response: { data } };

      toast.success(data.message || 'Resume parsed and candidate added!');
      fetchCandidates();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to upload resume'));
    } finally {
      setUploading(false);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto flex items-center justify-center min-h-[50vh]">
        <svg className="animate-spin h-8 w-8 text-[#09090b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto animate-fade-in relative">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Talent Pool</h1>
          <p className="text-sm text-[#71717a] mt-1">All candidates across your job pipelines</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-1">Add Candidates</h2>
        <p className="text-sm text-[#71717a] mb-4">Select a job pipeline, then upload a CSV/Excel or PDF resume.</p>

        {/* Job Pipeline Selector */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-1.5 block">Assign to Job Pipeline *</label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="input w-full md:w-1/2 bg-white"
          >
            <option value="" disabled>Select a job pipeline...</option>
            {jobs.map(j => (
              <option key={j._id} value={j._id}>{j.title} — {j.department || 'General'}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CSV/Excel */}
          <div
            onClick={() => !uploading && selectedJob && csvInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              selectedJob ? 'border-[#e4e4e7] cursor-pointer hover:border-[#09090b] hover:bg-[#fafafa]' : 'border-[#f4f4f5] opacity-50 cursor-not-allowed'
            }`}
          >
            <input ref={csvInputRef} disabled={uploading} type="file" accept=".csv,.xlsx,.xls" onChange={handleCSVUpload} className="hidden" />
            <svg className="w-8 h-8 mx-auto mb-3 text-[#a1a1aa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            <p className="font-medium text-sm">Bulk Upload (CSV / Excel)</p>
            <p className="text-xs text-[#a1a1aa] mt-1">Columns: firstName, lastName, email, headline, location, skills</p>
          </div>

          {/* PDF Resume */}
          <div
            onClick={() => !uploading && selectedJob && resumeInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              selectedJob ? 'border-[#e4e4e7] cursor-pointer hover:border-[#09090b] hover:bg-[#fafafa]' : 'border-[#f4f4f5] opacity-50 cursor-not-allowed'
            }`}
          >
            <input ref={resumeInputRef} disabled={uploading} type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
            <svg className="w-8 h-8 mx-auto mb-3 text-[#a1a1aa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M9 13h6" /><path d="M9 17h3" />
            </svg>
            <p className="font-medium text-sm">Upload Resume (PDF)</p>
            <p className="text-xs text-[#a1a1aa] mt-1">AI will parse and extract candidate data</p>
          </div>
        </div>

        {uploading && (
          <div className="flex items-center gap-2 mt-4 text-sm text-[#71717a]">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing upload...
          </div>
        )}
      </div>

      {/* Candidate Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-[#a1a1aa] uppercase tracking-wider border-b border-[#e4e4e7]">
              <th className="px-6 py-3 font-medium">Candidate</th>
              <th className="px-6 py-3 font-medium">Job Pipeline</th>
              <th className="px-6 py-3 font-medium">Location</th>
              <th className="px-6 py-3 font-medium">Source</th>
              <th className="px-6 py-3 font-medium">Added</th>
              <th className="px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-[#71717a]">
                  No candidates found. Upload a CSV or PDF resume above to get started.
                </td>
              </tr>
            ) : (
              candidates.map((c) => (
                <tr key={c._id || c.id} className="table-row">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#09090b] text-white flex items-center justify-center text-xs font-bold">{(c.firstName?.[0] || '?')}</div>
                      <div>
                        <p className="font-medium text-sm">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-[#a1a1aa]">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#71717a]">{c.job?.title || 'Unassigned'}</td>
                  <td className="px-6 py-4 text-sm text-[#71717a]">{c.location || 'Not specified'}</td>
                  <td className="px-6 py-4"><span className="badge badge-neutral text-xs">{c.source || 'manual'}</span></td>
                  <td className="px-6 py-4 text-sm text-[#a1a1aa]">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-4"><Link href={`/candidates/${c._id || c.id}`} className="text-sm font-medium hover:underline">Profile →</Link></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
