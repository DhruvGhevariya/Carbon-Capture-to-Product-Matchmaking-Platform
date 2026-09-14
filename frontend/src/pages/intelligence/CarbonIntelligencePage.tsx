import React, { useState } from 'react';
import {
  DollarSign,
  Truck,
  Leaf,
  Layers,
  ArrowRight,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export const CarbonIntelligencePage: React.FC = () => {
  const navigate = useNavigate();

  // Slider State Controls
  const [co2Volume, setCo2Volume] = useState<number>(500); // tonnes
  const [distanceKm, setDistanceKm] = useState<number>(45); // km
  const [efficiency, setEfficiency] = useState<number>(92); // %
  const [avoidanceFactor, setAvoidanceFactor] = useState<number>(0.84);

  // Engine Formula Logic
  const co2Utilized = Math.round(co2Volume * (efficiency / 100));
  const transportEmissions = parseFloat((co2Utilized * distanceKm * 0.00012).toFixed(2));
  const netAvoidedCo2 = Math.round(co2Utilized * avoidanceFactor - transportEmissions);
  
  // Freight Tariff Calculation (₹3.5 per ton-km base)
  const freightTariffPerTon = Math.round(distanceKm * 3.5 + 180);
  const totalLandedCost = Math.round(co2Utilized * (1200 + freightTariffPerTon));
  const netRevenue = Math.round(co2Utilized * 2800 - totalLandedCost);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              Stage 5 of 10
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Carbon Intelligence & Scenario Modeling
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Simulate net carbon avoidance, landed freight cost tariffs, and commercial NPV scenarios using deterministic calculation engines.
          </p>
        </div>

        <button
          onClick={() => navigate('/marketplace')}
          className="inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg"
        >
          <Layers className="h-4 w-4" />
          <span>Proceed to Marketplace</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Controls & Scenario Sliders */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3.5 dark:border-slate-800">
              <Sliders className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Scenario Simulation Inputs
              </h2>
            </div>

            <div className="mt-5 space-y-5">
              {/* CO2 Captured Volume */}
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">CO₂ Capture Volume</span>
                  <span className="font-extrabold text-emerald-600">{co2Volume} tonnes</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={co2Volume}
                  onChange={(e) => setCo2Volume(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Transport Distance */}
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Transport Distance</span>
                  <span className="font-extrabold text-emerald-600">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="300"
                  step="5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Conversion Efficiency */}
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Conversion Efficiency</span>
                  <span className="font-extrabold text-emerald-600">{efficiency}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="99"
                  step="1"
                  value={efficiency}
                  onChange={(e) => setEfficiency(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Avoidance Factor */}
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Avoidance Factor Ratio</span>
                  <span className="font-extrabold text-emerald-600">{avoidanceFactor}</span>
                </div>
                <input
                  type="range"
                  min="0.50"
                  max="0.95"
                  step="0.01"
                  value={avoidanceFactor}
                  onChange={(e) => setAvoidanceFactor(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Engine Outputs */}
        <div className="space-y-6 lg:col-span-7">
          {/* Carbon & Environmental Results */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Leaf className="h-5 w-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Deterministic Carbon Impact Output
                </h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Formula v1.4 Certified
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 p-4 dark:border-emerald-900 dark:from-emerald-950/30 dark:to-slate-900">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Net Avoided CO₂</span>
                </div>
                <div className="mt-2 text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                  {netAvoidedCo2.toLocaleString()} t CO₂e
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  After accounting for logistics transport emissions
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
                  <Truck className="h-4 w-4 text-teal-600" />
                  <span>Transport Emissions</span>
                </div>
                <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {transportEmissions} t CO₂e
                </div>
                <p className="mt-1 text-[10px] text-slate-400">
                  0.00012 t/km factor over {distanceKm} km
                </p>
              </div>
            </div>
          </div>

          {/* Economic Scenario Results */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Economic Tariff & Margin Modeling
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-400">Currency: INR (₹)</span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="text-xs font-semibold text-slate-500">Freight Tariff / Ton</div>
                <div className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
                  ₹{freightTariffPerTon.toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400">Road cryogenic tanker</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="text-xs font-semibold text-slate-500">Total Landed Cost</div>
                <div className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
                  ₹{(totalLandedCost / 100000).toFixed(2)} Lakh
                </div>
                <p className="text-[10px] text-slate-400">Base capture + transport</p>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5 dark:border-emerald-900 dark:bg-emerald-950/30">
                <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                  Est. Net Margin
                </div>
                <div className="mt-2 text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
                  ₹{(netRevenue / 100000).toFixed(2)} Lakh
                </div>
                <p className="text-[10px] text-emerald-800 dark:text-emerald-300">
                  Commercial off-take ROI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
