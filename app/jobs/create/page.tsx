'use client';

import { useState } from 'react';

// Mock company data to demonstrate the department dropdown binding
const MOCK_COMPANY_DEPARTMENTS = [
  'Engineering', 'Marketing', 'Sales', 'Human Resources', 'Design'
];

export default function CreateJobPage() {
  const [formData, setFormData] = useState({
    title: '', department: MOCK_COMPANY_DEPARTMENTS[0], location: '', description: '',
    requiredSkills: '', shortlistSize: '5',
    skills: '30', experience: '25', projects: '20', credibility: '15', companyFit: '10',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const total = Number(formData.skills) + Number(formData.experience) + Number(formData.projects) + Number(formData.credibility) + Number(formData.companyFit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (total !== 100) { alert('Scoring weights must total 100%'); return; }
    alert('Mock: Job created successfully');
    window.location.href = '/jobs';
  };

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create Job Pipeline</h1>
        <p className="text-sm text-[#71717a] mt-1">Define a new role and configure AI scoring weights</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Job Title *</label>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Backend Engineer" className="input w-full" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Department *</label>
            <select name="department" value={formData.department} onChange={handleChange} className="input w-full bg-white" required>
              <option value="" disabled>Select Department</option>
              {MOCK_COMPANY_DEPARTMENTS.map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Location</label>
            <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Kigali, RW" className="input w-full" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Shortlist Size</label>
            <input name="shortlistSize" value={formData.shortlistSize} onChange={handleChange} type="number" className="input w-full" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the role..." className="input w-full min-h-24 resize-y" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center justify-between"><span>Required Skills</span><span className="text-xs text-[#a1a1aa] font-normal">Comma separated</span></label>
          <input name="requiredSkills" value={formData.requiredSkills} onChange={handleChange} placeholder="e.g. Node.js, TypeScript, Account Management" className="input w-full" />
        </div>

        {/* Scoring Weights */}
        <div className="space-y-4 pt-4 border-t border-[#e4e4e7]">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">AI Scoring Weights</h3>
            <span className={`text-sm font-bold ${total === 100 ? 'text-[#166534]' : 'text-red-500'}`}>{total}/100%</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {['skills', 'experience', 'projects', 'credibility', 'companyFit'].map(key => (
              <div key={key} className="space-y-1">
                <label className="text-xs text-[#71717a] capitalize">{key}</label>
                <input name={key} value={(formData as Record<string, string>)[key]} onChange={handleChange} type="number" className="input w-full text-center" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#e4e4e7]">
          <button type="submit" className="btn-primary">Create Job Pipeline</button>
        </div>
      </form>
    </div>
  );
}
