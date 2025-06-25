'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Weight, DollarSign, Zap, Trophy, Target } from 'lucide-react';

interface BuildComparisonProps {
  scenarios: Array<{
    id: string;
    name: string;
    build: any;
    metrics: any;
  }>;
}

export function BuildComparison({ scenarios }: BuildComparisonProps) {
  const [comparisonMetric, setComparisonMetric] = useState<'overall' | 'weight' | 'price' | 'efficiency'>('overall');

  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="card text-center py-12">
        <BarChart3 className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 mb-2">No Builds to Compare</h3>
        <p className="text-neutral-600">Add more scenarios and run analysis to see comparisons</p>
      </div>
    );
  }

  const metrics = [
    { 
      id: 'overall', 
      label: 'Overall Score', 
      icon: <TrendingUp className="w-4 h-4" />,
      getValue: (scenario: any) => scenario.metrics?.overallScore || 0,
      format: (value: number) => `${value}/100`,
      higher: true
    },
    { 
      id: 'weight', 
      label: 'Total Weight', 
      icon: <Weight className="w-4 h-4" />,
      getValue: (scenario: any) => scenario.metrics?.weight?.total || 0,
      format: (value: number) => `${value}g`,
      higher: false
    },
    { 
      id: 'price', 
      label: 'Total Price', 
      icon: <DollarSign className="w-4 h-4" />,
      getValue: (scenario: any) => scenario.metrics?.price?.total || 0,
      format: (value: number) => `$${value}`,
      higher: false
    },
    { 
      id: 'efficiency', 
      label: 'Gear Efficiency', 
      icon: <Zap className="w-4 h-4" />,
      getValue: (scenario: any) => scenario.metrics?.gearAnalysis?.efficiency || 0,
      format: (value: number) => `${value}%`,
      higher: true
    }
  ];

  const currentMetric = metrics.find(m => m.id === comparisonMetric)!;
  const values = scenarios.map(s => currentMetric.getValue(s));
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  const getBestScenario = (metricId: string) => {
    const metric = metrics.find(m => m.id === metricId)!;
    const values = scenarios.map(s => ({ scenario: s, value: metric.getValue(s) }));
    
    if (metric.higher) {
      return values.reduce((best, current) => current.value > best.value ? current : best);
    } else {
      return values.reduce((best, current) => current.value < best.value ? current : best);
    }
  };

  const getScenarioRank = (scenario: any, metricId: string) => {
    const metric = metrics.find(m => m.id === metricId)!;
    const sorted = scenarios
      .map(s => ({ id: s.id, value: metric.getValue(s) }))
      .sort((a, b) => metric.higher ? b.value - a.value : a.value - b.value);
    
    return sorted.findIndex(s => s.id === scenario.id) + 1;
  };

  const getPerformanceColor = (value: number, isHigherBetter: boolean) => {
    const isOptimal = isHigherBetter ? value === maxValue : value === minValue;
    if (isOptimal) return 'text-success-600 bg-success-50 border-success-200';
    
    const percentage = isHigherBetter 
      ? (value / maxValue) * 100 
      : ((maxValue - value) / (maxValue - minValue)) * 100;
    
    if (percentage >= 90) return 'text-success-600 bg-success-50 border-success-200';
    if (percentage >= 75) return 'text-tool-orange bg-orange-50 border-orange-200';
    return 'text-neutral-600 bg-neutral-50 border-neutral-200';
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Build Comparison</h2>
              <p className="text-sm text-neutral-600">Compare performance across {scenarios.length} scenarios</p>
            </div>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex flex-wrap gap-2">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setComparisonMetric(metric.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                comparisonMetric === metric.id
                  ? 'border-primary-300 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {metric.icon}
              <span className="text-sm font-medium">{metric.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Charts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">
          {currentMetric.label} Comparison
        </h3>
        
        <div className="space-y-4">
          {scenarios.map((scenario, index) => {
            const value = currentMetric.getValue(scenario);
            const percentage = maxValue === minValue ? 100 : 
              currentMetric.higher 
                ? (value / maxValue) * 100 
                : ((maxValue - value) / (maxValue - minValue)) * 100;
            
            const rank = getScenarioRank(scenario, comparisonMetric);
            const isWinner = rank === 1;
            
            return (
              <div key={scenario.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isWinner && <Trophy className="w-4 h-4 text-yellow-500" />}
                    <span className="font-medium text-neutral-900">{scenario.name}</span>
                    <span className="text-sm text-neutral-500">#{rank}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-neutral-900">
                      {currentMetric.format(value)}
                    </span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-neutral-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isWinner ? 'bg-success-500' : 
                        rank <= 2 ? 'bg-primary-500' : 'bg-neutral-400'
                      }`}
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-end pr-2">
                    <span className="text-xs font-medium text-white mix-blend-difference">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="card overflow-x-auto">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Detailed Comparison</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 font-medium text-neutral-900">Build</th>
                <th className="text-center py-3 px-4 font-medium text-neutral-900">Overall Score</th>
                <th className="text-center py-3 px-4 font-medium text-neutral-900">Weight</th>
                <th className="text-center py-3 px-4 font-medium text-neutral-900">Price</th>
                <th className="text-center py-3 px-4 font-medium text-neutral-900">Gear Efficiency</th>
                <th className="text-center py-3 px-4 font-medium text-neutral-900">Best For</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario) => (
                <tr key={scenario.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-neutral-900">{scenario.name}</div>
                      <div className="text-xs text-neutral-500 capitalize">
                        {scenario.build.bikeType} build
                      </div>
                    </div>
                  </td>
                  
                  <td className="text-center py-4 px-4">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full border ${
                      getPerformanceColor(scenario.metrics?.overallScore || 0, true)
                    }`}>
                      <span className="font-medium">
                        {scenario.metrics?.overallScore || 0}/100
                      </span>
                    </div>
                  </td>
                  
                  <td className="text-center py-4 px-4">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full border ${
                      getPerformanceColor(scenario.metrics?.weight?.total || 999, false)
                    }`}>
                      <span className="font-medium">
                        {scenario.metrics?.weight?.total || 'N/A'}g
                      </span>
                    </div>
                  </td>
                  
                  <td className="text-center py-4 px-4">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full border ${
                      getPerformanceColor(scenario.metrics?.price?.total || 999, false)
                    }`}>
                      <span className="font-medium">
                        ${scenario.metrics?.price?.total || 'N/A'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="text-center py-4 px-4">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full border ${
                      getPerformanceColor(scenario.metrics?.gearAnalysis?.efficiency || 0, true)
                    }`}>
                      <span className="font-medium">
                        {scenario.metrics?.gearAnalysis?.efficiency || 0}%
                      </span>
                    </div>
                  </td>
                  
                  <td className="text-center py-4 px-4">
                    <div className="text-xs text-neutral-600">
                      {getBestScenario('overall').scenario.id === scenario.id && (
                        <span className="block text-primary-600 font-medium">🏆 Best Overall</span>
                      )}
                      {getBestScenario('weight').scenario.id === scenario.id && (
                        <span className="block text-neutral-600 font-medium">🪶 Lightest</span>
                      )}
                      {getBestScenario('price').scenario.id === scenario.id && (
                        <span className="block text-green-600 font-medium">💰 Best Value</span>
                      )}
                      {getBestScenario('efficiency').scenario.id === scenario.id && (
                        <span className="block text-tool-orange font-medium">⚡ Most Efficient</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Winner Analysis */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>Category Winners</span>
          </h3>
          
          <div className="space-y-3">
            {metrics.map((metric) => {
              const winner = getBestScenario(metric.id);
              const value = metric.getValue(winner.scenario);
              
              return (
                <div key={metric.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-primary-600">{metric.icon}</div>
                    <div>
                      <div className="font-medium text-neutral-900">{metric.label}</div>
                      <div className="text-sm text-neutral-600">{winner.scenario.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-neutral-900">{metric.format(value)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trade-offs Analysis */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary-600" />
            <span>Trade-off Analysis</span>
          </h3>
          
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="font-medium text-blue-900 mb-1">Performance vs Weight</div>
              <div className="text-blue-800">
                The lightest build sacrifices {Math.abs(getBestScenario('overall').scenario.metrics?.overallScore - getBestScenario('weight').scenario.metrics?.overallScore || 0)} 
                performance points for weight savings.
              </div>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="font-medium text-green-900 mb-1">Performance vs Price</div>
              <div className="text-green-800">
                Upgrading from budget to premium adds $
                {Math.abs((getBestScenario('overall').scenario.metrics?.price?.total || 0) - (getBestScenario('price').scenario.metrics?.price?.total || 0))} 
                for better performance.
              </div>
            </div>
            
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="font-medium text-orange-900 mb-1">Efficiency vs Cost</div>
              <div className="text-orange-800">
                The most efficient setup provides {getBestScenario('efficiency').scenario.metrics?.gearAnalysis?.efficiency || 0}% 
                gear efficiency at a balanced price point.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-white text-lg">🎯</span>
          </div>
          <div>
            <h3 className="font-semibold text-primary-900 mb-2">Our Recommendation</h3>
            <p className="text-primary-800 mb-3">
              Based on your comparison, the <strong>{getBestScenario('overall').scenario.name}</strong> offers 
              the best balance of performance, efficiency, and value for most riders.
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary text-sm">Choose This Build</button>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View Detailed Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}