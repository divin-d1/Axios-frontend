'use client';

import { useState } from 'react';

const mockJobs = [
  { id: '3', title: 'ML Engineer — 8 shortlisted' },
  { id: '1', title: 'Senior Backend Engineer — 5 shortlisted' },
];

export default function EmailsPage() {
  const [selectedJob, setSelectedJob] = useState('3');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Communications</h1>
        <p className="text-sm text-[#71717a] mt-1">Notify shortlisted candidates from screened pipelines</p>
      </div>

      <div className="card p-8 space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Select Job Pipeline</label>
          <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} className="input w-full bg-white">
            {mockJobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        </div>

        <div className="bg-[#fafafa] border border-[#e4e4e7] rounded-lg p-6 space-y-3">
          <h3 className="font-medium text-sm">What happens when you send?</h3>
          <ul className="text-sm text-[#71717a] space-y-2 list-disc pl-4">
            <li>System extracts the AI-determined shortlist for this job</li>
            <li>Generates personalized &ldquo;Next Steps&rdquo; emails for each candidate</li>
            <li>Dispatches emails asynchronously via your configured SMTP</li>
          </ul>
        </div>

        {sent ? (
          <div className="bg-[#dcfce7] border border-[#bbf7d0] text-[#166534] rounded-lg p-4 text-sm text-center font-medium">
            ✓ Emails dispatched successfully to all shortlisted candidates
          </div>
        ) : (
          <button onClick={handleSend} disabled={sending} className="btn-primary w-full disabled:opacity-50">
            {sending ? 'Dispatching...' : 'Send Notification Emails'}
          </button>
        )}
      </div>
    </div>
  );
}
