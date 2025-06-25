'use client';

import { useState, useEffect } from 'react';
import { Settings, Edit3, Save, X, Upload, Download } from 'lucide-react';
import { ComponentSelector } from '@/components/ComponentSelector';
import type { BikeType } from '@/types/components';

interface AnalysisSetupProps {
  scenario: {
    id: string;
    name: string;
    build: any;
    metrics?: any;
  };
  onUpdate: (updates: any) => void;
}

export function AnalysisSetup({ scenario, onUpdate }: AnalysisSetupProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(scenario.name);
  const [savedBuilds, setSavedBuilds] = useState<any[]>([]);
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  useEffect(() => {
    fetchSavedBuilds();
  }, []);

  const fetchSavedBuilds = async () => {
    try {
      const response = await fetch('/api/builds');
      const builds = await response.json();
      setSavedBuilds(builds);
    } catch (error) {
      console.error('Failed to fetch saved builds:', error);
    }
  };

  const handleNameSave = () => {
    onUpdate({ name: tempName });
    setIsEditingName(false);
  };

  const handleBikeTypeChange = (bikeType: BikeType) => {
    onUpdate({ 
      build: { 
        ...scenario.build,
        bikeType,
        // Clear components when bike type changes
        cassette: undefined,
        chain: undefined,
        rearDerailleur: undefined,
        crankset: undefined
      }
    });
  };

  const handleComponentSelect = (componentType: string, component: any) => {
    onUpdate({
      build: {
        ...scenario.build,
        [componentType]: component
      }
    });
  };

  const handleComponentClear = (componentType: string) => {
    const updatedBuild = { ...scenario.build };
    delete updatedBuild[componentType];
    onUpdate({ build: updatedBuild });
  };

  const loadBuild = (build: any) => {
    onUpdate({
      build: {
        bikeType: build.bikeType,
        cassette: build.cassette,
        chain: build.chain,
        rearDerailleur: build.rearDerailleur,
        crankset: build.crankset
      }
    });
    setShowLoadDialog(false);
  };

  const clearBuild = () => {
    onUpdate({
      build: {
        bikeType: scenario.build.bikeType,
        cassette: undefined,
        chain: undefined,
        rearDerailleur: undefined,
        crankset: undefined
      }
    });
  };

  const exportBuild = () => {
    const exportData = {
      name: scenario.name,
      build: scenario.build,
      exportedAt: new Date().toISOString(),
      exportedFrom: 'CrankSmith Advanced Analysis'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scenario.name.replace(/\s+/g, '_')}_build.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCompletionStatus = () => {
    const components = [scenario.build.cassette, scenario.build.chain, scenario.build.rearDerailleur, scenario.build.crankset];
    const completed = components.filter(Boolean).length;
    return { completed, total: 4, percentage: (completed / 4) * 100 };
  };

  const status = getCompletionStatus();
  const bikeTypes: { value: BikeType; label: string; emoji: string }[] = [
    { value: 'mtb', label: 'Mountain Bike', emoji: '🏔️' },
    { value: 'road', label: 'Road Bike', emoji: '🚴' },
    { value: 'gravel', label: 'Gravel Bike', emoji: '🌾' },
    { value: 'hybrid', label: 'Hybrid/Commuter', emoji: '🚲' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-primary-600" />
            <div>
              {isEditingName ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="text-lg font-semibold bg-transparent border-b border-neutral-300 focus:border-primary-500 outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleNameSave}
                    className="p-1 text-success-600 hover:text-success-700"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setTempName(scenario.name);
                      setIsEditingName(false);
                    }}
                    className="p-1 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold text-neutral-900">{scenario.name}</h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 text-neutral-400 hover:text-neutral-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-sm text-neutral-600">Configure your drivetrain for analysis</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowLoadDialog(true)}
              className="flex items-center space-x-2 px-3 py-2 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50"
            >
              <Upload className="w-4 h-4" />
              <span>Load Build</span>
            </button>
            {status.completed > 0 && (
              <>
                <button
                  onClick={exportBuild}
                  className="flex items-center space-x-2 px-3 py-2 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={clearBuild}
                  className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900"
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700">
              Build Progress
            </span>
            <span className="text-sm text-neutral-600">
              {status.completed}/4 components
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${status.percentage}%` }}
            />
          </div>
        </div>

        {/* Bike Type Selection */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Bike Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bikeTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleBikeTypeChange(type.value)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  scenario.build.bikeType === type.value
                    ? 'border-primary-300 bg-primary-50 text-primary-900'
                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className="text-lg mb-1">{type.emoji}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Component Selection */}
      {scenario.build.bikeType && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Components</h3>
            <div className="space-y-6">
              
              {/* Cassette */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Cassette
                </label>
                <ComponentSelector
                  type="cassette"
                  label="Cassette"
                  selected={scenario.build.cassette}
                  onSelect={(component) => handleComponentSelect('cassette', component)}
                  onClear={() => handleComponentClear('cassette')}
                />
              </div>

              {/* Chain */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Chain
                </label>
                <ComponentSelector
                  type="chain"
                  label="Chain"
                  selected={scenario.build.chain}
                  onSelect={(component) => handleComponentSelect('chain', component)}
                  onClear={() => handleComponentClear('chain')}
                />
              </div>

              {/* Rear Derailleur */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Rear Derailleur
                </label>
                <ComponentSelector
                  type="rearDerailleur"
                  label="Rear Derailleur"
                  selected={scenario.build.rearDerailleur}
                  onSelect={(component) => handleComponentSelect('rearDerailleur', component)}
                  onClear={() => handleComponentClear('rearDerailleur')}
                />
              </div>

              {/* Crankset */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Crankset
                </label>
                <ComponentSelector
                  type="crankset"
                  label="Crankset"
                  selected={scenario.build.crankset}
                  onSelect={(component) => handleComponentSelect('crankset', component)}
                  onClear={() => handleComponentClear('crankset')}
                />
              </div>
            </div>
          </div>

          {/* Analysis Ready Status */}
          {status.completed === 4 && (
            <div className="card border-2 border-success-200 bg-success-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-success-900">Ready for Analysis</h3>
                  <p className="text-sm text-success-700">
                    Complete drivetrain configured. Click "Run Analysis" to get detailed insights.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Load Build Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-neutral-500 bg-opacity-75"
              onClick={() => setShowLoadDialog(false)}
            />

            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-neutral-900">Load Saved Build</h3>
                <button
                  onClick={() => setShowLoadDialog(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {savedBuilds.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-neutral-600">No saved builds found.</p>
                    <p className="text-sm text-neutral-500 mt-2">
                      Create builds using the Build Wizard to see them here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedBuilds.map((build) => (
                      <button
                        key={build.id}
                        onClick={() => loadBuild(build)}
                        className="w-full p-4 text-left border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-primary-300"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-neutral-900">{build.name}</h4>
                            <p className="text-sm text-neutral-600 capitalize">
                              {build.bikeType} • {build.compatibilityScore}/100 compatibility
                            </p>
                            <div className="text-xs text-neutral-500 mt-1">
                              {build.cassette?.manufacturer} • {build.chain?.manufacturer} • 
                              {build.rearDerailleur?.manufacturer} • {build.crankset?.manufacturer}
                            </div>
                          </div>
                          <div className="text-sm text-neutral-500">
                            {new Date(build.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}