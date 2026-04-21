'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import apiClient from '../../lib/api';
import { useToast } from '../../components/Toast';
import { getApiErrorMessage } from '../../lib/errors';

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
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to send reset code. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-[#09090b]">
      
      {/* Left panel with Graphic */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#f4f4f5] items-center justify-center p-12">
        <Image
          src="/forgot-password-bg.png"
          alt="Security Graphic"
          width={600}
          height={600}
          className="w-full max-w-[600px] object-contain"
          priority
        />
      </div>

      {/* Right panel with minimalist form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-24 py-8">
        
        <div className="w-full max-w-[400px]">
          {/* Subtle Logo inclusion */}
          <div className="w-10 h-10 rounded-full bg-[#09090b] flex items-center justify-center p-2 mb-12 shadow-md">
            <Image src="/logo.png" alt="Axios" width={32} height={32} className="w-[80%] h-[80%] object-contain brightness-0 invert" />
          </div>

          <h1 className="text-3xl sm:text-[44px] font-extrabold mb-4 tracking-[-0.02em] leading-[1.1]">
            Forgot<br />Password?
          </h1>
          <p className="text-[15px] font-medium text-[#71717a] mb-12 leading-relaxed max-w-[280px]">
            Enter the email address associated with your account.
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-10">
              <input 
                type="email" 
                placeholder="Enter Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-[#e4e4e7] py-3 text-[15px] bg-transparent focus:outline-none focus:border-[#09090b] transition-colors placeholder:text-[#d4d4d8] font-medium"
                required 
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Replacing "Try another way" with Back to Login */}
              <Link href="/login" className="text-sm font-medium text-[#a1a1aa] hover:text-[#09090b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#09090b] focus:ring-offset-2 rounded-sm pr-4">
                Back to Login
              </Link>

              {/* Pill Button exactly matching spec shape but B&W */}
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary rounded-full px-10 py-3 text-[15px] font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[130px] w-full sm:w-auto"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Next"}
              </button>
            </div>
          </form>
        </div>
        
      </div>
      
    </div>
  );
}
