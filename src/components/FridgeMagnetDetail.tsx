import { X, MapPin, Calendar, Ruler, Tag, Home, Package, Gift, Edit3, Trash2 } from 'lucide-react';
import type { FridgeMagnet } from '@/types';
import { cn } from '@/lib/utils';

interface FridgeMagnetDetailProps {
  magnet: FridgeMagnet | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const statusIcon: Record<string, typeof Home> = {
  '在冰箱上': Home,
  '已收纳': Package,
  '已赠送': Gift,
};

export default function FridgeMagnetDetail({ magnet, onClose, onEdit, onDelete }: FridgeMagnetDetailProps) {
  if (!magnet) return null;

  const StatusIcon = statusIcon[magnet.displayStatus] || Home;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-cream-50 rounded-2xl shadow-card w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-[fadeIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-semibold text-ink-800">{magnet.name}</h2>
            <span className={cn(
              'chip border',
              magnet.displayStatus === '在冰箱上' && 'bg-sage-100 text-sage-600 border-sage-200',
              magnet.displayStatus === '已收纳' && 'bg-cream-200 text-ink-600 border-cream-300',
              magnet.displayStatus === '已赠送' && 'bg-terracotta-100 text-terracotta-600 border-terracotta-200',
            )}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {magnet.displayStatus}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onEdit} className="btn-ghost" title="编辑">
              <Edit3 className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="btn-ghost text-red-500 hover:bg-red-50" title="删除">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="btn-ghost p-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="bg-gradient-to-br from-cream-100 to-cream-200 p-6">
              <div className="aspect-square rounded-xl overflow-hidden shadow-card bg-white">
                <img src={magnet.frontImage} alt={magnet.name} className="w-full h-full object-cover" />
              </div>
              {magnet.sideImage && (
                <div className="mt-4 aspect-video rounded-xl overflow-hidden shadow-card bg-white">
                  <img src={magnet.sideImage} alt={`${magnet.name} 侧面`} className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-ink-400 mb-2">基本信息</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-terracotta-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-terracotta-500" />
                    </div>
                    <div>
                      <p className="text-ink-500 text-xs">购买地点</p>
                      <p className="text-ink-800 font-medium">{magnet.country} · {magnet.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-sage-50 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-sage-500" />
                    </div>
                    <div>
                      <p className="text-ink-500 text-xs">购买日期</p>
                      <p className="text-ink-800 font-medium">{magnet.purchaseDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-cream-200 flex items-center justify-center shrink-0">
                      <Ruler className="w-4 h-4 text-ink-600" />
                    </div>
                    <div>
                      <p className="text-ink-500 text-xs">尺寸</p>
                      <p className="text-ink-800 font-medium">{magnet.width} × {magnet.height} cm</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4 text-ink-600" />
                    </div>
                    <div>
                      <p className="text-ink-500 text-xs">材质 / 类型</p>
                      <p className="text-ink-800 font-medium">{magnet.material} · {magnet.category}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-ink-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-ink-400">价格</span>
                  <span className="font-display text-2xl font-semibold text-terracotta-600">
                    {magnet.currency} {magnet.price}
                  </span>
                </div>
              </div>

              {magnet.story && (
                <div className="pt-4 border-t border-ink-100">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-ink-400 mb-2">旅行故事</h3>
                  <div className="p-4 bg-cream-100/60 rounded-xl border border-cream-200">
                    <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-wrap italic">
                      "{magnet.story}"
                    </p>
                  </div>
                </div>
              )}

              {magnet.coordinates && (
                <div className="pt-4 border-t border-ink-100">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-ink-400 mb-2">地理坐标</h3>
                  <p className="text-sm text-ink-600 font-mono">
                    {magnet.coordinates.lat.toFixed(4)}, {magnet.coordinates.lng.toFixed(4)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
