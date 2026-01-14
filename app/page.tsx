'use client';

import { useState } from 'react';
import { parameters, companies } from '@/data/parameters';
import { Configuration, Company } from '@/types';
import ScenarioView from '@/components/ScenarioView';

export default function Home() {
  const [step, setStep] = useState<'config' | 'scenario' | 'view-all'>('config');
  const [config, setConfig] = useState<Configuration>({
    parameters: {
      codingTimeHorizonDoubling: -1,
      codingTimeHorizonForAC: -1,
      doublingDifficulty: -1,
      topToMedianRatio: -1,
      researchTasteSpeed: -1,
    },
    companyRanking: [null, null, null, null, null], // Start with all positions unspecified
  });

  const handleParameterChange = (paramId: string, optionIndex: number) => {
    const param = parameters.find((p) => p.id === paramId);
    if (param) {
      const value = param.options[optionIndex].value;
      setConfig((prev) => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          [paramId]: value,
        },
      }));
    }
  };

  const getSelectedIndex = (paramId: string): number => {
    const param = parameters.find((p) => p.id === paramId);
    if (!param) return 2;
    const currentValue = config.parameters[paramId as keyof typeof config.parameters];
    const index = param.options.findIndex((opt) => opt.value === currentValue);
    return index >= 0 ? index : 2;
  };

  // Get companies that haven't been assigned to any position
  const getAvailableCompanies = (): Company[] => {
    const assigned = new Set(config.companyRanking.filter((c): c is Company => c !== null));
    return companies.filter((c) => !assigned.has(c));
  };

  // Assign a company to a position
  const handleAssignCompany = (position: number, company: Company | null) => {
    setConfig((prev) => {
      const newRanking = [...prev.companyRanking];
      // If assigning a company, remove it from any other position first
      if (company !== null) {
        const existingIndex = newRanking.indexOf(company);
        if (existingIndex !== -1) {
          newRanking[existingIndex] = null;
        }
      }
      newRanking[position] = company;
      return { ...prev, companyRanking: newRanking };
    });
  };

  // Clear a position
  const handleClearPosition = (position: number) => {
    handleAssignCompany(position, null);
  };

  if (step === 'scenario') {
    return <ScenarioView configuration={config} onBack={() => setStep('config')} />;
  }

  if (step === 'view-all') {
    return <ScenarioView configuration={config} onBack={() => setStep('config')} viewAll />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Scenario Explorer
            </h1>
            <p className="text-gray-600 mb-8">
              Configure parameters to explore different AI development scenarios starting
              from January 1st, 2027.
            </p>

            <div className="space-y-8">
              {/* Parameter Configuration */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  AI Development Parameters
                </h2>
                <div className="space-y-8">
                  {parameters.map((param) => {
                    const selectedIndex = getSelectedIndex(param.id);
                    return (
                      <div key={param.id} className="space-y-3">
                        <div>
                          <span className="text-base font-medium text-gray-800">
                            {param.name}
                          </span>
                          <span className="block text-sm text-gray-500 mt-0.5">
                            {param.description}
                          </span>
                        </div>

                        {/* Slider */}
                        <div className="px-1">
                          <input
                            type="range"
                            min="0"
                            max={param.options.length - 1}
                            value={selectedIndex}
                            onChange={(e) =>
                              handleParameterChange(param.id, parseInt(e.target.value))
                            }
                            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer slider-thumb"
                          />
                          {/* Labels */}
                          <div className="flex justify-between mt-2">
                            {param.options.map((option, idx) => (
                              <button
                                key={option.value}
                                onClick={() => handleParameterChange(param.id, idx)}
                                className={`text-xs px-1 py-0.5 rounded transition-colors ${
                                  idx === selectedIndex
                                    ? 'text-gray-900 font-semibold'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Company Leaderboard */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  AI Company Leaderboard
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Specify which companies lead in AI capabilities. Leave positions unspecified if unknown.
                </p>
                <div className="space-y-2">
                  {config.companyRanking.map((company, index) => {
                    const availableCompanies = getAvailableCompanies();
                    const isAssigned = company !== null;

                    return (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <span className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-sm mr-3 ${
                          isAssigned ? 'bg-gray-900' : 'bg-gray-300'
                        } text-white`}>
                          {index + 1}
                        </span>

                        {isAssigned ? (
                          <>
                            <span className="font-medium text-gray-700 flex-1">{company}</span>
                            <button
                              onClick={() => handleClearPosition(index)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                              title="Clear position"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <select
                            value=""
                            onChange={(e) => handleAssignCompany(index, e.target.value as Company)}
                            className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-1.5 text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent cursor-pointer"
                          >
                            <option value="" disabled>Unspecified</option>
                            {availableCompanies.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={() => setStep('scenario')}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  View Matching Scenarios
                </button>
                <button
                  onClick={() => setStep('view-all')}
                  className="w-full bg-white text-gray-700 py-3 px-6 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  View All Scenarios
                </button>
              </div>
            </div>
          </div>

          {/* Info Footer */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>
              Parameter values based on{' '}
              <a
                href="https://www.aifuturesmodel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 underline"
              >
                AI Futures Model
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
