import { useMemo, useState } from 'react';
import { Image, Star, Gem, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFridgeMagnetStore } from '@/store/useFridgeMagnetStore';
import type { FridgeMagnet } from '@/types';
import { cn } from '@/lib/utils';

interface CollectionWallViewProps {
  onMagnetClick: (magnet: FridgeMagnet) => void;
}

export default function CollectionWallView({ onMagnetClick }: CollectionWallViewProps) {
  const getFilteredMagnets = useFridgeMagnetStore((s) => s.getFilteredMagnets);
  const getSortedMagnets = useFridgeMagnetStore((s) => s.getSortedMagnets);
  const [selectedMagnet, setSelectedMagnet] = useState<FridgeMagnet | null>(null);
  const [showOnlyTreasure, setShowOnlyTreasure] = useState(false);

  const sortedMagnets = useMemo(() => {
    let magnets = getSortedMagnets(getFilteredMagnets());
    if (showOnlyTreasure) {
      magnets = magnets.filter((m) => m.isTreasure);
    }
    return magnets;
  }, [getFilteredMagnets, getSortedMagnets, showOnlyTreasure]);

  const getAllImages = useMemo(() => {
    const images: { magnet: FridgeMagnet; url: string; caption: string }[] = [];
    sortedMagnets.forEach((magnet) => {
      images.push({
        magnet,
        url: magnet.frontImage,
        caption: `${magnet.name} - 正面`,
      });
      if (magnet.sideImage) {
        images.push({
          magnet,
          url: magnet.sideImage,
          caption: `${magnet.name} - 侧面`,
        });
      }
      magnet.photos?.forEach((photo) => {
        images.push({
          magnet,
          url: photo.url,
          caption: `${magnet.name} - ${photo.caption || photo.type}`,
        });
      });
    });
    return images;
  }, [sortedMagnets]);

  const currentIndex = selectedMagnet
    ? getAllImages.findIndex((img) => img.magnet.id === selectedMagnet.id)
    : -1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setSelectedMagnet(getAllImages[currentIndex - 1].magnet);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < getAllImages.length - 1) {
      setSelectedMagnet(getAllImages[currentIndex + 1].magnet);
    }
  };

  if (sortedMagnets.length === 0) {
    return (
      <div className="card p-16 text-center">
        <Image className="w-16 h-16 mx-auto text-ink-200 mb-4" />
        <h3 className="font-display text-xl font-semibold text-ink-700 mb-2">
          暂无图片
        </h3>
        <p className="text-ink-500">没有符合筛选条件的藏品</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-lg text-ink-800">
          收藏墙
          <span className="ml-2 text-sm font-normal text-ink-500">
            共 {sortedMagnets.length} 枚藏品 · {getAllImages.length} 张图片
          </span>
        </h2>
        <button
          onClick={() => setShowOnlyTreasure(!showOnlyTreasure)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
            showOnlyTreasure
              ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
              : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
          )}
        >
          <Gem className={cn('w-4 h-4', showOnlyTreasure && 'fill-amber-500')} />
          仅珍藏
        </button>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
        {sortedMagnets.map((magnet) => (
          <div
            key={magnet.id}
            className="break-inside-avoid relative group cursor-pointer"
            onClick={() => {
              setSelectedMagnet(magnet);
              onMagnetClick(magnet);
            }}
          >
            <div className="card overflow-hidden transition-all duration-300 hover:shadow-card hover:scale-[1.02]">
              <div className="relative">
                <img
                  src={magnet.frontImage}
                  alt={magnet.name}
                  className="w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <h3 className="font-display font-semibold text-white text-sm">
                    {magnet.name}
                  </h3>
                  <p className="text-xs text-ink-200">
                    {magnet.country} · {magnet.city}
                  </p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {magnet.isTreasure && (
                    <span className="chip bg-amber-400 text-white text-[10px] px-1.5 py-0.5">
                      <Gem className="w-2.5 h-2.5 mr-0.5" />
                      珍藏
                    </span>
                  )}
                </div>
                <div className="absolute top-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-ink-900/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
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
                {(magnet.photos?.length || 0) > 0 && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-ink-900/60 rounded-full text-white text-[10px]">
                    <Image className="w-2.5 h-2.5" />
                    {(magnet.photos?.length || 0) + (magnet.sideImage ? 1 : 0) + 1}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMagnet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedMagnet(null)}
        >
          <button
            onClick={() => setSelectedMagnet(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div
            className="max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative">
                <img
                  src={selectedMagnet.frontImage}
                  alt={selectedMagnet.name}
                  className="w-full max-h-[70vh] object-contain rounded-xl"
                />
              </div>
              <div className="text-white">
                <h3 className="font-display text-3xl font-semibold mb-2">
                  {selectedMagnet.name}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  {selectedMagnet.isTreasure && (
                    <span className="chip bg-amber-400 text-white">
                      <Gem className="w-3 h-3 mr-1" />
                      珍藏
                    </span>
                  )}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'w-4 h-4',
                          star <= selectedMagnet.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-white/30'
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-white/70 mb-2">
                  {selectedMagnet.country} · {selectedMagnet.city}
                </p>
                <p className="text-white/70 mb-4">{selectedMagnet.purchaseDate}</p>
                {selectedMagnet.story && (
                  <p className="text-white/80 italic leading-relaxed">
                    "{selectedMagnet.story}"
                  </p>
                )}
                <p className="text-2xl font-display font-semibold text-terracotta-400 mt-4">
                  {selectedMagnet.currency} {selectedMagnet.price}
                </p>
              </div>
            </div>
          </div>

          {currentIndex < getAllImages.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            {currentIndex + 1} / {getAllImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
