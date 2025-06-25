'use client';

import { CheckCircle, XCircle, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import type { CompatibilityResult, Cassette, Chain, RearDerailleur, Crankset } from '@/types/components';

interface CompatibilityResultsProps {
  result: CompatibilityResult;
  components: {
    cassette?: Cassette;
    chain?: Chain;
    rearDerailleur?: RearDerailleur;
    crankset?: Crankset;
  };
}

export function CompatibilityResults({ result, components }: CompatibilityResultsProps) {
  const { isCompatible, compatibilityScore, issues, warnings, gearAnalysis } = result;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-600';
    if (score >= 70) return 'text-tool-orange';
    return 'text-error-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-success-50 border-success-200';
    if (score >= 70) return 'bg-orange-50 border-orange-200';
    return 'bg-error-50 border-error-200';
  };

  return (
    <div className="space-y-6">
      {/* Overall Compatibility Score */}
      <div className={`card border-2 ${getScoreBgColor(compatibilityScore)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {isCompatible ? (
              <CheckCircle className="w-8 h-8 text-success-600" />
            ) : (
              <XCircle className="w-8 h-8 text-error-600" />
            )}
            <div>
              <h3 className="text-xl font-bold text-neutral-900">
                {isCompatible ? 'Compatible!' : 'Incompatible'}
              </h3>
              <p className="text-neutral-600">
                {isCompatible 
                  ? 'These components work together'
                  : 'Issues found that prevent compatibility'
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(compatibilityScore)}`}>
              {compatibilityScore}
            </div>
            <div className="text-sm text-neutral-600">
              Compatibility Score
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-neutral-600">Issues:</span>
            <span className="ml-2 font-medium">
              {issues.length === 0 ? 'None' : `${issues.length} found`}
            </span>
          </div>
          <div>
            <span className="text-neutral-600">Warnings:</span>
            <span className="ml-2 font-medium">
              {warnings.length === 0 ? 'None' : `${warnings.length} found`}
            </span>
          </div>
        </div>
      </div>

      {/* Issues */}
      {issues.length > 0 && (
        <div className="card">
          <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
            <XCircle className="w-5 h-5 text-error-600 mr-2" />
            Compatibility Issues
          </h4>
          <div className="space-y-4">
            {issues.map((issue, index) => (
              <div key={index} className="border border-error-200 bg-error-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <XCircle className="w-5 h-5 text-error-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h5 className="font-medium text-error-900 mb-1">
                      {issue.issue}
                    </h5>
                    <p className="text-sm text-error-800 mb-2">
                      {issue.description}
                    </p>
                    {issue.solution && (
                      <div className="bg-error-100 border border-error-200 rounded p-3">
                        <p className="text-sm font-medium text-error-900 mb-1">
                          💡 Solution:
                        </p>
                        <p className="text-sm text-error-800">
                          {issue.solution}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="card">
          <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-tool-orange mr-2" />
            Warnings & Recommendations
          </h4>
          <div className="space-y-3">
            {warnings.map((warning, index) => (
              <div key={index} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-tool-orange mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h5 className="font-medium text-orange-900 mb-1">
                      {warning.warning}
                    </h5>
                    <p className="text-sm text-orange-800 mb-2">
                      {warning.description}
                    </p>
                    {warning.recommendation && (
                      <p className="text-sm text-orange-700 font-medium">
                        💡 {warning.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gear Analysis */}
      {gearAnalysis && (
        <div className="card">
          <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-primary-600 mr-2" />
            Gear Ratio Analysis
          </h4>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {gearAnalysis.minRatio.toFixed(1)}
              </div>
              <div className="text-sm text-neutral-600">Lowest Gear</div>
            </div>
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {gearAnalysis.maxRatio.toFixed(1)}
              </div>
              <div className="text-sm text-neutral-600">Highest Gear</div>
            </div>
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {gearAnalysis.range.toFixed(1)}
              </div>
              <div className="text-sm text-neutral-600">Range</div>
            </div>
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {gearAnalysis.efficiency.toFixed(0)}
              </div>
              <div className="text-sm text-neutral-600">Efficiency Score</div>
            </div>
          </div>

          {/* Gear Steps Analysis */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <h5 className="font-medium text-neutral-900 mb-2">Gear Steps Analysis</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-600">Average Step:</span>
                <span className="ml-2 font-medium">
                  {gearAnalysis.averageStep.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-neutral-600">Largest Gap:</span>
                <span className="ml-2 font-medium">
                  {gearAnalysis.largestGap.toFixed(1)}%
                </span>
              </div>
            </div>
            
            {gearAnalysis.largestGap > 25 && (
              <div className="mt-3 p-3 bg-orange-100 border border-orange-200 rounded">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-orange-800">
                    Large gear step detected ({gearAnalysis.largestGap.toFixed(1)}%). 
                    Consider a cassette with more evenly spaced cogs for smoother shifting.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Gear Ratios List */}
          <div className="mt-4">
            <h5 className="font-medium text-neutral-900 mb-2">All Gear Ratios</h5>
            <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-12 gap-1 text-xs">
              {gearAnalysis.ratios.map((ratio, index) => (
                <div 
                  key={index}
                  className="text-center p-1 bg-white border border-neutral-200 rounded"
                >
                  {ratio.toFixed(1)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compatible & No Issues */}
      {isCompatible && issues.length === 0 && warnings.length === 0 && (
        <div className="card border-2 border-success-200 bg-success-50">
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-success-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-success-900 mb-2">
              Perfect Compatibility! 🎉
            </h3>
            <p className="text-success-800">
              These components work together flawlessly with no issues or warnings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}