import { MapPin, Calendar, Ruler, Tag, Pencil, Trash2 } from 'lucide-react';
import type { FridgeMagnet } from '@/types';
import { cn } from '@/lib/utils';

interface FridgeMagnetCardProps {
  magnet: FridgeMagnet;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

const statusColors: Record<string, string> = {
  '在冰箱上': 'bg-sage-100 text-sage-600 border-sage-200',
  '已收纳': 'bg-cream-200 text-ink-600 border-cream-300',
  '已赠送': 'bg-terracotta-100 text-terracotta-600 border-terracotta-200',
};

const categoryColors: Record<string, string> = {
  '城市地标': 'bg-terracotta-50 text-terracotta-600',
  '博物馆': 'bg-sage-50 text-sage-600',
  '动植物': 'bg-sage-100 text-sage-700',
  '交通工具': 'bg-cream-200 text-ink-700',
  '美食': 'bg-terracotta-100 text-terracotta-700',
  '卡通联名': 'bg-cream-100 text-terracotta-600',
  '其他': 'bg-ink-100 text-ink-600',
};

export default function FridgeMagnetCard({
  magnet,
  onClick,
  onEdit,
  onDelete,
  compact = false,
}: FridgeMagnetCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'card group cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-1',
        compact && 'hover:translate-y-0'
      )}
    >
      <div className={cn('relative overflow-hidden bg-cream-100', compact ? 'h-28' : 'h-44')}>
        <img
          src={magnet.frontImage}
          alt={magnet.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-ink-600 hover:bg-white hover:text-terracotta-500 shadow-sm"
              title="编辑"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-ink-600 hover:bg-red-50 hover:text-red-500 shadow-sm"
              title="删除"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="absolute top-2 left-2">
          <span className={cn('chip border', statusColors[magnet.displayStatus])}>
            {magnet.displayStatus}
          </span>
        </div>
      </div>

      <div className={cn('space-y-2', compact ? 'p-3' : 'p-4')}>
        <div className="flex items-start justify-between gap-2">
          <h3 className={cn('font-display font-semibold text-ink-800 leading-tight', compact ? 'text-sm' : 'text-base')}>
            {magnet.name}
          </h3>
          <span className={cn('chip shrink-0', categoryColors[magnet.category])}>
            {magnet.category}
          </span>
        </div>

        {!compact && (
          <>
            <div className="flex items-center gap-1.5 text-xs text-ink-500">
              <MapPin className="w-3 h-3 text-terracotta-400" />
              <span>{magnet.country} · {magnet.city}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-ink-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{magnet.purchaseDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Ruler className="w-3 h-3" />
                <span>{magnet.width}×{magnet.height}cm</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-ink-50">
              <div className="flex items-center gap-1 text-xs text-ink-500">
                <Tag className="w-3 h-3" />
                <span>{magnet.material}</span>
              </div>
              <div className="text-sm font-semibold text-terracotta-600 font-display">
                {magnet.currency} {magnet.price}
              </div>
            </div>
          </>
        )}

        {compact && (
          <div className="flex items-center gap-1 text-[11px] text-ink-500">
            <MapPin className="w-2.5 h-2.5 text-terracotta-400" />
            <span>{magnet.city}</span>
          </div>
        )}
      </div>
    </div>
  );
}
