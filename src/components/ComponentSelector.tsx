'use client';

import { useState, useEffect } from 'react';
import { Search, X, ChevronDown, Package } from 'lucide-react';
import type { Cassette, Chain, RearDerailleur, Crankset } from '@/types/components';

interface ComponentSelectorProps {
  type: 'cassette' | 'chain' | 'rearDerailleur' | 'crankset';
  label: string;
  selected?: Cassette | Chain | RearDerailleur | Crankset;
  onSelect: (component: any) => void;
  onClear: () => void;
}

export function ComponentSelector({ 
  type, 
  label, 
  selected, 
  onSelect, 
  onClear 
}: ComponentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [components, setComponents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch components when dropdown opens
  useEffect(() => {
    if (isOpen && components.length === 0) {
      fetchComponents();
    }
  }, [isOpen]);

  const fetchComponents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/components/${type}`);
      const data = await response.json();
      setComponents(data);
    } catch (error) {
      console.error('Failed to fetch components:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredComponents = components.filter(component =>
    `${component.manufacturer} ${component.model} ${component.series || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleSelect = (component: any) => {
    onSelect(component);
    setIsOpen(false);
    setSearchQuery('');
  };

  const formatPrice = (msrp?: number) => {
    if (!msrp) return '';
    return `$${(msrp / 100).toFixed(0)}`;
  };

  const getComponentIcon = () => {
    switch (type) {
      case 'cassette': return '⚙️';
      case 'chain': return '🔗';
      case 'rearDerailleur': return '🔧';
      case 'crankset': return '🔄';
      default: return '📦';
    }
  };

  const getComponentSpecs = (component: any) => {
    switch (type) {
      case 'cassette':
        return `${component.speeds}sp • ${component.freehubStandard}`;
      case 'chain':
        return `${component.speeds}sp • ${component.chainStandard}`;
      case 'rearDerailleur':
        return `${component.speeds}sp • ${component.maxCogSize}T max • ${component.cageLength}`;
      case 'crankset':
        return `${component.chainrings}T • ${component.bbStandard}`;
      default:
        return '';
    }
  };

  return (
    <div className="relative">
      {/* Selected Component Display */}
      {selected ? (
        <div className="card border-2 border-success-200 bg-success-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="text-2xl">{getComponentIcon()}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-neutral-900">
                    {selected.manufacturer} {selected.model}
                  </h3>
                  {selected.msrp && (
                    <span className="text-sm text-neutral-600">
                      {formatPrice(selected.msrp)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-600">
                  {getComponentSpecs(selected)}
                </p>
                {selected.series && (
                  <p className="text-xs text-neutral-500">{selected.series}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsOpen(true)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Change
              </button>
              <button
                onClick={onClear}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Component Selector Button */
        <button
          onClick={() => setIsOpen(true)}
          className="card w-full text-left hover:shadow-lg transition-shadow duration-200 border-dashed border-2 border-neutral-300 hover:border-primary-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl opacity-50">{getComponentIcon()}</div>
              <div>
                <h3 className="font-medium text-neutral-700">
                  Select {label}
                </h3>
                <p className="text-sm text-neutral-500">
                  Choose from verified components
                </p>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          </div>
        </button>
      )}

      {/* Dropdown Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-neutral-500 bg-opacity-75"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-neutral-900">
                  Select {label}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder={`Search ${label.toLowerCase()}s...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              </div>

              {/* Component List */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-neutral-600">Loading components...</p>
                  </div>
                ) : filteredComponents.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-neutral-600">
                      {searchQuery ? 'No components found' : 'No components available'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredComponents.map((component) => (
                      <button
                        key={component.id}
                        onClick={() => handleSelect(component)}
                        className="w-full p-3 text-left border border-neutral-200 rounded-md hover:bg-neutral-50 hover:border-primary-300 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-neutral-900">
                                {component.manufacturer} {component.model}
                              </span>
                              {component.msrp && (
                                <span className="text-sm text-neutral-600">
                                  {formatPrice(component.msrp)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-neutral-600">
                              {getComponentSpecs(component)}
                            </p>
                            {component.series && (
                              <p className="text-xs text-neutral-500">
                                {component.series} • {component.year || 'Current'}
                              </p>
                            )}
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