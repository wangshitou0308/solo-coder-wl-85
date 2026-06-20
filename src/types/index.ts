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
  purchaseDate: string;
  material: Material;
  category: FridgeMagnetCategory;
  width: number;
  height: number;
  price: number;
  currency: string;
  frontImage: string;
  sideImage?: string;
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
}

export interface Statistics {
  totalCount: number;
  countryCount: number;
  cityCount: number;
  totalCost: number;
  currency: string;
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
