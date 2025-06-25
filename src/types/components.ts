// Base component interface
export interface BaseComponent {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    
    // Basic info
    manufacturer: string;
    series?: string;
    model: string;
    year?: number;
    weight?: number; // grams
    bikeType: BikeType;
    msrp?: number; // cents
    imageUrl?: string;
  }
  
  // Enums for type safety
  export type BikeType = 'mtb' | 'road' | 'gravel' | 'hybrid';
  export type FreehubStandard = 'Shimano HG' | 'SRAM XD' | 'SRAM XDR' | 'Shimano Microspline' | 'Campagnolo';
  export type ChainStandard = 'HG' | 'HG+' | 'Eagle' | 'Flat Top' | 'Campagnolo';
  export type ShiftingStandard = 'Shimano' | 'SRAM' | 'Campagnolo';
  export type CageLength = 'short' | 'medium' | 'long';
  export type BBStandard = 'BSA' | 'BB30' | 'PF30' | 'BB86' | 'BB92' | 'T47' | 'PressFit BB86';
  
  // Component-specific interfaces
  export interface Cassette extends BaseComponent {
    speeds: number;
    cogs: string; // "10-12-14-16-18-21-24-28-33-39-45-51"
    freehubStandard: FreehubStandard;
    chainCompatibility: string;
    
    // Advanced specs
    cogMaterial?: string;
    spiderMaterial?: string;
    spacing?: number; // mm between cogs
  }
  
  export interface Chain extends BaseComponent {
    speeds: number;
    chainStandard: ChainStandard;
    links?: number;
    masterLink?: string;
    
    // Advanced specs
    innerWidth?: number; // mm
    outerWidth?: number; // mm
    coating?: string;
  }
  
  export interface RearDerailleur extends BaseComponent {
    speeds: number;
    cageLength: CageLength;
    maxCogSize: number;
    minCogSize?: number;
    totalCapacity?: number; // teeth
    
    // Compatibility
    shiftingStandard: ShiftingStandard;
    pullRatio?: string;
    
    // Advanced specs
    jockeyWheelSize?: number; // mm
    clutch: boolean;
  }
  
  export interface Crankset extends BaseComponent {
    chainrings: string; // "32" or "50-34" or "50-39-30"
    bbStandard: BBStandard;
    crankLength: number; // mm
    
    // Advanced specs
    chainline?: number; // mm
    qFactor?: number; // mm
    bcd?: string; // "104mm" or "110/74mm"
  }
  
  // Build and compatibility interfaces
  export interface Build {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    
    name?: string;
    bikeType: BikeType;
    
    // Components
    cassette?: Cassette;
    chain?: Chain;
    rearDerailleur?: RearDerailleur;
    crankset?: Crankset;
    
    // Analysis results
    compatibilityScore?: number; // 0-100
    gearRatioMin?: number;
    gearRatioMax?: number;
    gearRatioRange?: number;
  }
  
  export interface CompatibilityIssue {
    component: string;
    issue: string;
    severity: 'error' | 'warning' | 'info';
    description: string;
    solution?: string;
  }
  
  export interface CompatibilityWarning {
    component: string;
    warning: string;
    description: string;
    recommendation?: string;
  }
  
  export interface CompatibilityResult {
    isCompatible: boolean;
    compatibilityScore: number; // 0-100
    issues: CompatibilityIssue[];
    warnings: CompatibilityWarning[];
    gearAnalysis?: GearAnalysis;
  }
  
  export interface GearAnalysis {
    ratios: number[];
    minRatio: number;
    maxRatio: number;
    range: number;
    steps: number[];
    averageStep: number;
    largestGap: number;
    efficiency: number; // 0-100 score
  }
  
  // Utility types for component selection
  export interface ComponentOption {
    id: string;
    manufacturer: string;
    model: string;
    series?: string;
    year?: number;
    msrp?: number;
    imageUrl?: string;
    isRecommended?: boolean;
    compatibilityScore?: number;
  }
  
  export interface ComponentFilters {
    manufacturer?: string[];
    bikeType?: BikeType[];
    priceRange?: [number, number]; // min, max in cents
    speeds?: number[];
    year?: [number, number]; // min, max year
  }
  
  // Search and filtering
  export interface SearchParams {
    query?: string;
    filters: ComponentFilters;
    sortBy: 'price' | 'weight' | 'manufacturer' | 'year' | 'compatibility';
    sortOrder: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }