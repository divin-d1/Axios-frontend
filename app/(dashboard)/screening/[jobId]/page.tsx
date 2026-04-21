'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import apiClient from '../../../lib/api';
import { useToast } from '../../../components/Toast';
import {
  CandidateIdentity,
  getCandidateDisplayName,
  getCandidateInitials,
  getEvaluationModeLabel,
  getScreeningModeSummary,
} from '../../../lib/candidates';

const scoreBreakdown = [
  { key: 'skillMatchScore', label: 'Skills' },
  { key: 'experienceScore', label: 'Experience' },
  { key: 'projectScore', label: 'Projects' },
  { key: 'credibilityScore', label: 'Credibility' },
  { key: 'companyFitScore', label: 'Fit' },
] as const;

type ScreeningResultItem = {
  _id?: string;
  candidate?: CandidateIdentity & { _id?: string; email?: string };
  overallScore?: number;
  skillMatchScore?: number;
  experienceScore?: number;
  projectScore?: number;
  credibilityScore?: number;
  companyFitScore?: number;
  rank?: number;
  strengths?: string[];
  weaknesses?: string[];
  reasoning?: string;
  evaluationMode?: string;
};

type ScreeningJob = {
  _id?: string;
  title?: string;
  company?: string;
  shortlistSize?: number;
};

type ScreeningMeta = {
  usedLocalFallback?: boolean;
  screeningMode?: string | null;
  totalResults?: number;
  shortlistedResults?: number;
};

type ScreeningResponse = {
  data?: {
    data?: {
      results?: ScreeningResultItem[];
      job?: ScreeningJob | null;
      meta?: ScreeningMeta | null;
    };
  };
};

const badgeClassName = (evaluationMode?: string) => (
  evaluationMode === 'local-fallback'
    ? 'bg-amber-50 text-amber-800 border border-amber-200'
    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
);

export default function ScreeningResults() {
  const { jobId } = useParams() as { jobId: string };
  const [results, setResults] = useState<ScreeningResultItem[]>([]);
  const [job, setJob] = useState<ScreeningJob | null>(null);
  const [meta, setMeta] = useState<ScreeningMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (!jobId) return;

    const fetchResults = async () => {
      try {
        const res = await apiClient.get(`/screening/${jobId}?shortlistOnly=true`) as ScreeningResponse;
        const payload = res.data?.data || {};

        setResults(payload.results || []);
        setJob(payload.job || null);
        setMeta(payload.meta || null);
      } catch {
        toast.error('Failed to load screening results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [jobId, toast]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto flex items-center justify-center min-h-[50vh]">
        <svg className="animate-spin h-8 w-8 text-[#09090b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  const modeSummary = getScreeningModeSummary(meta?.screeningMode);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in relative">
      <Link href={`/jobs/${jobId}`} className="text-sm text-[#71717a] hover:text-black mb-4 inline-block">← Back to Job</Link>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">AI Ranked Shortlist</h1>
          <p className="text-sm text-[#71717a]">
            {job?.title ? `${job.title} • ` : ''}{modeSummary.message}
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-[#71717a]">
            <span className="px-2.5 py-1 rounded-full bg-[#f4f4f5] border border-[#e4e4e7]">
              Showing {results.length} shortlisted candidates
            </span>
            {(meta?.totalResults ?? 0) > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-[#f4f4f5] border border-[#e4e4e7]">
                {meta?.shortlistedResults ?? 0} shortlisted out of {meta?.totalResults ?? 0} screened
              </span>
            )}
          </div>
        </div>
        <Link href="/emails" className="btn-primary w-full md:w-auto text-center">Notify Candidates</Link>
      </div>

      {meta?.usedLocalFallback && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">{modeSummary.eyebrow}</p>
          <p className="text-sm text-amber-900 leading-relaxed">{modeSummary.message}</p>
        </div>
      )}

      <div className="space-y-6">
        {results.length === 0 ? (
          <div className="text-center py-12 text-[#71717a]">
            No shortlisted candidates have been screened for this pipeline yet.
          </div>
        ) : (
          results.map((result, index) => (
            <div key={result._id || index} className="card p-4 sm:p-6 relative">
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:absolute sm:top-4 sm:right-4 sm:mb-0">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeClassName(result.evaluationMode)}`}>
                  {getEvaluationModeLabel(result.evaluationMode)}
                </span>
                <div className="w-8 h-8 rounded-full bg-[#09090b] text-white flex items-center justify-center text-xs font-bold shadow-md">
                  #{result.rank}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 sm:mt-8">
                <div className="lg:w-1/3 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#09090b] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      {getCandidateInitials(result.candidate)}
                    </div>
                    <div>
                      <h2 className="font-bold">{getCandidateDisplayName(result.candidate)}</h2>
                      <p className="text-xs text-[#71717a] mt-0.5">{result.candidate?.email || 'No email available'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg border border-[#e4e4e7]">
                    <span className="text-sm text-[#71717a] font-medium">Match Score</span>
                    <span className="text-xl font-bold">{result.overallScore}%</span>
                  </div>

                  <Link href={`/candidates/${result.candidate?._id}`} className="btn-outline w-full text-center block text-sm">View Full Profile</Link>
                </div>

                <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Algorithm Breakdown</h3>
                    {scoreBreakdown.map((item) => {
                      const score = result[item.key] || 0;

                      return (
                        <div key={item.key} className="flex items-center gap-2">
                          <span className="text-xs text-[#71717a] w-20">{item.label}</span>
                          <div className="flex-1 h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
                            <div className="h-full bg-[#09090b] rounded-full" style={{ width: `${score}%` }} />
                          </div>
                          <span className="text-xs font-medium w-8 text-right">{score}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mt-4">Screening Justification</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <div className="p-3 rounded-lg bg-white border border-black">
                        <p className="text-[11px] font-bold text-black mb-2">Strengths</p>
                        {(result.strengths?.length ?? 0) > 0 ? (
                          <ul className="text-[11px] text-black space-y-1 ml-1">
                            {result.strengths?.map((strength: string, strengthIndex: number) => <li key={strengthIndex}>• {strength}</li>)}
                          </ul>
                        ) : (
                          <p className="text-[11px] text-black">No explicit strengths listed.</p>
                        )}
                      </div>
                      <div className="p-3 rounded-lg bg-white border border-black">
                        <p className="text-[11px] font-bold text-black mb-2">Gaps</p>
                        {(result.weaknesses?.length ?? 0) > 0 ? (
                          <ul className="text-[11px] text-black space-y-1 ml-1">
                            {result.weaknesses?.map((weakness: string, weaknessIndex: number) => <li key={weaknessIndex}>• {weakness}</li>)}
                          </ul>
                        ) : (
                          <p className="text-[11px] text-black">No explicit gaps listed.</p>
                        )}
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
