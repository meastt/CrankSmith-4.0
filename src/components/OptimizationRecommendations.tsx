'use client';

import { useState } from 'react';
import { Target, TrendingUp, Weight, DollarSign, Zap, ArrowRight, Star, AlertTriangle } from 'lucide-react';

interface OptimizationRecommendationsProps {
  build: any;
  metrics: any;
}

export function OptimizationRecommendations({ build, metrics }: OptimizationRecommendationsProps) {
  const [activeTab, setActiveTab] = useState<'performance' | 'weight' | 'value' | 'efficiency'>('performance');

  if (!metrics) {
    return null;
  }

  const recommendations = {
    performance: [
      {
        id: 'gear-range',
        priority: 'high',
        title: 'Optimize Gear Range',
        description: 'Your largest gear step is 28.5%, which may cause shifting difficulties on climbs.',
        impact: '+15% climbing efficiency',
        suggestion: 'Consider the SRAM X01 Eagle cassette with more evenly spaced cogs',
        component: 'cassette',
        currentScore: 72,
        projectedScore: 89,
        cost: +120
      },
      {
        id: 'derailleur-capacity',
        priority: 'medium',
        title: 'Derailleur Capacity Optimization',
        description: 'Your current derailleur is at 85% capacity, leaving little room for upgrades.',
        impact: '+8% shifting precision',
        suggestion: 'Upgrade to a long-cage derailleur for better chain wrap',
        component: 'rearDerailleur',
        currentScore: 78,
        projectedScore: 86,
        cost: +75
      }
    ],
    weight: [
      {
        id: 'lightweight-cassette',
        priority: 'high',
        title: 'Lightweight Cassette Upgrade',
        description: 'Switch to a machined aluminum cassette to save significant weight.',
        impact: '-180g weight reduction',
        suggestion: 'SRAM X01 Eagle cassette (290g vs 470g current)',
        component: 'cassette',
        currentScore: 68,
        projectedScore: 85,
        cost: +180
      },
      {
        id: 'carbon-crankset',
        priority: 'medium',
        title: 'Carbon Fiber Crankset',
        description: 'Carbon crankset would reduce rotational weight significantly.',
        impact: '-150g weight reduction',
        suggestion: 'Consider carbon fiber crankarms with aluminum spider',
        component: 'crankset',
        currentScore: 71,
        projectedScore: 82,
        cost: +250
      }
    ],
    value: [
      {
        id: 'budget-alternative',
        priority: 'high',
        title: 'Value Alternative Cassette',
        description: 'Similar performance available at a lower price point.',
        impact: '-$85 cost savings',
        suggestion: 'SRAM NX Eagle cassette offers 90% of the performance',
        component: 'cassette',
        currentScore: 76,
        projectedScore: 74,
        cost: -85
      },
      {
        id: 'combo-deals',
        priority: 'medium',
        title: 'Component Bundle Savings',
        description: 'Purchasing chain and cassette together often includes discounts.',
        impact: '-$35 potential savings',
        suggestion: 'Look for manufacturer combo deals or groupset packages',
        component: 'multiple',
        currentScore: 80,
        projectedScore: 80,
        cost: -35
      }
    ],
    efficiency: [
      {
        id: 'chainline-optimization',
        priority: 'high',
        title: 'Chainline Optimization',
        description: 'Your chainline is slightly off optimal, causing power loss.',
        impact: '+3% power transfer efficiency',
        suggestion: 'Consider a different bottom bracket or crankset offset',
        component: 'crankset',
        currentScore: 82,
        projectedScore: 91,
        cost: 0
      },
      {
        id: 'chain-efficiency',
        priority: 'medium',
        title: 'Chain Technology Upgrade',
        description: 'Modern chain coatings can improve efficiency and longevity.',
        impact: '+2% efficiency, +40% chain life',
        suggestion: 'Upgrade to a DLC-coated or ceramic-treated chain',
        component: 'chain',
        currentScore: 78,
        projectedScore: 84,
        cost: +45
      }
    ]
  };

  const tabs = [
    { id: 'performance', label: 'Performance', icon: <TrendingUp className="w-4 h-4" />, color: 'text-primary-600' },
    { id: 'weight', label: 'Weight', icon: <Weight className="w-4 h-4" />, color: 'text-neutral-600' },
    { id: 'value', label: 'Value', icon: <DollarSign className="w-4 h-4" />, color: 'text-green-600' },
    { id: 'efficiency', label: 'Efficiency', icon: <Zap className="w-4 h-4" />, color: 'text-tool-orange' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-error-100 text-error-800 border-error-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Target className="w-4 h-4" />;
      case 'low': return <Star className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getScoreChange = (current: number, projected: number) => {
    const change = projected - current;
    if (change > 0) {
      return <span className="text-success-600">+{change}</span>;
    } else if (change < 0) {
      return <span className="text-error-600">{change}</span>;
    }
    return <span className="text-neutral-600">±0</span>;
  };

  const getCostChange = (cost: number) => {
    if (cost > 0) {
      return <span className="text-error-600">+${cost}</span>;
    } else if (cost < 0) {
      return <span className="text-success-600">-${Math.abs(cost)}</span>;
    }
    return <span className="text-neutral-600">No cost</span>;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Target className="w-6 h-6 text-primary-600" />
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Optimization Recommendations</h2>
            <p className="text-sm text-neutral-600">AI-powered suggestions to improve your build</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? `border-primary-500 ${tab.color}`
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Recommendations */}
      <div className="space-y-6">
        {recommendations[activeTab].map((rec) => (
          <div key={rec.id} className="border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                    {getPriorityIcon(rec.priority)}
                    <span className="ml-1 capitalize">{rec.priority} Priority</span>
                  </span>
                  <span className="text-xs text-neutral-500 capitalize">
                    {rec.component} optimization
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">{rec.title}</h3>
                <p className="text-neutral-600 mt-1">{rec.description}</p>
              </div>
            </div>

            {/* Impact and Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-900 mb-1">Expected Impact</div>
                <div className="text-blue-800">{rec.impact}</div>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3">
                <div className="text-sm font-medium text-neutral-900 mb-1">Score Change</div>
                <div className="flex items-center space-x-2">
                  <span className="text-neutral-700">{rec.currentScore}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                  <span className="font-medium">{rec.projectedScore}</span>
                  <span className="text-sm">({getScoreChange(rec.currentScore, rec.projectedScore)})</span>
                </div>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3">
                <div className="text-sm font-medium text-neutral-900 mb-1">Cost Impact</div>
                <div className="font-medium">{getCostChange(rec.cost)}</div>
              </div>
            </div>

            {/* Suggestion */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">💡</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-primary-900 mb-1">Recommendation</h4>
                  <p className="text-primary-800 text-sm">{rec.suggestion}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-4">
              <div className="flex items-center space-x-4">
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View Compatible Components
                </button>
                <button className="text-sm text-neutral-600 hover:text-neutral-700">
                  Learn More
                </button>
              </div>
              <button className="btn-primary text-sm">
                Apply Recommendation
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200">
        <h3 className="font-semibold text-primary-900 mb-3">Optimization Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-primary-800 mb-1">Potential Improvements</div>
            <div className="text-primary-700">
              Up to +{Math.max(...recommendations[activeTab].map(r => r.projectedScore - r.currentScore))} points possible
            </div>
          </div>
          <div>
            <div className="font-medium text-primary-800 mb-1">Investment Range</div>
            <div className="text-primary-700">
              ${Math.min(...recommendations[activeTab].map(r => r.cost))} to 
              ${Math.max(...recommendations[activeTab].map(r => r.cost))}
            </div>
          </div>
          <div>
            <div className="font-medium text-primary-800 mb-1">Quick Wins</div>
            <div className="text-primary-700">
              {recommendations[activeTab].filter(r => r.cost <= 0).length} free optimizations available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}