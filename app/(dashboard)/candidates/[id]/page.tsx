'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import apiClient from '../../../lib/api';
import { useToast } from '../../../components/Toast';

export default function CandidateDetailPage() {
  const { id } = useParams() as { id: string };
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      try {
        const res: any = await apiClient.get(`/candidates/${id}`);
        setCandidate(res.data?.candidate || null);
      } catch (err) {
        toast.error('Failed to load candidate profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading || !candidate) {
    return (
      <div className="p-8 max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
        {loading ? (
          <svg className="animate-spin h-8 w-8 text-[#09090b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <div className="text-[#71717a]">Candidate not found</div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in relative">
      <Link href="/candidates" className="text-sm text-[#71717a] hover:text-black mb-4 inline-block">← Back to Talent Pool</Link>
      
      {/* Header */}
      <div className="card p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-[#09090b] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {candidate.firstName?.charAt(0) || '?'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{candidate.firstName} {candidate.lastName}</h1>
            <p className="text-sm text-[#71717a] mt-1">{candidate.headline || candidate.appliedJob?.title || 'Unknown Role'}</p>
            <p className="text-xs text-[#a1a1aa] mt-1">{candidate.email}</p>
          </div>
          <div className="text-right">
            <span className="badge badge-success">{candidate.status || 'New'}</span>
          </div>
        </div>
        {candidate.bio && <p className="text-sm text-[#71717a] mt-4 leading-relaxed">{candidate.bio}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">Skills</h2>
          <div>
            <h3 className="text-xs text-[#a1a1aa] uppercase tracking-wider mb-2">Technical & Soft Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.map((s: string) => <span key={s} className="badge badge-neutral">{s}</span>)}
              {(!candidate.skills || candidate.skills.length === 0) && <span className="text-sm text-[#a1a1aa]">No skills mapped from resume.</span>}
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">Experience</h2>
          {candidate.experience?.length ? candidate.experience.map((exp: any, i: number) => (
            <div key={i} className="pb-4 border-b border-[#f4f4f5] last:border-0 last:pb-0">
              <h3 className="font-medium text-sm">{exp.title}</h3>
              <p className="text-xs text-[#71717a]">{exp.company} · {exp.duration}</p>
              <p className="text-sm text-[#a1a1aa] mt-1">{exp.description}</p>
            </div>
          )) : <div className="text-sm text-[#a1a1aa]">No prior experience listed.</div>}
        </div>

        {/* Education */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">Education</h2>
          {candidate.education?.length ? candidate.education.map((ed: any, i: number) => (
            <div key={i} className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm">{ed.degree}</h3>
                <p className="text-xs text-[#71717a]">{ed.institution}</p>
              </div>
              <span className="text-xs text-[#a1a1aa]">{ed.year}</span>
            </div>
          )) : <div className="text-sm text-[#a1a1aa]">No education data available.</div>}
        </div>

        {/* AI Analysis (If Screened) */}
        {candidate.evaluations?.length > 0 && (
          <div className="card p-6 space-y-3">
            <h2 className="font-semibold">AI Evaluation</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#71717a]">Match Score</span><span className="font-bold">{candidate.evaluations[0].matchScore}%</span></div>
              <div className="mt-4"><span className="text-[#71717a] block mb-1">Reasoning</span><span className="text-xs leading-relaxed text-[#09090b]">{candidate.evaluations[0].reasoning}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
