'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '../../lib/api';
import { useToast } from '../../components/Toast';

const statusColor = (s: string) => {
  if (s === 'Shortlisted') return 'badge-success';
  if (s === 'Under Review') return 'badge-warning';
  return 'badge-neutral';
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res: any = await apiClient.get('/candidates');
        setCandidates(res.data?.data || []);
      } catch (err) {
        toast.error('Failed to load candidates');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
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
          <h1 className="text-2xl font-bold">Talent Pool</h1>
          <p className="text-sm text-[#71717a] mt-1">All candidates across your job pipelines</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-[#a1a1aa] uppercase tracking-wider border-b border-[#e4e4e7]">
              <th className="px-6 py-3 font-medium">Candidate</th>
              <th className="px-6 py-3 font-medium">Headline</th>
              <th className="px-6 py-3 font-medium">Location</th>
              <th className="px-6 py-3 font-medium">AI Score</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-[#71717a]">
                  No candidates found in your pipeline yet.
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
                  <td className="px-6 py-4 text-sm text-[#71717a]">{c.headline || c.appliedJob?.title || 'Unknown Role'}</td>
                  <td className="px-6 py-4 text-sm text-[#71717a]">{c.location || 'Not specified'}</td>
                  <td className="px-6 py-4 font-bold text-sm">
                    {c.evaluations && c.evaluations.length > 0 ? `${c.evaluations[0].matchScore}%` : 'Pending'}
                  </td>
                  <td className="px-6 py-4"><span className={`badge ${statusColor(c.status || 'New')}`}>{c.status || 'New'}</span></td>
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
