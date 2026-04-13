'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const mockResults = [
  {
    id: '1', rank: 1, firstName: 'Sarah', lastName: 'Kamana', overallScore: 94,
    skillMatchScore: 96, experienceScore: 90, projectScore: 95, credibilityScore: 88, companyFitScore: 92,
    reasoning: 'Exceptional match across all criteria. Strong ML infrastructure background with production-grade deployment experience at scale. Published research aligns with company specialization.',
    strengths: ['Deep ML pipeline expertise', 'Production deployment experience', 'Published researcher'],
    weaknesses: ['Limited frontend experience', 'No management background'],
  },
  {
    id: '2', rank: 2, firstName: 'James', lastName: 'Mugisha', overallScore: 91,
    skillMatchScore: 92, experienceScore: 94, projectScore: 85, credibilityScore: 90, companyFitScore: 88,
    reasoning: 'Senior-level backend architect with extensive API design experience. Strong systems thinking and infrastructure knowledge. Excellent culture fit based on open-source contributions.',
    strengths: ['10+ years backend experience', 'API architecture expert', 'Active OSS contributor'],
    weaknesses: ['Limited cloud-native experience', 'Narrow AI/ML exposure'],
  },
  {
    id: '3', rank: 3, firstName: 'Aline', lastName: 'Uwase', overallScore: 88,
    skillMatchScore: 90, experienceScore: 82, projectScore: 92, credibilityScore: 85, companyFitScore: 90,
    reasoning: 'Versatile full-stack developer with impressive project portfolio. Strong demonstration of rapid prototyping and shipping ability. Excellent alignment with startup-fast hiring philosophy.',
    strengths: ['Impressive project portfolio', 'Full-stack versatility', 'Rapid shipping ability'],
    weaknesses: ['4 years experience (less than ideal)', 'No formal CS degree'],
  },
];

export default function ScreeningResults() {
  const { jobId } = useParams();
  const scoreKeys = ['skillMatchScore', 'experienceScore', 'projectScore', 'credibilityScore', 'companyFitScore'] as const;
  const scoreLabels = ['Skills', 'Experience', 'Projects', 'Credibility', 'Fit'];

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <Link href={`/jobs/${jobId}`} className="text-sm text-[#71717a] hover:text-black mb-4 inline-block">← Back to Job</Link>
      
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">AI Ranked Shortlist</h1>
          <p className="text-sm text-[#71717a] mt-1">Top candidates ranked by Gemini AI analysis</p>
        </div>
        <Link href="/emails" className="btn-primary">Notify Candidates</Link>
      </div>

      <div className="space-y-6">
        {mockResults.map((r) => (
          <div key={r.id} className="card p-6 relative">
            {/* Rank */}
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#09090b] text-white flex items-center justify-center text-xs font-bold">
              #{r.rank}
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left: Info */}
              <div className="lg:w-1/3 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#09090b] text-white flex items-center justify-center text-sm font-bold">
                    {r.firstName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold">{r.firstName} {r.lastName}</h2>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg border border-[#e4e4e7]">
                  <span className="text-sm text-[#71717a]">Overall Score</span>
                  <span className="text-xl font-bold">{r.overallScore}%</span>
                </div>
                <Link href={`/candidates/${r.id}`} className="btn-outline w-full text-center block text-sm">View Full Profile</Link>
              </div>

              {/* Right: Breakdown */}
              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Score Bars */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Score Breakdown</h3>
                  {scoreKeys.map((key, i) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-xs text-[#71717a] w-20">{scoreLabels[i]}</span>
                      <div className="flex-1 h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
                        <div className="h-full bg-[#09090b] rounded-full" style={{ width: `${r[key]}%` }} />
                      </div>
                      <span className="text-xs font-medium w-8 text-right">{r[key]}</span>
                    </div>
                  ))}
                </div>

                {/* Reasoning */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">AI Justification</h3>
                  <p className="text-sm text-[#71717a] leading-relaxed">{r.reasoning}</p>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-2 rounded-lg bg-[#dcfce7]/50 border border-[#bbf7d0]">
                      <p className="text-[10px] font-semibold text-[#166534] mb-1">Strengths</p>
                      <ul className="text-[11px] text-[#166534]/80 space-y-0.5">{r.strengths.map((s, i) => <li key={i}>• {s}</li>)}</ul>
                    </div>
                    <div className="p-2 rounded-lg bg-[#fef2f2]/50 border border-[#fecaca]">
                      <p className="text-[10px] font-semibold text-[#991b1b] mb-1">Gaps</p>
                      <ul className="text-[11px] text-[#991b1b]/80 space-y-0.5">{r.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}</ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
