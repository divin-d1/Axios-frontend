'use client';

import { useState, useEffect } from 'react';
import apiClient from '../../lib/api';
import { useToast } from '../../components/Toast';

const INDUSTRIES = [
  'Financial Technology', 'E-commerce', 'Healthcare Technology', 
  'Education Technology', 'Agriculture', 'Logistics', 'Consulting', 
  'Telecommunications', 'Software Development'
];

export default function CompanyProfile() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '', industries: [] as string[], departments: [] as string[],
    specialization: '', size: 'startup', hiringPhilosophy: 'balanced', 
    email: '', website: '', description: '', skills: '',
  });

  const [newDepartment, setNewDepartment] = useState('');

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res: any = await apiClient.get('/companies');
        const companies = res.data?.companies || res.data || [];
        if (companies.length > 0) {
          const c = companies[0];
          setCompanyId(c._id);
          setFormData({
            name: c.name || '',
            industries: c.industries || [],
            departments: c.departments || [],
            specialization: c.specialization || '',
            size: c.size || 'startup',
            hiringPhilosophy: c.hiringPhilosophy || 'balanced',
            email: c.email || '',
            website: c.website || '',
            description: c.description || '',
            skills: (c.skills || []).join(', '),
          });
        }
      } catch (err) {
        console.error('Failed to load company profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleIndustry = (ind: string) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.includes(ind)
        ? prev.industries.filter(i => i !== ind)
        : [...prev.industries, ind]
    }));
  };

  const addDepartment = () => {
    if (newDepartment.trim() && !formData.departments.includes(newDepartment.trim())) {
      setFormData(prev => ({ ...prev, departments: [...prev.departments, newDepartment.trim()] }));
      setNewDepartment('');
    }
  };

  const removeDepartment = (dep: string) => {
    setFormData(prev => ({ ...prev, departments: prev.departments.filter(d => d !== dep) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (companyId) {
        await apiClient.put(`/companies/${companyId}`, payload);
      } else {
        const res: any = await apiClient.post('/companies', payload);
        setCompanyId(res.data?.company?._id || res.data?._id);
      }
      toast.success('Company profile saved successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save company profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto flex items-center justify-center min-h-[50vh]">
        <svg className="animate-spin h-8 w-8 text-[#09090b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Company Profile</h1>
        <p className="text-sm text-[#71717a] mt-1">This context directly guides AI candidate evaluation</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Company Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="input w-full" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Contact Email</label>
            <input name="email" value={formData.email} onChange={handleChange} className="input w-full" type="email" />
          </div>
          
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium">Industries (Select multiple)</label>
            <div className="flex flex-wrap gap-2 p-4 border border-[#e4e4e7] rounded-lg">
              {INDUSTRIES.map(ind => (
                <button
                  type="button"
                  key={ind}
                  onClick={() => toggleIndustry(ind)}
                  className={`badge cursor-pointer px-3 py-1.5 border transition-colors ${
                    formData.industries.includes(ind) ? 'bg-[#09090b] text-white border-[#09090b]' : 'bg-[#fafafa] text-[#71717a] border-[#e4e4e7] hover:bg-[#f4f4f5]'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium">Departments</label>
            <div className="flex gap-2">
              <input value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDepartment(); } }} placeholder="e.g. Engineering, Sales, HR" className="input flex-1" />
              <button type="button" onClick={addDepartment} className="btn-outline">Add</button>
            </div>
            {formData.departments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.departments.map(dep => (
                  <span key={dep} className="badge bg-[#f4f4f5] text-[#09090b] px-3 py-1.5 flex items-center gap-1">
                    {dep} <button type="button" onClick={() => removeDepartment(dep)} className="text-[#a1a1aa] hover:text-red-500 ml-1">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Website</label>
            <input name="website" value={formData.website} onChange={handleChange} className="input w-full" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Company Size</label>
            <select name="size" value={formData.size} onChange={handleChange} className="input w-full bg-white">
              <option value="startup">Startup (1–50)</option><option value="small">Small (50–200)</option><option value="medium">Medium (200–1000)</option><option value="large">Large (1000–5000)</option><option value="enterprise">Enterprise (5000+)</option>
            </select>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium">Hiring Philosophy</label>
            <select name="hiringPhilosophy" value={formData.hiringPhilosophy} onChange={handleChange} className="input w-full bg-white">
              <option value="startup-fast">Startup Fast</option><option value="enterprise-structured">Enterprise Structured</option><option value="research-heavy">Research Heavy</option><option value="balanced">Balanced</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center justify-between">
            <span>Skills / Tech Stack</span>
            <span className="text-xs text-[#a1a1aa] font-normal">Comma separated</span>
          </label>
          <input name="skills" value={formData.skills} onChange={handleChange} className="input w-full" />
          <p className="text-xs text-[#a1a1aa] mt-1">If your company is non-technical, type <strong>Not Applicable (Non-Technical)</strong> or list core business skills.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="input w-full min-h-24 resize-y" />
        </div>
        
        <div className="flex items-center justify-end pt-4 border-t border-[#e4e4e7]">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
