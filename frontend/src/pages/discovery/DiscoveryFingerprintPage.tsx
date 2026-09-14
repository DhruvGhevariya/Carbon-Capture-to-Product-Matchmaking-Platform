import React, { useState } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Building2,
  MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  CO2Fingerprint,
  MatchScore,
  MatchScoreBreakdown,
  MatchExplanation,
  CarbonImpactCard,
  EconomicScenarioCard,
} from '@/components/carbonx';


interface StreamSource {
  id: string;
  name: string;
  facility: string;
  industry: string;
  location: string;
  annualVolume: number;
  purity: number;
  pressure: number;
  temperature: number;
  impurities: Record<string, number>;
  fingerprintStatus: 'VERIFIED' | 'PENDING' | 'CHARACTERIZED';
}

const mockStreams: StreamSource[] = [
  {
    id: 'src-001',
    name: 'Gulf Coast Ammonia Capture Stream A',
    facility: 'Texas Industrial Hydrogen Hub',
    industry: 'Fertilizer & Ammonia',
    location: 'Houston, TX',
    annualVolume: 120000,
    purity: 98.5,
    pressure: 15.2,
    temperature: 28.0,
    impurities: { H2S_ppm: 2.5, moisture_ppm: 15, NOx_ppm: 0.8 },
    fingerprintStatus: 'VERIFIED',
  },
  {
    id: 'src-002',
    name: 'Gujarat Cement Flue Gas Stream',
    facility: 'UltraTech Hazira Plant',
    industry: 'Cement & Building Materials',
    location: 'Hazira, Gujarat, IN',
    annualVolume: 85000,
    purity: 92.0,
    pressure: 2.1,
    temperature: 85.0,
    impurities: { SOx_ppm: 45, dust_mg_m3: 12, moisture_ppm: 120 },
    fingerprintStatus: 'CHARACTERIZED',
  },
  {
    id: 'src-003',
    name: 'Permian Bio-Ethanol Fermentation Off-Gas',
    facility: 'Midland Green Energy Complex',
    industry: 'Bio-refining',
    location: 'Midland, TX',
    annualVolume: 45000,
    purity: 99.2,
    pressure: 8.5,
    temperature: 22.0,
    impurities: { moisture_ppm: 8, ethanol_ppm: 12 },
    fingerprintStatus: 'VERIFIED',
  },
];

export const DiscoveryFingerprintPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStream, setSelectedStream] = useState<StreamSource>(mockStreams[0]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              Stage 2 of 10
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              CO₂ Stream Discovery & Fingerprinting
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Explore certified point-source capture streams, characterize physical impurities, and generate stream fingerprints.
          </p>
        </div>

        <button
          onClick={() => navigate('/ai/recommend')}
          className="inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg"
        >
          <Sparkles className="h-4 w-4" />
          <span>Proceed to AI Matchmaking</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Stream Selector List */}
        <div className="space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search capture streams by facility or purity..."
                className="w-full rounded-lg bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none dark:bg-slate-800 dark:text-white"
              />
            </div>
            <button className="ml-2 rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800">
              <Filter className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {mockStreams.map((stream) => {
              const isSelected = selectedStream.id === stream.id;
              return (
                <div
                  key={stream.id}
                  onClick={() => setSelectedStream(stream)}
                  className={`group relative cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-gradient-to-br from-emerald-50/80 to-white shadow-md dark:border-emerald-600 dark:from-emerald-950/40 dark:to-slate-900'
                      : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {stream.industry}
                      </span>
                      <h3 className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">
                        {stream.name}
                      </h3>
                      <div className="mt-1 flex items-center space-x-3 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Building2 className="h-3.5 w-3.5" />
                          <span>{stream.facility}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{stream.location}</span>
                        </span>
                      </div>
                    </div>

                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {stream.purity}% Purity
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {stream.annualVolume.toLocaleString()} tonnes/yr
                    </span>
                    <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{stream.fingerprintStatus}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stream Detail & Fingerprint Engine Card */}
        <div className="space-y-6 lg:col-span-7">
          {/* CO2 Fingerprint Spectrograph */}
          <CO2Fingerprint
            purityPercent={selectedStream.purity}
            volumeTonnes={selectedStream.annualVolume}
            temperatureC={selectedStream.temperature}
            pressureBar={selectedStream.pressure}
            impuritiesPpm="SOx < 15 ppm · NOx < 40 ppm · Moisture < 1.2%"
          />

          {/* Match Score & Analysis Section */}
          <div className="rounded-xl border border-[#222736] bg-[#12141C] p-6 shadow-card space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#222736]">
              <div>
                <h3 className="font-display text-base font-bold text-[#F8FAFC]">
                  ALGORITHMIC COMPATIBILITY ANALYSIS
                </h3>
                <p className="font-mono text-xs text-[#94A3B8]">
                  MATCHED AGAINST: CARBONCURE PRECAST SINK #CONCRETE-994
                </p>
              </div>

              <MatchScore score={94} size="sm" />
            </div>

            <MatchScoreBreakdown
              technicalScore={96}
              economicScore={88}
              environmentalScore={95}
              geographicScore={92}
              trlScore={90}
            />
          </div>

          {/* Sticky Storytelling Match Narrative */}
          <MatchExplanation
            sourceName={selectedStream.name}
            sinkName="CarbonCure Mineral Carbonation Sink"
            rationale={[
              `CO₂ stream purity (${selectedStream.purity}%) exceeds minimum threshold (88.0%) required for direct mineral carbonation.`,
              `Stack temperature (${selectedStream.temperature}°C) provides sufficient thermal energy for solvent recovery.`,
              'Geographic distance enables low-cost pipeline transportation without rail logistics overhead.',
            ]}
            warnings={[
              'Trace sulfur components require secondary polish filter if relative moisture exceeds 2.0%.',
            ]}
            netAvoidedTons={Math.round(selectedStream.annualVolume * 0.9)}
            estimatedRevenue={`$${(selectedStream.annualVolume * 165 / 1000000).toFixed(1)}M / year`}
          />

          {/* Editorial Data Cards: Impact & Economics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CarbonImpactCard
              avoidedEmissions={Math.round(selectedStream.annualVolume * 0.9)}
              captureEfficiency={selectedStream.purity}
            />

            <EconomicScenarioCard
              capex="$12.4M"
              opexPerTon="$42.50 / ton"
              offtakePricePerTon="$185.00 / ton"
              paybackPeriodYears={3.8}
              npv7Year="$14.8M"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
