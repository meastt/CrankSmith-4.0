'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ComponentFilters as FilterType } from '@/types/components';

interface ComponentFiltersProps {
  componentType: string;
  components: any[];
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

export function ComponentFilters({ 
  componentType, 
  components, 
  filters, 
  onFiltersChange 
}: ComponentFiltersProps) {

  const [expandedSections, setExpandedSections] = useState({
    manufacturer: true,
    bikeType: true,
    speeds: true,
    price: false,
    year: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  // Get unique values from components
  const getUniqueValues = (field: string) => {
    return [...new Set(components.map(c => c[field]).filter(Boolean))].sort();
  };

  const manufacturers = getUniqueValues('manufacturer');
  const bikeTypes = getUniqueValues('bikeType');
  const speeds = getUniqueValues('speeds').sort((a, b) => a - b);
  
  const priceRange = components
    .filter(c => c.msrp)
    .reduce((acc, c) => ({
      min: Math.min(acc.min, c.msrp),
      max: Math.max(acc.max, c.msrp)
    }), { min: Infinity, max: 0 });

  const yearRange = components
    .filter(c => c.year)
    .reduce((acc, c) => ({
      min: Math.min(acc.min, c.year),
      max: Math.max(acc.max, c.year)
    }), { min: Infinity, max: 0 });

  const handleCheckboxChange = (field: keyof FilterType, value: string) => {
    const currentValues = filters[field] as string[] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [field]: newValues
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      priceRange: [min, max]
    });
  };

  const handleYearRangeChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      year: [min, max]
    });
  };

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    sectionKey: string; 
    children: React.ReactNode; 
  }) => (
    <div className="border-b border-neutral-200 pb-4 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="font-medium text-neutral-900">{title}</span>
        {expandedSections[sectionKey as keyof typeof expandedSections] ? (
          <ChevronUp className="w-4 h-4 text-neutral-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-neutral-500" />
        )}
      </button>
      {expandedSections[sectionKey as keyof typeof expandedSections] && (
        <div>{children}</div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      
      {/* Manufacturer */}
      <FilterSection title="Manufacturer" sectionKey="manufacturer">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {manufacturers.map((manufacturer) => (
            <label key={manufacturer} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.manufacturer?.includes(manufacturer) || false}
                onChange={() => handleCheckboxChange('manufacturer', manufacturer)}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-neutral-700">{manufacturer}</span>
              <span className="ml-auto text-xs text-neutral-500">
                ({components.filter(c => c.manufacturer === manufacturer).length})
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Bike Type */}
      <FilterSection title="Bike Type" sectionKey="bikeType">
        <div className="space-y-2">
          {bikeTypes.map((bikeType) => (
            <label key={bikeType} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.bikeType?.includes(bikeType) || false}
                onChange={() => handleCheckboxChange('bikeType', bikeType)}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-neutral-700 capitalize">{bikeType}</span>
              <span className="ml-auto text-xs text-neutral-500">
                ({components.filter(c => c.bikeType === bikeType).length})
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Speeds */}
      <FilterSection title="Speeds" sectionKey="speeds">
        <div className="space-y-2">
          {speeds.map((speed) => (
            <label key={speed} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.speeds?.includes(speed) || false}
                onChange={() => handleCheckboxChange('speeds', speed.toString())}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-neutral-700">{speed}-speed</span>
              <span className="ml-auto text-xs text-neutral-500">
                ({components.filter(c => c.speeds === speed).length})
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      {priceRange.min !== Infinity && (
        <FilterSection title="Price Range" sectionKey="price">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <span>${(priceRange.min / 100).toFixed(0)}</span>
              <span>-</span>
              <span>${(priceRange.max / 100).toFixed(0)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Min</label>
                <input
                  type="number"
                  placeholder="Min price"
                  value={filters.priceRange?.[0] ? (filters.priceRange[0] / 100).toFixed(0) : ''}
                  onChange={(e) => {
                    const min = parseInt(e.target.value) * 100 || priceRange.min;
                    const max = filters.priceRange?.[1] || priceRange.max;
                    handlePriceRangeChange(min, max);
                  }}
                  className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Max</label>
                <input
                  type="number"
                  placeholder="Max price"
                  value={filters.priceRange?.[1] ? (filters.priceRange[1] / 100).toFixed(0) : ''}
                  onChange={(e) => {
                    const min = filters.priceRange?.[0] || priceRange.min;
                    const max = parseInt(e.target.value) * 100 || priceRange.max;
                    handlePriceRangeChange(min, max);
                  }}
                  className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </FilterSection>
      )}

      {/* Year Range */}
      {yearRange.min !== Infinity && (
        <FilterSection title="Year" sectionKey="year">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <span>{yearRange.min}</span>
              <span>-</span>
              <span>{yearRange.max}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-neutral-600 mb-1">From</label>
                <input
                  type="number"
                  placeholder="From year"
                  value={filters.year?.[0] || ''}
                  onChange={(e) => {
                    const min = parseInt(e.target.value) || yearRange.min;
                    const max = filters.year?.[1] || yearRange.max;
                    handleYearRangeChange(min, max);
                  }}
                  className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">To</label>
                <input
                  type="number"
                  placeholder="To year"
                  value={filters.year?.[1] || ''}
                  onChange={(e) => {
                    const min = filters.year?.[0] || yearRange.min;
                    const max = parseInt(e.target.value) || yearRange.max;
                    handleYearRangeChange(min, max);
                  }}
                  className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </FilterSection>
      )}
    </div>
  );
}