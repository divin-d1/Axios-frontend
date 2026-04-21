'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '../../../lib/api';
import { useToast } from '../../../components/Toast';
import { getApiErrorMessage } from '../../../lib/errors';
import Modal from '../../../components/Modal';
import type { Job } from '../../../lib/types';

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    open: 'badge-success', screening: 'badge-warning', completed: 'badge-info', draft: 'badge-neutral',
  };
  return styles[status] || 'badge-neutral';
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://axios-2mom.onrender.com/api' : 'http://localhost:5000/api');

const getToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? match[1] : null;
};

export default function JobDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const toast = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [screening, setScreening] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    department: '',
    location: '',
    description: '',
    shortlistSize: '5',
    requiredSkills: '',
  });
  const csvInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const fetchJob = useCallback(async () => {
    try {
      const res = await apiClient.get<{ data?: Job }>(`/jobs/${id}`);
      setJob(res.data?.data || null);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to load job details'));
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    if (!id) return;
    fetchJob();
  }, [id, fetchJob]);

  const handleRunScreening = async () => {
    if ((job?.candidateCount || job?.totalApplicants || 0) < 1) {
      toast.error('Upload candidates before running screening.');
      return;
    }

    setScreening(true);
    try {
      await apiClient.post(`/screening/${id}`);
      toast.success('AI Screening started successfully!');
      setTimeout(() => router.push(`/screening/${id}`), 1500);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to start screening'));
    } finally {
      setScreening(false);
    }
  };

  const startEdit = () => {
    if (!job) return;
    setEditForm({
      title: job.title || '',
      department: job.department || '',
      location: job.location || '',
      description: job.description || '',
      shortlistSize: String(job.shortlistSize || 5),
      requiredSkills: (job.requiredSkills || []).join(', '),
    });
    setIsEditing(true);
  };

  const handleUpdateJob = async () => {
    setSaving(true);
    try {
      await apiClient.put(`/jobs/${id}`, {
        title: editForm.title.trim(),
        department: editForm.department.trim(),
        location: editForm.location.trim(),
        description: editForm.description.trim(),
        shortlistSize: Number(editForm.shortlistSize || 5),
        requiredSkills: editForm.requiredSkills.split(',').map((skill) => skill.trim()).filter(Boolean),
      });
      toast.success('Job updated successfully.');
      setIsEditing(false);
      await fetchJob();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to update job'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async () => {
    setDeleting(true);
    try {
      await apiClient.delete(`/jobs/${id}`);
      toast.success('Job and related data deleted.');
      setIsDeleteModalOpen(false);
      router.push('/jobs');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to delete job'));
    } finally {
      setDeleting(false);
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('spreadsheet', file);

      const token = getToken();
      const res = await fetch(`${BASE_URL}/candidates/upload/${id}`, {
        method: 'POST',
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw { response: { data } };

      toast.success(data.message || `${data.count || 0} candidates imported!`);
      fetchJob(); // Refresh candidate count
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to upload file'));
    } finally {
      setUploading(false);
      if (csvInputRef.current) csvInputRef.current.value = '';
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const token = getToken();
      const res = await fetch(`${BASE_URL}/candidates/resume/${id}`, {
        method: 'POST',
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw { response: { data } };

      toast.success(data.message || 'Resume parsed and candidate added!');
      fetchJob();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to upload resume'));
    } finally {
      setUploading(false);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    }
  };

  if (loading || !job) {
    return (
      <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        {loading ? (
          <svg className="animate-spin h-8 w-8 text-[#09090b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <div className="text-center">
            <p className="text-[#71717a] mb-2">Job not found</p>
            <Link href="/jobs" className="text-sm font-medium hover:underline">← Back to Jobs</Link>
          </div>
        )}
      </div>
    );
  }

  const weights: Record<string, number> = job.scoringWeights || {};

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
      <Link href="/jobs" className="text-sm text-[#71717a] hover:text-black mb-4 inline-block">← Back to Jobs</Link>
      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-sm text-[#71717a] mt-1">{job.department || 'General'} · {job.location || 'Remote'}</p>
        </div>
        <span className={`badge ${statusBadge(job.status || 'open')} text-sm w-fit`}>{job.status || 'open'}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="stat-card"><p className="text-sm text-[#71717a]">Candidates</p><p className="text-2xl font-bold">{job.candidateCount || job.totalApplicants || 0}</p></div>
        <div className="stat-card"><p className="text-sm text-[#71717a]">Target Shortlist</p><p className="text-2xl font-bold">{job.shortlistSize || 0}</p></div>
        <div className="stat-card"><p className="text-sm text-[#71717a]">Required Skills</p><p className="text-2xl font-bold">{job.requiredSkills?.length || 0}</p></div>
      </div>

      {isEditing && (
        <div className="card p-6 mb-6 space-y-4">
          <h2 className="font-semibold">Update Job</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="input w-full" value={editForm.title} onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Title" />
            <input className="input w-full" value={editForm.department} onChange={(e) => setEditForm((prev) => ({ ...prev, department: e.target.value }))} placeholder="Department" />
            <input className="input w-full" value={editForm.location} onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))} placeholder="Location" />
            <input type="number" min={1} className="input w-full" value={editForm.shortlistSize} onChange={(e) => setEditForm((prev) => ({ ...prev, shortlistSize: e.target.value }))} placeholder="Shortlist size" />
          </div>
          <input className="input w-full" value={editForm.requiredSkills} onChange={(e) => setEditForm((prev) => ({ ...prev, requiredSkills: e.target.value }))} placeholder="Required skills (comma separated)" />
          <textarea className="input w-full min-h-24" value={editForm.description} onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description" />
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn-primary disabled:opacity-50 w-full sm:w-auto" onClick={handleUpdateJob} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            <button className="btn-outline w-full sm:w-auto" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Upload Candidates */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-1">Add Candidates</h2>
        <p className="text-sm text-[#71717a] mb-4">Upload a CSV/Excel file with multiple candidates or upload individual PDF resumes for AI parsing.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CSV/Excel Upload */}
          <div 
            onClick={() => !uploading && csvInputRef.current?.click()}
            className="border-2 border-dashed border-[#e4e4e7] rounded-xl p-6 text-center cursor-pointer hover:border-[#09090b] hover:bg-[#fafafa] transition-all"
          >
            <input ref={csvInputRef} disabled={uploading} type="file" accept=".csv,.xlsx,.xls" onChange={handleCSVUpload} className="hidden" />
            <svg className="w-8 h-8 mx-auto mb-3 text-[#a1a1aa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            <p className="font-medium text-sm">Bulk Upload (CSV / Excel)</p>
            <p className="text-xs text-[#a1a1aa] mt-1">Columns: firstName, lastName, email, headline, location, skills</p>
          </div>

          {/* PDF Resume Upload */}
          <div 
            onClick={() => !uploading && resumeInputRef.current?.click()}
            className="border-2 border-dashed border-[#e4e4e7] rounded-xl p-6 text-center cursor-pointer hover:border-[#09090b] hover:bg-[#fafafa] transition-all"
          >
            <input ref={resumeInputRef} disabled={uploading} type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
            <svg className="w-8 h-8 mx-auto mb-3 text-[#a1a1aa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M9 13h6" />
              <path d="M9 17h3" />
            </svg>
            <p className="font-medium text-sm">Upload Resume (PDF)</p>
            <p className="text-xs text-[#a1a1aa] mt-1">AI will parse and extract candidate data</p>
          </div>
        </div>

        {uploading && (
          <div className="flex items-center gap-2 mt-4 text-sm text-[#71717a]">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing upload...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Description */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">Description</h2>
          <p className="text-sm text-[#71717a] leading-relaxed">{job.description || 'No description provided.'}</p>
          
          <h3 className="font-medium text-sm pt-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {(job.requiredSkills?.length ?? 0) > 0 ? (
              job.requiredSkills?.map((s: string) => (
                <span key={s} className="badge badge-neutral">{s}</span>
              ))
            ) : (
              <span className="text-sm text-[#a1a1aa]">No skills specified</span>
            )}
          </div>
        </div>

        {/* Scoring Weights */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">AI Scoring Weights</h2>
          <div className="space-y-3">
            {Object.keys(weights).length > 0 ? (
              Object.entries(weights).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm text-[#71717a] capitalize w-28">{key}</span>
                  <div className="flex-1 h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#09090b] rounded-full" style={{ width: `${value}%` }} />
                  </div>
                  <span className="text-sm font-medium w-10 text-right">{value}%</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#a1a1aa]">Default AI weights will be applied</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-8">
        <button className="btn-primary disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto" onClick={handleRunScreening} disabled={screening || (job.candidateCount || job.totalApplicants || 0) < 1}>
          {screening ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running...
            </>
          ) : 'Run AI Screening'}
        </button>
        <button className="btn-outline w-full sm:w-auto" onClick={startEdit}>Update Job</button>
        <button className="btn-outline border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 w-full sm:w-auto" onClick={() => setIsDeleteModalOpen(true)} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete Job'}</button>
        <Link href={`/screening/${id}`} className="btn-outline w-full sm:w-auto text-center">View Screening Results</Link>
        <Link href={`/candidates`} className="btn-outline w-full sm:w-auto text-center">View Candidates</Link>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !deleting && setIsDeleteModalOpen(false)}
        title="Delete Job"
        maxWidth="md"
      >
        <p className="text-sm text-neutral-300 mb-6">
          Are you sure you want to delete this job? All related candidates and screening results will be permanently removed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="btn-outline w-full sm:w-auto"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            className="btn-primary w-full sm:w-auto bg-red-600 hover:bg-red-700"
            onClick={handleDeleteJob}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Yes, Delete Job'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
