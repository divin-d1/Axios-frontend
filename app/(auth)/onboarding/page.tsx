'use client';

import { useState, useEffect } from 'react';
import apiClient from '../../lib/api';
import { useToast } from '../../components/Toast';

const steps = [
  { id: 1, label: 'Company Info' },
  { id: 2, label: 'Team & Culture' },
  { id: 3, label: 'Skills & Tech' },
  { id: 4, label: 'Complete' },
];

  // Removed hardcoded INDUSTRIES; will fetch from backend.

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', website: '', size: 'medium',
    industries: [] as string[], departments: [] as string[],
    hiringPhilosophy: 'balanced', description: '', specialization: '', skills: ''
  });

  const [newDepartment, setNewDepartment] = useState('');
  
  // API Data
  const [availableIndustries, setAvailableIndustries] = useState<string[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchConstants = async () => {
      try {
        const res: any = await apiClient.get('/config/constants');
        setAvailableIndustries(res.data?.industries || []);
        setAvailableDepartments(res.data?.departments || []);
      } catch (error) {
        console.error('Failed to fetch config constants');
      }
    };
    fetchConstants();
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

  const next = () => setStep(s => Math.min(s + 1, 4));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleFinish = async () => {
    try {
      await apiClient.post('/company/setup', formData);
      toast.success('Company profile created successfully!');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to finish onboarding. Please try again.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa] flex items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-full bg-black p-1.5 flex items-center justify-center flex-shrink-0">
            <img src="/logo.png" alt="Axios" className="w-full h-full object-contain" />
          </div>
          <span className="text-lg font-bold tracking-wider">AXIOS</span>
        </div>

        <div className="flex items-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  step >= s.id ? 'bg-[#09090b] text-white border-[#09090b]' : 'bg-white text-[#a1a1aa] border-[#e4e4e7]'
                }`}>
                  {step > s.id ? '✓' : s.id}
                </div>
                <span className={`text-xs mt-2 ${step >= s.id ? 'text-[#09090b] font-medium' : 'text-[#a1a1aa]'}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 flex-1 -mt-5 ${step > s.id ? 'bg-[#09090b]' : 'bg-[#e4e4e7]'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#e4e4e7] rounded-xl p-8 shadow-sm">
          {/* Step 1: Company Info */}
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Tell us about your company</h2>
                <p className="text-sm text-[#71717a]">This information helps our AI understand your hiring context.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-medium">Company Name *</label><input name="name" value={formData.name} onChange={handleChange} className="input w-full" required /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Contact Email *</label><input name="email" value={formData.email} onChange={handleChange} className="input w-full" type="email" required /></div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium">Industries</label>
                  <div className="flex gap-2">
                    <select 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && !formData.industries.includes(val)) {
                          setFormData(prev => ({ ...prev, industries: [...prev.industries, val] }));
                        }
                        e.target.value = ""; // reset select
                      }} 
                      className="input flex-1 bg-white"
                    >
                      <option value="">Select an industry...</option>
                      {availableIndustries.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  {formData.industries.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 p-4 border border-[#e4e4e7] rounded-lg">
                      {formData.industries.map(ind => (
                        <span key={ind} className="badge bg-[#09090b] text-white px-3 py-1.5 flex items-center gap-1 transition-colors">
                          {ind} <button onClick={() => toggleIndustry(ind)} className="text-white/70 hover:text-red-400 ml-1">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium">Departments</label>
                  <div className="flex gap-2">
                    <select 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && !formData.departments.includes(val)) {
                          setFormData(prev => ({ ...prev, departments: [...prev.departments, val] }));
                        }
                        e.target.value = ""; // reset select
                      }} 
                      className="input w-2/3 bg-white"
                    >
                      <option value="">Select predefined department...</option>
                      {availableDepartments.map(dep => (
                        <option key={dep} value={dep}>{dep}</option>
                      ))}
                    </select>
                    <input value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addDepartment()} placeholder="Or type custom..." className="input flex-1" />
                    <button onClick={addDepartment} className="btn-outline">Add</button>
                  </div>
                  {formData.departments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.departments.map(dep => (
                        <span key={dep} className="badge bg-[#f4f4f5] text-[#09090b] px-3 py-1.5 flex items-center gap-1">
                          {dep} <button onClick={() => removeDepartment(dep)} className="text-[#a1a1aa] hover:text-red-500 ml-1">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5"><label className="text-sm font-medium">Website</label><input name="website" value={formData.website} onChange={handleChange} className="input w-full" /></div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Company Size</label>
                  <select name="size" value={formData.size} onChange={handleChange} className="input w-full bg-white">
                    <option value="startup">Startup (1–50)</option><option value="small">Small (50–200)</option><option value="medium">Medium (200–1000)</option><option value="large">Large (1000–5000)</option><option value="enterprise">Enterprise (5000+)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Team & Culture */}
          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <div><h2 className="text-xl font-bold mb-1">Team &amp; Culture</h2><p className="text-sm text-[#71717a]">Help the AI calibrate its screening philosophy to your values.</p></div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Hiring Philosophy</label>
                  <select name="hiringPhilosophy" value={formData.hiringPhilosophy} onChange={handleChange} className="input w-full bg-white">
                    <option value="startup-fast">Startup Fast — raw skill &amp; shipping speed</option><option value="enterprise-structured">Enterprise — stability &amp; formal experience</option><option value="research-heavy">Research Heavy — academic &amp; technical depth</option><option value="balanced">Balanced — standard mixture</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Company Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Briefly describe what your company does and what you value in employees..." className="input w-full min-h-32 resize-y" />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Skills & Tech */}
          {step === 3 && (
            <div className="animate-fade-in space-y-6">
              <div><h2 className="text-xl font-bold mb-1">Profile & Skills</h2><p className="text-sm text-[#71717a]">Define your core required skills to sharpen candidate matching.</p></div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Specialization</label>
                  <input name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. AI/ML, Strategy, Analytics" className="input w-full" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center justify-between">
                    <span>Skills / Tech Stack</span>
                    <span className="text-xs text-[#a1a1aa] font-normal">Comma separated</span>
                  </label>
                  <input name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Negotiations, Financial Modeling, N/A" className="input w-full" />
                  <p className="text-xs text-[#a1a1aa] mt-1">If your company is non-technical, type <strong>Not Applicable (Non-Technical)</strong> or list core business skills.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 4 && (
            <div className="animate-fade-in text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#09090b] text-white flex items-center justify-center text-2xl mx-auto">✓</div>
              <div>
                <h2 className="text-xl font-bold mb-2">You&apos;re all set!</h2>
                <p className="text-sm text-[#71717a] max-w-sm mx-auto">Your company profile has been configured. The AI engine will use this context to screen and rank candidates tailored to your needs.</p>
              </div>
              <button onClick={handleFinish} className="btn-primary px-8">Go to Dashboard</button>
            </div>
          )}

          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-[#e4e4e7]">
              <button onClick={prev} disabled={step === 1} className="btn-outline disabled:opacity-30 disabled:cursor-not-allowed">Back</button>
              <button onClick={next} className="btn-primary">{step === 3 ? 'Complete Setup' : 'Continue'}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
