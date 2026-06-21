import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  FridgeMagnet,
  FilterOptions,
  Statistics,
  SortOption,
  Achievement,
  AnnualReview,
  Photo,
  Material,
  FridgeMagnetCategory,
} from '@/types';
import {
  MATERIALS,
  CATEGORIES,
  CONTINENT_MAP,
  CITY_COORDINATES,
} from '@/types';
import { calculateTotalCNY, convertToCNY } from '@/utils/currency';

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

const generatePhotoId = () => 'photo_' + Math.random().toString(36).substring(2, 9);

const sampleMagnets: FridgeMagnet[] = [
  {
    id: generateId(),
    name: '埃菲尔铁塔',
    city: '巴黎',
    country: '法国',
    coordinates: { lat: 48.8584, lng: 2.2945 },
    purchaseLocation: '埃菲尔铁塔纪念品店',
    shopName: 'La Tour Eiffel Gift Shop',
    travelCompanions: ['家人'],
    travelTags: ['浪漫', '地标', '经典'],
    notes: '第一天到达巴黎就去了铁塔',
    purchaseDate: '2023-06-15',
    material: '金属',
    category: '城市地标',
    width: 5,
    height: 8,
    price: 8.5,
    currency: 'EUR',
    rating: 5,
    isTreasure: true,
    frontImage:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Eiffel%20Tower%20fridge%20magnet%20on%20white%20background%20product%20photo&image_size=square',
    photos: [
      {
        id: generatePhotoId(),
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Eiffel%20Tower%20fridge%20magnet%20front%20view%20product%20photo&image_size=square',
        type: 'front',
        caption: '正面',
      },
    ],
    story: '第一次去巴黎旅行，在铁塔下的纪念品店买的。那天阳光正好，塞纳河畔的风景太美了。',
    displayStatus: '在冰箱上',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '樱花富士山',
    city: '东京',
    country: '日本',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    purchaseLocation: '上野公园',
    shopName: '樱花季限定小摊',
    travelCompanions: ['朋友'],
    travelTags: ['樱花季', '春天', '限定'],
    notes: '樱花飘落的时候特别美',
    purchaseDate: '2024-03-28',
    material: '陶瓷',
    category: '城市地标',
    width: 6,
    height: 6,
    price: 1200,
    currency: 'JPY',
    rating: 5,
    isTreasure: true,
    frontImage:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Mount%20Fuji%20with%20cherry%20blossoms%20Japanese%20style%20fridge%20magnet%20ceramic&image_size=square',
    photos: [
      {
        id: generatePhotoId(),
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Mount%20Fuji%20cherry%20blossom%20fridge%20magnet%20front%20view&image_size=square',
        type: 'front',
        caption: '正面',
      },
      {
        id: generatePhotoId(),
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Japanese%20ceramic%20fridge%20magnet%20back%20view%20with%20magnet&image_size=square',
        type: 'back',
        caption: '背面磁石',
      },
    ],
    story: '樱花季去日本，在上野公园的小摊上看到的，粉粉的樱花和富士山，一眼就爱上了。',
    displayStatus: '在冰箱上',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '兵马俑',
    city: '西安',
    country: '中国',
    coordinates: { lat: 34.3416, lng: 108.9398 },
    purchaseLocation: '兵马俑博物馆',
    shopName: '博物馆文创商店',
    travelCompanions: ['家人'],
    travelTags: ['历史', '文化', '博物馆'],
    notes: '迷你版将军俑',
    purchaseDate: '2022-10-05',
    material: '树脂',
    category: '博物馆',
    width: 4,
    height: 7,
    price: 35,
    currency: 'CNY',
    rating: 4,
    isTreasure: false,
    frontImage:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Terracotta%20Warrior%20Chinese%20fridge%20magnet%20resin%20craft&image_size=square',
    photos: [
      {
        id: generatePhotoId(),
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Terracotta%20Warrior%20fridge%20magnet%20front%20view&image_size=square',
        type: 'front',
        caption: '正面',
      },
    ],
    story: '参观兵马俑博物馆时买的，迷你版的将军俑，做工很精细。',
    displayStatus: '已收纳',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '威尼斯贡多拉',
    city: '威尼斯',
    country: '意大利',
    coordinates: { lat: 45.4408, lng: 12.3155 },
    purchaseLocation: '威尼斯水岸',
    shopName: 'Gondola Souvenirs',
    travelCompanions: ['伴侣'],
    travelTags: ['浪漫', '水城', '小船'],
    notes: '船夫帮忙挑选的',
    purchaseDate: '2023-09-12',
    material: '木质',
    category: '交通工具',
    width: 8,
    height: 3,
    price: 12,
    currency: 'EUR',
    rating: 4,
    isTreasure: false,
    frontImage:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Venetian%20gondola%20wooden%20fridge%20magnet%20Italian%20souvenir&image_size=square',
    photos: [
      {
        id: generatePhotoId(),
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Venetian%20gondola%20wooden%20fridge%20magnet%20side%20view&image_size=square',
        type: 'side',
        caption: '侧面',
      },
    ],
    story: '坐完贡多拉后在岸边的小店买的，船夫还帮我选了一个最好看的。',
    displayStatus: '在冰箱上',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '墨西哥仙人掌',
    city: '墨西哥城',
    country: '墨西哥',
    coordinates: { lat: 19.4326, lng: -99.1332 },
    purchaseLocation: '墨西哥城市集',
    shopName: 'Mercado de Artesanías',
    travelCompanions: ['朋友'],
    travelTags: ['异域风情', '色彩鲜艳', '手工'],
    notes: '软胶材质特别可爱',
    purchaseDate: '2024-01-20',
    material: '软胶',
    category: '动植物',
    width: 5,
    height: 7,
    price: 65,
    currency: 'MXN',
    rating: 4,
    isTreasure: false,
    frontImage:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Colorful%20Mexican%20cactus%20silicone%20fridge%20magnet%20cute%20design&image_size=square',
    photos: [
      {
        id: generatePhotoId(),
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Colorful%20Mexican%20cactus%20silicone%20fridge%20magnet%20front&image_size=square',
        type: 'front',
        caption: '正面',
      },
      {
        id: generatePhotoId(),
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Mexican%20market%20stall%20with%20colorful%20souvenirs&image_size=square',
        type: 'scene',
        caption: '购买的市集',
      },
    ],
    story: '在墨西哥城的集市上淘到的，色彩鲜艳的仙人掌，满满的异域风情。',
    displayStatus: '在冰箱上',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '小熊维尼',
    city: '伦敦',
    country: '英国',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    purchaseLocation: '牛津街迪士尼商店',
    shopName: 'Disney Store',
    travelCompanions: ['妹妹'],
    travelTags: ['迪士尼', '可爱', '礼物'],
    notes: '送妹妹后她又回赠给我了',
    purchaseDate: '2023-12-01',
    material: '亚克力',
    category: '卡通联名',
    width: 5,
    height: 5,
    price: 6,
    currency: 'GBP',
    rating: 3,
    isTreasure: false,
    frontImage:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Winnie%20the%20Pooh%20cute%20acrylic%20fridge%20magnet%20Disney&image_size=square',
    photos: [
      {
        id: generatePhotoId(),
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Winnie%20the%20Pooh%20acrylic%20fridge%20magnet%20front%20view&image_size=square',
        type: 'front',
        caption: '正面',
      },
    ],
    story: '在伦敦的迪士尼商店买的，送给妹妹的礼物，后来她又回赠给我了。',
    displayStatus: '已赠送',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface FridgeMagnetState {
  magnets: FridgeMagnet[];
  filters: FilterOptions;
  sortOption: SortOption;
  selectedMagnetId: string | null;
  viewMode: 'grid' | 'map' | 'browse' | 'timeline' | 'wall' | 'stats';
  achievements: Achievement[];
  lastAchievementCheck: string;
  getMagnetById: (id: string) => FridgeMagnet | undefined;
  addMagnet: (magnet: Omit<FridgeMagnet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addMagnetsBatch: (magnets: Omit<FridgeMagnet, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  updateMagnet: (id: string, updates: Partial<FridgeMagnet>) => void;
  deleteMagnet: (id: string) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  setSortOption: (sort: SortOption) => void;
  setSelectedMagnet: (id: string | null) => void;
  setViewMode: (mode: FridgeMagnetState['viewMode']) => void;
  getFilteredMagnets: () => FridgeMagnet[];
  getSortedMagnets: (magnets?: FridgeMagnet[]) => FridgeMagnet[];
  getStatistics: () => Statistics;
  getMagnetsByCountry: () => Record<string, FridgeMagnet[]>;
  getMagnetsByCity: (country: string) => Record<string, FridgeMagnet[]>;
  getMagnetsByYearMonth: () => Record<string, FridgeMagnet[]>;
  getUniqueYears: () => number[];
  getCityMagnets: (city: string, country: string) => FridgeMagnet[];
  getCityCoordinates: (city: string, country?: string) => { lat: number; lng: number } | null;
  searchMagnets: (query: string) => FridgeMagnet[];
  getMissingInfoMagnets: () => {
    noCoordinates: FridgeMagnet[];
    noStory: FridgeMagnet[];
    noSideImage: FridgeMagnet[];
    zeroPrice: FridgeMagnet[];
  };
  getAchievements: () => Achievement[];
  checkAndUnlockAchievements: () => Achievement[];
  getAnnualReview: (year: number) => AnnualReview | null;
  getTravelCoverage: () => {
    continents: string[];
    countries: string[];
    cities: string[];
    continentCounts: Record<string, number>;
    heatmapData: { lat: number; lng: number; count: number }[];
  };
  addPhoto: (magnetId: string, photo: Omit<Photo, 'id'>) => void;
  removePhoto: (magnetId: string, photoId: string) => void;
  toggleTreasure: (magnetId: string) => void;
}

const defaultFilters: FilterOptions = {
  material: '全部',
  category: '全部',
  year: '全部',
  displayStatus: '全部',
  searchQuery: '',
  missingInfo: 'none',
  isTreasureOnly: false,
};

const defaultAchievements: Achievement[] = [
  {
    id: 'first_magnet',
    name: '初次收藏',
    description: '添加你的第一枚冰箱贴',
    icon: '🧲',
    unlocked: false,
    progress: { current: 0, target: 1 },
  },
  {
    id: 'ten_magnets',
    name: '小有收藏',
    description: '收藏达到10枚冰箱贴',
    icon: '🎯',
    unlocked: false,
    progress: { current: 0, target: 10 },
  },
  {
    id: 'twenty_magnets',
    name: '收藏达人',
    description: '收藏达到20枚冰箱贴',
    icon: '🏆',
    unlocked: false,
    progress: { current: 0, target: 20 },
  },
  {
    id: 'five_countries',
    name: '环游五国',
    description: '收藏来自5个不同国家的冰箱贴',
    icon: '🌍',
    unlocked: false,
    progress: { current: 0, target: 5 },
  },
  {
    id: 'ten_countries',
    name: '世界旅行家',
    description: '收藏来自10个不同国家的冰箱贴',
    icon: '✈️',
    unlocked: false,
    progress: { current: 0, target: 10 },
  },
  {
    id: 'farthest_city',
    name: '最远足迹',
    description: '收藏来自距离最远的城市的冰箱贴',
    icon: '📍',
    unlocked: false,
  },
  {
    id: 'treasure_hunter',
    name: '珍藏猎人',
    description: '标记5枚冰箱贴为珍藏',
    icon: '💎',
    unlocked: false,
    progress: { current: 0, target: 5 },
  },
  {
    id: 'storyteller',
    name: '故事大王',
    description: '为10枚冰箱添加旅行故事',
    icon: '📖',
    unlocked: false,
    progress: { current: 0, target: 10 },
  },
  {
    id: 'photographer',
    name: '摄影大师',
    description: '为一枚冰箱贴添加5张以上照片',
    icon: '📷',
    unlocked: false,
    progress: { current: 0, target: 5 },
  },
  {
    id: 'three_continents',
    name: '跨越三大洲',
    description: '收藏来自3个大洲的冰箱贴',
    icon: '🌏',
    unlocked: false,
    progress: { current: 0, target: 3 },
  },
];

const defaultSort: SortOption = {
  field: 'purchaseDate',
  direction: 'desc',
};

export const useFridgeMagnetStore = create<FridgeMagnetState>()(
  persist(
    (set, get) => ({
      magnets: sampleMagnets,
      filters: defaultFilters,
      sortOption: defaultSort,
      selectedMagnetId: null,
      viewMode: 'grid',
      achievements: defaultAchievements,
      lastAchievementCheck: '',

      getMagnetById: (id) => get().magnets.find((m) => m.id === id),

      addMagnet: (magnet) => {
        const now = new Date().toISOString();
        const newMagnet: FridgeMagnet = {
          ...magnet,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set({ magnets: [...get().magnets, newMagnet] });
        get().checkAndUnlockAchievements();
      },

      addMagnetsBatch: (magnets) => {
        const now = new Date().toISOString();
        const newMagnets = magnets.map((m) => ({
          ...m,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        }));
        set({ magnets: [...get().magnets, ...newMagnets] });
        get().checkAndUnlockAchievements();
      },

      updateMagnet: (id, updates) => {
        set({
          magnets: get().magnets.map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
          ),
        });
        get().checkAndUnlockAchievements();
      },

      deleteMagnet: (id) => {
        set({
          magnets: get().magnets.filter((m) => m.id !== id),
          selectedMagnetId: get().selectedMagnetId === id ? null : get().selectedMagnetId,
        });
      },

      setFilters: (filters) => {
        set({ filters: { ...get().filters, ...filters } });
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      setSortOption: (sort) => {
        set({ sortOption: sort });
      },

      setSelectedMagnet: (id) => {
        set({ selectedMagnetId: id });
      },

      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      getFilteredMagnets: () => {
        const { magnets, filters } = get();
        return magnets.filter((m) => {
          if (filters.material !== '全部' && m.material !== filters.material) return false;
          if (filters.category !== '全部' && m.category !== filters.category) return false;
          if (filters.year !== '全部') {
            const year = new Date(m.purchaseDate).getFullYear();
            if (year !== filters.year) return false;
          }
          if (filters.displayStatus !== '全部' && m.displayStatus !== filters.displayStatus)
            return false;
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            const searchFields = [
              m.name,
              m.country,
              m.city,
              m.story,
              m.shopName || '',
              m.purchaseLocation || '',
              m.notes || '',
              ...(m.travelTags || []),
              ...(m.travelCompanions || []),
            ];
            if (!searchFields.some((f) => f.toLowerCase().includes(query))) return false;
          }
          if (filters.missingInfo === 'noCoordinates' && m.coordinates) return false;
          if (filters.missingInfo === 'noStory' && m.story.trim()) return false;
          if (filters.missingInfo === 'noSideImage' && m.sideImage) return false;
          if (filters.missingInfo === 'zeroPrice' && m.price > 0) return false;
          if (filters.isTreasureOnly && !m.isTreasure) return false;
          return true;
        });
      },

      getSortedMagnets: (magnetsInput) => {
        const { sortOption } = get();
        const magnets = magnetsInput || get().getFilteredMagnets();
        const sorted = [...magnets].sort((a, b) => {
          let comparison = 0;
          switch (sortOption.field) {
            case 'purchaseDate':
              comparison = new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
              break;
            case 'price':
              comparison = convertToCNY(a.price, a.currency) - convertToCNY(b.price, b.currency);
              break;
            case 'size':
              comparison = a.width * a.height - b.width * b.height;
              break;
            case 'rating':
              comparison = a.rating - b.rating;
              break;
            case 'updatedAt':
              comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
              break;
            case 'name':
              comparison = a.name.localeCompare(b.name, 'zh-CN');
              break;
          }
          return sortOption.direction === 'asc' ? comparison : -comparison;
        });
        return sorted;
      },

      getStatistics: () => {
        const { magnets } = get();
        const countries = new Set(magnets.map((m) => m.country));
        const cities = new Set(magnets.map((m) => `${m.country}-${m.city}`));
        const continents = new Set(
          magnets.map((m) => CONTINENT_MAP[m.country] || '未知')
        );
        const totalCost = calculateTotalCNY(magnets);
        const averagePrice = magnets.length > 0 ? totalCost / magnets.length : 0;

        let mostExpensive: Statistics['mostExpensive'] = null;
        let maxPrice = 0;
        magnets.forEach((m) => {
          const priceCNY = convertToCNY(m.price, m.currency);
          if (priceCNY > maxPrice) {
            maxPrice = priceCNY;
            mostExpensive = { name: m.name, price: m.price, currency: m.currency };
          }
        });

        const materialDistribution = MATERIALS.reduce((acc, mat) => {
          acc[mat] = magnets.filter((m) => m.material === mat).length;
          return acc;
        }, {} as Record<Material, number>);

        const categoryDistribution = CATEGORIES.reduce((acc, cat) => {
          acc[cat] = magnets.filter((m) => m.category === cat).length;
          return acc;
        }, {} as Record<FridgeMagnetCategory, number>);

        const countryCounts: Record<string, number> = {};
        const cityCounts: Record<string, { city: string; country: string; count: number }> = {};
        const yearCounts: Record<number, { count: number; totalCost: number }> = {};

        magnets.forEach((m) => {
          countryCounts[m.country] = (countryCounts[m.country] || 0) + 1;
          const cityKey = `${m.country}-${m.city}`;
          if (!cityCounts[cityKey]) {
            cityCounts[cityKey] = { city: m.city, country: m.country, count: 0 };
          }
          cityCounts[cityKey].count++;

          const year = new Date(m.purchaseDate).getFullYear();
          if (!yearCounts[year]) {
            yearCounts[year] = { count: 0, totalCost: 0 };
          }
          yearCounts[year].count++;
          yearCounts[year].totalCost += convertToCNY(m.price, m.currency);
        });

        const countryRanking = Object.entries(countryCounts)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count);

        const cityRanking = Object.values(cityCounts).sort((a, b) => b.count - a.count);

        const annualAdditions = Object.entries(yearCounts)
          .map(([year, data]) => ({
            year: parseInt(year),
            count: data.count,
            totalCost: Math.round(data.totalCost * 100) / 100,
          }))
          .sort((a, b) => b.year - a.year);

        return {
          totalCount: magnets.length,
          countryCount: countries.size,
          cityCount: cities.size,
          continentCount: continents.size,
          totalCost,
          currency: 'CNY',
          averagePrice: Math.round(averagePrice * 100) / 100,
          mostExpensive,
          materialDistribution,
          categoryDistribution,
          countryRanking,
          cityRanking,
          annualAdditions,
        };
      },

      getMagnetsByCountry: () => {
        const { magnets } = get();
        const result: Record<string, FridgeMagnet[]> = {};
        magnets.forEach((m) => {
          if (!result[m.country]) result[m.country] = [];
          result[m.country].push(m);
        });
        return result;
      },

      getMagnetsByCity: (country) => {
        const { magnets } = get();
        const result: Record<string, FridgeMagnet[]> = {};
        magnets
          .filter((m) => m.country === country)
          .forEach((m) => {
            if (!result[m.city]) result[m.city] = [];
            result[m.city].push(m);
          });
        return result;
      },

      getMagnetsByYearMonth: () => {
        const { magnets } = get();
        const result: Record<string, FridgeMagnet[]> = {};
        magnets.forEach((m) => {
          const date = new Date(m.purchaseDate);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!result[key]) result[key] = [];
          result[key].push(m);
        });
        return result;
      },

      getUniqueYears: () => {
        const { magnets } = get();
        const years = new Set(magnets.map((m) => new Date(m.purchaseDate).getFullYear()));
        return Array.from(years).sort((a, b) => b - a);
      },

      getCityMagnets: (city, country) => {
        return get().magnets.filter((m) => m.city === city && m.country === country);
      },

      getCityCoordinates: (city) => {
        return CITY_COORDINATES[city] || null;
      },

      searchMagnets: (query) => {
        if (!query.trim()) return get().magnets;
        const lowerQuery = query.toLowerCase();
        return get().magnets.filter((m) => {
          const searchFields = [
            m.name,
            m.country,
            m.city,
            m.story,
            m.shopName || '',
            m.purchaseLocation || '',
            m.notes || '',
            ...(m.travelTags || []),
            ...(m.travelCompanions || []),
          ];
          return searchFields.some((f) => f.toLowerCase().includes(lowerQuery));
        });
      },

      getMissingInfoMagnets: () => {
        const { magnets } = get();
        return {
          noCoordinates: magnets.filter((m) => !m.coordinates),
          noStory: magnets.filter((m) => !m.story.trim()),
          noSideImage: magnets.filter((m) => !m.sideImage),
          zeroPrice: magnets.filter((m) => m.price === 0),
        };
      },

      getAchievements: () => {
        return get().achievements;
      },

      checkAndUnlockAchievements: () => {
        const { magnets, achievements } = get();
        const now = new Date().toISOString();
        const countries = new Set(magnets.map((m) => m.country));
        const continents = new Set(
          magnets.map((m) => CONTINENT_MAP[m.country] || '未知')
        );
        const treasureCount = magnets.filter((m) => m.isTreasure).length;
        const storyCount = magnets.filter((m) => m.story.trim()).length;
        const maxPhotos = Math.max(...magnets.map((m) => m.photos?.length || 0), 0);

        const getFarthestDistance = () => {
          const homeCoords = { lat: 39.9042, lng: 116.4074 };
          let maxDist = 0;
          magnets.forEach((m) => {
            if (m.coordinates) {
              const dist = Math.sqrt(
                Math.pow(m.coordinates.lat - homeCoords.lat, 2) +
                  Math.pow(m.coordinates.lng - homeCoords.lng, 2)
              );
              if (dist > maxDist) maxDist = dist;
            }
          });
          return maxDist;
        };

        const updatedAchievements = achievements.map((ach) => {
          let unlocked = ach.unlocked;
          let progress = ach.progress;
          let unlockedAt = ach.unlockedAt;

          switch (ach.id) {
            case 'first_magnet':
              progress = { current: magnets.length, target: 1 };
              if (magnets.length >= 1 && !unlocked) {
                unlocked = true;
                unlockedAt = now;
              }
              break;
            case 'ten_magnets':
              progress = { current: magnets.length, target: 10 };
              if (magnets.length >= 10 && !unlocked) {
                unlocked = true;
                unlockedAt = now;
              }
              break;
            case 'twenty_magnets':
              progress = { current: magnets.length, target: 20 };
              if (magnets.length >= 20 && !unlocked) {
                unlocked = true;
                unlockedAt = now;
              }
              break;
            case 'five_countries':
              progress = { current: countries.size, target: 5 };
              if (countries.size >= 5 && !unlocked) {
                unlocked = true;
                unlockedAt = now;
              }
              break;
            case 'ten_countries':
              progress = { current: countries.size, target: 10 };
              if (countries.size >= 10 && !unlocked) {
                unlocked = true;
                unlockedAt = now;
              }
              break;
            case 'farthest_city':
              if (getFarthestDistance() > 50 && !unlocked) {
                unlocked = true;
                unlockedAt = now;
              }
              break;
            case 'treasure_hunter':
              progress = { current: treasureCount, target: 5 };
              if (treasureCount >= 5 && !unlocked) {
                unlocked = true;
                unlockedAt = now;
              }
              break;
            case 'storyteller':
              progress = { current: storyCount, target: 10 };
              if (storyCount >= 10 && !unlocked) {
                unlocked = true;
                unlockedAt = now;
              }
              break;
            case 'photographer':
              progress = { current: maxPhotos, target: 5 };
              if (maxPhotos >= 5 && !unlocked) {
                unlocked = true;
                unlockedAt = now;
              }
              break;
            case 'three_continents':
              progress = { current: continents.size, target: 3 };
              if (continents.size >= 3 && !unlocked) {
                unlocked = true;
                unlockedAt = now;
              }
              break;
          }

          return { ...ach, unlocked, progress, unlockedAt };
        });

        set({ achievements: updatedAchievements, lastAchievementCheck: now });
        return updatedAchievements.filter((a) => a.unlocked);
      },

      getAnnualReview: (year) => {
        const { magnets } = get();
        const yearMagnets = magnets.filter(
          (m) => new Date(m.purchaseDate).getFullYear() === year
        );
        if (yearMagnets.length === 0) return null;

        const countries = new Set(yearMagnets.map((m) => m.country));
        const cities = new Set(yearMagnets.map((m) => `${m.country}-${m.city}`));
        const totalSpent = calculateTotalCNY(yearMagnets);

        const categoryCounts: Record<string, number> = {};
        yearMagnets.forEach((m) => {
          categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
        });
        const topCategory = Object.entries(categoryCounts).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0] as FridgeMagnetCategory;

        const favoriteMagnet = [...yearMagnets].sort((a, b) => b.rating - a.rating)[0];

        const milestones: string[] = [];
        if (yearMagnets.length >= 1) {
          milestones.push(`今年共收藏了 ${yearMagnets.length} 枚冰箱贴`);
        }
        if (countries.size > 0) {
          milestones.push(`踏足了 ${countries.size} 个国家`);
        }
        if (cities.size > 0) {
          milestones.push(`到访了 ${cities.size} 座城市`);
        }
        if (totalSpent > 0) {
          milestones.push(`累计花费 ¥${totalSpent.toLocaleString()}`);
        }

        return {
          year,
          totalAdded: yearMagnets.length,
          countries: Array.from(countries),
          cities: Array.from(cities).map((c) => c.split('-')[1]),
          totalSpent,
          topCategory,
          favoriteMagnet,
          milestones,
        };
      },

      getTravelCoverage: () => {
        const { magnets } = get();
        const continents = new Set<string>();
        const countries = new Set<string>();
        const cities = new Set<string>();
        const continentCounts: Record<string, number> = {};
        const heatmapData: { lat: number; lng: number; count: number }[] = [];

        const cityGroups: Record<string, { lat: number; lng: number; count: number }> = {};

        magnets.forEach((m) => {
          const continent = CONTINENT_MAP[m.country] || '未知';
          continents.add(continent);
          countries.add(m.country);
          cities.add(`${m.country}-${m.city}`);
          continentCounts[continent] = (continentCounts[continent] || 0) + 1;

          if (m.coordinates) {
            const key = `${m.country}-${m.city}`;
            if (!cityGroups[key]) {
              cityGroups[key] = {
                lat: m.coordinates.lat,
                lng: m.coordinates.lng,
                count: 0,
              };
            }
            cityGroups[key].count++;
          }
        });

        Object.values(cityGroups).forEach((group) => {
          heatmapData.push(group);
        });

        return {
          continents: Array.from(continents),
          countries: Array.from(countries),
          cities: Array.from(cities).map((c) => c.split('-')[1]),
          continentCounts,
          heatmapData,
        };
      },

      addPhoto: (magnetId, photo) => {
        const newPhoto: Photo = {
          ...photo,
          id: generatePhotoId(),
        };
        set({
          magnets: get().magnets.map((m) =>
            m.id === magnetId
              ? { ...m, photos: [...(m.photos || []), newPhoto], updatedAt: new Date().toISOString() }
              : m
          ),
        });
        get().checkAndUnlockAchievements();
      },

      removePhoto: (magnetId, photoId) => {
        set({
          magnets: get().magnets.map((m) =>
            m.id === magnetId
              ? {
                  ...m,
                  photos: (m.photos || []).filter((p) => p.id !== photoId),
                  updatedAt: new Date().toISOString(),
                }
              : m
          ),
        });
      },

      toggleTreasure: (magnetId) => {
        const magnet = get().getMagnetById(magnetId);
        if (magnet) {
          get().updateMagnet(magnetId, { isTreasure: !magnet.isTreasure });
        }
      },
    }),
    {
      name: 'fridge-magnet-collection',
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) =>
              !['viewMode', 'selectedMagnetId', 'sortOption', 'filters'].includes(key)
          )
        ),
    }
  )
);
