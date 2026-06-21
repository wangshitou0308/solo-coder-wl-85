import { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Ruler,
  Tag,
  Home,
  Package,
  Gift,
  Edit3,
  Trash2,
  Star,
  Gem,
  Users,
  Store,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { FridgeMagnet } from '@/types';
import { PHOTO_TYPES } from '@/types';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/utils/currency';

interface FridgeMagnetDetailProps {
  magnet: FridgeMagnet | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleTreasure?: () => void;
}

const statusIcon: Record<string, typeof Home> = {
  '在冰箱上': Home,
  '已收纳': Package,
  '已赠送': Gift,
};

export default function FridgeMagnetDetail({
  magnet,
  onClose,
  onEdit,
  onDelete,
  onToggleTreasure,
}: FridgeMagnetDetailProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (!magnet) return null;

  const StatusIcon = statusIcon[magnet.displayStatus] || Home;

  const allPhotos = [
    { url: magnet.frontImage, type: 'front', caption: '正面照片' },
    ...(magnet.sideImage
      ? [{ url: magnet.sideImage, type: 'side', caption: '侧面照片' }]
      : []),
    ...(magnet.photos?.map((p) => ({ url: p.url, type: p.type, caption: p.caption || '' })) || []),
  ];

  const currentPhoto = allPhotos[activePhotoIndex] || allPhotos[0];

  const getPhotoTypeLabel = (type: string) => {
    return PHOTO_TYPES.find((t) => t.value === type)?.label || type;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-cream-50 rounded-2xl shadow-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-[fadeIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-semibold text-ink-800">{magnet.name}</h2>
            <span
              className={cn(
                'chip border',
                magnet.displayStatus === '在冰箱上' &&
                  'bg-sage-100 text-sage-600 border-sage-200',
                magnet.displayStatus === '已收纳' &&
                  'bg-cream-200 text-ink-600 border-cream-300',
                magnet.displayStatus === '已赠送' &&
                  'bg-terracotta-100 text-terracotta-600 border-terracotta-200'
              )}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {magnet.displayStatus}
            </span>
            {magnet.isTreasure && (
              <span className="chip bg-amber-400 text-white border-0">
                <Gem className="w-3 h-3 mr-1" />
                珍藏
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {onToggleTreasure && (
              <button
                onClick={onToggleTreasure}
                className={cn(
                  'btn-ghost',
                  magnet.isTreasure
                    ? 'text-amber-500 hover:bg-amber-50'
                    : 'text-ink-500 hover:bg-ink-50'
                )}
                title={magnet.isTreasure ? '取消珍藏' : '标记珍藏'}
              >
                <Gem
                  className={cn('w-4 h-4', magnet.isTreasure && 'fill-amber-500')}
                />
              </button>
            )}
            <button onClick={onEdit} className="btn-ghost" title="编辑">
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="btn-ghost text-red-500 hover:bg-red-50"
              title="删除"
            >
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
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-card bg-white">
                <img
                  src={currentPhoto.url}
                  alt={magnet.name}
                  className="w-full h-full object-contain"
                />
                {allPhotos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActivePhotoIndex(
                          activePhotoIndex === 0
                            ? allPhotos.length - 1
                            : activePhotoIndex - 1
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-ink-900/60 text-white rounded-full hover:bg-ink-900/80 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActivePhotoIndex(
                          activePhotoIndex === allPhotos.length - 1
                            ? 0
                            : activePhotoIndex + 1
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-ink-900/60 text-white rounded-full hover:bg-ink-900/80 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-ink-900/70 text-white text-xs rounded-full">
                  {getPhotoTypeLabel(currentPhoto.type)}
                  {currentPhoto.caption && `: ${currentPhoto.caption}`}
                </div>
              </div>

              {allPhotos.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {allPhotos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setActivePhotoIndex(index)}
                      className={cn(
                        'w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all',
                        activePhotoIndex === index
                          ? 'border-terracotta-500 ring-2 ring-terracotta-200'
                          : 'border-transparent hover:border-ink-200'
                      )}
                    >
                      <img
                        src={photo.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        'w-5 h-5',
                        star <= magnet.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-ink-200'
                      )}
                    />
                  ))}
                </div>
                <span className="text-ink-500 text-sm">
                  {magnet.rating} 星
                </span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-ink-400 mb-2">
                  基本信息
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-terracotta-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-terracotta-500" />
                    </div>
                    <div>
                      <p className="text-ink-500 text-xs">购买地点</p>
                      <p className="text-ink-800 font-medium">
                        {magnet.country} · {magnet.city}
                      </p>
                    </div>
                  </div>

                  {magnet.purchaseLocation && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-sage-50 flex items-center justify-center shrink-0">
                        <Store className="w-4 h-4 text-sage-500" />
                      </div>
                      <div>
                        <p className="text-ink-500 text-xs">具体位置</p>
                        <p className="text-ink-800 font-medium">
                          {magnet.purchaseLocation}
                          {magnet.shopName && ` · ${magnet.shopName}`}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-sage-50 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-sage-500" />
                    </div>
                    <div>
                      <p className="text-ink-500 text-xs">购买日期</p>
                      <p className="text-ink-800 font-medium">
                        {magnet.purchaseDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-cream-200 flex items-center justify-center shrink-0">
                      <Ruler className="w-4 h-4 text-ink-600" />
                    </div>
                    <div>
                      <p className="text-ink-500 text-xs">尺寸</p>
                      <p className="text-ink-800 font-medium">
                        {magnet.width} × {magnet.height} cm
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4 text-ink-600" />
                    </div>
                    <div>
                      <p className="text-ink-500 text-xs">材质 / 类型</p>
                      <p className="text-ink-800 font-medium">
                        {magnet.material} · {magnet.category}
                      </p>
                    </div>
                  </div>

                  {magnet.travelCompanions &&
                    magnet.travelCompanions.length > 0 && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-sage-50 flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-sage-500" />
                        </div>
                        <div>
                          <p className="text-ink-500 text-xs">同行人</p>
                          <p className="text-ink-800 font-medium">
                            {magnet.travelCompanions.join('、')}
                          </p>
                        </div>
                      </div>
                    )}

                  {magnet.travelTags && magnet.travelTags.length > 0 && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-terracotta-50 flex items-center justify-center shrink-0">
                        <Tag className="w-4 h-4 text-terracotta-500" />
                      </div>
                      <div>
                        <p className="text-ink-500 text-xs">旅行标签</p>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {magnet.travelTags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-ink-100 text-ink-600 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-ink-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-ink-400">
                    价格
                  </span>
                  <div className="font-display text-2xl font-semibold text-terracotta-600">
                    {formatPrice(magnet.price, magnet.currency)}
                  </div>
                </div>
              </div>

              {magnet.story && (
                <div className="pt-4 border-t border-ink-100">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-ink-400 mb-2">
                    旅行故事
                  </h3>
                  <div className="p-4 bg-cream-100/60 rounded-xl border border-cream-200">
                    <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-wrap italic">
                      "{magnet.story}"
                    </p>
                  </div>
                  </div>
              )}

              {magnet.notes && (
                <div className="pt-4 border-t border-ink-100">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-ink-400 mb-2">
                    备注
                  </h3>
                  <p className="text-sm text-ink-600">{magnet.notes}</p>
                </div>
              )}

              {magnet.coordinates && (
                <div className="pt-4 border-t border-ink-100">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-ink-400 mb-2">
                    地理坐标
                  </h3>
                  <p className="text-sm text-ink-600 font-mono">
                    {magnet.coordinates.lat.toFixed(4)},{' '}
                    {magnet.coordinates.lng.toFixed(4)}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-ink-100 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-ink-400" />
                <span className="text-xs text-ink-500">
                  共 {allPhotos.length} 张照片
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
