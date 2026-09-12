import React from 'react';
import { Github, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Tagline */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black font-black text-white text-xs">
              CX
            </div>
            <div>
              <span className="font-bold text-sm text-neutral-950 dark:text-white">CarbonX</span>
              <p className="text-xs text-neutral-500">
                CarbonX • HackOut 2026
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center space-x-6 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            <a href="#how-it-works" className="hover:text-black dark:hover:text-white transition">
              About
            </a>
            <a href="#features" className="hover:text-black dark:hover:text-white transition">
              Features
            </a>
            <a href="#impact" className="hover:text-black dark:hover:text-white transition">
              Contact
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-black dark:hover:text-white transition"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-2">
          <p>© 2026 CarbonX Exchange Platform. Built for HackOut 2026.</p>
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Verifiable Industrial CCUS Matchmaking</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
