'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import apiClient from '../lib/api';
import InstallPwaButton from '../components/InstallPwaButton';

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    open: 'badge-success',
    screening: 'badge-warning',
    completed: 'badge-info',
    draft: 'badge-neutral',
  };

  return styles[status] || 'badge-neutral';
};

type DashboardJob = {
  _id: string;
  title?: string;
  totalApplicants?: number;
  shortlistSize?: number;
  status?: string;
};

type DashboardData = {
  overview?: {
    activeJobs?: number;
    totalCandidates?: number;
    totalScreenings?: number;
  };
  recentJobs?: DashboardJob[];
};

type DashboardResponse = {
  data?: {
    data?: DashboardData;
  };
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get('/dashboard') as DashboardResponse;
        setData(res.data?.data || null);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-[#09090b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  const overview = data?.overview || { activeJobs: 0, totalCandidates: 0, totalScreenings: 0 };
  const recentJobs = data?.recentJobs || [];
  const liveStats = [
    { label: 'Active Jobs', value: overview.activeJobs || '0', change: 'Current pipelines' },
    { label: 'Total Candidates', value: overview.totalCandidates || '0', change: 'Across all jobs' },
    { label: 'Screenings Run', value: overview.totalScreenings || '0', change: 'Total AI parsing runs' },
    { label: 'Avg. Match Score', value: '-', change: 'Updates periodically' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-10">
        <div>
          <p className="text-sm text-[#71717a] mb-1">Welcome back</p>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 text-sm text-[#71717a]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            AI Engine Online
          </div>
          <InstallPwaButton />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {liveStats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <p className="text-sm text-[#71717a] mb-1">{stat.label}</p>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-xs text-[#a1a1aa] mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-x-auto">
        <div className="px-6 py-4 border-b border-[#e4e4e7] flex items-center justify-between">
          <h2 className="font-semibold">Recent Job Pipelines</h2>
          <Link href="/jobs" className="text-sm text-[#71717a] hover:text-black transition-colors">View all →</Link>
        </div>
        {recentJobs.length === 0 ? (
          <div className="p-8 text-center text-[#71717a] text-sm">No active jobs found. Create one to get started.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-[#a1a1aa] uppercase tracking-wider border-b border-[#f4f4f5]">
                <th className="px-6 py-3 font-medium">Position</th>
                <th className="px-6 py-3 font-medium">Applicants</th>
                <th className="px-6 py-3 font-medium">Shortlist</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((job) => (
                <tr key={job._id} className="table-row">
                  <td className="px-6 py-4 font-medium">{job.title}</td>
                  <td className="px-6 py-4 text-[#71717a]">{job.totalApplicants || 0}</td>
                  <td className="px-6 py-4 text-[#71717a]">{job.shortlistSize || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${statusBadge(job.status || 'open')}`}>
                      {job.status || 'open'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
