'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Check, Settings, TrendingUp, Mountain } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode);
  };

  const handleStartTool = () => {
    if (selectedMode === 'quick') {
      router.push('/quick-check');
    } else if (selectedMode === 'build') {
      router.push('/build');
    } else if (selectedMode === 'analyze') {
      router.push('/analyze');
    }
  };

  const modes = [
    {
      id: 'quick',
      title: 'Quick Compatibility Check',
      description: 'Verify component compatibility and get basic gear ratio analysis',
      icon: <Check className="w-8 h-8" />,
      color: 'bg-success-500',
      hoverColor: 'hover:bg-success-600',
      borderColor: 'border-success-200',
      textColor: 'text-success-700',
      features: ['Component compatibility verification', 'Basic gear ratio calculation', 'Compatibility warnings']
    },
    {
      id: 'build',
      title: 'Build Custom Setup',
      description: 'Design your drivetrain from scratch with guided component selection',
      icon: <Settings className="w-8 h-8" />,
      color: 'bg-primary-600',
      hoverColor: 'hover:bg-primary-700',
      borderColor: 'border-primary-200',
      textColor: 'text-primary-700',
      features: ['Step-by-step component selection', 'Real-time compatibility checking', 'Performance optimization suggestions']
    },
    {
      id: 'analyze',
      title: 'Advanced Analysis',
      description: 'Deep dive into gear ratios, chain line, and performance optimization',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'bg-tool-orange',
      hoverColor: 'hover:bg-orange-600',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      features: ['Comprehensive gear ratio analysis', 'Chain line calculations', 'Performance metrics and recommendations']
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white shadow-tool border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-neutral-900">CrankSmith</h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-neutral-600 hover:text-neutral-900">Tools</a>
                <a href="#" className="text-neutral-600 hover:text-neutral-900">Database</a>
                <a href="#" className="text-neutral-600 hover:text-neutral-900">About</a>
              </nav>
            </div>
            <div className="text-sm text-neutral-500">
              v4.0 Beta
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Mountain className="w-16 h-16 text-primary-200" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Never Buy Incompatible Parts Again
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Check component compatibility, analyze gear ratios, and build the perfect drivetrain 
              with the most comprehensive cycling database ever created.
            </p>
            <div className="text-sm text-primary-200">
              10,000+ verified components • Real compatibility checking • Pro-level analysis
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Choose Your Tool
          </h2>
          <p className="text-lg text-neutral-600">
            Select the right tool for your needs, from quick checks to detailed analysis
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {modes.map((mode) => (
            <div
              key={mode.id}
              className={`card cursor-pointer transition-all duration-200 ${
                selectedMode === mode.id 
                  ? `border-2 ${mode.borderColor} shadow-lg transform scale-105` 
                  : 'hover:shadow-lg hover:scale-102'
              }`}
              onClick={() => handleModeSelect(mode.id)}
            >
              <div className="text-center">
                <div className={`inline-flex p-4 rounded-full ${mode.color} text-white mb-4`}>
                  {mode.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {mode.title}
                </h3>
                <p className="text-neutral-600 mb-6">
                  {mode.description}
                </p>
                <ul className="space-y-2 text-sm text-neutral-600">
                  {mode.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Start Button */}
        {selectedMode && (
          <div className="text-center">
            <button
              onClick={handleStartTool}
              className="btn-primary text-lg px-8 py-3 rounded-lg inline-flex items-center space-x-2"
            >
              <span>Start {modes.find(m => m.id === selectedMode)?.title}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-neutral-800 text-neutral-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm">
              CrankSmith 4.0 - Built for cyclists, by cyclists
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}