import { useMemo } from 'react';
import { Calendar, MapPin, Star, Gem } from 'lucide-react';
import { useFridgeMagnetStore } from '@/store/useFridgeMagnetStore';
import type { FridgeMagnet } from '@/types';
import { cn } from '@/lib/utils';

interface TimelineViewProps {
  onMagnetClick: (magnet: FridgeMagnet) => void;
}

export default function TimelineView({ onMagnetClick }: TimelineViewProps) {
  const getFilteredMagnets = useFridgeMagnetStore((s) => s.getFilteredMagnets);
  const getSortedMagnets = useFridgeMagnetStore((s) => s.getSortedMagnets);
  const getMagnetsByYearMonth = useFridgeMagnetStore((s) => s.getMagnetsByYearMonth);

  const sortedMagnets = useMemo(() => {
    return getSortedMagnets(getFilteredMagnets());
  }, [getFilteredMagnets, getSortedMagnets]);

  const magnetsByMonth = useMemo(() => {
    return getMagnetsByYearMonth();
  }, [getMagnetsByYearMonth]);

  const sortedMonths = useMemo(() => {
    return Object.keys(magnetsByMonth).sort((a, b) => b.localeCompare(a));
  }, [magnetsByMonth]);

  const getMonthName = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
  };

  if (sortedMagnets.length === 0) {
    return (
      <div className="card p-16 text-center">
        <Calendar className="w-16 h-16 mx-auto text-ink-200 mb-4" />
        <h3 className="font-display text-xl font-semibold text-ink-700 mb-2">
          暂无数据
        </h3>
        <p className="text-ink-500">没有符合筛选条件的藏品</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg text-ink-800">
          收藏时间线
          <span className="ml-2 text-sm font-normal text-ink-500">
            共 {sortedMagnets.length} 枚
          </span>
        </h2>
        <div className="text-sm text-ink-500">
          {sortedMonths.length} 个月 · {new Set(sortedMonths.map((m) => m.split('-')[0])).size} 年
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-ink-100" />

        {sortedMonths.map((yearMonth, monthIndex) => {
          const monthMagnets = magnetsByMonth[yearMonth];
          const [year, month] = yearMonth.split('-');
          const isNewYear =
            monthIndex === 0 || sortedMonths[monthIndex - 1].split('-')[0] !== year;

          return (
            <div key={yearMonth} className="relative">
              {isNewYear && (
                <div className="sticky top-0 z-10 py-4 -mx-4 px-4 bg-gradient-to-b from-cream-50 to-transparent">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta-500 text-white rounded-full shadow-md">
                    <Calendar className="w-4 h-4" />
                    <span className="font-display font-semibold">{year} 年</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 pl-4 mb-8 mt-4">
                <div className="relative z-10 w-8 h-8 rounded-full bg-white border-4 border-terracotta-500 flex items-center justify-center shadow-md shrink-0">
                  <span className="text-xs font-bold text-terracotta-600">
                    {parseInt(month)}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-display font-semibold text-ink-700">
                      {getMonthName(yearMonth)}
                    </h3>
                    <span className="chip bg-ink-100 text-ink-600">
                      {monthMagnets.length} 枚
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {monthMagnets.map((magnet) => (
                      <div
                        key={magnet.id}
                        onClick={() => onMagnetClick(magnet)}
                        className="card group cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-1 overflow-hidden"
                      >
                        <div className="relative h-32 bg-cream-100 overflow-hidden">
                          <img
                            src={magnet.frontImage}
                            alt={magnet.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                            {magnet.isTreasure && (
                              <span className="chip bg-amber-400 text-white text-[10px] px-1.5 py-0.5">
                                <Gem className="w-2.5 h-2.5 mr-0.5" />
                                珍藏
                              </span>
                            )}
                          </div>
                          <div className="absolute bottom-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-ink-900/60 rounded-full">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  'w-2.5 h-2.5',
                                  star <= magnet.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-ink-300'
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-display font-semibold text-ink-800 text-sm mb-1">
                            {magnet.name}
                          </h4>
                          <div className="flex items-center gap-1 text-xs text-ink-500">
                            <MapPin className="w-3 h-3 text-terracotta-400" />
                            <span>
                              {magnet.country} · {magnet.city}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-ink-50">
                            <span className="text-xs text-ink-500">
                              {magnet.purchaseDate}
                            </span>
                            <span className="text-sm font-semibold text-terracotta-600 font-display">
                              {magnet.currency} {magnet.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
