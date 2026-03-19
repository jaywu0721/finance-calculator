import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import KuseJointDevelopment from './KuseJointDevelopment';
import Home from './Home';

export default function IntegratedCalculator() {
  const [activeTab, setActiveTab] = useState('joint-development');
  const [paperSize, setPaperSize] = useState<'a4' | 'a3'>('a4');

  useEffect(() => {
    // 從 localStorage 讀取用戶的紙張選擇
    const saved = localStorage.getItem('printPaperSize');
    if (saved === 'a3' || saved === 'a4') {
      setPaperSize(saved);
    }
  }, []);

  const handlePaperSizeChange = (size: 'a4' | 'a3') => {
    setPaperSize(size);
    localStorage.setItem('printPaperSize', size);
  };

  return (
    <div className="min-h-screen bg-background text-foreground" data-paper-size={paperSize}>
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 print:px-0 print:py-0">
        {/* 紙張大小選擇 - 列印時隱藏 */}
        <div className="flex gap-2 mb-4 print:hidden">
          <label className="text-sm font-semibold">列印紙張大小：</label>
          <button
            onClick={() => handlePaperSizeChange('a4')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              paperSize === 'a4'
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            A4
          </button>
          <button
            onClick={() => handlePaperSizeChange('a3')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              paperSize === 'a3'
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            A3
          </button>
        </div>

        {/* 頁籤導航 - 列印時隱藏 */}
        <div className="flex gap-2 mb-6 border-b border-border print:hidden">
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
            營建雙平台資金缺口與稅務規劃試算
          </button>
        </div>

        {/* 頁籤內容 - 使用 display 切換而非條件渲染，保留已輸入的數值 */}
        <div
          style={{ display: activeTab === 'joint-development' ? 'block' : 'none' }}
          className="print-content"
        >
          <KuseJointDevelopment />
        </div>
        <div
          style={{ display: activeTab === 'tax-calculation' ? 'block' : 'none' }}
          className="print-content"
        >
          <Home />
        </div>
      </div>
    </div>
  );
}
