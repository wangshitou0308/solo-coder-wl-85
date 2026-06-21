export type Material = '树脂' | '金属' | '木质' | '陶瓷' | '亚克力' | '软胶' | '其他';

export type FridgeMagnetCategory =
  | '城市地标'
  | '博物馆'
  | '动植物'
  | '交通工具'
  | '美食'
  | '卡通联名'
  | '其他';

export type DisplayStatus = '在冰箱上' | '已收纳' | '已赠送';

export type PhotoType = 'front' | 'back' | 'side' | 'packaging' | 'scene';

export interface Photo {
  id: string;
  url: string;
  type: PhotoType;
  caption?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface FridgeMagnet {
  id: string;
  name: string;
  city: string;
  country: string;
  coordinates?: Coordinates;
  purchaseLocation?: string;
  shopName?: string;
  travelCompanions?: string[];
  travelTags?: string[];
  notes?: string;
  purchaseDate: string;
  material: Material;
  category: FridgeMagnetCategory;
  width: number;
  height: number;
  price: number;
  currency: string;
  rating: number;
  isTreasure: boolean;
  frontImage: string;
  sideImage?: string;
  photos: Photo[];
  story: string;
  displayStatus: DisplayStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  material: Material | '全部';
  category: FridgeMagnetCategory | '全部';
  year: number | '全部';
  displayStatus: DisplayStatus | '全部';
  searchQuery: string;
  missingInfo: 'none' | 'noCoordinates' | 'noStory' | 'noSideImage' | 'zeroPrice';
  isTreasureOnly: boolean;
}

export interface SortOption {
  field: 'purchaseDate' | 'price' | 'size' | 'rating' | 'updatedAt' | 'name';
  direction: 'asc' | 'desc';
}

export interface Statistics {
  totalCount: number;
  countryCount: number;
  cityCount: number;
  continentCount: number;
  totalCost: number;
  currency: string;
  averagePrice: number;
  mostExpensive: { name: string; price: number; currency: string } | null;
  materialDistribution: Record<Material, number>;
  categoryDistribution: Record<FridgeMagnetCategory, number>;
  countryRanking: { country: string; count: number }[];
  cityRanking: { city: string; country: string; count: number }[];
  annualAdditions: { year: number; count: number; totalCost: number }[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: { current: number; target: number };
}

export interface AnnualReview {
  year: number;
  totalAdded: number;
  countries: string[];
  cities: string[];
  totalSpent: number;
  topCategory: FridgeMagnetCategory;
  favoriteMagnet: FridgeMagnet | null;
  milestones: string[];
}

export const MATERIALS: Material[] = ['树脂', '金属', '木质', '陶瓷', '亚克力', '软胶', '其他'];

export const CATEGORIES: FridgeMagnetCategory[] = [
  '城市地标',
  '博物馆',
  '动植物',
  '交通工具',
  '美食',
  '卡通联名',
  '其他',
];

export const DISPLAY_STATUSES: DisplayStatus[] = ['在冰箱上', '已收纳', '已赠送'];

export const PHOTO_TYPES: { value: PhotoType; label: string }[] = [
  { value: 'front', label: '正面' },
  { value: 'back', label: '背面' },
  { value: 'side', label: '侧面' },
  { value: 'packaging', label: '包装' },
  { value: 'scene', label: '购买场景' },
];

export const CONTINENT_MAP: Record<string, string> = {
  '中国': '亚洲',
  '日本': '亚洲',
  '韩国': '亚洲',
  '泰国': '亚洲',
  '新加坡': '亚洲',
  '马来西亚': '亚洲',
  '印度尼西亚': '亚洲',
  '菲律宾': '亚洲',
  '越南': '亚洲',
  '印度': '亚洲',
  '土耳其': '亚洲',
  '俄罗斯': '欧洲',
  '法国': '欧洲',
  '英国': '欧洲',
  '德国': '欧洲',
  '意大利': '欧洲',
  '西班牙': '欧洲',
  '葡萄牙': '欧洲',
  '希腊': '欧洲',
  '荷兰': '欧洲',
  '比利时': '欧洲',
  '奥地利': '欧洲',
  '瑞士': '欧洲',
  '美国': '北美洲',
  '加拿大': '北美洲',
  '墨西哥': '北美洲',
  '巴西': '南美洲',
  '阿根廷': '南美洲',
  '埃及': '非洲',
  '南非': '非洲',
  '澳大利亚': '大洋洲',
  '新西兰': '大洋洲',
};

export const CITY_COORDINATES: Record<string, Coordinates> = {
  '巴黎': { lat: 48.8566, lng: 2.3522 },
  '东京': { lat: 35.6762, lng: 139.6503 },
  '西安': { lat: 34.3416, lng: 108.9398 },
  '威尼斯': { lat: 45.4408, lng: 12.3155 },
  '墨西哥城': { lat: 19.4326, lng: -99.1332 },
  '伦敦': { lat: 51.5074, lng: -0.1278 },
  '北京': { lat: 39.9042, lng: 116.4074 },
  '上海': { lat: 31.2304, lng: 121.4737 },
  '纽约': { lat: 40.7128, lng: -74.0060 },
  '洛杉矶': { lat: 34.0522, lng: -118.2437 },
  '首尔': { lat: 37.5665, lng: 126.9780 },
  '曼谷': { lat: 13.7563, lng: 100.5018 },
  '新加坡': { lat: 1.3521, lng: 103.8198 },
  '悉尼': { lat: -33.8688, lng: 151.2093 },
  '罗马': { lat: 41.9028, lng: 12.4964 },
  '马德里': { lat: 40.4168, lng: -3.7038 },
  '柏林': { lat: 52.5200, lng: 13.4050 },
  '阿姆斯特丹': { lat: 52.3676, lng: 4.9041 },
  '布鲁塞尔': { lat: 50.8503, lng: 4.3517 },
  '维也纳': { lat: 48.2082, lng: 16.3738 },
  '里斯本': { lat: 38.7223, lng: -9.1393 },
  '雅典': { lat: 37.9838, lng: 23.7275 },
  '开罗': { lat: 30.0444, lng: 31.2357 },
  '开普敦': { lat: -33.9249, lng: 18.4241 },
  '里约热内卢': { lat: -22.9068, lng: -43.1729 },
  '布宜诺斯艾利斯': { lat: -34.6037, lng: -58.3816 },
  '莫斯科': { lat: 55.7558, lng: 37.6173 },
  '迪拜': { lat: 25.2048, lng: 55.2708 },
  '香港': { lat: 22.3193, lng: 114.1694 },
  '台北': { lat: 25.0330, lng: 121.5654 },
  '广州': { lat: 23.1291, lng: 113.2644 },
  '深圳': { lat: 22.5431, lng: 114.0579 },
  '成都': { lat: 30.5728, lng: 104.0668 },
  '杭州': { lat: 30.2741, lng: 120.1551 },
  '南京': { lat: 32.0603, lng: 118.7969 },
  '武汉': { lat: 30.5928, lng: 114.3055 },
  '青岛': { lat: 36.0671, lng: 120.3826 },
  '厦门': { lat: 24.4798, lng: 118.0894 },
  '桂林': { lat: 25.2736, lng: 110.2900 },
  '丽江': { lat: 26.8552, lng: 100.2270 },
  '拉萨': { lat: 29.6548, lng: 91.1392 },
  '哈尔滨': { lat: 45.8038, lng: 126.5350 },
  '三亚': { lat: 18.2528, lng: 109.5119 },
};

export const SORT_OPTIONS: { value: SortOption['field']; label: string }[] = [
  { value: 'purchaseDate', label: '购买时间' },
  { value: 'price', label: '价格' },
  { value: 'size', label: '尺寸' },
  { value: 'rating', label: '喜爱程度' },
  { value: 'updatedAt', label: '最近更新' },
  { value: 'name', label: '名称' },
];
