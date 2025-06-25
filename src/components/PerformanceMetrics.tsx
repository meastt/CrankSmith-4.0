'use client';

import { useState } from 'react';
import { TrendingUp, BarChart3, Target, Weight, DollarSign, Zap, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface PerformanceMetricsProps {
  build: any;
  metrics: any;
}

export function PerformanceMetrics({ build, metrics }: PerformanceMetricsProps) {
  const [expandedSections, setExpandedSections] = useState({
    gearRatios: true,
    weight: false,
    price: false,
    efficiency: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  if (!metrics) {
    return (
      <div className="card text-center py-12">
        <BarChart3 className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 mb-2">No Analysis Results</h3>
        <p className="text-neutral-600">Run analysis to see detailed performance metrics</p>
      </div>
    );
  }

  const getEfficiencyColor = (score: number) => {
    if (score >= 90) return 'text-success-600 bg-success-50';
    if (score >= 75) return 'text-tool-orange bg-orange-50';
    return 'text-error-600 bg-error-50';
  };

  const getPerformanceGrade = (score: number) => {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    return 'D';
  };

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    subtitle, 
    icon, 
    color = 'text-primary-600' 
  }: {
    title: string;
    value: string | number;
    unit?: string;
    subtitle?: string;
    icon: React.ReactNode;
    color?: string;
  }) => (
    <div className="bg-white rounded-lg border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <div className={color}>{icon}</div>
        </div>
      </div>
      <div className="text-2xl font-bold text-neutral-900 mb-1">
        {value}{unit && <span className="text-lg text-neutral-600 ml-1">{unit}</span>}
      </div>
      <div className="text-sm text-neutral-600">{title}</div>
      {subtitle && (
        <div className="text-xs text-neutral-500 mt-1">{subtitle}</div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Overall Performance"
          value={getPerformanceGrade(metrics.overallScore || 85)}
          subtitle={`${metrics.overallScore || 85}/100 points`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-primary-600"
        />
        
        <MetricCard
          title="Gear Efficiency"
          value={metrics.gearAnalysis?.efficiency || 78}
          unit="%"
          subtitle="Step consistency rating"
          icon={<Zap className="w-5 h-5" />}
          color={getEfficiencyColor(metrics.gearAnalysis?.efficiency || 78).split(' ')[0]}
        />
        
        <MetricCard
          title="Total Weight"
          value={metrics.weight?.total || 'N/A'}
          unit={metrics.weight?.total ? 'g' : ''}
          subtitle="Drivetrain components"
          icon={<Weight className="w-5 h-5" />}
          color="text-neutral-600"
        />
        
        <MetricCard
          title="Total Price"
          value={metrics.price?.total ? `$${metrics.price.total}` : 'N/A'}
          subtitle="MSRP pricing"
          icon={<DollarSign className="w-5 h-5" />}
          color="text-green-600"
        />
      </div>

      {/* Detailed Sections */}
      <div className="space-y-6">
        
        {/* Gear Ratio Analysis */}
        <div className="card">
          <button
            onClick={() => toggleSection('gearRatios')}
            className="w-full flex items-center justify-between p-2 -m-2 rounded-lg hover:bg-neutral-50"
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-neutral-900">Gear Ratio Analysis</h3>
            </div>
            {expandedSections.gearRatios ? (
              <ChevronUp className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            )}
          </button>

          {expandedSections.gearRatios && (
            <div className="mt-6 space-y-6">
              {/* Gear Range Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">
                    {metrics.gearAnalysis?.minRatio?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="text-sm text-neutral-600">Lowest Gear</div>
                  <div className="text-xs text-neutral-500 mt-1">Climbing gear</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">
                    {metrics.gearAnalysis?.maxRatio?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="text-sm text-neutral-600">Highest Gear</div>
                  <div className="text-xs text-neutral-500 mt-1">Top speed gear</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">
                    {metrics.gearAnalysis?.range?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="text-sm text-neutral-600">Total Range</div>
                  <div className="text-xs text-neutral-500 mt-1">Gear versatility</div>
                </div>
              </div>

              {/* Gear Steps Visualization */}
              {metrics.gearAnalysis?.steps && (
                <div>
                  <h4 className="font-medium text-neutral-900 mb-3">Gear Step Analysis</h4>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-lg font-bold text-neutral-900">
                          {metrics.gearAnalysis.averageStep?.toFixed(1)}%
                        </div>
                        <div className="text-xs text-neutral-600">Average Step</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-neutral-900">
                          {metrics.gearAnalysis.largestGap?.toFixed(1)}%
                        </div>
                        <div className="text-xs text-neutral-600">Largest Gap</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-neutral-900">
                          {metrics.gearAnalysis.steps?.length || 0}
                        </div>
                        <div className="text-xs text-neutral-600">Total Gears</div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${getEfficiencyColor(metrics.gearAnalysis.efficiency).split(' ')[0]}`}>
                          {getPerformanceGrade(metrics.gearAnalysis.efficiency)}
                        </div>
                        <div className="text-xs text-neutral-600">Efficiency Grade</div>
                      </div>
                    </div>

                    {/* Step Size Indicator */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-neutral-600">
                        <span>Gear Steps (% increase between gears)</span>
                        <span>Ideal: 12-18%</span>
                      </div>
                      <div className="flex space-x-1 h-8">
                        {metrics.gearAnalysis.steps.map((step: number, index: number) => {
                          const height = Math.min(100, (step / 30) * 100); // Scale to 30% max
                          const color = step < 12 ? 'bg-blue-400' : 
                                      step <= 18 ? 'bg-success-400' : 
                                      step <= 25 ? 'bg-tool-orange' : 'bg-error-400';
                          
                          return (
                            <div 
                              key={index}
                              className={`${color} rounded-t flex-1 flex items-end justify-center`}
                              style={{ height: `${height}%` }}
                              title={`Gear ${index + 1} → ${index + 2}: ${step.toFixed(1)}%`}
                            >
                              <span className="text-xs text-white opacity-75 pb-1">
                                {step > 20 ? step.toFixed(0) : ''}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs text-neutral-500">
                        <span>Low</span>
                        <span>Ideal</span>
                        <span>High</span>
                        <span>Too High</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {metrics.gearAnalysis?.recommendations && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-blue-900 mb-2">Gear Ratio Insights</h5>
                      <ul className="space-y-1 text-sm text-blue-800">
                        {metrics.gearAnalysis.recommendations.map((rec: string, index: number) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Weight Analysis */}
        <div className="card">
          <button
            onClick={() => toggleSection('weight')}
            className="w-full flex items-center justify-between p-2 -m-2 rounded-lg hover:bg-neutral-50"
          >
            <div className="flex items-center space-x-3">
              <Weight className="w-5 h-5 text-neutral-600" />
              <h3 className="text-lg font-semibold text-neutral-900">Weight Analysis</h3>
            </div>
            {expandedSections.weight ? (
              <ChevronUp className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            )}
          </button>

          {expandedSections.weight && metrics.weight && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(metrics.weight.breakdown).map(([component, weight]: [string, any]) => (
                  <div key={component} className="text-center p-3 bg-neutral-50 rounded-lg">
                    <div className="text-lg font-bold text-neutral-900">{weight}g</div>
                    <div className="text-xs text-neutral-600 capitalize">{component}</div>
                    <div className="text-xs text-neutral-500">
                      {((weight / metrics.weight.total) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>

              {metrics.weight.comparison && (
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-900 mb-3">Weight Comparison</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-success-600 font-medium">Lightweight Option</div>
                      <div className="text-lg font-bold text-neutral-900">{metrics.weight.comparison.light}g</div>
                      <div className="text-xs text-neutral-500">-{metrics.weight.total - metrics.weight.comparison.light}g lighter</div>
                    </div>
                    <div className="text-center">
                      <div className="text-neutral-600 font-medium">Your Build</div>
                      <div className="text-lg font-bold text-neutral-900">{metrics.weight.total}g</div>
                      <div className="text-xs text-neutral-500">Current selection</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-600 font-medium">Budget Option</div>
                      <div className="text-lg font-bold text-neutral-900">{metrics.weight.comparison.budget}g</div>
                      <div className="text-xs text-neutral-500">+{metrics.weight.comparison.budget - metrics.weight.total}g heavier</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Price Analysis */}
        <div className="card">
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between p-2 -m-2 rounded-lg hover:bg-neutral-50"
          >
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-neutral-900">Price Analysis</h3>
            </div>
            {expandedSections.price ? (
              <ChevronUp className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            )}
          </button>

          {expandedSections.price && metrics.price && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(metrics.price.breakdown).map(([component, price]: [string, any]) => (
                  <div key={component} className="text-center p-3 bg-neutral-50 rounded-lg">
                    <div className="text-lg font-bold text-neutral-900">${price}</div>
                    <div className="text-xs text-neutral-600 capitalize">{component}</div>
                    <div className="text-xs text-neutral-500">
                      {((price / metrics.price.total) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>

              {metrics.price.valueAnalysis && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-3">Value Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-green-800 mb-2">Price vs Performance</div>
                      <div className="text-green-700">
                        This build offers <strong>{metrics.price.valueAnalysis.rating}</strong> value.
                        Performance score of {metrics.overallScore}/100 at ${metrics.price.total}.
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-green-800 mb-2">Market Position</div>
                      <div className="text-green-700">
                        {metrics.price.valueAnalysis.marketPosition} compared to similar builds.
                        {metrics.price.valueAnalysis.recommendation}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Efficiency Analysis */}
        <div className="card">
          <button
            onClick={() => toggleSection('efficiency')}
            className="w-full flex items-center justify-between p-2 -m-2 rounded-lg hover:bg-neutral-50"
          >
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-tool-orange" />
              <h3 className="text-lg font-semibold text-neutral-900">Efficiency Analysis</h3>
            </div>
            {expandedSections.efficiency ? (
              <ChevronUp className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            )}
          </button>

          {expandedSections.efficiency && metrics.efficiency && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">
                    {metrics.efficiency.chainline?.toFixed(1)}mm
                  </div>
                  <div className="text-sm text-neutral-600">Chainline</div>
                  <div className="text-xs text-neutral-500">Power transfer efficiency</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">
                    {metrics.efficiency.drivetrain?.toFixed(0)}%
                  </div>
                  <div className="text-sm text-neutral-600">Drivetrain Efficiency</div>
                  <div className="text-xs text-neutral-500">Overall power loss</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-900 mb-1">
                    {metrics.efficiency.crossChaining?.toFixed(0)}%
                  </div>
                  <div className="text-sm text-neutral-600">Cross-Chain Usage</div>
                  <div className="text-xs text-neutral-500">Inefficient gear combinations</div>
                </div>
              </div>

              {metrics.efficiency.recommendations && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-tool-orange mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-orange-900 mb-2">Efficiency Recommendations</h5>
                      <ul className="space-y-1 text-sm text-orange-800">
                        {metrics.efficiency.recommendations.map((rec: string, index: number) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}