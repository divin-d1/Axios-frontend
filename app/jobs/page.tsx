'use client';

import Link from 'next/link';

const mockJobs = [
  { id: '1', title: 'Senior Backend Engineer', department: 'Engineering', candidates: 64, status: 'screening', location: 'Kigali, RW', posted: '2 days ago' },
  { id: '2', title: 'Product Designer', department: 'Design', candidates: 38, status: 'open', location: 'Remote', posted: '5 days ago' },
  { id: '3', title: 'ML Engineer', department: 'AI/ML', candidates: 112, status: 'completed', location: 'Kigali, RW', posted: '1 week ago' },
  { id: '4', title: 'DevOps Specialist', department: 'Infrastructure', candidates: 29, status: 'open', location: 'Hybrid', posted: '3 days ago' },
  { id: '5', title: 'Frontend Developer', department: 'Engineering', candidates: 55, status: 'draft', location: 'Remote', posted: 'Just now' },
  { id: '6', title: 'Data Analyst', department: 'Analytics', candidates: 41, status: 'open', location: 'Kigali, RW', posted: '1 day ago' },
];

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    open: 'badge-success', screening: 'badge-warning', completed: 'badge-info', draft: 'badge-neutral',
  };
  return styles[status] || 'badge-neutral';
};

export default function JobsPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
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
            {mockJobs.map((job) => (
              <tr key={job.id} className="table-row">
                <td className="px-6 py-4 font-medium">{job.title}</td>
                <td className="px-6 py-4 text-[#71717a] text-sm">{job.department}</td>
                <td className="px-6 py-4 text-[#71717a] text-sm">{job.location}</td>
                <td className="px-6 py-4 text-sm">{job.candidates}</td>
                <td className="px-6 py-4"><span className={`badge ${statusBadge(job.status)}`}>{job.status}</span></td>
                <td className="px-6 py-4 text-[#a1a1aa] text-sm">{job.posted}</td>
                <td className="px-6 py-4"><Link href={`/jobs/${job.id}`} className="text-sm font-medium hover:underline">View →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
