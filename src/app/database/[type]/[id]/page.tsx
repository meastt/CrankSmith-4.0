'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ExternalLink, CheckCircle, AlertTriangle, Share2, Heart } from 'lucide-react';
import { ComponentSpecs } from '@/components/ComponentSpecs';
import { CompatibilityMatrix } from '@/components/CompatibilityMatrix';

interface ComponentDetailPageProps {
  params: {
    type: string;
    id: string;
  };
}

export default function ComponentDetailPage({ params }: ComponentDetailPageProps) {
  const router = useRouter();
  const [component, setComponent] = useState<any>(null);
  const [relatedComponents, setRelatedComponents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('specs');

  useEffect(() => {
    fetchComponent();
  }, [params.type, params.id]);

  const fetchComponent = async () => {
    setIsLoading(true);
    try {
      // Fetch the specific component
      const response = await fetch(`/api/components/${params.type}/${params.id}`);
      const componentData = await response.json();
      setComponent(componentData);

      // Fetch related components (same manufacturer or similar specs)
      const relatedResponse = await fetch(`/api/components/${params.type}/related/${params.id}`);
      const relatedData = await relatedResponse.json();
      setRelatedComponents(relatedData);
    } catch (error) {
      console.error('Failed to fetch component:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (msrp?: number) => {
    if (!msrp) return 'Price not available';
    return `$${(msrp / 100).toFixed(0)}`;
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'cassette': return '⚙️';
      case 'chain': return '🔗';
      case 'rearDerailleur': return '🔧';
      case 'crankset': return '🔄';
      default: return '📦';
    }
  };

  const tabs = [
    { id: 'specs', label: 'Specifications' },
    { id: 'compatibility', label: 'Compatibility' },
    { id: 'related', label: 'Related Components' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading component details...</p>
        </div>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Component Not Found</h1>
          <p className="text-neutral-600 mb-6">The component you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/database')}
            className="btn-primary"
          >
            Back to Database
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-tool border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/database')}
                className="flex items-center text-neutral-600 hover:text-neutral-900"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Database
              </button>
              <div className="h-6 w-px bg-neutral-300" />
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getComponentIcon(params.type)}</span>
                <span className="text-sm text-neutral-600 capitalize">{params.type}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-neutral-400 hover:text-neutral-600">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-neutral-400 hover:text-neutral-600">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Component Header */}
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                    {component.manufacturer} {component.model}
                  </h1>
                  {component.series && (
                    <p className="text-lg text-neutral-600 mb-4">{component.series}</p>
                  )}
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 capitalize">
                      {component.bikeType}
                    </span>
                    {component.year && (
                      <span className="text-sm text-neutral-600">{component.year}</span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {formatPrice(component.msrp)}
                  </div>
                  {component.weight && (
                    <div className="text-sm text-neutral-600">
                      {component.weight}g
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-lg">
                {params.type === 'cassette' && (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-900">{component.speeds}</div>
                      <div className="text-xs text-neutral-600">Speeds</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-900">
                        {component.cogs?.split('-')[0]}-{component.cogs?.split('-').slice(-1)[0]}T
                      </div>
                      <div className="text-xs text-neutral-600">Range</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-neutral-900">{component.freehubStandard}</div>
                      <div className="text-xs text-neutral-600">Freehub</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-neutral-900">{component.chainCompatibility}</div>
                      <div className="text-xs text-neutral-600">Chain</div>
                    </div>
                  </>
                )}
                {/* Add similar quick stats for other component types */}
              </div>
            </div>

            {/* Tabs */}
            <div className="card">
              <div className="border-b border-neutral-200 mb-6">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'specs' && (
                <ComponentSpecs component={component} componentType={params.type} />
              )}
              
              {activeTab === 'compatibility' && (
                <CompatibilityMatrix component={component} componentType={params.type} />
              )}
              
              {activeTab === 'related' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Related Components</h3>
                  {relatedComponents.length === 0 ? (
                    <p className="text-neutral-600">No related components found.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {relatedComponents.map((related) => (
                        <div key={related.id} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50">
                          <h4 className="font-medium text-neutral-900">{related.manufacturer} {related.model}</h4>
                          <p className="text-sm text-neutral-600">{formatPrice(related.msrp)}</p>
                          <button
                            onClick={() => router.push(`/database/${params.type}/${related.id}`)}
                            className="text-sm text-primary-600 hover:text-primary-700 mt-2"
                          >
                            View Details →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Compatibility Status */}
            <div className="card">
              <h3 className="font-semibold text-neutral-900 mb-4">Compatibility Status</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success-500" />
                  <span className="text-sm text-neutral-700">Verified specifications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success-500" />
                  <span className="text-sm text-neutral-700">Wide compatibility</span>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-tool-orange" />
                  <span className="text-sm text-neutral-700">Check freehub compatibility</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-semibold text-neutral-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push(`/quick-check?preselect=${params.type}:${component.id}`)}
                  className="w-full btn-primary text-sm"
                >
                  Check Compatibility
                </button>
                <button className="w-full btn-secondary text-sm">
                  Add to Build
                </button>
                <button className="w-full btn-secondary text-sm flex items-center justify-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>Find Retailers</span>
                </button>
              </div>
            </div>

            {/* Technical Notes */}
            {component.notes && (
              <div className="card">
                <h3 className="font-semibold text-neutral-900 mb-4">Technical Notes</h3>
                <p className="text-sm text-neutral-700">{component.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}