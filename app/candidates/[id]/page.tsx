'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const mockCandidate = {
  firstName: 'Sarah', lastName: 'Kamana', email: 'sarah.k@gmail.com',
  headline: 'ML Engineer — TensorFlow, PyTorch & Cloud AI Systems',
  bio: 'Passionate machine learning engineer with 6+ years of experience building production ML pipelines. Specialized in computer vision and NLP systems at scale.',
  skills: { technical: ['Python', 'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes', 'AWS SageMaker'], soft: ['Communication', 'Leadership', 'Problem Solving'], languages: [{ language: 'English', proficiency: 'Native' }, { language: 'French', proficiency: 'Professional' }, { language: 'Kinyarwanda', proficiency: 'Native' }] },
  experience: [
    { title: 'Senior ML Engineer', company: 'DataVerse AI', duration: '2021 – Present', description: 'Lead ML infrastructure team. Built real-time inference pipeline serving 10M+ predictions/day.' },
    { title: 'ML Engineer', company: 'TechRwanda', duration: '2019 – 2021', description: 'Developed NLP models for Kinyarwanda language processing. Improved model accuracy by 34%.' },
  ],
  education: [{ degree: 'MSc Computer Science', institution: 'Carnegie Mellon University Africa', year: '2019' }, { degree: 'BSc Mathematics', institution: 'University of Rwanda', year: '2017' }],
  availability: { status: 'Open to opportunities', noticePeriod: '2 weeks', preferredWorkType: 'Remote / Hybrid' },
};

export default function CandidateDetailPage() {
  useParams();

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <Link href="/candidates" className="text-sm text-[#71717a] hover:text-black mb-4 inline-block">← Back to Talent Pool</Link>
      
      {/* Header */}
      <div className="card p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-[#09090b] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {mockCandidate.firstName.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{mockCandidate.firstName} {mockCandidate.lastName}</h1>
            <p className="text-sm text-[#71717a] mt-1">{mockCandidate.headline}</p>
            <p className="text-xs text-[#a1a1aa] mt-1">{mockCandidate.email}</p>
          </div>
          <div className="text-right">
            <span className="badge badge-success">{mockCandidate.availability.status}</span>
            <p className="text-xs text-[#a1a1aa] mt-2">{mockCandidate.availability.noticePeriod} notice</p>
          </div>
        </div>
        {mockCandidate.bio && <p className="text-sm text-[#71717a] mt-4 leading-relaxed">{mockCandidate.bio}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">Skills</h2>
          <div>
            <h3 className="text-xs text-[#a1a1aa] uppercase tracking-wider mb-2">Technical</h3>
            <div className="flex flex-wrap gap-2">
              {mockCandidate.skills.technical.map(s => <span key={s} className="badge badge-neutral">{s}</span>)}
            </div>
          </div>
          <div>
            <h3 className="text-xs text-[#a1a1aa] uppercase tracking-wider mb-2">Soft Skills</h3>
            <div className="flex flex-wrap gap-2">
              {mockCandidate.skills.soft.map(s => <span key={s} className="badge badge-info">{s}</span>)}
            </div>
          </div>
          <div>
            <h3 className="text-xs text-[#a1a1aa] uppercase tracking-wider mb-2">Languages</h3>
            <div className="space-y-1">
              {mockCandidate.skills.languages.map(l => (
                <div key={l.language} className="flex justify-between text-sm">
                  <span>{l.language}</span>
                  <span className="text-[#a1a1aa]">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">Experience</h2>
          {mockCandidate.experience.map((exp, i) => (
            <div key={i} className="pb-4 border-b border-[#f4f4f5] last:border-0 last:pb-0">
              <h3 className="font-medium text-sm">{exp.title}</h3>
              <p className="text-xs text-[#71717a]">{exp.company} · {exp.duration}</p>
              <p className="text-sm text-[#a1a1aa] mt-1">{exp.description}</p>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">Education</h2>
          {mockCandidate.education.map((ed, i) => (
            <div key={i} className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm">{ed.degree}</h3>
                <p className="text-xs text-[#71717a]">{ed.institution}</p>
              </div>
              <span className="text-xs text-[#a1a1aa]">{ed.year}</span>
            </div>
          ))}
        </div>

        {/* Availability */}
        <div className="card p-6 space-y-3">
          <h2 className="font-semibold">Availability</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[#71717a]">Status</span><span className="font-medium">{mockCandidate.availability.status}</span></div>
            <div className="flex justify-between"><span className="text-[#71717a]">Notice Period</span><span>{mockCandidate.availability.noticePeriod}</span></div>
            <div className="flex justify-between"><span className="text-[#71717a]">Preferred Type</span><span>{mockCandidate.availability.preferredWorkType}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
