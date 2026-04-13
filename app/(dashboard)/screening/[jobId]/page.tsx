'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import apiClient from '../../../lib/api';
import { useToast } from '../../../components/Toast';

  // Removed mockResults

export default function ScreeningResults() {
  const { jobId } = useParams() as { jobId: string };
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const scoreKeys = ['skills', 'experience', 'projects', 'credibility', 'companyFit'] as const;
  const scoreLabels = ['Skills', 'Experience', 'Projects', 'Credibility', 'Fit'];

  useEffect(() => {
    if (!jobId) return;
    const fetchResults = async () => {
      try {
        const res: any = await apiClient.get(`/screening/${jobId}`);
        setResults(res.data?.results || []);
      } catch (err) {
        toast.error('Failed to load screening results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [jobId]);

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex items-center justify-center min-h-[50vh]">
        <svg className="animate-spin h-8 w-8 text-[#09090b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in relative">
      <Link href={`/jobs/${jobId}`} className="text-sm text-[#71717a] hover:text-black mb-4 inline-block">← Back to Job</Link>
      
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">AI Ranked Shortlist</h1>
          <p className="text-sm text-[#71717a] mt-1">Top candidates ranked by Gemini AI analysis</p>
        </div>
        <Link href="/emails" className="btn-primary">Notify Candidates</Link>
      </div>

      <div className="space-y-6">
        {results.length === 0 ? (
          <div className="text-center py-12 text-[#71717a]">
            No candidates have been automatically screened for this pipeline yet.
          </div>
        ) : (
          results.map((r, index) => (
            <div key={r._id || index} className="card p-6 relative">
              {/* Rank */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#09090b] text-white flex items-center justify-center text-xs font-bold shadow-md">
                #{r.rank}
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Info */}
                <div className="lg:w-1/3 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#09090b] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      {r.candidate?.firstName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h2 className="font-bold">{r.candidate?.firstName} {r.candidate?.lastName}</h2>
                      <p className="text-xs text-[#71717a] mt-0.5">{r.candidate?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg border border-[#e4e4e7]">
                    <span className="text-sm text-[#71717a] font-medium">Match Score</span>
                    <span className="text-xl font-bold">{r.matchScore}%</span>
                  </div>
                  <Link href={`/candidates/${r.candidate?._id}`} className="btn-outline w-full text-center block text-sm">View Full Profile</Link>
                </div>

                {/* Right: Breakdown */}
                <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Score Bars */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Algorithm Breakdown</h3>
                    {scoreKeys.map((key, i) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-xs text-[#71717a] w-20">{scoreLabels[i]}</span>
                        <div className="flex-1 h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
                          <div className="h-full bg-[#09090b] rounded-full" style={{ width: `${r.scores?.[key] || 0}%` }} />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{r.scores?.[key] || 0}</span>
                      </div>
                    ))}
                  </div>

                  {/* Reasoning */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">AI Justification</h3>
                    <p className="text-xs text-[#71717a] leading-relaxed line-clamp-3" title={r.reasoning}>{r.reasoning}</p>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="p-2 rounded-lg bg-[#dcfce7]/50 border border-[#bbf7d0]">
                        <p className="text-[10px] font-semibold text-[#166534] mb-1">Strengths</p>
                        <ul className="text-[10px] text-[#166534]/80 space-y-0.5 ml-1">
                          {r.strengths?.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                        </ul>
                      </div>
                      <div className="p-2 rounded-lg bg-[#fef2f2]/50 border border-[#fecaca]">
                        <p className="text-[10px] font-semibold text-[#991b1b] mb-1">Gaps</p>
                        <ul className="text-[10px] text-[#991b1b]/80 space-y-0.5 ml-1">
                          {r.weaknesses?.map((w: string, i: number) => <li key={i}>• {w}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
