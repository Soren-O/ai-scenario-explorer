'use client';

import { useState } from 'react';
import { Configuration, Scenario, ScenarioBranch } from '@/types';
import { initialScenarios } from '@/data/scenarios';
import { parameters } from '@/data/parameters';

interface ScenarioViewProps {
  configuration: Configuration;
  onBack: () => void;
  viewAll?: boolean;
}

export default function ScenarioView({ configuration, onBack, viewAll = false }: ScenarioViewProps) {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [branchPath, setBranchPath] = useState<ScenarioBranch[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2027-01-01'));

  // Helper to get parameter label from value
  const getParamLabel = (paramId: string, value: number): string => {
    const param = parameters.find((p) => p.id === paramId);
    if (!param) return String(value);
    const option = param.options.find((o) => o.value === value);
    return option ? option.label : String(value);
  };

  // Find scenarios that match the configuration (or all if viewAll is true)
  // -1 means "unspecified" and matches any value
  const matchingScenarios = viewAll
    ? initialScenarios
    : initialScenarios.filter((scenario) => {
        return Object.keys(configuration.parameters).every((key) => {
          const userValue = configuration.parameters[key as keyof typeof configuration.parameters];
          const scenarioValue = scenario.configuration.parameters[key as keyof typeof configuration.parameters];
          // If user left it unspecified (-1), match any scenario value
          if (userValue === -1) return true;
          return scenarioValue === userValue;
        });
      });

  // Helper to format a scenario's parameters for display
  const formatScenarioParams = (scenario: Scenario): string[] => {
    const result: string[] = [];
    Object.entries(scenario.configuration.parameters).forEach(([key, value]) => {
      const label = getParamLabel(key, value);
      const shortName = paramDisplayNames[key] || key;
      if (value !== -1) {
        result.push(`${shortName}: ${label}`);
      }
    });
    return result;
  };

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setBranchPath([]);
    setCurrentDate(new Date('2027-01-01'));
  };

  const handleSelectBranch = (branch: ScenarioBranch) => {
    setBranchPath([...branchPath, branch]);
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 3);
    setCurrentDate(newDate);
  };

  const handleBack = () => {
    if (branchPath.length > 0) {
      setBranchPath(branchPath.slice(0, -1));
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 3);
      setCurrentDate(newDate);
    } else if (selectedScenario) {
      setSelectedScenario(null);
    } else {
      onBack();
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCurrentBranches = (): ScenarioBranch[] => {
    if (!selectedScenario) return [];
    if (branchPath.length === 0) return selectedScenario.branches;
    const lastBranch = branchPath[branchPath.length - 1];
    return lastBranch.nextBranches || [];
  };

  // Parameter display names
  const paramDisplayNames: Record<string, string> = {
    codingTimeHorizonDoubling: 'Doubling Rate',
    codingTimeHorizonForAC: 'AC Threshold',
    doublingDifficulty: 'Difficulty Scaling',
    topToMedianRatio: 'Top/Median Ratio',
    researchTasteSpeed: 'Research Taste',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Parameters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedScenario
                    ? selectedScenario.title
                    : viewAll
                      ? 'All Scenarios'
                      : 'Matching Scenarios'}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {selectedScenario
                    ? formatDate(currentDate)
                    : viewAll
                      ? 'Browse all available scenarios'
                      : 'Based on your configuration'}
                </p>
              </div>
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Back
              </button>
            </div>

            {/* Selected Parameters Display - only show when not in viewAll mode */}
            {!viewAll && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Your Parameters</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(configuration.parameters).map(([key, value]) => (
                    <div
                      key={key}
                      className="inline-flex items-center px-3 py-1.5 bg-gray-100 rounded-full text-sm"
                    >
                      <span className="text-gray-500 mr-1.5">{paramDisplayNames[key]}:</span>
                      <span className="font-medium text-gray-900">{getParamLabel(key, value)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                    <span className="text-gray-500 mr-1.5">Company Ranking:</span>
                    <span className="font-medium text-gray-900">
                      {configuration.companyRanking.every((c) => c === null)
                        ? 'All Unspecified'
                        : configuration.companyRanking
                            .map((c, i) => c ?? `#${i + 1}?`)
                            .join(' > ')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scenario Selection */}
          {!selectedScenario && (
            <div className="space-y-4">
              {matchingScenarios.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Matching Scenarios
                  </h3>
                  <p className="text-gray-600 mb-6">
                    No pre-written scenarios match your exact parameter configuration.
                    Try adjusting your parameters or check back later as more scenarios are added.
                  </p>
                  <button
                    onClick={onBack}
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Adjust Parameters
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-sm">
                    {viewAll
                      ? `${matchingScenarios.length} scenario${matchingScenarios.length !== 1 ? 's' : ''} available`
                      : `${matchingScenarios.length} scenario${matchingScenarios.length !== 1 ? 's' : ''} match your configuration`}
                  </p>
                  {matchingScenarios.map((scenario) => {
                    const scenarioParams = formatScenarioParams(scenario);
                    return (
                      <div
                        key={scenario.id}
                        onClick={() => handleSelectScenario(scenario)}
                        className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all border border-gray-100 hover:border-gray-200"
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {scenario.title}
                        </h3>
                        {scenario.sourceUrl && (
                          <a
                            href={scenario.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline mb-3 inline-block"
                          >
                            {scenario.sourceUrl}
                          </a>
                        )}

                        {/* Scenario's parameters - always show in viewAll mode */}
                        {(viewAll || scenarioParams.length > 0) && (
                          <div className="mb-3 py-2 px-3 bg-gray-50 rounded-lg border border-gray-100">
                            {scenarioParams.length > 0 ? (
                              <div className="text-xs text-gray-600 space-y-0.5">
                                {scenarioParams.map((param, idx) => (
                                  <div key={idx}>{param}</div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500 italic">
                                All parameters unspecified
                              </p>
                            )}
                          </div>
                        )}

                        <p className="text-gray-600 leading-relaxed line-clamp-4">
                          {scenario.description.split('\n')[0]}
                        </p>
                        <div className="mt-4 text-gray-900 font-medium text-sm">
                          Explore scenario →
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {/* Selected Scenario with Branches */}
          {selectedScenario && (
            <div className="space-y-6">
              {/* Timeline */}
              {branchPath.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <div className="flex items-center space-x-2 overflow-x-auto">
                    <div className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm font-medium whitespace-nowrap">
                      Jan 1, 2027
                    </div>
                    {branchPath.map((branch, index) => {
                      const date = new Date('2027-01-01');
                      date.setMonth(date.getMonth() + (index + 1) * 3);
                      return (
                        <div key={branch.id} className="flex items-center space-x-2">
                          <span className="text-gray-400">→</span>
                          <div className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm font-medium whitespace-nowrap">
                            {date.toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Current Situation */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {branchPath.length === 0
                    ? 'Starting Scenario'
                    : branchPath[branchPath.length - 1].title}
                </h3>
                {branchPath.length === 0 && selectedScenario.sourceUrl && (
                  <a
                    href={selectedScenario.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline mb-4 inline-block"
                  >
                    Source: {selectedScenario.sourceUrl}
                  </a>
                )}
                <p className="text-gray-600 whitespace-pre-line leading-relaxed mt-3">
                  {branchPath.length === 0
                    ? selectedScenario.description
                    : branchPath[branchPath.length - 1].description}
                </p>
                {branchPath.length > 0 && (
                  <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r">
                    <p className="text-sm font-medium text-amber-800 mb-1">Consequences</p>
                    <p className="text-amber-900 text-sm">
                      {branchPath[branchPath.length - 1].consequences}
                    </p>
                  </div>
                )}
              </div>

              {/* Next Branches */}
              {getCurrentBranches().length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    What happens next?
                  </h3>
                  <div className="space-y-3">
                    {getCurrentBranches().map((branch) => (
                      <div
                        key={branch.id}
                        onClick={() => handleSelectBranch(branch)}
                        className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-lg transition-all border-l-4 border-gray-900"
                      >
                        <h4 className="text-lg font-bold text-gray-900 mb-2">
                          {branch.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">{branch.description}</p>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Outcome:</span> {branch.consequences}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* End of Path */}
              {getCurrentBranches().length === 0 && branchPath.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="text-5xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    End of Path
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    You've reached the end of this scenario path.
                  </p>
                  <button
                    onClick={() => {
                      setBranchPath([]);
                      setCurrentDate(new Date('2027-01-01'));
                    }}
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    Start Over
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
