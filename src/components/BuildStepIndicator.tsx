'use client';

import { CheckCircle, Circle, Target, Mountain, Bike, Zap } from 'lucide-react';
import type { Build } from '@/types/components';

interface BuildStepIndicatorProps {
  steps: Array<{ id: string; title: string; description: string }>;
  currentStep: number;
  build: Partial<Build>;
  onStepClick: (stepIndex: number) => void;
}

export function BuildStepIndicator({ steps, currentStep, build, onStepClick }: BuildStepIndicatorProps) {
  
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const isStepAccessible = (stepIndex: number) => {
    // Can always go back to previous steps
    if (stepIndex <= currentStep) return true;
    
    // Can skip ahead if previous steps are completed
    switch (stepIndex) {
      case 1: return build.bikeType; // Can go to cassette if bike type selected
      case 2: return build.bikeType && build.cassette; // Can go to chain if cassette selected
      case 3: return build.bikeType && build.cassette && build.chain;
      case 4: return build.bikeType && build.cassette && build.chain && build.rearDerailleur;
      case 5: return build.bikeType && build.cassette && build.chain && build.rearDerailleur && build.crankset;
      default: return false;
    }
  };

  const getStepIcon = (stepId: string, status: string) => {
    if (status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-success-600" />;
    }
    
    if (status === 'current') {
      switch (stepId) {
        case 'bike-type': return <Mountain className="w-5 h-5 text-primary-600" />;
        case 'cassette': return <span className="text-primary-600 text-lg">⚙️</span>;
        case 'chain': return <span className="text-primary-600 text-lg">🔗</span>;
        case 'derailleur': return <span className="text-primary-600 text-lg">🔧</span>;
        case 'crankset': return <span className="text-primary-600 text-lg">🔄</span>;
        case 'review': return <Target className="w-5 h-5 text-primary-600" />;
        default: return <Circle className="w-5 h-5 text-primary-600" />;
      }
    }
    
    // Upcoming step
    return <Circle className="w-5 h-5 text-neutral-300" />;
  };

  const getStepProgress = (stepId: string) => {
    switch (stepId) {
      case 'bike-type': return build.bikeType ? '✓' : '';
      case 'cassette': return build.cassette ? build.cassette.manufacturer : '';
      case 'chain': return build.chain ? build.chain.manufacturer : '';
      case 'derailleur': return build.rearDerailleur ? build.rearDerailleur.manufacturer : '';
      case 'crankset': return build.crankset ? build.crankset.manufacturer : '';
      case 'review': return 'Final Check';
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isAccessible = isStepAccessible(index);
        const progress = getStepProgress(step.id);
        
        return (
          <div key={step.id} className="relative">
            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-2.5 top-8 w-px h-8 bg-neutral-200" />
            )}
            
            <button
              onClick={() => isAccessible && onStepClick(index)}
              disabled={!isAccessible}
              className={`w-full flex items-start space-x-3 p-3 rounded-lg text-left transition-colors ${
                isAccessible
                  ? status === 'current'
                    ? 'bg-primary-50 border-2 border-primary-200'
                    : 'hover:bg-neutral-50'
                  : 'cursor-not-allowed opacity-50'
              }`}
            >
              {/* Step Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getStepIcon(step.id, status)}
              </div>
              
              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${
                    status === 'current' ? 'text-primary-900' : 
                    status === 'completed' ? 'text-success-900' : 
                    'text-neutral-700'
                  }`}>
                    {step.title}
                  </h3>
                  {status === 'completed' && (
                    <span className="text-xs text-success-600 font-medium">
                      Complete
                    </span>
                  )}
                </div>
                
                <p className={`text-sm mt-1 ${
                  status === 'current' ? 'text-primary-700' : 
                  status === 'completed' ? 'text-success-700' : 
                  'text-neutral-500'
                }`}>
                  {step.description}
                </p>
                
                {progress && status !== 'upcoming' && (
                  <p className={`text-xs mt-2 font-medium ${
                    status === 'current' ? 'text-primary-600' : 
                    'text-neutral-600'
                  }`}>
                    {progress}
                  </p>
                )}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}