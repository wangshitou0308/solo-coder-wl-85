import { useMemo } from 'react';
import { Globe2, MapPin, Layers, Wallet } from 'lucide-react';
import { useFridgeMagnetStore } from '@/store/useFridgeMagnetStore';

export default function StatisticsPanel() {
  const magnets = useFridgeMagnetStore((s) => s.magnets);

  const stats = useMemo(() => {
    const countries = new Set(magnets.map((m) => m.country));
    const cities = new Set(magnets.map((m) => `${m.country}-${m.city}`));
    const totalCost = magnets.reduce((sum, m) => {
      if (m.currency === 'CNY') return sum + m.price;
      if (m.currency === 'EUR') return sum + m.price * 7.8;
      if (m.currency === 'JPY') return sum + m.price * 0.047;
      if (m.currency === 'GBP') return sum + m.price * 9.2;
      if (m.currency === 'MXN') return sum + m.price * 0.38;
      return sum + m.price;
    }, 0);
    return {
      totalCount: magnets.length,
      countryCount: countries.size,
      cityCount: cities.size,
      totalCost: Math.round(totalCost * 100) / 100,
    };
  }, [magnets]);

  const statItems = [
    {
      label: '藏品总数',
      value: stats.totalCount,
      unit: '枚',
      icon: Layers,
      color: 'bg-terracotta-50 text-terracotta-600',
      ringColor: 'ring-terracotta-100',
    },
    {
      label: '覆盖国家',
      value: stats.countryCount,
      unit: '个',
      icon: Globe2,
      color: 'bg-sage-50 text-sage-600',
      ringColor: 'ring-sage-100',
    },
    {
      label: '到访城市',
      value: stats.cityCount,
      unit: '座',
      icon: MapPin,
      color: 'bg-cream-200 text-ink-700',
      ringColor: 'ring-cream-300',
    },
    {
      label: '累计花费',
      value: stats.totalCost.toLocaleString(),
      unit: 'CNY',
      icon: Wallet,
      color: 'bg-ink-100 text-ink-700',
      ringColor: 'ring-ink-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div key={item.label} className="card p-5 hover:shadow-card transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-ink-500 uppercase tracking-wider">{item.label}</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold text-ink-800">{item.value}</span>
                <span className="text-sm text-ink-500">{item.unit}</span>
              </div>
            </div>
            <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center ring-4 ${item.ringColor}`}>
              <item.icon className="w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
