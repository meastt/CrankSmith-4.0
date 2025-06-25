'use client';

interface ComponentSpecsProps {
  component: any;
  componentType: string;
}

export function ComponentSpecs({ component, componentType }: ComponentSpecsProps) {
  
  const getSpecSections = () => {
    switch (componentType) {
      case 'cassette':
        return [
          {
            title: 'Basic Specifications',
            specs: [
              { label: 'Manufacturer', value: component.manufacturer },
              { label: 'Model', value: component.model },
              { label: 'Series', value: component.series || 'N/A' },
              { label: 'Year', value: component.year || 'Current' },
              { label: 'Bike Type', value: component.bikeType?.charAt(0).toUpperCase() + component.bikeType?.slice(1) },
              { label: 'MSRP', value: component.msrp ? `$${(component.msrp / 100).toFixed(0)}` : 'N/A' }
            ]
          },
          {
            title: 'Drivetrain Specifications',
            specs: [
              { label: 'Speeds', value: `${component.speeds}-speed` },
              { label: 'Cog Range', value: component.cogs || 'N/A' },
              { label: 'Freehub Standard', value: component.freehubStandard },
              { label: 'Chain Compatibility', value: component.chainCompatibility },
              { label: 'Cog Spacing', value: component.spacing ? `${component.spacing}mm` : 'N/A' }
            ]
          },
          {
            title: 'Physical Specifications',
            specs: [
              { label: 'Weight', value: component.weight ? `${component.weight}g` : 'N/A' },
              { label: 'Cog Material', value: component.cogMaterial || 'N/A' },
              { label: 'Spider Material', value: component.spiderMaterial || 'N/A' }
            ]
          }
        ];
      
      case 'chain':
        return [
          {
            title: 'Basic Specifications',
            specs: [
              { label: 'Manufacturer', value: component.manufacturer },
              { label: 'Model', value: component.model },
              { label: 'Series', value: component.series || 'N/A' },
              { label: 'Year', value: component.year || 'Current' },
              { label: 'Bike Type', value: component.bikeType?.charAt(0).toUpperCase() + component.bikeType?.slice(1) },
              { label: 'MSRP', value: component.msrp ? `$${(component.msrp / 100).toFixed(0)}` : 'N/A' }
            ]
          },
          {
            title: 'Chain Specifications',
            specs: [
              { label: 'Speeds', value: `${component.speeds}-speed` },
              { label: 'Chain Standard', value: component.chainStandard },
              { label: 'Links', value: component.links ? `${component.links} links` : 'N/A' },
              { label: 'Master Link', value: component.masterLink || 'N/A' }
            ]
          },
          {
            title: 'Physical Specifications',
            specs: [
              { label: 'Weight', value: component.weight ? `${component.weight}g` : 'N/A' },
              { label: 'Inner Width', value: component.innerWidth ? `${component.innerWidth}mm` : 'N/A' },
              { label: 'Outer Width', value: component.outerWidth ? `${component.outerWidth}mm` : 'N/A' },
              { label: 'Coating', value: component.coating || 'N/A' }
            ]
          }
        ];

      case 'rearDerailleur':
        return [
          {
            title: 'Basic Specifications',
            specs: [
              { label: 'Manufacturer', value: component.manufacturer },
              { label: 'Model', value: component.model },
              { label: 'Series', value: component.series || 'N/A' },
              { label: 'Year', value: component.year || 'Current' },
              { label: 'Bike Type', value: component.bikeType?.charAt(0).toUpperCase() + component.bikeType?.slice(1) },
              { label: 'MSRP', value: component.msrp ? `$${(component.msrp / 100).toFixed(0)}` : 'N/A' }
            ]
          },
          {
            title: 'Derailleur Specifications',
            specs: [
              { label: 'Speeds', value: `${component.speeds}-speed` },
              { label: 'Cage Length', value: component.cageLength?.charAt(0).toUpperCase() + component.cageLength?.slice(1) },
              { label: 'Max Cog Size', value: `${component.maxCogSize}T` },
              { label: 'Min Cog Size', value: component.minCogSize ? `${component.minCogSize}T` : 'N/A' },
              { label: 'Total Capacity', value: component.totalCapacity ? `${component.totalCapacity}T` : 'N/A' }
            ]
          },
          {
            title: 'Compatibility & Features',
            specs: [
              { label: 'Shifting Standard', value: component.shiftingStandard },
              { label: 'Pull Ratio', value: component.pullRatio || 'N/A' },
              { label: 'Clutch', value: component.clutch ? 'Yes' : 'No' },
              { label: 'Jockey Wheel Size', value: component.jockeyWheelSize ? `${component.jockeyWheelSize}mm` : 'N/A' },
              { label: 'Weight', value: component.weight ? `${component.weight}g` : 'N/A' }
            ]
          }
        ];

      case 'crankset':
        return [
          {
            title: 'Basic Specifications',
            specs: [
              { label: 'Manufacturer', value: component.manufacturer },
              { label: 'Model', value: component.model },
              { label: 'Series', value: component.series || 'N/A' },
              { label: 'Year', value: component.year || 'Current' },
              { label: 'Bike Type', value: component.bikeType?.charAt(0).toUpperCase() + component.bikeType?.slice(1) },
              { label: 'MSRP', value: component.msrp ? `$${(component.msrp / 100).toFixed(0)}` : 'N/A' }
            ]
          },
          {
            title: 'Crankset Specifications',
            specs: [
              { label: 'Chainrings', value: `${component.chainrings}T` },
              { label: 'BB Standard', value: component.bbStandard },
              { label: 'Crank Length', value: `${component.crankLength}mm` },
              { label: 'BCD', value: component.bcd || 'N/A' }
            ]
          },
          {
            title: 'Physical Specifications',
            specs: [
              { label: 'Weight', value: component.weight ? `${component.weight}g` : 'N/A' },
              { label: 'Chainline', value: component.chainline ? `${component.chainline}mm` : 'N/A' },
              { label: 'Q-Factor', value: component.qFactor ? `${component.qFactor}mm` : 'N/A' }
            ]
          }
        ];

      default:
        return [];
    }
  };

  const sections = getSpecSections();

  return (
    <div className="space-y-8">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">{section.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.specs.map((spec, specIndex) => (
              <div key={specIndex} className="bg-neutral-50 rounded-lg p-4">
                <div className="text-sm text-neutral-600 mb-1">{spec.label}</div>
                <div className="font-medium text-neutral-900">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Additional Technical Information */}
      {(component.notes || component.commonMistakes) && (
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Technical Notes</h3>
          <div className="space-y-4">
            {component.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Important Notes</h4>
                <p className="text-sm text-blue-800">{component.notes}</p>
              </div>
            )}
            {component.commonMistakes && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">Common Mistakes</h4>
                <p className="text-sm text-orange-800">{component.commonMistakes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}