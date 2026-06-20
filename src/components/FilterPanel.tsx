import { useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import { useFridgeMagnetStore } from '@/store/useFridgeMagnetStore';
import { MATERIALS, CATEGORIES, DISPLAY_STATUSES } from '@/types';
import type { Material, FridgeMagnetCategory, DisplayStatus, FilterOptions } from '@/types';

export default function FilterPanel() {
  const filters = useFridgeMagnetStore((s) => s.filters);
  const magnets = useFridgeMagnetStore((s) => s.magnets);
  const setFilters = useFridgeMagnetStore((s) => s.setFilters);
  const resetFilters = useFridgeMagnetStore((s) => s.resetFilters);

  const years = useMemo(() => {
    const yearSet = new Set(magnets.map((m) => new Date(m.purchaseDate).getFullYear()));
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [magnets]);

  const hasActiveFilters: boolean =
    filters.material !== '全部' ||
    filters.category !== '全部' ||
    filters.year !== '全部' ||
    filters.displayStatus !== '全部';

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-terracotta-500" />
          <h3 className="font-display font-semibold text-ink-800">筛选收藏</h3>
        </div>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="text-xs text-ink-500 hover:text-terracotta-500 flex items-center gap-1 transition-colors">
            <X className="w-3 h-3" />
            清除筛选
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="label-text text-xs text-ink-500">材质</label>
          <select
            className="select-field text-sm"
            value={filters.material}
            onChange={(e) => setFilters({ material: e.target.value as Material | '全部' })}
          >
            <option value="全部">全部材质</option>
            {MATERIALS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-text text-xs text-ink-500">类型</label>
          <select
            className="select-field text-sm"
            value={filters.category}
            onChange={(e) => setFilters({ category: e.target.value as FridgeMagnetCategory | '全部' })}
          >
            <option value="全部">全部类型</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-text text-xs text-ink-500">年份</label>
          <select
            className="select-field text-sm"
            value={filters.year.toString()}
            onChange={(e) => setFilters({ year: e.target.value === '全部' ? '全部' : parseInt(e.target.value) })}
          >
            <option value="全部">全部年份</option>
            {years.map((y) => (
              <option key={y} value={y}>{y} 年</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-text text-xs text-ink-500">展示状态</label>
          <select
            className="select-field text-sm"
            value={filters.displayStatus}
            onChange={(e) => setFilters({ displayStatus: e.target.value as DisplayStatus | '全部' })}
          >
            <option value="全部">全部状态</option>
            {DISPLAY_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
