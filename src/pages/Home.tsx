import { useState, useMemo } from 'react';
import { Plus, Map, LayoutGrid, List, Magnet, Clock, Image, BarChart3, Layers } from 'lucide-react';
import { useFridgeMagnetStore } from '@/store/useFridgeMagnetStore';
import type { FridgeMagnet } from '@/types';
import StatisticsPanel from '@/components/StatisticsPanel';
import FilterPanel from '@/components/FilterPanel';
import CollectionMap from '@/components/CollectionMap';
import CountryCityBrowser from '@/components/CountryCityBrowser';
import FridgeMagnetCard from '@/components/FridgeMagnetCard';
import FridgeMagnetDetail from '@/components/FridgeMagnetDetail';
import FridgeMagnetForm from '@/components/FridgeMagnetForm';
import ExportPanel from '@/components/ExportPanel';
import TimelineView from '@/components/TimelineView';
import CollectionWallView from '@/components/CollectionWallView';

type ViewMode = 'grid' | 'map' | 'browse' | 'timeline' | 'wall' | 'stats';

export default function Home() {
  const deleteMagnet = useFridgeMagnetStore((s) => s.deleteMagnet);
  const getFilteredMagnets = useFridgeMagnetStore((s) => s.getFilteredMagnets);
  const getSortedMagnets = useFridgeMagnetStore((s) => s.getSortedMagnets);
  const checkAndUnlockAchievements = useFridgeMagnetStore((s) => s.checkAndUnlockAchievements);

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [formOpen, setFormOpen] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchCount, setBatchCount] = useState(0);
  const [editingMagnet, setEditingMagnet] = useState<FridgeMagnet | null>(null);
  const [detailMagnet, setDetailMagnet] = useState<FridgeMagnet | null>(null);

  const filteredMagnets = useMemo(() => {
    return getSortedMagnets(getFilteredMagnets());
  }, [getFilteredMagnets, getSortedMagnets]);

  const handleAdd = () => {
    setEditingMagnet(null);
    setIsBatchMode(false);
    setBatchCount(0);
    setFormOpen(true);
  };

  const handleBatchAdd = () => {
    setEditingMagnet(null);
    setIsBatchMode(true);
    setBatchCount(0);
    setFormOpen(true);
  };

  const handleBatchAddNext = () => {
    setBatchCount((prev) => prev + 1);
    checkAndUnlockAchievements();
  };

  const handleEdit = (magnet: FridgeMagnet) => {
    setEditingMagnet(magnet);
    setIsBatchMode(false);
    setFormOpen(true);
  };

  const handleDelete = (magnet: FridgeMagnet) => {
    if (confirm(`确定要删除 "${magnet.name}" 吗？`)) {
      deleteMagnet(magnet.id);
      setDetailMagnet(null);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingMagnet(null);
    setIsBatchMode(false);
    if (batchCount > 0) {
      checkAndUnlockAchievements();
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-cream-50/80 backdrop-blur-xl border-b border-ink-100">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-terracotta-400 to-terracotta-600 flex items-center justify-center shadow-md">
                <Magnet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-ink-800 leading-none">
                  冰箱贴收藏册
                </h1>
                <p className="text-xs text-ink-500 mt-1">记录每一段旅行的温度</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 bg-ink-100/60 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-terracotta-600 shadow-sm'
                      : 'text-ink-500 hover:text-ink-700'
                  }`}
                  title="网格视图"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'map'
                      ? 'bg-white text-terracotta-600 shadow-sm'
                      : 'text-ink-500 hover:text-ink-700'
                  }`}
                  title="地图视图"
                >
                  <Map className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('browse')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'browse'
                      ? 'bg-white text-terracotta-600 shadow-sm'
                      : 'text-ink-500 hover:text-ink-700'
                  }`}
                  title="浏览视图"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'timeline'
                      ? 'bg-white text-terracotta-600 shadow-sm'
                      : 'text-ink-500 hover:text-ink-700'
                  }`}
                  title="时间线"
                >
                  <Clock className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('wall')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'wall'
                      ? 'bg-white text-terracotta-600 shadow-sm'
                      : 'text-ink-500 hover:text-ink-700'
                  }`}
                  title="收藏墙"
                >
                  <Image className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('stats')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'stats'
                      ? 'bg-white text-terracotta-600 shadow-sm'
                      : 'text-ink-500 hover:text-ink-700'
                  }`}
                  title="统计分析"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>

              <ExportPanel />

              <div className="flex items-center gap-1">
                <button onClick={handleAdd} className="btn-primary gap-1.5">
                  <Plus className="w-4 h-4" />
                  添加
                </button>
                <button
                  onClick={handleBatchAdd}
                  className="btn-secondary gap-1.5"
                  title="批量添加多个藏品"
                >
                  <Layers className="w-4 h-4" />
                  批量
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {viewMode !== 'stats' && <StatisticsPanel />}
        {viewMode !== 'stats' && viewMode !== 'wall' && <FilterPanel />}

        {viewMode === 'grid' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg text-ink-800">
                全部藏品
                <span className="ml-2 text-sm font-normal text-ink-500">
                  共 {filteredMagnets.length} 枚
                </span>
              </h2>
            </div>

            {filteredMagnets.length === 0 ? (
              <div className="card p-16 text-center">
                <Magnet className="w-16 h-16 mx-auto text-ink-200 mb-4" />
                <h3 className="font-display text-xl font-semibold text-ink-700 mb-2">
                  还没有冰箱贴
                </h3>
                <p className="text-ink-500 mb-6">
                  开始记录你的第一枚收藏吧
                </p>
                <button onClick={handleAdd} className="btn-primary gap-1.5">
                  <Plus className="w-4 h-4" />
                  添加第一枚
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredMagnets.map((magnet) => (
                  <FridgeMagnetCard
                    key={magnet.id}
                    magnet={magnet}
                    onClick={() => setDetailMagnet(magnet)}
                    onEdit={() => handleEdit(magnet)}
                    onDelete={() => handleDelete(magnet)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {viewMode === 'map' && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-lg text-ink-800">
              收藏地图
              <span className="ml-2 text-sm font-normal text-ink-500">
                点击标记查看该城市的冰箱贴
              </span>
            </h2>
            <CollectionMap
              height="calc(100vh - 320px)"
              onMagnetClick={(magnet) => setDetailMagnet(magnet)}
            />

            {filteredMagnets.filter((m) => !m.coordinates).length > 0 && (
              <div className="card p-4 bg-cream-100/50 border-cream-200">
                <p className="text-sm text-ink-600">
                  <span className="font-medium">提示：</span>
                  有 {filteredMagnets.filter((m) => !m.coordinates).length} 枚冰箱贴没有设置坐标，
                  编辑时添加经纬度即可在地图上显示。
                </p>
              </div>
            )}
          </div>
        )}

        {viewMode === 'browse' && (
          <CountryCityBrowser onMagnetClick={(magnet) => setDetailMagnet(magnet)} />
        )}

        {viewMode === 'timeline' && (
          <TimelineView onMagnetClick={(magnet) => setDetailMagnet(magnet)} />
        )}

        {viewMode === 'wall' && (
          <CollectionWallView onMagnetClick={(magnet) => setDetailMagnet(magnet)} />
        )}

        {viewMode === 'stats' && <StatisticsPanel fullView />}
      </main>

      <footer className="border-t border-ink-100 mt-12">
        <div className="container py-6 text-center">
          <p className="text-sm text-ink-400">
            冰箱贴收藏册 · 记录旅行的美好瞬间
          </p>
        </div>
      </footer>

      <FridgeMagnetForm
        open={formOpen}
        onClose={handleFormClose}
        editMagnet={editingMagnet}
        isBatch={isBatchMode}
        onBatchAdd={handleBatchAddNext}
      />

      {batchCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="card px-4 py-2 bg-sage-500 text-white shadow-lg flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span className="text-sm font-medium">已批量添加 {batchCount} 枚，继续录入中...</span>
          </div>
        </div>
      )}

      <FridgeMagnetDetail
        magnet={detailMagnet}
        onClose={() => setDetailMagnet(null)}
        onEdit={() => {
          if (detailMagnet) {
            handleEdit(detailMagnet);
            setDetailMagnet(null);
          }
        }}
        onDelete={() => detailMagnet && handleDelete(detailMagnet)}
      />
    </div>
  );
}
