'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, TrendingUp, DollarSign, Weight, Zap, Edit3 } from 'lucide-react';
import type { Build, CompatibilityResult } from '@/types/components';

interface BuildSummaryProps {
  build: Partial<Build>;
  compatibilityResult?: CompatibilityResult | null;
  onNameChange: (name: string) => void;
  onSave: () => void;
}

export function BuildSummary({ build, compatibilityResult, onNameChange, onSave }: BuildSummaryProps) {
  const [buildName, setBuildName] = useState(build.name || '');
  const [isEditingName, setIsEditingName] = useState(!build.name);

  const formatPrice = (msrp?: number) => {
    if (!msrp) return 'N/A';
    return `$${(msrp / 100).toFixed(0)}`;
  };

  const getTotalPrice = () => {
    const prices = [
      build.cassette?.msrp || 0,
      build.chain?.msrp || 0,
      build.rearDerailleur?.msrp || 0,
      build.crankset?.msrp || 0
    ];
    return prices.reduce((sum, price) => sum + price, 0);
  };

  const getTotalWeight = () => {
    const weights = [
      build.cassette?.weight || 0,
      build.chain?.weight || 0,
      build.rearDerailleur?.weight || 0,
      build.crankset?.weight || 0
    ];
    return weights.reduce((sum, weight) => sum + weight, 0);
  };

  const handleNameSave = () => {
    onNameChange(buildName);
    setIsEditingName(false);
  };

  const components = [
    { 
      type: 'Cassette', 
      component: build.cassette, 
      icon: '⚙️',
      specs: build.cassette ? [
        `${build.cassette.speeds}-speed`,
        `${build.cassette.cogs?.split('-')[0]}-${build.cassette.cogs?.split('-').slice(-1)[0]}T`,
        build.cassette.freehubStandard
      ] : []
    },
    { 
      type: 'Chain', 
      component: build.chain, 
      icon: '🔗',
      specs: build.chain ? [
        `${build.chain.speeds}-speed`,
        build.chain.chainStandard,
        build.chain.links ? `${build.chain.links} links` : ''
      ].filter(Boolean) : []
    },
    { 
      type: 'Rear Derailleur', 
      component: build.rearDerailleur, 
      icon: '🔧',
      specs: build.rearDerailleur ? [
        `${build.rearDerailleur.speeds}-speed`,
        `${build.rearDerailleur.maxCogSize}T max`,
        build.rearDerailleur.cageLength
      ] : []
    },
    { 
      type: 'Crankset', 
      component: build.crankset, 
      icon: '🔄',
      specs: build.crankset ? [
        `${build.crankset.chainrings}T`,
        build.crankset.bbStandard,
        `${build.crankset.crankLength}mm`
      ] : []
    }
  ];

  const totalPrice = getTotalPrice();
  const totalWeight = getTotalWeight();

  return (
    <div className="space-y-8">
      {/* Build Name */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Build Name</h3>
          {!isEditingName && (
            <button
              onClick={() => setIsEditingName(true)}
              className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>
        
        {isEditingName ? (
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              placeholder="Enter a name for your build..."
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <button
              onClick={handleNameSave}
              disabled={!buildName.trim()}
              className="btn-primary"
            >
              Save
            </button>
            <button
              onClick={() => {
                setBuildName(build.name || '');
                setIsEditingName(false);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="text-xl font-medium text-neutral-900">
            {buildName || 'Unnamed Build'}
          </div>
        )}
      </div>

      {/* Components Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Components</h3>
        <div className="space-y-4">
          {components.map((item) => (
            <div key={item.type} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h4 className="font-medium text-neutral-900">{item.type}</h4>
                  {item.component ? (
                    <>
                      <p className="text-sm text-neutral-600">
                        {item.component.manufacturer} {item.component.model}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {item.specs.join(' • ')}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-neutral-500">Not selected</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-neutral-900">
                  {formatPrice(item.component?.msrp)}
                </div>
                {item.component?.weight && (
                  <div className="text-xs text-neutral-500">
                    {item.component.weight}g
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Build Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <DollarSign className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-neutral-900">
            {totalPrice > 0 ? `$${(totalPrice / 100).toFixed(0)}` : 'N/A'}
          </div>
          <div className="text-sm text-neutral-600">Total Price</div>
          <div className="text-xs text-neutral-500 mt-1">
            MSRP • Prices may vary
          </div>
        </div>

        <div className="card text-center">
          <Weight className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-neutral-900">
            {totalWeight > 0 ? `${totalWeight}g` : 'N/A'}
          </div>
          <div className="text-sm text-neutral-600">Total Weight</div>
          <div className="text-xs text-neutral-500 mt-1">
            Drivetrain components only
          </div>
        </div>

        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-neutral-900">
            {compatibilityResult?.compatibilityScore || 'N/A'}
          </div>
          <div className="text-sm text-neutral-600">Compatibility Score</div>
          <div className="text-xs text-neutral-500 mt-1">
            Out of 100
          </div>
        </div>
      </div>

      {/* Compatibility Results */}
      {compatibilityResult && (
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Final Compatibility Check</h3>
          
          {compatibilityResult.isCompatible ? (
            <div className="bg-success-50 border border-success-200 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <CheckCircle className="w-8 h-8 text-success-600" />
                <div>
                  <h4 className="text-xl font-bold text-success-900">Perfect Compatibility! 🎉</h4>
                  <p className="text-success-700">All components work together flawlessly</p>
                </div>
              </div>
              
              {compatibilityResult.gearAnalysis && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-success-900">
                      {compatibilityResult.gearAnalysis.minRatio.toFixed(1)}
                    </div>
                    <div className="text-xs text-success-700">Lowest Gear</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-success-900">
                      {compatibilityResult.gearAnalysis.maxRatio.toFixed(1)}
                    </div>
                    <div className="text-xs text-success-700">Highest Gear</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-success-900">
                      {compatibilityResult.gearAnalysis.range.toFixed(1)}
                    </div>
                    <div className="text-xs text-success-700">Range</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-success-900">
                      {compatibilityResult.gearAnalysis.efficiency.toFixed(0)}
                    </div>
                    <div className="text-xs text-success-700">Efficiency Score</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-error-50 border border-error-200 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <AlertTriangle className="w-8 h-8 text-error-600" />
                <div>
                  <h4 className="text-xl font-bold text-error-900">Compatibility Issues Found</h4>
                  <p className="text-error-700">This build has problems that need fixing</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {compatibilityResult.issues.map((issue, index) => (
                  <div key={index} className="bg-error-100 border border-error-200 rounded p-3">
                    <h5 className="font-medium text-error-900 mb-1">{issue.issue}</h5>
                    <p className="text-sm text-error-800">{issue.description}</p>
                    {issue.solution && (
                      <p className="text-sm text-error-700 mt-2">
                        <strong>Solution:</strong> {issue.solution}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {compatibilityResult.warnings.length > 0 && (
            <div className="mt-4 space-y-2">
              {compatibilityResult.warnings.map((warning, index) => (
                <div key={index} className="bg-orange-50 border border-orange-200 rounded p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h6 className="font-medium text-orange-900">{warning.warning}</h6>
                      <p className="text-sm text-orange-800">{warning.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      <div className="text-center">
        <button
          onClick={onSave}
          disabled={!compatibilityResult?.isCompatible || !buildName.trim()}
          className={`px-8 py-3 rounded-lg font-medium text-lg flex items-center space-x-3 mx-auto ${
            compatibilityResult?.isCompatible && buildName.trim()
              ? 'bg-success-600 hover:bg-success-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span>Save My Build</span>
        </button>
        
        {(!compatibilityResult?.isCompatible || !buildName.trim()) && (
          <p className="text-sm text-neutral-600 mt-3">
            {!buildName.trim() 
              ? 'Enter a build name to save'
              : 'Fix compatibility issues before saving'
            }
          </p>
        )}
      </div>
    </div>
  );
}