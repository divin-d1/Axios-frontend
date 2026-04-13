'use client';

import Link from 'next/link';

const mockCandidates = [
  { id: '1', firstName: 'Sarah', lastName: 'Kamana', email: 'sarah.k@gmail.com', headline: 'ML Engineer', location: 'Kigali, RW', score: 94, status: 'Shortlisted' },
  { id: '2', firstName: 'James', lastName: 'Mugisha', email: 'james.m@gmail.com', headline: 'Backend Engineer', location: 'Nairobi, KE', score: 91, status: 'Shortlisted' },
  { id: '3', firstName: 'Aline', lastName: 'Uwase', email: 'aline.u@gmail.com', headline: 'Full Stack Developer', location: 'Remote', score: 88, status: 'Under Review' },
  { id: '4', firstName: 'David', lastName: 'Rwigamba', email: 'david.r@gmail.com', headline: 'Product Designer', location: 'Kampala, UG', score: 85, status: 'Shortlisted' },
  { id: '5', firstName: 'Grace', lastName: 'Iradukunda', email: 'grace.i@gmail.com', headline: 'Data Scientist', location: 'Kigali, RW', score: 82, status: 'Under Review' },
  { id: '6', firstName: 'Eric', lastName: 'Habimana', email: 'eric.h@gmail.com', headline: 'DevOps Engineer', location: 'Lagos, NG', score: 79, status: 'New' },
];

const statusColor = (s: string) => {
  if (s === 'Shortlisted') return 'badge-success';
  if (s === 'Under Review') return 'badge-warning';
  return 'badge-neutral';
};

export default function CandidatesPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
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
            {mockCandidates.map((c) => (
              <tr key={c.id} className="table-row">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#09090b] text-white flex items-center justify-center text-xs font-bold">{c.firstName.charAt(0)}</div>
                    <div>
                      <p className="font-medium text-sm">{c.firstName} {c.lastName}</p>
                      <p className="text-xs text-[#a1a1aa]">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#71717a]">{c.headline}</td>
                <td className="px-6 py-4 text-sm text-[#71717a]">{c.location}</td>
                <td className="px-6 py-4 font-bold text-sm">{c.score}%</td>
                <td className="px-6 py-4"><span className={`badge ${statusColor(c.status)}`}>{c.status}</span></td>
                <td className="px-6 py-4"><Link href={`/candidates/${c.id}`} className="text-sm font-medium hover:underline">Profile →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
