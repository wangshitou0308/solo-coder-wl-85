import { useState, useMemo } from 'react';
import { Download, FileJson, FileText, ChevronDown } from 'lucide-react';
import { useFridgeMagnetStore } from '@/store/useFridgeMagnetStore';
import { calculateTotalCNY } from '@/utils/currency';
import PrintView from './PrintView';

export default function ExportPanel() {
  const magnets = useFridgeMagnetStore((s) => s.magnets);
  const filters = useFridgeMagnetStore((s) => s.filters);

  const [open, setOpen] = useState(false);
  const [useFiltered, setUseFiltered] = useState(true);
  const [showPrintView, setShowPrintView] = useState(false);

  const filteredMagnets = useMemo(() => {
    return magnets.filter((m) => {
      if (filters.material !== '全部' && m.material !== filters.material) return false;
      if (filters.category !== '全部' && m.category !== filters.category) return false;
      if (filters.year !== '全部') {
        const year = new Date(m.purchaseDate).getFullYear();
        if (year !== filters.year) return false;
      }
      if (filters.displayStatus !== '全部' && m.displayStatus !== filters.displayStatus)
        return false;
      return true;
    });
  }, [magnets, filters]);

  const sourceMagnets = useFiltered ? filteredMagnets : magnets;

  const stats = useMemo(() => {
    const countries = new Set(sourceMagnets.map((m) => m.country));
    const cities = new Set(sourceMagnets.map((m) => `${m.country}-${m.city}`));
    const totalCost = calculateTotalCNY(sourceMagnets);
    return {
      totalCount: sourceMagnets.length,
      countryCount: countries.size,
      cityCount: cities.size,
      totalCost,
      currency: 'CNY',
    };
  }, [sourceMagnets]);

  const exportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      statistics: stats,
      magnets: sourceMagnets,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `冰箱贴收藏_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    setShowPrintView(true);
    setOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="btn-secondary gap-2"
        >
          <Download className="w-4 h-4" />
          导出
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-72 card z-20 overflow-hidden animate-[fadeIn_0.15s_ease-out]">
            <div className="p-3 border-b border-ink-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useFiltered}
                  onChange={(e) => setUseFiltered(e.target.checked)}
                  className="w-4 h-4 rounded border-ink-300 text-terracotta-500 focus:ring-terracotta-300"
                />
                <span className="text-sm text-ink-700">仅导出筛选结果</span>
                <span className="ml-auto chip bg-ink-100 text-ink-600">
                  {sourceMagnets.length} 枚
                </span>
              </label>
            </div>

            <div className="p-2">
              <button
                onClick={() => { exportJSON(); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cream-50 text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-sage-50 flex items-center justify-center">
                  <FileJson className="w-4 h-4 text-sage-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-800">JSON 备份</p>
                  <p className="text-xs text-ink-500">完整数据，可用于恢复导入</p>
                </div>
              </button>

              <button
                onClick={exportPDF}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cream-50 text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-terracotta-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-terracotta-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-800">PDF 清单</p>
                  <p className="text-xs text-ink-500">可视化打印清单</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {showPrintView && (
        <PrintView magnets={sourceMagnets} onClose={() => setShowPrintView(false)} />
      )}
    </>
  );
}
