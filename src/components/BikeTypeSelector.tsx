'use client';

import { Mountain, Zap, Bike, Users } from 'lucide-react';
import type { BikeType } from '@/types/components';

interface BikeTypeSelectorProps {
  selected?: BikeType;
  onSelect: (bikeType: BikeType) => void;
}

const bikeTypes = [
  {
    id: 'mtb' as BikeType,
    name: 'Mountain Bike',
    description: 'Trail, enduro, cross-country, and downhill riding',
    icon: <Mountain className="w-8 h-8" />,
    color: 'bg-green-50 border-green-200 text-green-800',
    hoverColor: 'hover:bg-green-100',
    selectedColor: 'bg-green-100 border-green-300',
    features: [
      'Wide gear ranges for climbing',
      '1x and 2x drivetrain options',
      'Durable components for rough terrain',
      'Clutch derailleurs for chain security'
    ],
    popular: ['SRAM Eagle', 'Shimano XT/SLX', 'Single chainring setups']
  },
  {
    id: 'road' as BikeType,
    name: 'Road Bike',
    description: 'Racing, endurance, and performance road cycling',
    icon: <Zap className="w-8 h-8" />,
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    hoverColor: 'hover:bg-blue-100',
    selectedColor: 'bg-blue-100 border-blue-300',
    features: [
      'Close gear ratios for efficiency',
      '2x drivetrain with front derailleur',
      'Lightweight components',
      'Aerodynamic considerations'
    ],
    popular: ['Shimano 105/Ultegra/Dura-Ace', 'SRAM Rival/Force/Red', 'Compact cranks']
  },
  {
    id: 'gravel' as BikeType,
    name: 'Gravel Bike',
    description: 'Adventure riding, mixed terrain, bikepacking',
    icon: <Bike className="w-8 h-8" />,
    color: 'bg-orange-50 border-orange-200 text-orange-800',
    hoverColor: 'hover:bg-orange-100',
    selectedColor: 'bg-orange-100 border-orange-300',
    features: [
      'Versatile gear ranges',
      '1x and 2x options available',
      'Durable yet lightweight',
      'Wide tire clearance considerations'
    ],
    popular: ['SRAM Force/Rival AXS', 'Shimano GRX', 'Sub-compact cranks']
  },
  {
    id: 'hybrid' as BikeType,
    name: 'Hybrid/Commuter',
    description: 'Urban riding, commuting, recreational cycling',
    icon: <Users className="w-8 h-8" />,
    color: 'bg-purple-50 border-purple-200 text-purple-800',
    hoverColor: 'hover:bg-purple-100',
    selectedColor: 'bg-purple-100 border-purple-300',
    features: [
      'Practical gear ranges',
      'Low maintenance priority',
      'Comfort-focused geometry',
      'Weather resistance'
    ],
    popular: ['Shimano Tourney/Altus', 'SRAM X3/X4', 'Internal hub gears']
  }
];

export function BikeTypeSelector({ selected, onSelect }: BikeTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          What type of bike are you building for?
        </h3>
        <p className="text-neutral-600">
          This helps us recommend the right components and check compatibility
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bikeTypes.map((bikeType) => {
          const isSelected = selected === bikeType.id;
          
          return (
            <button
              key={bikeType.id}
              onClick={() => onSelect(bikeType.id)}
              className={`text-left p-6 rounded-lg border-2 transition-all duration-200 ${
                isSelected 
                  ? `${bikeType.selectedColor} shadow-lg transform scale-105`
                  : `${bikeType.color} ${bikeType.hoverColor} hover:shadow-md hover:scale-102`
              }`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-full ${isSelected ? 'bg-white shadow-sm' : 'bg-white bg-opacity-50'}`}>
                  {bikeType.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{bikeType.name}</h3>
                  <p className="text-sm opacity-80">{bikeType.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Key Features:</h4>
                  <ul className="space-y-1 text-sm">
                    {bikeType.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-current rounded-full flex-shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Popular Options:</h4>
                  <div className="flex flex-wrap gap-1">
                    {bikeType.popular.map((option, index) => (
                      <span 
                        key={index}
                        className="inline-block px-2 py-1 text-xs bg-white bg-opacity-50 rounded"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="flex items-center space-x-2 text-sm font-medium">
                    <div className="w-2 h-2 bg-current rounded-full"></div>
                    <span>Selected</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="text-center p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-sm text-primary-800">
            <strong>Great choice!</strong> We'll now show you components optimized for {bikeTypes.find(t => t.id === selected)?.name.toLowerCase()} riding.
          </p>
        </div>
      )}
    </div>
  );
}