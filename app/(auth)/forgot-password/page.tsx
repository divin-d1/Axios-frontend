'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '../../lib/api';
import { useToast } from '../../components/Toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await apiClient.post('/auth/forgot-password', { email });
      toast.success('Verification code sent to your email');
      
      // Redirect to reset-password page with email prefilled
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#fafafa]">
      {/* Aesthetic Blurred Orbs (B&W adjusted from user specs) */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-black/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-black/10 blur-[150px] pointer-events-none" />

      {/* Main Glassmorphism Form Container */}
      <div className="relative z-10 w-full max-w-md px-8 py-10 rounded-3xl backdrop-blur-xl bg-white/60 border border-white/20 shadow-2xl flex flex-col items-center animate-fade-in">
        
        <div className="w-12 h-12 rounded-full bg-[#09090b] flex items-center justify-center mb-6 shadow-lg">
          <img src="/logo.png" alt="Axios" className="h-4 object-contain brightness-0 invert" />
        </div>

        <h1 className="text-3xl font-extrabold text-[#09090b] mb-2 tracking-tight">Reset Password</h1>
        <p className="text-[#71717a] text-center text-sm mb-8">
          We'll email you a security code to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative border border-[#e4e4e7] rounded-xl overflow-hidden bg-white/80 focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[#a1a1aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent text-[#09090b] placeholder-[#a1a1aa] outline-none"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 bg-[#09090b] text-white rounded-xl font-medium shadow-md hover:bg-[#27272a] hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Send security code"}
          </button>
        </form>

        <div className="mt-8">
          <Link href="/login" className="flex items-center text-sm font-medium text-[#71717a] hover:text-[#09090b] transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Go back to Login
          </Link>
        </div>
      </div>
      

    </div>
  );
}
