'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import apiClient from '../../lib/api';
import { useToast } from '../../components/Toast';
import { getApiErrorMessage } from '../../lib/errors';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await apiClient.post<{ token: string; user: { companyId?: string | null } }>(
        '/auth/login',
        { email, password }
      );
      
      // Store token securely in cookies for Next.js Middleware Edge processing
      document.cookie = `token=${response.data.token}; path=/; max-age=${30 * 24 * 60 * 60}; samesite=strict`;
      
      toast.success('Login successful! Redirecting...');
      
      // Redirect after a short delay
      setTimeout(() => {
        if (!response.data.user.companyId) {
          router.push('/onboarding');
        } else {
          router.push('/');
        }
      }, 1000);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel with image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image src="/auth-bg.png" alt="" fill sizes="50vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-black/30" />
            
          <div className="relative z-10 flex flex-col justify-between p-12 h-full">
            <div>
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center p-2 mb-4">
                <Image src="/logo.png" alt="Axios Logo" width={32} height={32} className="w-full h-full object-contain" />
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-black/20 border border-white/10 p-8 rounded-2xl shadow-2xl">
              <blockquote className="text-white/90 text-lg leading-relaxed mb-6 font-medium">
                &ldquo;Axios transformed how we screen candidates. What used to take weeks now takes minutes, with AI-powered insights that actually make sense.&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10 text-white font-bold">G</div>
                <div>
                  <p className="text-white text-sm font-semibold">Grace Uwimana</p>
                  <p className="text-white/60 text-xs">Head of HR, TechRwanda</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Right panel with form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-[#71717a] text-sm mb-8">Enter your credentials to access your workspace</p>
  
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input w-full" required />
              
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="input w-full pr-10" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#09090b] transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPassword ? (
                      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    ) : (
                      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    )}
                  </svg>
                </button>
              </div>
  
              <button disabled={loading} type="submit" className="btn-primary w-full mt-2 flex justify-center items-center">
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Sign in'}
              </button>
            </form>
          
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-[#71717a]">Don&apos;t have an account? <Link href="/register" className="font-medium text-[#09090b] hover:underline">Create an account</Link></span>
              <Link href="/forgot-password" className="text-sm font-normal text-[#71717a] hover:text-[#09090b] hover:underline transition-colors">Forgot password?</Link>
            </div>

          <p className="text-xs text-[#a1a1aa] text-center mt-8">
            By continuing, you agree to our <a href="#" className="underline text-[#71717a]">Terms of Service</a> and <a href="#" className="underline text-[#71717a]">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
