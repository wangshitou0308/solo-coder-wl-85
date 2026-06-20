import { useState, useMemo } from 'react';
import { ChevronRight, MapPin, ChevronDown, Globe2 } from 'lucide-react';
import { useFridgeMagnetStore } from '@/store/useFridgeMagnetStore';
import type { FridgeMagnet } from '@/types';

interface CountryCityBrowserProps {
  onMagnetClick: (magnet: FridgeMagnet) => void;
}

export default function CountryCityBrowser({ onMagnetClick }: CountryCityBrowserProps) {
  const magnets = useFridgeMagnetStore((s) => s.magnets);
  const filters = useFridgeMagnetStore((s) => s.filters);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);

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

  const magnetsByCountry = useMemo(() => {
    const result: Record<string, FridgeMagnet[]> = {};
    filteredMagnets.forEach((m) => {
      if (!result[m.country]) result[m.country] = [];
      result[m.country].push(m);
    });
    return result;
  }, [filteredMagnets]);

  const filteredCountries = useMemo(() => {
    return Object.entries(magnetsByCountry)
      .map(([country, countryMagnets]) => ({ country, magnets: countryMagnets }))
      .sort((a, b) => b.magnets.length - a.magnets.length);
  }, [magnetsByCountry]);

  const getCitiesForCountry = (country: string) => {
    const result: Record<string, FridgeMagnet[]> = {};
    filteredMagnets
      .filter((m) => m.country === country)
      .forEach((m) => {
        if (!result[m.city]) result[m.city] = [];
        result[m.city].push(m);
      });
    return result;
  };

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-ink-100 bg-gradient-to-r from-cream-50 to-white">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-terracotta-500" />
          <h3 className="font-display font-semibold text-ink-800">按国家/城市浏览</h3>
          <span className="chip bg-ink-100 text-ink-600 ml-auto">
            {filteredCountries.length} 个国家
          </span>
        </div>
      </div>

      <div className="divide-y divide-ink-50 max-h-[600px] overflow-y-auto">
        {filteredCountries.length === 0 ? (
          <div className="p-8 text-center text-ink-400 text-sm">暂无匹配的收藏</div>
        ) : (
          filteredCountries.map(({ country, magnets: countryMagnets }) => {
            const isCountryExpanded = expandedCountry === country;
            const cities = getCitiesForCountry(country);
            const filteredCities = Object.entries(cities)
              .map(([city, cityMagnets]) => ({ city, magnets: cityMagnets }))
              .filter((item) => item.magnets.length > 0);

            return (
              <div key={country}>
                <button
                  onClick={() => setExpandedCountry(isCountryExpanded ? null : country)}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-cream-50/50 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-terracotta-50 flex items-center justify-center shrink-0">
                    <span className="text-lg">{getCountryFlag(country)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink-800">{country}</p>
                    <p className="text-xs text-ink-500">
                      {filteredCities.length} 座城市 · {countryMagnets.length} 枚
                    </p>
                  </div>
                  {isCountryExpanded ? (
                    <ChevronDown className="w-4 h-4 text-ink-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-ink-400" />
                  )}
                </button>

                {isCountryExpanded && (
                  <div className="bg-cream-50/40 border-t border-ink-50">
                    {filteredCities.map(({ city, magnets: cityMagnets }) => {
                      const cityKey = `${country}-${city}`;
                      const isCityExpanded = expandedCity === cityKey;

                      return (
                        <div key={city}>
                          <button
                            onClick={() => setExpandedCity(isCityExpanded ? null : cityKey)}
                            className="w-full px-5 py-3 pl-14 flex items-center gap-3 hover:bg-white transition-colors text-left"
                          >
                            <MapPin className="w-4 h-4 text-terracotta-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-ink-700">{city}</p>
                              <p className="text-xs text-ink-500">{cityMagnets.length} 枚冰箱贴</p>
                            </div>
                            <div className="flex -space-x-2">
                              {cityMagnets.slice(0, 3).map((m) => (
                                <img
                                  key={m.id}
                                  src={m.frontImage}
                                  alt={m.name}
                                  className="w-7 h-7 rounded-lg border-2 border-white object-cover shadow-sm"
                                />
                              ))}
                              {cityMagnets.length > 3 && (
                                <div className="w-7 h-7 rounded-lg border-2 border-white bg-ink-200 flex items-center justify-center text-[10px] font-medium text-ink-600">
                                  +{cityMagnets.length - 3}
                                </div>
                              )}
                            </div>
                            {isCityExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-ink-400" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-ink-400" />
                            )}
                          </button>

                          {isCityExpanded && (
                            <div className="px-5 pb-4 pl-14 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                              {cityMagnets.map((magnet) => (
                                <button
                                  key={magnet.id}
                                  onClick={() => onMagnetClick(magnet)}
                                  className="group aspect-square rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                >
                                  <img
                                    src={magnet.frontImage}
                                    alt={magnet.name}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function getCountryFlag(country: string): string {
  const flagMap: Record<string, string> = {
    '中国': '🇨🇳',
    '法国': '🇫🇷',
    '日本': '🇯🇵',
    '意大利': '🇮🇹',
    '英国': '🇬🇧',
    '美国': '🇺🇸',
    '墨西哥': '🇲🇽',
    '韩国': '🇰🇷',
    '德国': '🇩🇪',
    '西班牙': '🇪🇸',
    '泰国': '🇹🇭',
    '新加坡': '🇸🇬',
    '澳大利亚': '🇦🇺',
    '加拿大': '🇨🇦',
    '瑞士': '🇨🇭',
    '荷兰': '🇳🇱',
    '比利时': '🇧🇪',
    '奥地利': '🇦🇹',
    '葡萄牙': '🇵🇹',
    '希腊': '🇬🇷',
    '土耳其': '🇹🇷',
    '印度': '🇮🇳',
    '越南': '🇻🇳',
    '马来西亚': '🇲🇾',
    '印度尼西亚': '🇮🇩',
    '菲律宾': '🇵🇭',
    '俄罗斯': '🇷🇺',
    '巴西': '🇧🇷',
    '阿根廷': '🇦🇷',
    '埃及': '🇪🇬',
    '南非': '🇿🇦',
    '新西兰': '🇳🇿',
  };
  return flagMap[country] || '📍';
}
