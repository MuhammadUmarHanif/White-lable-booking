import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen champagne-gradient-bg flex items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-14 h-14 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#1C1917] text-[#D4AF37] mx-auto shadow-md">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-5xl font-bold text-[#1C1917]">404</h1>
          <h2 className="font-serif text-2xl text-[#1C1917]">Page Not Found</h2>
          <p className="text-xs text-[#78716C]">
            The hall or page you requested could not be located.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white gold-gradient-bg shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};
