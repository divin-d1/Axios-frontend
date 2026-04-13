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
        setCandidate(res.data?.candidate || res.data?.data || null);
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
    <div className="p-8 max-w-5xl mx-auto animate-fade-in relative space-y-6">
      <Link href="/candidates" className="text-sm text-[#71717a] hover:text-black mb-4 inline-block">← Back to Talent Pool</Link>
      
      {/* Header */}
      <div className="card p-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-[#09090b] text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {candidate.firstName?.charAt(0) || '?'}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{candidate.firstName} {candidate.lastName}</h1>
                <p className="text-base text-[#71717a] mt-1">{candidate.headline || candidate.appliedJob?.title || 'Candidate'}</p>
              </div>
              <span className="badge badge-success">{candidate.status || 'New'}</span>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-[#71717a]">
              {candidate.email && (
                <div className="flex items-center gap-1.5 text-[#5e5e66]">
                  <svg className="w-3.5 h-3.5 text-[#a1a1aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  {candidate.email}
                </div>
              )}
              {candidate.location && (
                <div className="flex items-center gap-1.5 text-[#5e5e66]">
                  <svg className="w-3.5 h-3.5 text-[#a1a1aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {candidate.location}
                </div>
              )}
              {candidate.socialLinks?.linkedin && (
                <a href={candidate.socialLinks.linkedin.startsWith('http') ? candidate.socialLinks.linkedin : `https://${candidate.socialLinks.linkedin}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  LinkedIn
                </a>
              )}
              {candidate.socialLinks?.github && (
                <a href={candidate.socialLinks.github.startsWith('http') ? candidate.socialLinks.github : `https://${candidate.socialLinks.github}`} target="_blank" rel="noreferrer" className="text-[#09090b] hover:text-black hover:underline flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#5e5e66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  GitHub
                </a>
              )}
              {candidate.socialLinks?.portfolio && (
                <a href={candidate.socialLinks.portfolio.startsWith('http') ? candidate.socialLinks.portfolio : `https://${candidate.socialLinks.portfolio}`} target="_blank" rel="noreferrer" className="text-[#09090b] hover:text-black hover:underline flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#5e5e66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
        {candidate.bio && <p className="text-sm text-[#3f3f46] mt-6 leading-relaxed bg-[#fafafa] p-4 rounded-lg border border-[#f4f4f5]">{candidate.bio}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Experience */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-lg border-b border-[#f4f4f5] pb-2">Experience</h2>
            {candidate.experience?.length ? candidate.experience.map((exp: any, i: number) => (
              <div key={i} className="pb-4 border-b border-[#f4f4f5] last:border-0 last:pb-0 relative">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-base text-[#09090b]">{exp.role}</h3>
                  <span className="text-xs text-[#71717a] font-medium bg-[#f4f4f5] px-2 py-1 rounded">
                    {exp.startDate || ''} — {exp.endDate || (exp.isCurrent ? 'Present' : '')}
                  </span>
                </div>
                <p className="text-sm text-[#3f3f46] mb-2 font-medium">{exp.company}</p>
                {exp.description && <p className="text-sm text-[#71717a] leading-relaxed mb-2">{exp.description}</p>}
                {exp.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {exp.technologies.map((t: string, j: number) => (
                      <span key={j} className="text-[10px] uppercase tracking-wider font-semibold bg-[#e4e4e7] text-[#52525b] px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )) : <div className="text-sm text-[#a1a1aa] italic">No experience listed.</div>}
          </div>

          {/* Projects */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-lg border-b border-[#f4f4f5] pb-2">Projects</h2>
            {candidate.projects?.length ? candidate.projects.map((proj: any, i: number) => (
              <div key={i} className="pb-4 border-b border-[#f4f4f5] last:border-0 last:pb-0">
                <h3 className="font-medium text-base text-[#09090b]">{proj.name}</h3>
                <p className="text-sm text-[#71717a] leading-relaxed mt-1">{proj.description}</p>
              </div>
            )) : <div className="text-sm text-[#a1a1aa] italic">No projects listed.</div>}
          </div>

          {/* Education */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-lg border-b border-[#f4f4f5] pb-2">Education</h2>
            {candidate.education?.length ? candidate.education.map((ed: any, i: number) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-base text-[#09090b]">{ed.degree}</h3>
                  <p className="text-sm text-[#71717a] mt-0.5">{ed.institution} {ed.fieldOfStudy ? `— ${ed.fieldOfStudy}` : ''}</p>
                </div>
                <span className="text-xs text-[#71717a] font-medium bg-[#f4f4f5] px-2 py-1 rounded">
                  {ed.startYear ? `${ed.startYear} - ` : ''}{ed.endYear}
                </span>
              </div>
            )) : <div className="text-sm text-[#a1a1aa] italic">No education data available.</div>}
          </div>
        </div>

        <div className="space-y-6">
          {/* AI Analysis (If Screened) */}
          {candidate.evaluations?.length > 0 && (
            <div className="card border-[#09090b] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#09090b]"></div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg">AI Evaluation</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#71717a] uppercase tracking-wider font-semibold">Match</span>
                    <span className="text-xl font-bold">{candidate.evaluations[0].matchScore}%</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#f4f4f5]">
                  <h3 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2">Reasoning</h3>
                  <p className="text-sm leading-relaxed text-[#3f3f46]">{candidate.evaluations[0].reasoning}</p>
                </div>
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-lg border-b border-[#f4f4f5] pb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.length ? candidate.skills.map((s: any, i: number) => (
                <span key={i} className="badge badge-neutral bg-[#f4f4f5] text-[#3f3f46] hover:bg-[#e4e4e7] cursor-default border-[#e4e4e7]">
                  {typeof s === 'string' ? s : s.name}
                  {s.yearsOfExperience ? ` · ${s.yearsOfExperience}y` : ''}
                </span>
              )) : <span className="text-sm text-[#a1a1aa] italic">No skills listed.</span>}
            </div>
          </div>

          {/* Languages & Certifications */}
          <div className="card p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-lg border-b border-[#f4f4f5] pb-2 mb-3">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {candidate.languages?.length ? candidate.languages.map((l: any, i: number) => (
                  <span key={i} className="text-sm text-[#71717a]">
                    • {typeof l === 'string' ? l : l.name} 
                  </span>
                )) : <span className="text-sm text-[#a1a1aa] italic">None listed.</span>}
              </div>
            </div>

            {candidate.certifications?.length > 0 && (
              <div>
                <h2 className="font-semibold text-lg border-b border-[#f4f4f5] pb-2 mb-3">Certifications</h2>
                <div className="space-y-2">
                  {candidate.certifications.map((c: any, i: number) => (
                    <div key={i} className="text-sm">
                      <span className="text-[#09090b] font-medium block">{typeof c === 'string' ? c : c.name}</span>
                      {c.issuer && <span className="text-[#71717a] text-xs">Issued by {c.issuer}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
