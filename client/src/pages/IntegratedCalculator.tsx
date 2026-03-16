import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import KuseJointDevelopment from './KuseJointDevelopment';
import Home from './Home';

export default function IntegratedCalculator() {
  const [activeTab, setActiveTab] = useState('joint-development');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* 頁籤導航 */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('joint-development')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'joint-development'
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            建設公司收益評估（合建）
          </button>
          <button
            onClick={() => setActiveTab('tax-calculation')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'tax-calculation'
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            營建雙平台資金缺口與稅務套利試算
          </button>
        </div>

        {/* 頁籤內容 */}
        <div>
          {activeTab === 'joint-development' && (
            <div>
              <KuseJointDevelopment />
            </div>
          )}
          {activeTab === 'tax-calculation' && (
            <div>
              <Home />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
