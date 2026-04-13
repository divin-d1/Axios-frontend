'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const mockJob = {
  title: 'Senior Backend Engineer', department: 'Engineering', location: 'Kigali, RW',
  status: 'screening', candidates: 64, shortlistSize: 5,
  description: 'We are looking for an experienced backend engineer to design, develop, and maintain scalable server-side applications. The ideal candidate has deep expertise in Node.js, API design, and database management.',
  requiredSkills: ['Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs', 'Docker'],
  scoringWeights: { skills: 30, experience: 25, projects: 20, credibility: 15, companyFit: 10 },
};

export default function JobDetailPage() {
  const { id } = useParams();

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <Link href="/jobs" className="text-sm text-[#71717a] hover:text-black mb-4 inline-block">← Back to Jobs</Link>
      
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{mockJob.title}</h1>
          <p className="text-sm text-[#71717a] mt-1">{mockJob.department} · {mockJob.location}</p>
        </div>
        <span className="badge badge-warning text-sm">{mockJob.status}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="stat-card"><p className="text-sm text-[#71717a]">Candidates</p><p className="text-2xl font-bold">{mockJob.candidates}</p></div>
        <div className="stat-card"><p className="text-sm text-[#71717a]">Target Shortlist</p><p className="text-2xl font-bold">{mockJob.shortlistSize}</p></div>
        <div className="stat-card"><p className="text-sm text-[#71717a]">Required Skills</p><p className="text-2xl font-bold">{mockJob.requiredSkills.length}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Description */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">Description</h2>
          <p className="text-sm text-[#71717a] leading-relaxed">{mockJob.description}</p>
          
          <h3 className="font-medium text-sm pt-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {mockJob.requiredSkills.map(s => (
              <span key={s} className="badge badge-neutral">{s}</span>
            ))}
          </div>
        </div>

        {/* Scoring Weights */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">AI Scoring Weights</h2>
          <div className="space-y-3">
            {Object.entries(mockJob.scoringWeights).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-sm text-[#71717a] capitalize w-28">{key}</span>
                <div className="flex-1 h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#09090b] rounded-full" style={{ width: `${value}%` }} />
                </div>
                <span className="text-sm font-medium w-10 text-right">{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <button className="btn-primary" onClick={() => alert('Mock: AI Screening triggered')}>
          Run AI Screening
        </button>
        <Link href={`/screening/${id}`} className="btn-outline">View Screening Results</Link>
      </div>
    </div>
  );
}
