import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FridgeMagnet, FilterOptions, Statistics } from '@/types';

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

const sampleMagnets: FridgeMagnet[] = [
  {
    id: generateId(),
    name: '埃菲尔铁塔',
    city: '巴黎',
    country: '法国',
    coordinates: { lat: 48.8584, lng: 2.2945 },
    purchaseDate: '2023-06-15',
    material: '金属',
    category: '城市地标',
    width: 5,
    height: 8,
    price: 8.5,
    currency: 'EUR',
    frontImage:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Eiffel%20Tower%20fridge%20magnet%20on%20white%20background%20product%20photo&image_size=square',
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
    purchaseDate: '2024-03-28',
    material: '陶瓷',
    category: '城市地标',
    width: 6,
    height: 6,
    price: 1200,
    currency: 'JPY',
    frontImage:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Mount%20Fuji%20with%20cherry%20blossoms%20Japanese%20style%20fridge%20magnet%20ceramic&image_size=square',
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
    purchaseDate: '2022-10-05',
    material: '树脂',
    category: '博物馆',
    width: 4,
    height: 7,
    price: 35,
    currency: 'CNY',
    frontImage:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Terracotta%20Warrior%20Chinese%20fridge%20magnet%20resin%20craft&image_size=square',
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
    purchaseDate: '2023-09-12',
    material: '木质',
    category: '交通工具',
    width: 8,
    height: 3,
    price: 12,
    currency: 'EUR',
    frontImage:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Venetian%20gondola%20wooden%20fridge%20magnet%20Italian%20souvenir&image_size=square',
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
    purchaseDate: '2024-01-20',
    material: '软胶',
    category: '动植物',
    width: 5,
    height: 7,
    price: 65,
    currency: 'MXN',
    frontImage:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Colorful%20Mexican%20cactus%20silicone%20fridge%20magnet%20cute%20design&image_size=square',
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
    purchaseDate: '2023-12-01',
    material: '亚克力',
    category: '卡通联名',
    width: 5,
    height: 5,
    price: 6,
    currency: 'GBP',
    frontImage:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Winnie%20the%20Pooh%20cute%20acrylic%20fridge%20magnet%20Disney&image_size=square',
    story: '在伦敦的迪士尼商店买的，送给妹妹的礼物，后来她又回赠给我了。',
    displayStatus: '已赠送',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface FridgeMagnetState {
  magnets: FridgeMagnet[];
  filters: FilterOptions;
  selectedMagnetId: string | null;
  getMagnetById: (id: string) => FridgeMagnet | undefined;
  addMagnet: (magnet: Omit<FridgeMagnet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMagnet: (id: string, updates: Partial<FridgeMagnet>) => void;
  deleteMagnet: (id: string) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  setSelectedMagnet: (id: string | null) => void;
  getFilteredMagnets: () => FridgeMagnet[];
  getStatistics: () => Statistics;
  getMagnetsByCountry: () => Record<string, FridgeMagnet[]>;
  getMagnetsByCity: (country: string) => Record<string, FridgeMagnet[]>;
  getUniqueYears: () => number[];
  getCityMagnets: (city: string, country: string) => FridgeMagnet[];
}

const defaultFilters: FilterOptions = {
  material: '全部',
  category: '全部',
  year: '全部',
  displayStatus: '全部',
};

export const useFridgeMagnetStore = create<FridgeMagnetState>()(
  persist(
    (set, get) => ({
      magnets: sampleMagnets,
      filters: defaultFilters,
      selectedMagnetId: null,

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
      },

      updateMagnet: (id, updates) => {
        set({
          magnets: get().magnets.map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
          ),
        });
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

      setSelectedMagnet: (id) => {
        set({ selectedMagnetId: id });
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
          return true;
        });
      },

      getStatistics: () => {
        const { magnets } = get();
        const countries = new Set(magnets.map((m) => m.country));
        const cities = new Set(magnets.map((m) => `${m.country}-${m.city}`));
        const totalCost = magnets.reduce((sum, m) => {
          if (m.currency === 'CNY') return sum + m.price;
          if (m.currency === 'EUR') return sum + m.price * 7.8;
          if (m.currency === 'JPY') return sum + m.price * 0.047;
          if (m.currency === 'GBP') return sum + m.price * 9.2;
          if (m.currency === 'MXN') return sum + m.price * 0.38;
          return sum + m.price;
        }, 0);
        return {
          totalCount: magnets.length,
          countryCount: countries.size,
          cityCount: cities.size,
          totalCost: Math.round(totalCost * 100) / 100,
          currency: 'CNY',
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

      getUniqueYears: () => {
        const { magnets } = get();
        const years = new Set(magnets.map((m) => new Date(m.purchaseDate).getFullYear()));
        return Array.from(years).sort((a, b) => b - a);
      },

      getCityMagnets: (city, country) => {
        return get().magnets.filter((m) => m.city === city && m.country === country);
      },
    }),
    {
      name: 'fridge-magnet-collection',
    }
  )
);
