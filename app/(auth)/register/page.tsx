'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '../../lib/api';
import { useToast } from '../../components/Toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [strength, setStrength] = useState({ score: 0, label: '', color: 'bg-[#e4e4e7]' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Auth API Loading and OTP States
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const toast = useToast();

  const router = useRouter();

  // Evaluate password strength in real-time
  useEffect(() => {
    const pw = formData.password;
    let score = 0;
    
    if (pw.length > 7) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;

    let label = '';
    let color = 'bg-[#e4e4e7]';

    if (pw.length === 0) {
      score = 0;
      label = '';
      color = 'bg-[#e4e4e7]';
    } else if (score <= 1) {
      label = 'Weak';
      color = 'bg-red-500';
    } else if (score === 2) {
      label = 'Fair';
      color = 'bg-yellow-500';
    } else if (score === 3) {
      label = 'Good';
      color = 'bg-blue-500';
    } else if (score >= 4) {
      label = 'Strong';
      color = 'bg-emerald-500';
    }

    setStrength({ score, label, color });
  }, [formData.password]);

  const isPasswordStrongEnough = strength.score >= 3;
  const passwordsMatch = formData.password === formData.confirm && formData.password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordStrongEnough) {
      toast.error('Please use a stronger password.');
      return;
    }
    if (!passwordsMatch) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/register', { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password 
      });
      toast.success('Account created successfully. Please verify your account.');
      setShowOtpModal(true); // Open the verifier modal
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed. Try again.');
      // Reset register form to try again on failure
      setFormData({ name: '', email: '', password: '', confirm: '' });
      setShowPassword(false);
      setShowConfirmPassword(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) return;
    
    setVerifying(true);
    try {
      const res: any = await apiClient.post('/auth/verify-email', {
        email: formData.email,
        code: otpCode
      });
      
      // Persist auth token
      document.cookie = `token=${res.data.token}; path=/; max-age=${30 * 24 * 60 * 60}; samesite=strict`;
      
      toast.success('Account verified successfully!');
      setTimeout(() => {
        router.push('/login'); // Redirect to login as requested
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid or expired code.');
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex relative">

      {/* OTP Verification Modal Overlay */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in pointer-events-auto border border-[#e4e4e7]">
            <div className="p-8">
              <div className="w-12 h-12 rounded-full bg-[#f4f4f5] flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#09090b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#09090b] mb-2">Check your email</h2>
              <p className="text-[#71717a] text-sm mb-6 leading-relaxed">
                We've sent a 6-digit security code to <strong>{formData.email}</strong>. Please enter it below to verify your account.
              </p>
              
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="000000" 
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  className="w-full bg-[#f4f4f5] border-none text-center text-3xl tracking-[1em] font-bold py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#09090b] transition-all"
                  required 
                />
                
                <button 
                  type="submit" 
                  disabled={verifying || otpCode.length !== 6}
                  className="btn-primary w-full flex justify-center items-center py-3"
                >
                  {verifying ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : "Verify Account"}
                </button>
              </form>
            </div>
            <div className="bg-[#f4f4f5] px-8 py-4 text-center border-t border-[#e4e4e7]">
              <p className="text-xs text-[#71717a]">
                Didn't receive the email? Check spam or <button onClick={() => { setShowOtpModal(false); setOtpCode(''); }} className="text-[#09090b] font-medium hover:underline">try another email</button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Left panel with image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="/auth-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
            
          <div className="relative z-10 flex flex-col justify-between p-12 h-full">
            <div>
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center p-2 mb-4">
                <img src="/logo.png" alt="Axios Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-black/20 border border-white/10 p-8 rounded-2xl shadow-2xl">
              <blockquote className="text-white/90 text-lg leading-relaxed mb-6 font-medium">
                &ldquo;Setting up our company profile took 5 minutes. The AI immediately understood our stack and started scoring candidates with incredible accuracy.&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10 text-white font-bold">P</div>
                <div>
                  <p className="text-white text-sm font-semibold">Patrick Muhire</p>
                  <p className="text-white/60 text-xs">CTO, Kigali Labs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-2">Create an account</h1>
            <p className="text-[#71717a] text-sm mb-8">Enter your details below to get started</p>
  
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input w-full" required />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input w-full" required />
              
              <div className="space-y-2">
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
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
                
                {/* Password Strength Meter */}
                {formData.password.length > 0 && (
                  <div className="space-y-1 animate-fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#71717a]">Password strength</span>
                      <span className={`font-medium ${
                        strength.score <= 1 ? 'text-red-600' : 
                        strength.score === 2 ? 'text-yellow-600' : 
                        strength.score === 3 ? 'text-blue-600' : 
                        'text-emerald-600'
                      }`}>{strength.label}</span>
                    </div>
                    <div className="flex gap-1 h-1.5 w-full bg-[#f4f4f5] rounded-full overflow-hidden">
                      {[1, 2, 3, 4].map((level) => (
                        <div 
                          key={level} 
                          className={`flex-1 transition-colors duration-300 ${level <= strength.score ? strength.color : 'bg-transparent'}`} 
                        />
                      ))}
                    </div>
                    {!isPasswordStrongEnough && (
                      <p className="text-[10px] text-[#a1a1aa] mt-1">
                        Must contain 8+ characters, uppercase, number, and symbol
                      </p>
                    )}
                  </div>
                )}
              </div>
  
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm Password" 
                  value={formData.confirm} 
                  onChange={(e) => setFormData({ ...formData, confirm: e.target.value })} 
                  className="input w-full pr-10" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#09090b] transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showConfirmPassword ? (
                      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    ) : (
                      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    )}
                  </svg>
                </button>
              </div>
            
            <button 
              type="submit" 
              disabled={!isPasswordStrongEnough || !passwordsMatch || !formData.name || !formData.email || loading}
              className="btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#71717a]">Already have an account? </span>
            <Link href="/login" className="font-medium text-[#09090b] hover:underline">
              Log in
            </Link>
          </div>

          <p className="text-xs text-[#a1a1aa] text-center mt-8">
            By clicking continue, you agree to our <a href="#" className="underline text-[#71717a]">Terms of Service</a> and <a href="#" className="underline text-[#71717a]">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
