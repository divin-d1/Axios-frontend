'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import apiClient from '../../lib/api';
import { useToast } from '../../components/Toast';

function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    
    try {
      await apiClient.post('/auth/reset-password', { email, code, newPassword });
      toast.success('Password reset successfully! Redirecting...');
      
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Aesthetic Blurred Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-black/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-black/10 blur-[150px] pointer-events-none" />

      {/* Main Glassmorphism Form Container */}
      <div className="relative z-10 w-full max-w-md px-8 py-10 rounded-3xl backdrop-blur-xl bg-white/60 border border-white/20 shadow-2xl flex flex-col items-center animate-fade-in">
        
        <div className="w-12 h-12 rounded-full bg-[#09090b] flex items-center justify-center mb-6 shadow-lg">
          <img src="/logo.png" alt="Axios" className="h-4 object-contain brightness-0 invert" />
        </div>

        <h1 className="text-3xl font-extrabold text-[#09090b] mb-2 tracking-tight">Create new password</h1>
        <p className="text-[#71717a] text-center text-sm mb-8">
          Enter the 6-digit code sent to your email and your new password.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative border border-[#e4e4e7] rounded-xl overflow-hidden bg-white/80 focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all">
            <input 
              type="text" 
              placeholder="6-Digit Verification Code" 
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              className="w-full px-4 py-3 bg-transparent text-[#09090b] placeholder-[#a1a1aa] outline-none text-center tracking-[0.5em] font-bold text-lg"
              required 
            />
          </div>

          <div className="relative border border-[#e4e4e7] rounded-xl overflow-hidden bg-white/80 focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all mt-4">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="New Password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-transparent text-[#09090b] placeholder-[#a1a1aa] outline-none"
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#09090b]"
            >
              {showPassword ? (
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>

          <div className="relative border border-[#e4e4e7] rounded-xl overflow-hidden bg-white/80 focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Confirm New Password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-transparent text-[#09090b] placeholder-[#a1a1aa] outline-none"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || code.length !== 6 || !newPassword}
            className="w-full py-3 px-4 bg-[#09090b] text-white rounded-xl font-medium shadow-md hover:bg-[#27272a] hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center mt-6"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Reset password"}
          </button>
        </form>

        <div className="mt-8">
          <Link href="/login" className="flex items-center text-sm font-medium text-[#71717a] hover:text-[#09090b] transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Return to Login
          </Link>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 right-6 flex items-center bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/5 shadow-sm">
        <span className="text-xs text-[#a1a1aa] mr-2 font-medium">presented by</span>
        <img src="/logo.png" alt="Axios" className="h-3 object-contain opacity-80" />
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#fafafa]">
      <Suspense fallback={<div className="animate-pulse w-96 h-96 bg-gray-200 rounded-3xl" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
