import { useMemo, useState } from 'react';
import {
  Globe2,
  MapPin,
  Layers,
  Wallet,
  BarChart3,
  PieChart,
  TrendingUp,
  Award,
  Calendar,
  ChevronDown,
  ChevronRight,
  Star,
  Gem,
} from 'lucide-react';
import { useFridgeMagnetStore } from '@/store/useFridgeMagnetStore';
import { MATERIALS, CATEGORIES } from '@/types';
import type { Material, FridgeMagnetCategory } from '@/types';
import { cn } from '@/lib/utils';

interface StatisticsPanelProps {
  fullView?: boolean;
}

export default function StatisticsPanel({ fullView = false }: StatisticsPanelProps) {
  const getStatistics = useFridgeMagnetStore((s) => s.getStatistics);
  const getTravelCoverage = useFridgeMagnetStore((s) => s.getTravelCoverage);
  const getAchievements = useFridgeMagnetStore((s) => s.getAchievements);
  const getAnnualReview = useFridgeMagnetStore((s) => s.getAnnualReview);
  const getUniqueYears = useFridgeMagnetStore((s) => s.getUniqueYears);
  const checkAndUnlockAchievements = useFridgeMagnetStore((s) => s.checkAndUnlockAchievements);

  const [expandedSection, setExpandedSection] = useState<string | null>(
    fullView ? 'overview' : null
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const stats = useMemo(() => getStatistics(), [getStatistics]);
  const coverage = useMemo(() => getTravelCoverage(), [getTravelCoverage]);
  const achievements = useMemo(() => getAchievements(), [getAchievements]);
  const years = useMemo(() => getUniqueYears(), [getUniqueYears]);
  const annualReview = useMemo(
    () => (selectedYear ? getAnnualReview(selectedYear) : null),
    [selectedYear, getAnnualReview]
  );

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const SectionHeader = ({
    id,
    icon: Icon,
    title,
    subtitle,
  }: {
    id: string;
    icon: any;
    title: string;
    subtitle?: string;
  }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 hover:bg-cream-50 transition-colors rounded-xl"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-terracotta-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-terracotta-600" />
        </div>
        <div className="text-left">
          <h3 className="font-display font-semibold text-ink-800">{title}</h3>
          {subtitle && <p className="text-xs text-ink-500">{subtitle}</p>}
        </div>
      </div>
      {expandedSection === id ? (
        <ChevronDown className="w-5 h-5 text-ink-400" />
      ) : (
        <ChevronRight className="w-5 h-5 text-ink-400" />
      )}
    </button>
  );

  const BarChart = ({
    data,
    color,
    maxValue,
  }: {
    data: { label: string; value: number }[];
    color: string;
    maxValue?: number;
  }) => {
    const max = maxValue || Math.max(...data.map((d) => d.value), 1);
    return (
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-xs text-ink-600 w-20 truncate">{item.label}</span>
            <div className="flex-1 h-6 bg-ink-50 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', color)}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-ink-700 w-8 text-right">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const PieChartDisplay = ({
    data,
    colors,
  }: {
    data: { label: string; value: number }[];
    colors: Record<string, string>;
  }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) return <p className="text-sm text-ink-400 text-center py-4">暂无数据</p>;

    let cumulativePercent = 0;
    const segments = data.map((d) => {
      const percent = (d.value / total) * 100;
      const startAngle = cumulativePercent * 3.6;
      cumulativePercent += percent;
      const endAngle = cumulativePercent * 3.6;
      return { ...d, percent, startAngle, endAngle };
    });

    const describeArc = (startAngle: number, endAngle: number) => {
      const start = polarToCartesian(50, 50, 40, endAngle);
      const end = polarToCartesian(50, 50, 40, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
      return `M 50 50 L ${start.x} ${start.y} A 40 40 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
    };

    const polarToCartesian = (
      centerX: number,
      centerY: number,
      radius: number,
      angleInDegrees: number
    ) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    };

    return (
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 100 100" className="w-32 h-32">
          {segments.map((seg, i) =>
            seg.value > 0 ? (
              <path
                key={i}
                d={describeArc(seg.startAngle, seg.endAngle)}
                fill={colors[seg.label]}
                className="transition-all duration-300 hover:opacity-80"
              />
            ) : null
          )}
          <circle cx="50" cy="50" r="25" fill="#fefcf8" />
          <text
            x="50"
            y="47"
            textAnchor="middle"
            className="text-xs fill-ink-800 font-semibold"
          >
            {total}
          </text>
          <text x="50" y="60" textAnchor="middle" className="text-[8px] fill-ink-500">
            总数
          </text>
        </svg>
        <div className="flex-1 space-y-1.5">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[d.label] }}
              />
              <span className="text-xs text-ink-600 flex-1">{d.label}</span>
              <span className="text-xs font-medium text-ink-700">
                {d.value} ({((d.value / total) * 100).toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const materialColors: Record<Material, string> = {
    树脂: '#e07a5f',
    金属: '#81b29a',
    木质: '#d4a373',
    陶瓷: '#3d405b',
    亚克力: '#f2cc8f',
    软胶: '#e56b6f',
    其他: '#b5838d',
  };

  const categoryColors: Record<FridgeMagnetCategory, string> = {
    城市地标: '#e07a5f',
    博物馆: '#81b29a',
    动植物: '#d4a373',
    交通工具: '#3d405b',
    美食: '#f2cc8f',
    卡通联名: '#e56b6f',
    其他: '#b5838d',
  };

  if (!fullView) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="card p-5 hover:shadow-card transition-shadow duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-ink-500 uppercase tracking-wider">
                  {item.label}
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-semibold text-ink-800">
                    {item.value}
                  </span>
                  <span className="text-sm text-ink-500">{item.unit}</span>
                </div>
              </div>
              <div
                className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center ring-4 ${item.ringColor}`}
              >
                <item.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-ink-800 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-terracotta-500" />
          统计分析
        </h2>
        <button
          onClick={() => checkAndUnlockAchievements()}
          className="btn-secondary text-sm gap-1.5"
        >
          <Award className="w-4 h-4" />
          检查成就
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="card p-5 hover:shadow-card transition-shadow duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-ink-500 uppercase tracking-wider">
                  {item.label}
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-semibold text-ink-800">
                    {item.value}
                  </span>
                  <span className="text-sm text-ink-500">{item.unit}</span>
                </div>
              </div>
              <div
                className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center ring-4 ${item.ringColor}`}
              >
                <item.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <SectionHeader
          id="distribution"
          icon={PieChart}
          title="分布分析"
          subtitle="材质与类型分布"
        />
        {expandedSection === 'distribution' && (
          <div className="p-4 pt-0 grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-ink-700 mb-4">材质分布</h4>
              <PieChartDisplay
                data={MATERIALS.map((m) => ({
                  label: m,
                  value: stats.materialDistribution[m],
                }))}
                colors={materialColors}
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-ink-700 mb-4">类型分布</h4>
              <PieChartDisplay
                data={CATEGORIES.map((c) => ({
                  label: c,
                  value: stats.categoryDistribution[c],
                }))}
                colors={categoryColors}
              />
            </div>
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        <SectionHeader
          id="ranking"
          icon={TrendingUp}
          title="收藏排行"
          subtitle="国家与城市收藏数量排行"
        />
        {expandedSection === 'ranking' && (
          <div className="p-4 pt-0 grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-ink-700 mb-4">国家排行 TOP 10</h4>
              <BarChart
                data={stats.countryRanking.slice(0, 10).map((c) => ({
                  label: c.country,
                  value: c.count,
                }))}
                color="bg-gradient-to-r from-terracotta-400 to-terracotta-500"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-ink-700 mb-4">城市排行 TOP 10</h4>
              <BarChart
                data={stats.cityRanking.slice(0, 10).map((c) => ({
                  label: c.city,
                  value: c.count,
                }))}
                color="bg-gradient-to-r from-sage-400 to-sage-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        <SectionHeader
          id="annual"
          icon={Calendar}
          title="年度新增"
          subtitle="每年收藏数量与花费"
        />
        {expandedSection === 'annual' && (
          <div className="p-4 pt-0">
            <h4 className="text-sm font-medium text-ink-700 mb-4">年度收藏数量</h4>
            <BarChart
              data={stats.annualAdditions.map((a) => ({
                label: `${a.year}年`,
                value: a.count,
              }))}
              color="bg-gradient-to-r from-ink-400 to-ink-500"
            />
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-ink-700 mb-4">年度花费 (CNY)</h4>
                <BarChart
                  data={stats.annualAdditions.map((a) => ({
                    label: `${a.year}年`,
                    value: Math.round(a.totalCost),
                  }))}
                  color="bg-gradient-to-r from-amber-400 to-amber-500"
                />
              </div>
              <div className="card bg-cream-50 p-4">
                <h4 className="text-sm font-medium text-ink-700 mb-4">消费分析</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-ink-600">单枚均价</span>
                    <span className="font-display font-semibold text-terracotta-600">
                      ¥{stats.averagePrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-ink-600">最贵藏品</span>
                    {stats.mostExpensive ? (
                      <span className="font-display font-semibold text-ink-800">
                        {stats.mostExpensive.name} ({stats.mostExpensive.currency}{' '}
                        {stats.mostExpensive.price})
                      </span>
                    ) : (
                      <span className="text-ink-400">-</span>
                    )}
                  </div>
                  {stats.annualAdditions[0] && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-ink-600">
                        {stats.annualAdditions[0].year}年花费
                      </span>
                      <span className="font-display font-semibold text-sage-600">
                        ¥{stats.annualAdditions[0].totalCost.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        <SectionHeader
          id="coverage"
          icon={Globe2}
          title="旅行覆盖度"
          subtitle={`覆盖 ${coverage.continents.length} 大洲 · ${stats.countryCount} 国家 · ${stats.cityCount} 城市`}
        />
        {expandedSection === 'coverage' && (
          <div className="p-4 pt-0">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {Object.entries(coverage.continentCounts).map(([continent, count]) => (
                <div key={continent} className="card bg-cream-50 p-4 text-center">
                  <p className="font-display text-2xl font-bold text-terracotta-600">{count}</p>
                  <p className="text-xs text-ink-600">{continent}</p>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-medium text-ink-700 mb-3">覆盖国家列表</h4>
              <div className="flex flex-wrap gap-2">
                {coverage.countries.map((country) => (
                  <span
                    key={country}
                    className="chip bg-sage-50 text-sage-700 border-sage-200"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        <SectionHeader
          id="achievements"
          icon={Award}
          title="收藏成就"
          subtitle={`已解锁 ${unlockedCount} / ${achievements.length} 个成就`}
        />
        {expandedSection === 'achievements' && (
          <div className="p-4 pt-0">
            <div className="grid sm:grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all',
                    achievement.unlocked
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-ink-50 border-ink-100 opacity-60'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5
                          className={cn(
                            'font-semibold',
                            achievement.unlocked ? 'text-amber-800' : 'text-ink-600'
                          )}
                        >
                          {achievement.name}
                        </h5>
                        {achievement.unlocked && (
                          <span className="chip bg-amber-400 text-white text-[10px]">
                            已解锁
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-500 mt-1">{achievement.description}</p>
                      {achievement.progress && (
                        <div className="mt-2">
                          <div className="flex justify-between text-[10px] text-ink-500 mb-1">
                            <span>进度</span>
                            <span>
                              {achievement.progress.current} / {achievement.progress.target}
                            </span>
                          </div>
                          <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-500',
                                achievement.unlocked
                                  ? 'bg-amber-400'
                                  : 'bg-terracotta-300'
                              )}
                              style={{
                                width: `${Math.min(
                                  (achievement.progress.current /
                                    achievement.progress.target) *
                                    100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        <SectionHeader
          id="review"
          icon={Calendar}
          title="年度回顾"
          subtitle="选择年份查看收藏总结"
        />
        {expandedSection === 'review' && (
          <div className="p-4 pt-0">
            <div className="flex gap-2 mb-4 flex-wrap">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedYear === year
                      ? 'bg-terracotta-500 text-white'
                      : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
                  )}
                >
                  {year} 年
                </button>
              ))}
            </div>

            {annualReview ? (
              <div className="card bg-gradient-to-br from-cream-50 to-terracotta-50 p-6">
                <div className="text-center mb-6">
                  <h3 className="font-display text-2xl font-bold text-ink-800 mb-2">
                    {annualReview.year} 年度收藏总结
                  </h3>
                  <p className="text-ink-500">这一年你的旅行足迹</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="font-display text-3xl font-bold text-terracotta-600">
                      {annualReview.totalAdded}
                    </p>
                    <p className="text-xs text-ink-500">新增收藏</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-3xl font-bold text-sage-600">
                      {annualReview.countries.length}
                    </p>
                    <p className="text-xs text-ink-500">踏足国家</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-3xl font-bold text-ink-600">
                      {annualReview.cities.length}
                    </p>
                    <p className="text-xs text-ink-500">到访城市</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-3xl font-bold text-amber-600">
                      ¥{annualReview.totalSpent.toLocaleString()}
                    </p>
                    <p className="text-xs text-ink-500">年度花费</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="card bg-white p-4">
                    <h4 className="text-sm font-medium text-ink-700 mb-2">年度之最</h4>
                    {annualReview.favoriteMagnet && (
                      <div className="flex items-center gap-4">
                        <img
                          src={annualReview.favoriteMagnet.frontImage}
                          alt={annualReview.favoriteMagnet.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-ink-800 flex items-center gap-2">
                            {annualReview.favoriteMagnet.name}
                            <span className="flex items-center gap-0.5">
                              {[...Array(annualReview.favoriteMagnet.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-3 h-3 text-amber-400 fill-amber-400"
                                />
                              ))}
                            </span>
                            {annualReview.favoriteMagnet.isTreasure && (
                              <Gem className="w-3 h-3 text-amber-400 fill-amber-400" />
                            )}
                          </p>
                          <p className="text-xs text-ink-500">
                            {annualReview.favoriteMagnet.country} ·{' '}
                            {annualReview.favoriteMagnet.city}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="card bg-white p-4">
                    <h4 className="text-sm font-medium text-ink-700 mb-2">年度里程碑</h4>
                    <div className="flex flex-wrap gap-2">
                      {annualReview.milestones.map((milestone, i) => (
                        <span
                          key={i}
                          className="chip bg-terracotta-50 text-terracotta-700 border-terracotta-200"
                        >
                          {milestone}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="card bg-white p-4">
                    <h4 className="text-sm font-medium text-ink-700 mb-2">年度热门类型</h4>
                    <span className="chip bg-sage-50 text-sage-700 border-sage-200">
                      {annualReview.topCategory}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-ink-400 py-8">选择年份查看年度回顾</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
