import React, { useState } from 'react';
import {
  Handshake,
  FolderKanban,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


interface ProjectItem {
  id: string;
  name: string;
  partner: string;
  pathway: string;
  targetVolume: number;
  status:
    | 'DRAFT'
    | 'PROPOSED'
    | 'UNDER_REVIEW'
    | 'TECHNICAL_VALIDATION'
    | 'COMMERCIAL_NEGOTIATION'
    | 'ACTIVE'
    | 'COMPLETED';
  progress: number;
}

const mockProjects: ProjectItem[] = [
  {
    id: 'prj-001',
    name: 'Hazira Concrete Mineralization JV',
    partner: 'UltraTech Cement Ltd',
    pathway: 'CO2 Concrete Curing Block',
    targetVolume: 45000,
    status: 'ACTIVE',
    progress: 75,
  },
  {
    id: 'prj-002',
    name: 'Gulf Coast Methanol Off-take Project',
    partner: 'GreenGrow Chemicals Corp',
    pathway: 'Catalytic Methanol Synthesis',
    targetVolume: 80000,
    status: 'COMMERCIAL_NEGOTIATION',
    progress: 45,
  },
  {
    id: 'prj-003',
    name: 'Permian Polycarbonate Pilot',
    partner: 'Sabic Polychem',
    pathway: 'Polycarbonate Polyol Polymer',
    targetVolume: 25000,
    status: 'TECHNICAL_VALIDATION',
    progress: 25,
  },
];

const lifecycleSteps = [
  'DRAFT',
  'PROPOSED',
  'UNDER_REVIEW',
  'TECHNICAL_VALIDATION',
  'COMMERCIAL_NEGOTIATION',
  'ACTIVE',
  'COMPLETED',
];

export const PartnershipProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<ProjectItem>(mockProjects[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              Stage 8 of 10
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Partnerships & Project State Machine
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track multi-party joint venture agreements and enforce canonical state transitions across project milestones.
          </p>
        </div>

        <button
          onClick={() => navigate('/bids')}
          className="inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg"
        >
          <Handshake className="h-4 w-4" />
          <span>View Active Bids</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Project List */}
        <div className="space-y-3 lg:col-span-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Joint Venture Projects
          </h2>

          {mockProjects.map((prj) => {
            const isSelected = selectedProject.id === prj.id;
            return (
              <div
                key={prj.id}
                onClick={() => setSelectedProject(prj)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50/80 to-white shadow-md dark:border-emerald-600 dark:from-emerald-950/40 dark:to-slate-900'
                    : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {prj.pathway}
                    </span>
                    <h3 className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">
                      {prj.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 flex items-center space-x-1">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{prj.partner}</span>
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {prj.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>Fulfillment Progress</span>
                    <span className="font-bold text-emerald-600">{prj.progress}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      style={{ width: `${prj.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* State Machine Lifecycle Stepper */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <FolderKanban className="h-5 w-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  State Machine Lifecycle: {selectedProject.name}
                </h2>
              </div>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                UUID: {selectedProject.id}
              </span>
            </div>

            {/* Visual Stepper */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Canonical State Transitions
              </h3>

              <div className="space-y-2">
                {lifecycleSteps.map((step, idx) => {
                  const currentIdx = lifecycleSteps.indexOf(selectedProject.status);
                  const isPassed = idx < currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div
                      key={step}
                      className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                        isCurrent
                          ? 'border-emerald-500 bg-emerald-50/70 font-bold text-emerald-950 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200'
                          : isPassed
                          ? 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400'
                          : 'border-slate-100 text-slate-400 opacity-60 dark:border-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            isCurrent
                              ? 'bg-emerald-600 text-white'
                              : isPassed
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-200 text-slate-500 dark:bg-slate-800'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                        </div>
                        <span className="text-xs">{step.replace('_', ' ')}</span>
                      </div>

                      {isCurrent && (
                        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          Current Stage
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Validation Rule Notice */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Backend State Transition Validation</span>
              </div>
              <p className="mt-1">
                Out-of-order state transitions (e.g. DRAFT to ACTIVE) are blocked by <code>app/core/state_machines.py</code> and return HTTP 409 Conflict.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
