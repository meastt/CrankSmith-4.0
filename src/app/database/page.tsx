'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, Package, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComponentCard } from '@/components/ComponentCard';
import { ComponentFilters } from '@/components/ComponentFilters';
import type { ComponentFilters as FilterType } from '@/types/components';

const componentTypes = [
  { id: 'cassette', label: 'Cassettes', icon: '⚙️' },
  { id: 'chain', label: 'Chains', icon: '🔗' },
  { id: 'rearDerailleur', label: 'Rear Derailleurs', icon: '🔧' },
  { id: 'crankset', label: 'Cranksets', icon: '🔄' }
];

export default function DatabasePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('cassette');
  const [searchQuery, setSearchQuery] = useState('');
  const [components, setComponents] = useState<any[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    manufacturer: [],
    bikeType: [],
    speeds: [],
    priceRange: undefined,
    year: undefined
  });

  // Fetch components when type changes
  useEffect(() => {
    fetchComponents();
  }, [selectedType]);

  // Filter components when search or filters change
  useEffect(() => {
    filterComponents();
  }, [components, searchQuery, filters]);

  const fetchComponents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/components/${selectedType}`);
      const data = await response.json();
      setComponents(data);
    } catch (error) {
      console.error('Failed to fetch components:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterComponents = () => {
    let filtered = [...components];

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(component =>
        `${component.manufacturer} ${component.model} ${component.series || ''}`
          .toLowerCase()
          .includes(query)
      );
    }

    // Manufacturer filter
    if (filters.manufacturer && filters.manufacturer.length > 0) {
      filtered = filtered.filter(c => 
        filters.manufacturer!.includes(c.manufacturer)
      );
    }

    // Bike type filter
    if (filters.bikeType && filters.bikeType.length > 0) {
      filtered = filtered.filter(c => 
        filters.bikeType!.includes(c.bikeType)
      );
    }

    // Speed filter
    if (filters.speeds && filters.speeds.length > 0) {
      filtered = filtered.filter(c => 
        filters.speeds!.includes(c.speeds)
      );
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(c => {
        if (!c.msrp) return true; // Include components without price
        return c.msrp >= min && c.msrp <= max;
      });
    }

    // Year filter
    if (filters.year) {
      const [minYear, maxYear] = filters.year;
      filtered = filtered.filter(c => {
        if (!c.year) return true; // Include components without year
        return c.year >= minYear && c.year <= maxYear;
      });
    }

    setFilteredComponents(filtered);
  };

  const clearFilters = () => {
    setFilters({
      manufacturer: [],
      bikeType: [],
      speeds: [],
      priceRange: undefined,
      year: undefined
    });
    setSearchQuery('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.manufacturer?.length) count++;
    if (filters.bikeType?.length) count++;
    if (filters.speeds?.length) count++;
    if (filters.priceRange) count++;
    if (filters.year) count++;
    return count;
  };

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
              <h1 className="text-xl font-semibold text-neutral-900">
                Component Database
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-600">
                {filteredComponents.length} of {components.length} components
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            
            {/* Component Type Selector */}
            <div className="card">
              <h3 className="font-semibold text-neutral-900 mb-4">Component Type</h3>
              <div className="space-y-2">
                {componentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      selectedType === type.id
                        ? 'bg-primary-50 border-2 border-primary-200 text-primary-900'
                        : 'bg-neutral-50 border border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="text-xl">{type.icon}</span>
                    <span className="font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="card">
              <h3 className="font-semibold text-neutral-900 mb-4">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900">Filters</h3>
                <div className="flex items-center space-x-2">
                  {getActiveFilterCount() > 0 && (
                    <>
                      <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                        {getActiveFilterCount()} active
                      </span>
                      <button
                        onClick={clearFilters}
                        className="text-xs text-neutral-600 hover:text-neutral-900"
                      >
                        Clear
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden p-1"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
                <ComponentFilters
                  componentType={selectedType}
                  components={components}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
                <p className="text-neutral-600">Loading components...</p>
              </div>
            ) : filteredComponents.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  No components found
                </h3>
                <p className="text-neutral-600 mb-4">
                  Try adjusting your search or filters
                </p>
                {(searchQuery || getActiveFilterCount() > 0) && (
                  <button
                    onClick={clearFilters}
                    className="btn-secondary"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredComponents.map((component) => (
                  <ComponentCard
                    key={component.id}
                    component={component}
                    componentType={selectedType}
                    onView={(id) => router.push(`/database/${selectedType}/${id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}