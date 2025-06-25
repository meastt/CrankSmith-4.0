import { NextRequest, NextResponse } from 'next/server';
import { CompatibilityEngine } from '@/lib/compatibility';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { build, tools } = body;

    // Validate build has required components
    if (!build.cassette || !build.chain || !build.rearDerailleur || !build.crankset) {
      return NextResponse.json(
        { error: 'Complete build required for analysis' },
        { status: 400 }
      );
    }

    // Run basic compatibility analysis
    const compatibilityResult = CompatibilityEngine.checkCompatibility(build);

    // Calculate advanced metrics
    const metrics = {
      overallScore: calculateOverallScore(build, compatibilityResult),
      gearAnalysis: compatibilityResult.gearAnalysis,
      weight: calculateWeightAnalysis(build),
      price: calculatePriceAnalysis(build),
      efficiency: calculateEfficiencyAnalysis(build),
      recommendations: generateRecommendations(build, compatibilityResult)
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Advanced analysis failed:', error);
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}

function calculateOverallScore(build: any, compatibilityResult: any): number {
  let score = compatibilityResult.compatibilityScore;

  // Weight bonus (lighter is better)
  const totalWeight = getTotalWeight(build);
  if (totalWeight > 0) {
    if (totalWeight < 1000) score += 10; // Very light
    else if (totalWeight < 1200) score += 5; // Light
    else if (totalWeight > 1500) score -= 5; // Heavy
  }

  // Gear efficiency bonus
  if (compatibilityResult.gearAnalysis?.efficiency > 85) {
    score += 5;
  } else if (compatibilityResult.gearAnalysis?.efficiency < 70) {
    score -= 5;
  }

  // Price/performance ratio
  const totalPrice = getTotalPrice(build);
  if (totalPrice > 0) {
    const pricePerformanceRatio = score / (totalPrice / 100); // Score per dollar
    if (pricePerformanceRatio > 0.3) score += 5; // Good value
    else if (pricePerformanceRatio < 0.1) score -= 3; // Poor value
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateWeightAnalysis(build: any) {
  const breakdown = {
    cassette: build.cassette?.weight || 0,
    chain: build.chain?.weight || 0,
    rearDerailleur: build.rearDerailleur?.weight || 0,
    crankset: build.crankset?.weight || 0
  };

  const total = Object.values(breakdown).reduce((sum, weight) => sum + weight, 0);

  // Simulate comparison weights (would come from database in real implementation)
  const comparison = {
    light: Math.round(total * 0.85), // 15% lighter alternative
    budget: Math.round(total * 1.15)  // 15% heavier budget option
  };

  return {
    total,
    breakdown,
    comparison
  };
}

function calculatePriceAnalysis(build: any) {
  const breakdown = {
    cassette: build.cassette?.msrp ? Math.round(build.cassette.msrp / 100) : 0,
    chain: build.chain?.msrp ? Math.round(build.chain.msrp / 100) : 0,
    rearDerailleur: build.rearDerailleur?.msrp ? Math.round(build.rearDerailleur.msrp / 100) : 0,
    crankset: build.crankset?.msrp ? Math.round(build.crankset.msrp / 100) : 0
  };

  const total = Object.values(breakdown).reduce((sum, price) => sum + price, 0);

  // Value analysis
  const valueAnalysis = {
    rating: total < 300 ? 'excellent' : total < 500 ? 'good' : total < 800 ? 'fair' : 'premium',
    marketPosition: total < 400 ? 'Budget-friendly option' : 
                   total < 700 ? 'Mid-range performance' : 'High-end components',
    recommendation: total < 300 ? ' Great entry point.' : 
                   total < 500 ? ' Good balance of price and performance.' :
                   total < 800 ? ' Performance-focused build.' : ' Premium setup for serious riders.'
  };

  return {
    total,
    breakdown,
    valueAnalysis
  };
}

function calculateEfficiencyAnalysis(build: any) {
  // Simulate chainline calculation (would be more complex in real implementation)
  const chainline = 52; // Standard MTB chainline

  // Simulate drivetrain efficiency (based on component quality)
  let drivetrainEfficiency = 95;
  
  // Reduce efficiency for mismatched components
  if (build.cassette?.manufacturer !== build.chain?.manufacturer) {
    drivetrainEfficiency -= 1;
  }
  
  if (build.chain?.chainStandard !== getExpectedChainStandard(build.cassette)) {
    drivetrainEfficiency -= 2;
  }

  // Cross-chaining analysis (1x drivetrains have less cross-chaining)
  const crossChaining = build.crankset?.chainrings?.includes('-') ? 15 : 5; // 2x vs 1x

  const recommendations = [];
  if (drivetrainEfficiency < 94) {
    recommendations.push('Consider matching chain and cassette brands for optimal efficiency');
  }
  if (crossChaining > 10) {
    recommendations.push('Single chainring setup would reduce cross-chain usage');
  }
  if (chainline !== 52) {
    recommendations.push('Chainline optimization could improve power transfer');
  }

  return {
    chainline,
    drivetrain: drivetrainEfficiency,
    crossChaining,
    recommendations
  };
}

function generateRecommendations(build: any, compatibilityResult: any) {
  const recommendations = [];

  // Gear ratio recommendations
  if (compatibilityResult.gearAnalysis?.largestGap > 25) {
    recommendations.push({
      type: 'gear-ratio',
      priority: 'high',
      title: 'Large gear steps detected',
      description: `Your largest gear step is ${compatibilityResult.gearAnalysis.largestGap.toFixed(1)}%, which may cause difficult transitions.`,
      suggestion: 'Consider a cassette with more evenly spaced cogs'
    });
  }

  // Weight recommendations
  const totalWeight = getTotalWeight(build);
  if (totalWeight > 1300) {
    recommendations.push({
      type: 'weight',
      priority: 'medium',
      title: 'Weight optimization opportunity',
      description: `Your drivetrain weighs ${totalWeight}g, which is above average.`,
      suggestion: 'Consider lightweight alternatives for cassette or crankset'
    });
  }

  // Price recommendations
  const totalPrice = getTotalPrice(build);
  if (totalPrice > 80000) { // $800
    recommendations.push({
      type: 'value',
      priority: 'low',
      title: 'High-end build detected',
      description: `This is a premium build at $${(totalPrice / 100).toFixed(0)}.`,
      suggestion: 'Consider if all components need to be top-tier for your riding style'
    });
  }

  return recommendations;
}

function getTotalWeight(build: any): number {
  return (build.cassette?.weight || 0) +
         (build.chain?.weight || 0) +
         (build.rearDerailleur?.weight || 0) +
         (build.crankset?.weight || 0);
}

function getTotalPrice(build: any): number {
  return (build.cassette?.msrp || 0) +
         (build.chain?.msrp || 0) +
         (build.rearDerailleur?.msrp || 0) +
         (build.crankset?.msrp || 0);
}

function getExpectedChainStandard(cassette: any): string {
  if (cassette?.chainCompatibility?.includes('Eagle')) return 'Eagle';
  if (cassette?.chainCompatibility?.includes('HG+')) return 'HG+';
  return 'HG';
}