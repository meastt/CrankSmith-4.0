'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, Target, Settings, BarChart3, Zap, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnalysisSetup } from '@/components/AnalysisSetup';
import { BuildComparison } from '@/components/BuildComparison';
import { PerformanceMetrics } from '@/components/PerformanceMetrics';
import { OptimizationRecommendations } from '@/components/OptimizationRecommendations';
import type { Build, BikeType } from '@/types/components';

interface AnalysisScenario {
  id: string;
  name: string;
  build: Partial<Build>;
  metrics?: any;
}

export default function AdvancedAnalysisPage() {
  const router = useRouter();
  const [analysisMode, setAnalysisMode] = useState<'single' | 'comparison'>('single');
  const [scenarios, setScenarios] = useState<AnalysisScenario[]>([
    {
      id: '1',
      name: 'Current Build',
      build: { bikeType: 'mtb' as BikeType }
    }
  ]);
  const [selectedScenario, setSelectedScenario] = useState('1');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analysisTools = [
    {
      id: 'gear-ratios',
      name: 'Gear Ratio Analysis',
      description: 'Detailed analysis of gear steps, efficiency, and performance',
      icon: <BarChart3 className="w-6 h-6" />,
      enabled: true
    },
    {
      id: 'weight-optimization', 
      name: 'Weight Optimization',
      description: 'Find the lightest compatible components',
      icon: <Target className="w-6 h-6" />,
      enabled: true
    },
    {
      id: 'price-performance',
      name: 'Price/Performance Analysis',
      description: 'Optimize for value and performance trade-offs',
      icon: <TrendingUp className="w-6 h-6" />,
      enabled: true
    },
    {
      id: 'durability-analysis',
      name: 'Durability Assessment',
      description: 'Component longevity and maintenance predictions',
      icon: <Settings className="w-6 h-6" />,
      enabled: false // Future feature
    }
  ];

  const addScenario = () => {
    const newId = (scenarios.length + 1).toString();
    const newScenario: AnalysisScenario = {
      id: newId,
      name: `Scenario ${scenarios.length + 1}`,
      build: { bikeType: scenarios[0].build.bikeType }
    };
    setScenarios([...scenarios, newScenario]);
    setSelectedScenario(newId);
    setAnalysisMode('comparison');
  };

  const removeScenario = (id: string) => {
    if (scenarios.length <= 1) return;
    
    const updated = scenarios.filter(s => s.id !== id);
    setScenarios(updated);
    
    if (selectedScenario === id) {
      setSelectedScenario(updated[0].id);
    }
    
    if (updated.length === 1) {
      setAnalysisMode('single');
    }
  };

  const updateScenario = (id: string, updates: Partial<AnalysisScenario>) => {
    setScenarios(scenarios.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Run analysis for each scenario
      const analysisPromises = scenarios.map(async (scenario) => {
        if (!hasValidBuild(scenario.build)) return null;
        
        const response = await fetch('/api/analysis/advanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            build: scenario.build,
            tools: analysisTools.filter(t => t.enabled).map(t => t.id)
          })
        });
        
        return response.json();
      });
      
      const results = await Promise.all(analysisPromises);
      
      // Update scenarios with results
      const updatedScenarios = scenarios.map((scenario, index) => ({
        ...scenario,
        metrics: results[index]
      }));
      
      setScenarios(updatedScenarios);
      setAnalysisResults(results);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const hasValidBuild = (build: Partial<Build>) => {
    return build.cassette && build.chain && build.rearDerailleur && build.crankset;
  };

  const canRunAnalysis = () => {
    return scenarios.some(s => hasValidBuild(s.build)) && !isAnalyzing;
  };

  const currentScenario = scenarios.find(s => s.id === selectedScenario) || scenarios[0];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-tool border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center text-neutral-600 hover:text-neutral-900"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              <div className="h-6 w-px bg-neutral-300" />
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h1 className="text-xl font-semibold text-neutral-900">
                  Advanced Analysis
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Analysis Mode Toggle */}
              <div className="flex bg-neutral-100 rounded-lg p-1">
                <button
                  onClick={() => setAnalysisMode('single')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    analysisMode === 'single'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Single Build
                </button>
                <button
                  onClick={() => setAnalysisMode('comparison')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    analysisMode === 'comparison'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Compare Builds
                </button>
              </div>
              
              {/* Run Analysis Button */}
              <button
                onClick={runAnalysis}
                disabled={!canRunAnalysis()}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium ${
                  canRunAnalysis()
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Run Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Scenario Management */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Scenarios */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900">
                  {analysisMode === 'single' ? 'Build Setup' : 'Scenarios'}
                </h3>
                {analysisMode === 'comparison' && scenarios.length < 4 && (
                  <button
                    onClick={addScenario}
                    className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`relative p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedScenario === scenario.id
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                    onClick={() => setSelectedScenario(scenario.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-900 text-sm">
                          {scenario.name}
                        </h4>
                        <p className="text-xs text-neutral-600 capitalize">
                          {scenario.build.bikeType || 'No bike type'}
                        </p>
                        <div className="text-xs text-neutral-500 mt-1">
                          {hasValidBuild(scenario.build) 
                            ? '✓ Complete build' 
                            : `${Object.values(scenario.build).filter(Boolean).length}/5 components`
                          }
                        </div>
                      </div>
                      
                      {analysisMode === 'comparison' && scenarios.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeScenario(scenario.id);
                          }}
                          className="p-1 text-neutral-400 hover:text-neutral-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {scenario.metrics && (
                      <div className="mt-2 text-xs text-success-600 font-medium">
                        ✓ Analyzed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Tools */}
            <div className="card">
              <h3 className="font-semibold text-neutral-900 mb-4">Analysis Tools</h3>
              <div className="space-y-3">
                {analysisTools.map((tool) => (
                  <div
                    key={tool.id}
                    className={`p-3 rounded-lg border ${
                      tool.enabled 
                        ? 'border-neutral-200 bg-white'
                        : 'border-neutral-100 bg-neutral-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-0.5 ${tool.enabled ? 'text-primary-600' : 'text-neutral-400'}`}>
                        {tool.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium text-sm ${tool.enabled ? 'text-neutral-900' : 'text-neutral-500'}`}>
                          {tool.name}
                        </h4>
                        <p className={`text-xs mt-1 ${tool.enabled ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          {tool.description}
                        </p>
                        {!tool.enabled && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-neutral-200 text-neutral-600 rounded">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Build Setup */}
            <AnalysisSetup
              scenario={currentScenario}
              onUpdate={(updates) => updateScenario(currentScenario.id, updates)}
            />

            {/* Results */}
            {analysisResults && (
              <>
                {analysisMode === 'single' ? (
                  <div className="space-y-8">
                    <PerformanceMetrics
                      build={currentScenario.build}
                      metrics={currentScenario.metrics}
                    />
                    <OptimizationRecommendations
                      build={currentScenario.build}
                      metrics={currentScenario.metrics}
                    />
                  </div>
                ) : (
                  <BuildComparison scenarios={scenarios.filter(s => s.metrics)} />
                )}
              </>
            )}

            {/* Getting Started Guide */}
            {!analysisResults && (
              <div className="card text-center py-12">
                <TrendingUp className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Advanced Performance Analysis
                </h3>
                <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
                  Get professional-level insights into your drivetrain setup. Analyze gear ratios, 
                  optimize for weight or price, and compare different build scenarios.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-sm">
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="text-2xl mb-2">⚙️</div>
                    <h4 className="font-medium text-neutral-900 mb-1">1. Setup Components</h4>
                    <p className="text-neutral-600">Select your cassette, chain, derailleur, and crankset</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="text-2xl mb-2">📊</div>
                    <h4 className="font-medium text-neutral-900 mb-1">2. Run Analysis</h4>
                    <p className="text-neutral-600">Get detailed performance metrics and insights</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-medium text-neutral-900 mb-1">3. Optimize</h4>
                    <p className="text-neutral-600">Receive recommendations for improvements</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}