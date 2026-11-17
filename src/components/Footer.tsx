import React from 'react';
import { useTrek } from '../context/TrekContext';
import { Globe, ShieldCheck, Mountain } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useTrek();

  return (
    <footer className="bg-[#ffffff] border-t border-[#ebebeb] text-[#222222] text-[14px] mt-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Three Columns of Link Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Support & Safety */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-semibold text-[#222222]">
              Expedition Support
            </h4>
            <ul className="space-y-2.5 text-[#6a6a6a] text-[14px]">
              <li>
                <a href="#help" onClick={(e) => { e.preventDefault(); setActiveTab('weather'); }} className="hover:underline">
                  High-Altitude Safety Center
                </a>
              </li>
              <li>
                <a href="#gear" onClick={(e) => { e.preventDefault(); setActiveTab('ai-guide'); }} className="hover:underline">
                  Personalized AI Packing Lists
                </a>
              </li>
              <li>
                <a href="#radar" onClick={(e) => { e.preventDefault(); setActiveTab('weather'); }} className="hover:underline">
                  Live Alpine Weather Radar
                </a>
              </li>
              <li>
                <span className="cursor-default">
                  Acute Mountain Sickness (AMS) Protocol
                </span>
              </li>
              <li>
                <span className="cursor-default">
                  Satellite SOS Emergency Evac
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2: Guiding & Hosting */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-semibold text-[#222222]">
              Guiding &amp; Leadership
            </h4>
            <ul className="space-y-2.5 text-[#6a6a6a] text-[14px]">
              <li>
                <a href="#admin" onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }} className="hover:underline text-[#222222] font-medium">
                  Guide Portal &amp; Admin Console
                </a>
              </li>
              <li>
                <span className="cursor-default">
                  IFMGA &amp; UIAGM Guide Standards
                </span>
              </li>
              <li>
                <span className="cursor-default">
                  Sherpa Community Fair-Wage Ethics
                </span>
              </li>
              <li>
                <span className="cursor-default">
                  National Park Conservation Permits
                </span>
              </li>
              <li>
                <span className="cursor-default">
                  Leave No Trace (LNT) Master Rules
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: ApexTrail */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-semibold text-[#222222]">
              ApexTrail
            </h4>
            <ul className="space-y-2.5 text-[#6a6a6a] text-[14px]">
              <li>
                <a href="#explore" onClick={(e) => { e.preventDefault(); setActiveTab('explore'); }} className="hover:underline">
                  Explore World-Class Trails
                </a>
              </li>
              <li>
                <span className="cursor-default">
                  Himalayan &amp; Alpine Peak Database
                </span>
              </li>
              <li>
                <span className="cursor-default">
                  Gemini 3.8 Flash Expedition Adviser
                </span>
              </li>
              <li>
                <span className="cursor-default">
                  Company details &amp; Careers
                </span>
              </li>
              <li>
                <span className="cursor-default">
                  Sustainability in Mountain Tourism
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Canonical Legal Sub-Band ({component.legal-band}) */}
        <div className="pt-6 border-t border-[#ebebeb] flex flex-col md:flex-row items-center justify-between gap-4 text-[14px] text-[#6a6a6a]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>&copy; {new Date().getFullYear()} ApexTrail, Inc.</span>
            <span>&bull;</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span>&bull;</span>
            <span className="hover:underline cursor-pointer">Terms</span>
            <span>&bull;</span>
            <span className="hover:underline cursor-pointer">Sitemap</span>
            <span>&bull;</span>
            <span className="hover:underline cursor-pointer">Company details</span>
          </div>

          {/* Utilities: Language & Currency */}
          <div className="flex items-center gap-6 font-semibold text-[#222222]">
            <button className="flex items-center gap-2 hover:underline cursor-pointer">
              <Globe className="w-4 h-4 text-[#222222]" />
              <span>English (US)</span>
            </button>
            <button className="hover:underline cursor-pointer">
              <span>$ USD</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
