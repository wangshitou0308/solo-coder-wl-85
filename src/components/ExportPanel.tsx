import { useState, useMemo } from 'react';
import { Download, FileJson, FileText, ChevronDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useFridgeMagnetStore } from '@/store/useFridgeMagnetStore';

export default function ExportPanel() {
  const magnets = useFridgeMagnetStore((s) => s.magnets);
  const filters = useFridgeMagnetStore((s) => s.filters);

  const [open, setOpen] = useState(false);
  const [useFiltered, setUseFiltered] = useState(true);
  const [exporting, setExporting] = useState(false);

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
    const totalCost = sourceMagnets.reduce((sum, m) => {
      if (m.currency === 'CNY') return sum + m.price;
      if (m.currency === 'EUR') return sum + m.price * 7.8;
      if (m.currency === 'JPY') return sum + m.price * 0.047;
      if (m.currency === 'GBP') return sum + m.price * 9.2;
      if (m.currency === 'MXN') return sum + m.price * 0.38;
      return sum + m.price;
    }, 0);
    return {
      totalCount: sourceMagnets.length,
      countryCount: countries.size,
      cityCount: cities.size,
      totalCost: Math.round(totalCost * 100) / 100,
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

  const exportPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let y = margin;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('Fridge Magnet Collection', pageWidth / 2, y, { align: 'center' });
      y += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text(`Exported on ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: 'center' });
      y += 10;

      doc.setFillColor(253, 248, 240);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 25, 3, 3, 'F');
      doc.setFontSize(11);
      doc.setTextColor(32, 31, 34);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total: ${stats.totalCount} pieces`, margin + 5, y + 10);
      doc.text(`Countries: ${stats.countryCount}`, margin + 50, y + 10);
      doc.text(`Cities: ${stats.cityCount}`, margin + 95, y + 10);
      doc.text(`Total Cost: ${stats.currency} ${stats.totalCost}`, margin + 140, y + 10);
      y += 35;

      const itemsPerPage = 4;
      const cardWidth = (pageWidth - margin * 2 - 5) / 2;
      const cardHeight = 60;

      for (let i = 0; i < sourceMagnets.length; i++) {
        if (i > 0 && i % itemsPerPage === 0) {
          doc.addPage();
          y = margin;
        }

        const col = i % 2;
        const row = Math.floor((i % itemsPerPage) / 2);
        const x = margin + col * (cardWidth + 5);
        const cardY = y + row * (cardHeight + 5);

        doc.setDrawColor(230, 230, 230);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(x, cardY, cardWidth, cardHeight, 3, 3, 'FD');

        try {
          const imgData = sourceMagnets[i].frontImage;
          if (imgData.startsWith('data:image')) {
            const imgType = imgData.includes('png') ? 'PNG' : 'JPEG';
            doc.addImage(imgData, imgType, x + 4, cardY + 4, 22, 22, undefined, 'FAST');
          }
        } catch {
          doc.setFillColor(245, 245, 245);
          doc.roundedRect(x + 4, cardY + 4, 22, 22, 2, 2, 'F');
        }

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(32, 31, 34);
        const name = sourceMagnets[i].name.length > 14
          ? sourceMagnets[i].name.substring(0, 14) + '...'
          : sourceMagnets[i].name;
        doc.text(name, x + 30, cardY + 12);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 106, 107);
        doc.text(`${sourceMagnets[i].country} · ${sourceMagnets[i].city}`, x + 30, cardY + 18);
        doc.text(`${sourceMagnets[i].material} · ${sourceMagnets[i].category}`, x + 30, cardY + 23);
        doc.text(sourceMagnets[i].purchaseDate, x + 30, cardY + 28);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(212, 95, 58);
        doc.text(`${sourceMagnets[i].currency} ${sourceMagnets[i].price}`, x + 4, cardY + 34);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 106, 107);
        doc.text(
          `${sourceMagnets[i].width}x${sourceMagnets[i].height}cm | ${sourceMagnets[i].displayStatus}`,
          x + 40,
          cardY + 34
        );

        if (sourceMagnets[i].story) {
          doc.setFontSize(7);
          doc.setTextColor(80, 80, 80);
          const story = sourceMagnets[i].story.length > 80
            ? sourceMagnets[i].story.substring(0, 80) + '...'
            : sourceMagnets[i].story;
          const splitStory = doc.splitTextToSize(story, cardWidth - 8);
          doc.text(splitStory, x + 4, cardY + 42);
        }

        if (i === sourceMagnets.length - 1 || (i + 1) % itemsPerPage === 0) {
          y = cardY + cardHeight + 5;
        }
      }

      doc.save(`冰箱贴收藏_${new Date().toISOString().split('T')[0]}.pdf`);
    } finally {
      setExporting(false);
    }
  };

  return (
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
              onClick={() => { exportPDF(); setOpen(false); }}
              disabled={exporting}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cream-50 text-left transition-colors disabled:opacity-50"
            >
              <div className="w-9 h-9 rounded-lg bg-terracotta-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-terracotta-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink-800">
                  {exporting ? '生成中...' : 'PDF 清单'}
                </p>
                <p className="text-xs text-ink-500">可视化打印清单</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
