'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Search, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComponentSelector } from '@/components/ComponentSelector';
import { CompatibilityResults } from '@/components/CompatibilityResults';
import type { Cassette, Chain, RearDerailleur, Crankset, CompatibilityResult } from '@/types/components';

export default function QuickCheckPage() {
  const router = useRouter();
  const [selectedComponents, setSelectedComponents] = useState<{
    cassette?: Cassette;
    chain?: Chain;
    rearDerailleur?: RearDerailleur;
    crankset?: Crankset;
  }>({});
  
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check compatibility whenever components change
  useEffect(() => {
    const hasAnyComponents = Object.values(selectedComponents).some(c => c !== undefined);
    
    if (hasAnyComponents) {
      checkCompatibility();
    } else {
      setCompatibilityResult(null);
    }
  }, [selectedComponents]);

  const checkCompatibility = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/compatibility/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedComponents)
      });
      
      const result = await response.json();
      setCompatibilityResult(result);
    } catch (error) {
      console.error('Compatibility check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComponentSelect = (componentType: string, component: any) => {
    setSelectedComponents(prev => ({
      ...prev,
      [componentType]: component
    }));
  };

  const handleComponentClear = (componentType: string) => {
    setSelectedComponents(prev => {
      const updated = { ...prev };
      delete updated[componentType as keyof typeof updated];
      return updated;
    });
  };

  const clearAll = () => {
    setSelectedComponents({});
    setCompatibilityResult(null);
  };

  const selectedCount = Object.values(selectedComponents).filter(c => c).length;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-tool border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h1 className="text-xl font-semibold text-neutral-900">
                Quick Compatibility Check
              </h1>
            </div>
            
            {selectedCount > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                Clear All ({selectedCount})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Component Selection */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Select Components
              </h2>
              <p className="text-neutral-600">
                Choose the components you want to check for compatibility. 
                You need at least 2 components for analysis.
              </p>
            </div>

            {/* Component Selectors */}
            <div className="space-y-4">
              <ComponentSelector
                type="cassette"
                label="Cassette"
                selected={selectedComponents.cassette}
                onSelect={(component) => handleComponentSelect('cassette', component)}
                onClear={() => handleComponentClear('cassette')}
              />
              
              <ComponentSelector
                type="chain"
                label="Chain"
                selected={selectedComponents.chain}
                onSelect={(component) => handleComponentSelect('chain', component)}
                onClear={() => handleComponentClear('chain')}
              />
              
              <ComponentSelector
                type="rearDerailleur"
                label="Rear Derailleur"
                selected={selectedComponents.rearDerailleur}
                onSelect={(component) => handleComponentSelect('rearDerailleur', component)}
                onClear={() => handleComponentClear('rearDerailleur')}
              />
              
              <ComponentSelector
                type="crankset"
                label="Crankset"
                selected={selectedComponents.crankset}
                onSelect={(component) => handleComponentSelect('crankset', component)}
                onClear={() => handleComponentClear('crankset')}
              />
            </div>

            {/* Instructions */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-primary-800">
                  <p className="font-medium mb-1">How it works:</p>
                  <ul className="space-y-1 text-primary-700">
                    <li>• Select components from our verified database</li>
                    <li>• Get instant compatibility analysis</li>
                    <li>• See gear ratios if cassette + crankset selected</li>
                    <li>• Get specific fixes for any issues found</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            {selectedCount === 0 && (
              <div className="card text-center py-12">
                <Search className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Ready to Check Compatibility
                </h3>
                <p className="text-neutral-600">
                  Select components on the left to see instant compatibility analysis
                </p>
              </div>
            )}

            {selectedCount === 1 && (
              <div className="card text-center py-12">
                <AlertTriangle className="w-12 h-12 text-tool-orange mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Need More Components
                </h3>
                <p className="text-neutral-600">
                  Add at least one more component to check compatibility
                </p>
              </div>
            )}

            {selectedCount >= 2 && (
              <div>
                {isLoading ? (
                  <div className="card text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
                    <p className="text-neutral-600">Checking compatibility...</p>
                  </div>
                ) : compatibilityResult ? (
                  <CompatibilityResults 
                    result={compatibilityResult}
                    components={selectedComponents}
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}