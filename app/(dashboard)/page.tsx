'use client';

const mockStats = [
  { label: 'Active Jobs', value: '12', change: '+3 this week' },
  { label: 'Total Candidates', value: '847', change: '+126 this week' },
  { label: 'Screenings Run', value: '38', change: '+8 this week' },
  { label: 'Avg. Match Score', value: '76.4%', change: '+2.1% vs last month' },
];

const mockJobs = [
  { id: '1', title: 'Senior Backend Engineer', candidates: 64, status: 'screening', shortlist: 5 },
  { id: '2', title: 'Product Designer', candidates: 38, status: 'open', shortlist: 3 },
  { id: '3', title: 'ML Engineer', candidates: 112, status: 'completed', shortlist: 8 },
  { id: '4', title: 'DevOps Specialist', candidates: 29, status: 'open', shortlist: 4 },
  { id: '5', title: 'Frontend Developer', candidates: 55, status: 'draft', shortlist: 5 },
];

const mockTopCandidates = [
  { name: 'Sarah K.', score: 94, role: 'ML Engineer', status: 'Shortlisted' },
  { name: 'James M.', score: 91, role: 'Senior Backend Engineer', status: 'Shortlisted' },
  { name: 'Aline U.', score: 88, role: 'ML Engineer', status: 'Under Review' },
  { name: 'David R.', score: 85, role: 'Product Designer', status: 'Shortlisted' },
];

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    open: 'badge-success',
    screening: 'badge-warning',
    completed: 'badge-info',
    draft: 'badge-neutral',
  };
  return styles[status] || 'badge-neutral';
};

export default function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-sm text-[#71717a] mb-1">Welcome back</p>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#71717a]">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          AI Engine Online
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {mockStats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <p className="text-sm text-[#71717a] mb-1">{stat.label}</p>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-xs text-[#a1a1aa] mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs Table */}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e4e4e7] flex items-center justify-between">
            <h2 className="font-semibold">Active Job Pipelines</h2>
            <a href="/jobs" className="text-sm text-[#71717a] hover:text-black transition-colors">View all →</a>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-[#a1a1aa] uppercase tracking-wider border-b border-[#f4f4f5]">
                <th className="px-6 py-3 font-medium">Position</th>
                <th className="px-6 py-3 font-medium">Candidates</th>
                <th className="px-6 py-3 font-medium">Shortlist</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockJobs.map((job) => (
                <tr key={job.id} className="table-row">
                  <td className="px-6 py-4 font-medium">{job.title}</td>
                  <td className="px-6 py-4 text-[#71717a]">{job.candidates}</td>
                  <td className="px-6 py-4 text-[#71717a]">{job.shortlist}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${statusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Candidates */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e4e4e7]">
            <h2 className="font-semibold">Top Matched Candidates</h2>
          </div>
          <div className="divide-y divide-[#f4f4f5]">
            {mockTopCandidates.map((c, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-[#fafafa] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#09090b] text-white flex items-center justify-center text-xs font-bold">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{c.name}</p>
                    <p className="text-xs text-[#a1a1aa]">{c.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{c.score}%</p>
                  <p className="text-[10px] text-[#a1a1aa]">{c.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="card p-6 mt-6">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { time: '2 min ago', text: 'AI Screening completed for ML Engineer — 8 candidates shortlisted' },
            { time: '1 hour ago', text: '14 new resumes uploaded to Senior Backend Engineer pipeline' },
            { time: '3 hours ago', text: 'Shortlist notification emails sent to Product Designer candidates' },
            { time: 'Yesterday', text: 'New job posting created: DevOps Specialist' },
          ].map((activity, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-2 h-2 rounded-full bg-[#09090b] mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm">{activity.text}</p>
                <p className="text-xs text-[#a1a1aa] mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
