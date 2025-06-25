import { 
    Cassette, 
    Chain, 
    RearDerailleur, 
    Crankset,
    CompatibilityResult,
    CompatibilityIssue,
    CompatibilityWarning,
    GearAnalysis 
  } from '@/types/components';
  
  export class CompatibilityEngine {
    
    /**
     * Main compatibility check function
     */
    static checkCompatibility(components: {
      cassette?: Cassette;
      chain?: Chain;
      rearDerailleur?: RearDerailleur;
      crankset?: Crankset;
    }): CompatibilityResult {
      const issues: CompatibilityIssue[] = [];
      const warnings: CompatibilityWarning[] = [];
  
      // Check cassette + chain compatibility
      if (components.cassette && components.chain) {
        const cassetteChainCheck = this.checkCassetteChainCompatibility(
          components.cassette, 
          components.chain
        );
        issues.push(...cassetteChainCheck.issues);
        warnings.push(...cassetteChainCheck.warnings);
      }
  
      // Check cassette + derailleur compatibility
      if (components.cassette && components.rearDerailleur) {
        const cassetteDerailleurCheck = this.checkCassetteDerailleurCompatibility(
          components.cassette,
          components.rearDerailleur
        );
        issues.push(...cassetteDerailleurCheck.issues);
        warnings.push(...cassetteDerailleurCheck.warnings);
      }
  
      // Check chain + derailleur compatibility
      if (components.chain && components.rearDerailleur) {
        const chainDerailleurCheck = this.checkChainDerailleurCompatibility(
          components.chain,
          components.rearDerailleur
        );
        issues.push(...chainDerailleurCheck.issues);
        warnings.push(...chainDerailleurCheck.warnings);
      }
  
      // Calculate compatibility score
      const compatibilityScore = this.calculateCompatibilityScore(issues, warnings);
      const isCompatible = issues.filter(i => i.severity === 'error').length === 0;
  
      // Generate gear analysis if we have cassette and crankset
      let gearAnalysis: GearAnalysis | undefined;
      if (components.cassette && components.crankset) {
        gearAnalysis = this.analyzeGearRatios(components.cassette, components.crankset);
      }
  
      return {
        isCompatible,
        compatibilityScore,
        issues,
        warnings,
        gearAnalysis
      };
    }
  
    /**
     * Check cassette and chain compatibility
     */
    private static checkCassetteChainCompatibility(
      cassette: Cassette, 
      chain: Chain
    ): { issues: CompatibilityIssue[]; warnings: CompatibilityWarning[] } {
      const issues: CompatibilityIssue[] = [];
      const warnings: CompatibilityWarning[] = [];
  
      // Speed compatibility
      if (cassette.speeds !== chain.speeds) {
        issues.push({
          component: 'Chain/Cassette',
          issue: 'Speed mismatch',
          severity: 'error',
          description: `${chain.speeds}-speed chain not compatible with ${cassette.speeds}-speed cassette`,
          solution: `Use a ${cassette.speeds}-speed chain`
        });
      }
  
      // Chain standard compatibility
      const chainStandardCompatibility = this.getChainStandardCompatibility();
      const cassetteChainStandard = this.getCassetteChainStandard(cassette);
      
      if (!chainStandardCompatibility[cassetteChainStandard]?.includes(chain.chainStandard)) {
        issues.push({
          component: 'Chain/Cassette',
          issue: 'Chain standard incompatible',
          severity: 'error',
          description: `${chain.chainStandard} chain not compatible with ${cassetteChainStandard} cassette`,
          solution: `Use a ${cassetteChainStandard} compatible chain`
        });
      }
  
      return { issues, warnings };
    }
  
    /**
     * Check cassette and derailleur compatibility
     */
    private static checkCassetteDerailleurCompatibility(
      cassette: Cassette,
      derailleur: RearDerailleur
    ): { issues: CompatibilityIssue[]; warnings: CompatibilityWarning[] } {
      const issues: CompatibilityIssue[] = [];
      const warnings: CompatibilityWarning[] = [];
  
      // Speed compatibility
      if (cassette.speeds !== derailleur.speeds) {
        issues.push({
          component: 'Derailleur/Cassette',
          issue: 'Speed mismatch',
          severity: 'error',
          description: `${derailleur.speeds}-speed derailleur not compatible with ${cassette.speeds}-speed cassette`
        });
      }
  
      // Check largest cog size
      const largeCog = this.getLargestCog(cassette.cogs);
      if (largeCog > derailleur.maxCogSize) {
        issues.push({
          component: 'Derailleur/Cassette',
          issue: 'Cog size too large',
          severity: 'error',
          description: `${largeCog}T largest cog exceeds derailleur's ${derailleur.maxCogSize}T capacity`,
          solution: `Use a derailleur with ${largeCog}T+ capacity or smaller cassette`
        });
      }
  
      // Warn if close to limit
      if (largeCog > derailleur.maxCogSize * 0.9) {
        warnings.push({
          component: 'Derailleur/Cassette',
          warning: 'Near capacity limit',
          description: `${largeCog}T cog is close to derailleur's ${derailleur.maxCogSize}T limit`,
          recommendation: 'Consider upgrading derailleur for better performance'
        });
      }
  
      return { issues, warnings };
    }
  
    /**
     * Check chain and derailleur compatibility
     */
    private static checkChainDerailleurCompatibility(
      chain: Chain,
      derailleur: RearDerailleur
    ): { issues: CompatibilityIssue[]; warnings: CompatibilityWarning[] } {
      const issues: CompatibilityIssue[] = [];
      const warnings: CompatibilityWarning[] = [];
  
      // Speed compatibility
      if (chain.speeds !== derailleur.speeds) {
        issues.push({
          component: 'Chain/Derailleur',
          issue: 'Speed mismatch',
          severity: 'error',
          description: `${chain.speeds}-speed chain not compatible with ${derailleur.speeds}-speed derailleur`
        });
      }
  
      // Shifting standard compatibility
      const chainShiftingStandard = this.getChainShiftingStandard(chain);
      if (chainShiftingStandard !== derailleur.shiftingStandard) {
        issues.push({
          component: 'Chain/Derailleur',
          issue: 'Shifting standard mismatch',
          severity: 'error',
          description: `${chainShiftingStandard} chain not compatible with ${derailleur.shiftingStandard} derailleur`
        });
      }
  
      return { issues, warnings };
    }
  
    /**
     * Analyze gear ratios
     */
    private static analyzeGearRatios(cassette: Cassette, crankset: Crankset): GearAnalysis {
      const cassetteCogs = this.parseCogs(cassette.cogs);
      const chainrings = this.parseChainrings(crankset.chainrings);
      
      const ratios: number[] = [];
      
      // Calculate all gear ratios
      chainrings.forEach(chainring => {
        cassetteCogs.forEach(cog => {
          ratios.push(chainring / cog);
        });
      });
  
      ratios.sort((a, b) => a - b);
  
      const minRatio = Math.min(...ratios);
      const maxRatio = Math.max(...ratios);
      const range = maxRatio - minRatio;
  
      // Calculate steps between gears
      const steps: number[] = [];
      for (let i = 1; i < ratios.length; i++) {
        steps.push((ratios[i] - ratios[i-1]) / ratios[i-1] * 100); // percentage step
      }
  
      const averageStep = steps.reduce((a, b) => a + b, 0) / steps.length;
      const largestGap = Math.max(...steps);
  
      // Calculate efficiency score (0-100)
      const efficiency = this.calculateGearEfficiency(steps, largestGap);
  
      return {
        ratios,
        minRatio,
        maxRatio,
        range,
        steps,
        averageStep,
        largestGap,
        efficiency
      };
    }
  
    /**
     * Helper functions
     */
    private static getLargestCog(cogsString: string): number {
      const cogs = this.parseCogs(cogsString);
      return Math.max(...cogs);
    }
  
    private static parseCogs(cogsString: string): number[] {
      return cogsString.split('-').map(Number);
    }
  
    private static parseChainrings(chainringsString: string): number[] {
      return chainringsString.split('-').map(Number);
    }
  
    private static getCassetteChainStandard(cassette: Cassette): string {
      // Map cassette compatibility to chain standard
      if (cassette.chainCompatibility.includes('Eagle')) return 'Eagle';
      if (cassette.chainCompatibility.includes('HG+')) return 'HG+';
      if (cassette.chainCompatibility.includes('Flat Top')) return 'Flat Top';
      return 'HG';
    }
  
    private static getChainShiftingStandard(chain: Chain): string {
      // Infer shifting standard from chain
      if (chain.chainStandard === 'Eagle') return 'SRAM';
      if (chain.chainStandard === 'Flat Top') return 'SRAM';
      return 'Shimano'; // Default for HG/HG+
    }
  
    private static getChainStandardCompatibility(): Record<string, string[]> {
      return {
        'HG': ['HG', 'HG+'],
        'HG+': ['HG+'],
        'Eagle': ['Eagle'],
        'Flat Top': ['Flat Top']
      };
    }
  
    private static calculateCompatibilityScore(
      issues: CompatibilityIssue[], 
      warnings: CompatibilityWarning[]
    ): number {
      let score = 100;
      
      // Deduct for issues
      issues.forEach(issue => {
        switch (issue.severity) {
          case 'error': score -= 30; break;
          case 'warning': score -= 10; break;
          case 'info': score -= 5; break;
        }
      });
  
      // Deduct for warnings
      warnings.forEach(() => {
        score -= 5;
      });
  
      return Math.max(0, score);
    }
  
    private static calculateGearEfficiency(steps: number[], largestGap: number): number {
      // Perfect efficiency would be consistent steps around 15-20%
      const idealStep = 17; // percent
      const stepVariance = steps.reduce((acc, step) => acc + Math.abs(step - idealStep), 0) / steps.length;
      
      let efficiency = 100;
      efficiency -= stepVariance * 2; // Penalize step variance
      efficiency -= Math.max(0, largestGap - 25) * 3; // Penalize large gaps over 25%
      
      return Math.max(0, Math.min(100, efficiency));
    }
  }