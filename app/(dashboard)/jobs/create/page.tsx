'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../lib/api';
import { useToast } from '../../../components/Toast';
import { getApiErrorMessage } from '../../../lib/errors';

export default function CreateJobPage() {
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '', department: '', location: '', description: '',
    requiredSkills: '', shortlistSize: '5',
    skills: '30', experience: '25', projects: '20', credibility: '15', companyFit: '10',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const fetchCompanyDepartments = async () => {
      try {
        const res = await apiClient.get<{ user?: { company?: { departments?: string[] } } }>('/company/me');
        const deps = res.data?.user?.company?.departments || [];
        setAvailableDepartments(deps);
        if (deps.length > 0) setFormData(prev => ({ ...prev, department: deps[0] }));
      } catch {
        console.error('Failed to load company departments');
      }
    };
    fetchCompanyDepartments();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const total = Number(formData.skills) + Number(formData.experience) + Number(formData.projects) + Number(formData.credibility) + Number(formData.companyFit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (total !== 100) { toast.error('Scoring weights must total 100%'); return; }
    
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        department: formData.department,
        location: formData.location,
        description: formData.description,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        shortlistSize: Number(formData.shortlistSize),
        scoringWeights: {
          skillMatch: Number(formData.skills),
          experienceDepth: Number(formData.experience),
          projectRelevance: Number(formData.projects),
          credibility: Number(formData.credibility),
          companyFit: Number(formData.companyFit),
        },
        status: 'open',
      };

      await apiClient.post('/jobs', payload);
      toast.success('Job Pipeline created successfully!');
      setTimeout(() => { router.push('/jobs'); }, 1000);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to create Job.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create Job Pipeline</h1>
        <p className="text-sm text-[#71717a] mt-1">Define a new role and configure AI scoring weights</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Job Title *</label>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Backend Engineer" className="input w-full" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Department *</label>
            <select name="department" value={formData.department} onChange={handleChange} className="input w-full bg-white" required>
              <option value="" disabled>Select Department</option>
              {availableDepartments.map(dep => (
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
          <button disabled={loading} type="submit" className="btn-primary w-full md:w-auto flex items-center justify-center">
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Create Job Pipeline"}
          </button>
        </div>
      </form>
    </div>
  );
}
