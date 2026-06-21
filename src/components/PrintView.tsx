import { useEffect } from 'react';
import { calculateTotalCNY, formatPrice, CURRENCY_NAMES } from '@/utils/currency';
import type { FridgeMagnet } from '@/types';

interface PrintViewProps {
  magnets: FridgeMagnet[];
  onClose: () => void;
}

export default function PrintView({ magnets, onClose }: PrintViewProps) {
  const stats = {
    totalCount: magnets.length,
    countryCount: new Set(magnets.map((m) => m.country)).size,
    cityCount: new Set(magnets.map((m) => `${m.country}-${m.city}`)).size,
    totalCost: calculateTotalCNY(magnets),
  };

  const sortedMagnets = [...magnets].sort((a, b) =>
    new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    const handleAfterPrint = () => {
      onClose();
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-white print:bg-white">
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-only {
            display: block !important;
          }
          .no-print {
            display: none !important;
          }
        }
        @media screen {
          .print-only {
            display: none;
          }
        }
      `}</style>

      <div className="no-print fixed top-4 right-4 z-50">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-ink-800 text-white rounded-lg hover:bg-ink-700 transition-colors"
        >
          关闭预览
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-8 print:p-0">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-ink-800 mb-2">
            冰箱贴收藏册
          </h1>
          <p className="text-ink-500 text-sm">
            导出日期：{new Date().toLocaleDateString('zh-CN')}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-cream-100 rounded-lg p-4 text-center">
            <div className="font-display text-2xl font-semibold text-ink-800">{stats.totalCount}</div>
            <div className="text-xs text-ink-500">藏品总数（枚）</div>
          </div>
          <div className="bg-sage-50 rounded-lg p-4 text-center">
            <div className="font-display text-2xl font-semibold text-sage-700">{stats.countryCount}</div>
            <div className="text-xs text-ink-500">覆盖国家（个）</div>
          </div>
          <div className="bg-terracotta-50 rounded-lg p-4 text-center">
            <div className="font-display text-2xl font-semibold text-terracotta-600">{stats.cityCount}</div>
            <div className="text-xs text-ink-500">到访城市（座）</div>
          </div>
          <div className="bg-ink-50 rounded-lg p-4 text-center">
            <div className="font-display text-2xl font-semibold text-ink-700">¥{stats.totalCost.toLocaleString()}</div>
            <div className="text-xs text-ink-500">累计花费（CNY）</div>
          </div>
        </div>

        <div className="space-y-6">
          {sortedMagnets.map((magnet, index) => (
            <div
              key={magnet.id}
              className="flex gap-4 p-4 border border-cream-200 rounded-lg break-inside-avoid"
              style={{ breakInside: 'avoid' }}
            >
              <img
                src={magnet.frontImage}
                alt={magnet.name}
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0 bg-cream-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIGZpbGw9IiNGRkY4RjAiLz48dGV4dCB4PSI0OCIgeT0iNTIiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5Zu+54mILTwvdGV4dD48L3N2Zz4=';
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-semibold text-ink-800 mb-1">
                  {index + 1}. {magnet.name}
                </h3>
                <div className="grid grid-cols-2 gap-1 text-sm text-ink-600">
                  <p><span className="text-ink-400">地点：</span>{magnet.country} · {magnet.city}</p>
                  <p><span className="text-ink-400">日期：</span>{magnet.purchaseDate}</p>
                  <p><span className="text-ink-400">材质：</span>{magnet.material}</p>
                  <p><span className="text-ink-400">类型：</span>{magnet.category}</p>
                  <p><span className="text-ink-400">尺寸：</span>{magnet.width} × {magnet.height} cm</p>
                  <p>
                    <span className="text-ink-400">价格：</span>
                    {formatPrice(magnet.price, magnet.currency)}
                    <span className="text-ink-400 text-xs ml-1">
                      （{CURRENCY_NAMES[magnet.currency] || magnet.currency}）
                    </span>
                  </p>
                  <p className="col-span-2"><span className="text-ink-400">状态：</span>{magnet.displayStatus}</p>
                </div>
                {magnet.story && (
                  <p className="mt-2 text-sm text-ink-500 italic line-clamp-2">
                    "{magnet.story}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-cream-200 text-center text-xs text-ink-400">
          冰箱贴收藏册 - 记录每一段旅行的温度
        </div>
      </div>
    </div>
  );
}
