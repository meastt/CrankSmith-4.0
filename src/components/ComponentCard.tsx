'use client';

import { Eye, ExternalLink, Gauge, Mountain, Bike, Zap } from 'lucide-react';

interface ComponentCardProps {
  component: any;
  componentType: string;
  onView: (id: string) => void;
}

export function ComponentCard({ component, componentType, onView }: ComponentCardProps) {
  
  const formatPrice = (msrp?: number) => {
    if (!msrp) return 'Price not available';
    return `$${(msrp / 100).toFixed(0)}`;
  };

  const getBikeTypeIcon = (bikeType: string) => {
    switch (bikeType) {
      case 'mtb': return <Mountain className="w-4 h-4" />;
      case 'road': return <Zap className="w-4 h-4" />;
      case 'gravel': return <Bike className="w-4 h-4" />;
      default: return <Bike className="w-4 h-4" />;
    }
  };

  const getBikeTypeColor = (bikeType: string) => {
    switch (bikeType) {
      case 'mtb': return 'bg-green-100 text-green-800';
      case 'road': return 'bg-blue-100 text-blue-800';
      case 'gravel': return 'bg-orange-100 text-orange-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getComponentSpecs = () => {
    switch (componentType) {
      case 'cassette':
        return [
          { label: 'Speeds', value: `${component.speeds}sp` },
          { label: 'Range', value: component.cogs?.split('-').slice(0,1)[0] + '-' + component.cogs?.split('-').slice(-1)[0] + 'T' },
          { label: 'Freehub', value: component.freehubStandard },
          { label: 'Weight', value: component.weight ? `${component.weight}g` : 'N/A' }
        ];
      case 'chain':
        return [
          { label: 'Speeds', value: `${component.speeds}sp` },
          { label: 'Standard', value: component.chainStandard },
          { label: 'Links', value: component.links ? `${component.links}` : 'N/A' },
          { label: 'Weight', value: component.weight ? `${component.weight}g` : 'N/A' }
        ];
      case 'rearDerailleur':
        return [
          { label: 'Speeds', value: `${component.speeds}sp` },
          { label: 'Max Cog', value: `${component.maxCogSize}T` },
          { label: 'Cage', value: component.cageLength },
          { label: 'Weight', value: component.weight ? `${component.weight}g` : 'N/A' }
        ];
      case 'crankset':
        return [
          { label: 'Chainrings', value: `${component.chainrings}T` },
          { label: 'BB Standard', value: component.bbStandard },
          { label: 'Crank Length', value: `${component.crankLength}mm` },
          { label: 'Weight', value: component.weight ? `${component.weight}g` : 'N/A' }
        ];
      default:
        return [];
    }
  };

  const specs = getComponentSpecs();

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-neutral-900 leading-tight">
              {component.manufacturer}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBikeTypeColor(component.bikeType)}`}>
              {getBikeTypeIcon(component.bikeType)}
              <span className="ml-1 capitalize">{component.bikeType}</span>
            </span>
          </div>
          <p className="text-sm text-neutral-600 mb-1">
            {component.model}
          </p>
          {component.series && (
            <p className="text-xs text-neutral-500">
              {component.series}
            </p>
          )}
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-primary-600">
            {formatPrice(component.msrp)}
          </div>
          {component.year && (
            <div className="text-xs text-neutral-500">
              {component.year}
            </div>
          )}
        </div>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {specs.map((spec, index) => (
          <div key={index} className="bg-neutral-50 rounded p-2">
            <div className="text-xs text-neutral-600 uppercase tracking-wide">
              {spec.label}
            </div>
            <div className="text-sm font-medium text-neutral-900">
              {spec.value}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
        <button
          onClick={() => onView(component.id)}
          className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
        
        {/* Compatibility indicator */}
        <div className="flex items-center space-x-1 text-xs text-neutral-500">
          <Gauge className="w-3 h-3" />
          <span>Compatible with most {component.bikeType} setups</span>
        </div>
      </div>
    </div>
  );
}