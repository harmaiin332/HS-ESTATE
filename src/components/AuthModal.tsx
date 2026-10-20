import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Mail, User, Phone, CheckCircle, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CURRENT_USER } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [investorType, setInvestorType] = useState<'Individual HNW' | 'Family Office' | 'Institutional'>('Individual HNW');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    // If Supabase Auth is configured, use real auth endpoints
    if (isSupabaseConfigured && supabase) {
      try {
        if (mode === 'login') {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
            return;
          }

          if (data.user) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            const loggedUser: UserProfile = {
              id: data.user.id,
              name: profile?.full_name || data.user.user_metadata?.full_name || 'VIP Client',
              email: data.user.email || email,
              phone: profile?.phone || data.user.user_metadata?.phone || '',
              role: profile?.role || 'investor',
              investorType: profile?.investor_type || 'Individual HNW',
              targetBudgetAed: profile?.target_budget_aed || 25000000,
              preferredAreas: profile?.preferred_areas || [],
              savedPropertyIds: [],
            };

            setSuccessMessage(`Authenticated with Supabase.`);
            setTimeout(() => {
              onLoginSuccess(loggedUser);
              onClose();
              setIsLoading(false);
            }, 600);
            return;
          }
        } else if (mode === 'register') {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name,
                phone,
                investor_type: investorType,
                role: 'investor',
              },
            },
          });

          if (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
            return;
          }

          if (data.user) {
            const registeredUser: UserProfile = {
              id: data.user.id,
              name: name || 'VIP Investor',
              email: data.user.email || email,
              phone,
              role: 'investor',
              investorType,
              targetBudgetAed: 35000000,
              preferredAreas: ['Palm Jumeirah', 'Downtown Dubai'],
              savedPropertyIds: [],
            };

            setSuccessMessage('Account registered in Supabase auth.');
            setTimeout(() => {
              onLoginSuccess(registeredUser);
              onClose();
              setIsLoading(false);
            }, 600);
            return;
          }
        } else if (mode === 'forgot') {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
          });

          if (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
            return;
          }

          setSuccessMessage('Password reset instructions dispatched to your email.');
          setIsLoading(false);
          return;
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Authentication error.');
        setIsLoading(false);
        return;
      }
    }

    // Seamless Local Fallback mode when Supabase credentials are not yet entered
    setTimeout(() => {
      if (mode === 'forgot') {
        setSuccessMessage('Reset instructions dispatched to ' + email);
        setIsLoading(false);
        return;
      }

      setSuccessMessage(`Welcome to HS ESTATE VIP Portal`);
      setTimeout(() => {
        onLoginSuccess({
          ...CURRENT_USER,
          name: name || (email.split('@')[0]) || CURRENT_USER.name,
          email: email || CURRENT_USER.email,
          phone: phone || CURRENT_USER.phone,
          investorType,
        });
        onClose();
        setIsLoading(false);
      }, 600);
    }, 400);
  };

  const handleQuickDemo = (role: 'investor' | 'admin') => {
    if (role === 'admin') {
      onLoginSuccess({
        ...CURRENT_USER,
        id: 'admin-partner-01',
        name: 'Harmain S. (Senior Managing Partner)',
        email: 'harmain332@gmail.com',
        role: 'admin',
        investorType: 'Institutional',
      });
    } else {
      onLoginSuccess({
        ...CURRENT_USER,
        id: 'investor-client-01',
        role: 'investor',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0B1220] border border-[#C8A96B]/50 p-6 sm:p-8 shadow-2xl text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 border border-[#C8A96B] bg-[#111C30] flex items-center justify-center text-[#C8A96B]">
            <span className="font-serif text-xl font-bold tracking-widest">HS</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
            {mode === 'login' ? 'Private Client Access' : mode === 'register' ? 'Create VIP Account' : 'Reset Credentials'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isSupabaseConfigured
              ? 'Secure Supabase PostgreSQL & Auth Authentication'
              : 'Exclusive off-market Dubai estates & bespoke portfolio advisory'}
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="mb-6 p-3 bg-[#111C30] border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#DFC58E] uppercase tracking-wider">
              Quick Test Credentials:
            </span>
            <span className="text-[10px] text-slate-400">1-Click</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('investor')}
              className="py-1.5 px-2 bg-[#0B1220] hover:bg-[#C8A96B] hover:text-[#0B1220] text-slate-200 border border-slate-700 transition-colors text-[11px] font-medium"
            >
              Demo VIP Investor
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 bg-[#0B1220] hover:bg-[#C8A96B] hover:text-[#0B1220] text-slate-200 border border-slate-700 transition-colors text-[11px] font-medium"
            >
              Demo Admin Desk
            </button>
          </div>
        </div>

        {/* Tab switch */}
        {mode !== 'forgot' && (
          <div className="flex border-b border-slate-800 mb-6 text-xs uppercase tracking-wider font-semibold">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                mode === 'login' ? 'text-[#C8A96B] border-[#C8A96B]' : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                mode === 'register' ? 'text-[#C8A96B] border-[#C8A96B]' : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-[#C8A96B] mx-auto animate-bounce" />
            <p className="text-sm font-serif font-bold text-white">{successMessage}</p>
            {mode === 'forgot' ? (
              <button
                onClick={() => {
                  setMode('login');
                  setSuccessMessage('');
                }}
                className="mt-3 text-xs text-[#C8A96B] hover:underline"
              >
                Back to Sign In
              </button>
            ) : (
              <p className="text-xs text-slate-400">Loading your private portfolio...</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-slate-300 mb-1">Full Legal Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Lord Alexander Sinclair"
                      className="w-full bg-[#111C30] border border-slate-700 text-white pl-9 pr-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Investor Category</label>
                  <select
                    value={investorType}
                    onChange={(e) => setInvestorType(e.target.value as any)}
                    className="w-full bg-[#111C30] border border-slate-700 text-white px-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
                  >
                    <option value="Individual HNW">Individual Ultra-HNW Buyer</option>
                    <option value="Family Office">Family Office Principal / Trustee</option>
                    <option value="Institutional">Institutional Fund / Asset Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Direct Mobile</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="w-full bg-[#111C30] border border-slate-700 text-white pl-9 pr-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investor@domain.com"
                  className="w-full bg-[#111C30] border border-slate-700 text-white pl-9 pr-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-[#DFC58E] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#111C30] border border-slate-700 text-white pl-9 pr-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-xs uppercase tracking-widest font-semibold bg-[#C8A96B] hover:bg-[#DFC58E] text-[#0B1220] transition-colors mt-2 disabled:opacity-50"
            >
              {isLoading
                ? 'Processing...'
                : mode === 'login'
                ? 'Authenticate & Enter'
                : mode === 'register'
                ? 'Submit VIP Registration'
                : 'Send Password Reset Email'}
            </button>

            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full py-2 text-center text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </button>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span>DIFC Compliant 256-Bit Encrypted Data Protection</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
