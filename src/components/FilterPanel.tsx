import { useMemo } from 'react';
import { Filter, X, Search, ArrowUpDown, Gem, MapPin, FileText, Image, CircleDollarSign } from 'lucide-react';
import { useFridgeMagnetStore } from '@/store/useFridgeMagnetStore';
import { MATERIALS, CATEGORIES, DISPLAY_STATUSES, SORT_OPTIONS } from '@/types';
import type { Material, FridgeMagnetCategory, DisplayStatus, FilterOptions, SortOption } from '@/types';
import { cn } from '@/lib/utils';

export default function FilterPanel() {
  const filters = useFridgeMagnetStore((s) => s.filters);
  const sortOption = useFridgeMagnetStore((s) => s.sortOption);
  const magnets = useFridgeMagnetStore((s) => s.magnets);
  const setFilters = useFridgeMagnetStore((s) => s.setFilters);
  const resetFilters = useFridgeMagnetStore((s) => s.resetFilters);
  const setSortOption = useFridgeMagnetStore((s) => s.setSortOption);

  const years = useMemo(() => {
    const yearSet = new Set(magnets.map((m) => new Date(m.purchaseDate).getFullYear()));
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [magnets]);

  const missingInfoCounts = useMemo(() => {
    return {
      noCoordinates: magnets.filter((m) => !m.coordinates).length,
      noStory: magnets.filter((m) => !m.story.trim()).length,
      noSideImage: magnets.filter((m) => !m.sideImage).length,
      zeroPrice: magnets.filter((m) => m.price === 0).length,
    };
  }, [magnets]);

  const hasActiveFilters: boolean =
    filters.material !== '全部' ||
    filters.category !== '全部' ||
    filters.year !== '全部' ||
    filters.displayStatus !== '全部' ||
    filters.searchQuery !== '' ||
    filters.missingInfo !== 'none' ||
    filters.isTreasureOnly;

  const missingInfoOptions = [
    { value: 'none', label: '全部', icon: null, count: null },
    {
      value: 'noCoordinates',
      label: '无坐标',
      icon: MapPin,
      count: missingInfoCounts.noCoordinates,
    },
    {
      value: 'noStory',
      label: '无故事',
      icon: FileText,
      count: missingInfoCounts.noStory,
    },
    {
      value: 'noSideImage',
      label: '无侧面图',
      icon: Image,
      count: missingInfoCounts.noSideImage,
    },
    {
      value: 'zeroPrice',
      label: '价格为零',
      icon: CircleDollarSign,
      count: missingInfoCounts.zeroPrice,
    },
  ] as const;

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-terracotta-500" />
          <h3 className="font-display font-semibold text-ink-800">筛选与搜索</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-ink-500 hover:text-terracotta-500 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            清除筛选
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <input
          type="text"
          className="input-field pl-10"
          placeholder="搜索名称、国家、城市、故事、标签..."
          value={filters.searchQuery}
          onChange={(e) => setFilters({ searchQuery: e.target.value })}
        />
        {filters.searchQuery && (
          <button
            onClick={() => setFilters({ searchQuery: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-ink-500">
          <ArrowUpDown className="w-4 h-4" />
          <span className="text-xs">排序：</span>
        </div>
        <select
          className="select-field text-sm flex-1"
          value={sortOption.field}
          onChange={(e) =>
            setSortOption({
              ...sortOption,
              field: e.target.value as SortOption['field'],
            })
          }
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          onClick={() =>
            setSortOption({
              ...sortOption,
              direction: sortOption.direction === 'asc' ? 'desc' : 'asc',
            })
          }
          className={cn(
            'px-3 py-2 rounded-lg border border-ink-200 text-sm transition-colors',
            sortOption.direction === 'desc'
              ? 'bg-terracotta-50 text-terracotta-600 border-terracotta-200'
              : 'bg-white text-ink-600 hover:bg-ink-50'
          )}
          title={sortOption.direction === 'desc' ? '降序' : '升序'}
        >
          {sortOption.direction === 'desc' ? '↓' : '↑'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="label-text text-xs text-ink-500">材质</label>
          <select
            className="select-field text-sm"
            value={filters.material}
            onChange={(e) =>
              setFilters({ material: e.target.value as Material | '全部' })
            }
          >
            <option value="全部">全部材质</option>
            {MATERIALS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-text text-xs text-ink-500">类型</label>
          <select
            className="select-field text-sm"
            value={filters.category}
            onChange={(e) =>
              setFilters({ category: e.target.value as FridgeMagnetCategory | '全部' })
            }
          >
            <option value="全部">全部类型</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-text text-xs text-ink-500">年份</label>
          <select
            className="select-field text-sm"
            value={filters.year.toString()}
            onChange={(e) =>
              setFilters({
                year: e.target.value === '全部' ? '全部' : parseInt(e.target.value),
              })
            }
          >
            <option value="全部">全部年份</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y} 年
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-text text-xs text-ink-500">展示状态</label>
          <select
            className="select-field text-sm"
            value={filters.displayStatus}
            onChange={(e) =>
              setFilters({ displayStatus: e.target.value as DisplayStatus | '全部' })
            }
          >
            <option value="全部">全部状态</option>
            {DISPLAY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2">
        <button
          onClick={() => setFilters({ isTreasureOnly: !filters.isTreasureOnly })}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            filters.isTreasureOnly
              ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
              : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
          )}
        >
          <Gem className={cn('w-3.5 h-3.5', filters.isTreasureOnly && 'fill-amber-500')} />
          仅显示珍藏
        </button>

        {missingInfoOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() =>
              setFilters({
                missingInfo: filters.missingInfo === opt.value ? 'none' : opt.value,
              })
            }
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              filters.missingInfo === opt.value
                ? 'bg-terracotta-100 text-terracotta-700 ring-1 ring-terracotta-300'
                : 'bg-ink-50 text-ink-600 hover:bg-ink-100',
              opt.value !== 'none' && opt.count === 0 && 'opacity-50 cursor-not-allowed'
            )}
            disabled={opt.value !== 'none' && opt.count === 0}
          >
            {opt.icon && <opt.icon className="w-3.5 h-3.5" />}
            {opt.label}
            {opt.count !== null && opt.count > 0 && (
              <span className="px-1.5 py-0.5 bg-ink-200/50 rounded-full text-[10px]">
                {opt.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
