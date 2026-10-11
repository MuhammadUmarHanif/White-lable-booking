import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isFirebaseActive } = useAuth();
  const { brand } = useBrand();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectDemoLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await login('admin@marquee.com', 'admin123');
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.error || 'Authentication failed.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@marquee.com');
    setPassword('admin123');
  };

  const isConfigError = error && (error.includes('configuration-not-found') || error.includes('auth/configuration-not-found'));

  return (
    <div className="min-h-screen champagne-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#1C1917] text-[#D4AF37] mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#1C1917]">
            {brand.businessName}
          </h1>
          <p className="text-xs text-[#78716C]">
            Management & Banquet Concierge Portal
          </p>
        </div>

        {/* Quick 1-Click Access Card */}
        <div className="p-4 rounded-2xl bg-[#FBF6E9] border border-[#D4AF37]/30 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#1C1917]">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Marquee Admin Access</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1C1917] text-[#D4AF37] font-semibold">
              Super Admin
            </span>
          </div>
          <p className="text-[11px] text-[#78716C] leading-relaxed">
            Directly access all booking approvals, hall showcases, catering menus, and custom pricing rules:
          </p>
          <button
            type="button"
            onClick={handleDirectDemoLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#1C1917] hover:bg-stone-800 text-[#D4AF37] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow"
          >
            <span>{loading ? 'Entering...' : '1-Click Sign In as Admin'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isConfigError ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-2.5">
            <div className="flex items-start gap-2 font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Firebase Authentication Setup Required:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Aap ke Firebase project (<code>whitelablebooking</code>) me <strong>Authentication</strong> &gt; <strong>Sign-in method</strong> me <strong>Email/Password</strong> abhi enable nahi hua.
            </p>
            <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-[11px] text-stone-700 space-y-1">
              <p className="font-semibold text-amber-950">Firebase Console Steps:</p>
              <ol className="list-decimal pl-4 space-y-0.5">
                <li>Firebase Console kholiye &gt; Build &gt; Authentication</li>
                <li>&quot;Sign-in method&quot; tab me <strong>Email/Password</strong> ko Enable karein</li>
                <li>&quot;Users&quot; tab me <code>admin@marquee.com</code> add karein</li>
              </ol>
            </div>
            <p className="text-[11px] font-medium text-amber-900">
              Tab tak aap ooper diye gaye <strong>1-Click Sign In as Admin</strong> button se direct dashboard use kar saktay hain!
            </p>
          </div>
        ) : error ? (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block uppercase font-semibold text-[#78716C] tracking-wider text-[11px]">
                Administrator Email
              </label>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[10px] text-[#997A15] hover:underline font-semibold"
              >
                Auto-fill
              </button>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@marquee.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-xs text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block uppercase font-semibold text-[#78716C] tracking-wider text-[11px]">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-xs text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-white gold-gradient-bg shadow-md hover:shadow-lg transition-transform hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link to="/" className="text-xs text-[#78716C] hover:text-[#1C1917]">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
