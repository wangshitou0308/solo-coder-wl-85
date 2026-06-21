import { useState, useEffect } from 'react';
import {
  X,
  Upload,
  MapPin,
  Star,
  Gem,
  Plus,
  Tag,
  Users,
  ImagePlus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import type {
  FridgeMagnet,
  Material,
  FridgeMagnetCategory,
  DisplayStatus,
  Coordinates,
  Photo,
  PhotoType,
} from '@/types';
import {
  MATERIALS,
  CATEGORIES,
  DISPLAY_STATUSES,
  PHOTO_TYPES,
  CITY_COORDINATES,
} from '@/types';
import { useFridgeMagnetStore } from '@/store/useFridgeMagnetStore';
import { cn } from '@/lib/utils';

interface FridgeMagnetFormProps {
  open: boolean;
  onClose: () => void;
  editMagnet?: FridgeMagnet | null;
  isBatch?: boolean;
  onBatchAdd?: () => void;
}

interface FormData {
  name: string;
  city: string;
  country: string;
  coordinates: Coordinates | null;
  purchaseLocation: string;
  shopName: string;
  travelCompanions: string;
  travelTags: string;
  notes: string;
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
  sideImage: string;
  photos: Photo[];
  story: string;
  displayStatus: DisplayStatus;
}

const generatePhotoId = () => 'photo_' + Math.random().toString(36).substring(2, 9);

const defaultFormData: FormData = {
  name: '',
  city: '',
  country: '',
  coordinates: null,
  purchaseLocation: '',
  shopName: '',
  travelCompanions: '',
  travelTags: '',
  notes: '',
  purchaseDate: new Date().toISOString().split('T')[0],
  material: '树脂',
  category: '城市地标',
  width: 5,
  height: 5,
  price: 0,
  currency: 'CNY',
  rating: 3,
  isTreasure: false,
  frontImage: '',
  sideImage: '',
  photos: [],
  story: '',
  displayStatus: '在冰箱上',
};

export default function FridgeMagnetForm({
  open,
  onClose,
  editMagnet,
  isBatch = false,
  onBatchAdd,
}: FridgeMagnetFormProps) {
  const { addMagnet, updateMagnet, getCityCoordinates } = useFridgeMagnetStore();
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'photos' | 'story'>('basic');
  const [newPhotoType, setNewPhotoType] = useState<PhotoType>('front');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  useEffect(() => {
    if (editMagnet) {
      setFormData({
        name: editMagnet.name,
        city: editMagnet.city,
        country: editMagnet.country,
        coordinates: editMagnet.coordinates || null,
        purchaseLocation: editMagnet.purchaseLocation || '',
        shopName: editMagnet.shopName || '',
        travelCompanions: (editMagnet.travelCompanions || []).join(', '),
        travelTags: (editMagnet.travelTags || []).join(', '),
        notes: editMagnet.notes || '',
        purchaseDate: editMagnet.purchaseDate,
        material: editMagnet.material,
        category: editMagnet.category,
        width: editMagnet.width,
        height: editMagnet.height,
        price: editMagnet.price,
        currency: editMagnet.currency,
        rating: editMagnet.rating,
        isTreasure: editMagnet.isTreasure,
        frontImage: editMagnet.frontImage,
        sideImage: editMagnet.sideImage || '',
        photos: editMagnet.photos || [],
        story: editMagnet.story,
        displayStatus: editMagnet.displayStatus,
      });
    } else {
      setFormData(defaultFormData);
    }
    setErrors({});
    setActiveTab('basic');
  }, [editMagnet, open]);

  useEffect(() => {
    if (formData.city && !formData.coordinates) {
      const coords = getCityCoordinates(formData.city);
      if (coords) {
        setFormData((prev) => ({ ...prev, coordinates: coords }));
      }
    }
  }, [formData.city, formData.coordinates, getCityCoordinates]);

  const handleAutoFillCoordinates = () => {
    if (formData.city) {
      const coords = CITY_COORDINATES[formData.city] || getCityCoordinates(formData.city);
      if (coords) {
        setFormData((prev) => ({ ...prev, coordinates: coords }));
      }
    }
  };

  const handleFileUpload = (field: 'frontImage' | 'sideImage', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrl = (field: 'frontImage' | 'sideImage', url: string) => {
    setFormData((prev) => ({ ...prev, [field]: url }));
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    const newPhoto: Photo = {
      id: generatePhotoId(),
      url: newPhotoUrl.trim(),
      type: newPhotoType,
      caption: newPhotoCaption.trim() || undefined,
    };
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, newPhoto],
    }));
    setNewPhotoUrl('');
    setNewPhotoCaption('');
  };

  const handleRemovePhoto = (photoId: string) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== photoId),
    }));
  };

  const handleFileUploadPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhoto: Photo = {
        id: generatePhotoId(),
        url: reader.result as string,
        type: newPhotoType,
        caption: newPhotoCaption.trim() || undefined,
      };
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, newPhoto],
      }));
      setNewPhotoCaption('');
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = '请输入冰箱贴名称';
    if (!formData.city.trim()) newErrors.city = '请输入购买城市';
    if (!formData.country.trim()) newErrors.country = '请输入购买国家';
    if (!formData.purchaseDate) newErrors.purchaseDate = '请选择购买日期';
    if (!formData.frontImage.trim()) newErrors.frontImage = '请上传正面照片';
    if (formData.width <= 0) newErrors.width = '请输入有效宽度';
    if (formData.height <= 0) newErrors.height = '请输入有效高度';
    if (formData.price < 0) newErrors.price = '价格不能为负数';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const companions = formData.travelCompanions
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const tags = formData.travelTags
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const magnetData = {
      name: formData.name.trim(),
      city: formData.city.trim(),
      country: formData.country.trim(),
      coordinates: formData.coordinates || undefined,
      purchaseLocation: formData.purchaseLocation.trim() || undefined,
      shopName: formData.shopName.trim() || undefined,
      travelCompanions: companions.length > 0 ? companions : undefined,
      travelTags: tags.length > 0 ? tags : undefined,
      notes: formData.notes.trim() || undefined,
      purchaseDate: formData.purchaseDate,
      material: formData.material,
      category: formData.category,
      width: formData.width,
      height: formData.height,
      price: formData.price,
      currency: formData.currency,
      rating: formData.rating,
      isTreasure: formData.isTreasure,
      frontImage: formData.frontImage,
      sideImage: formData.sideImage || undefined,
      photos: formData.photos,
      story: formData.story.trim(),
      displayStatus: formData.displayStatus,
    };

    if (editMagnet) {
      updateMagnet(editMagnet.id, magnetData);
      onClose();
    } else {
      addMagnet(magnetData);
      if (isBatch && onBatchAdd) {
        setFormData(defaultFormData);
        onBatchAdd();
      } else {
        onClose();
      }
    }
  };

  const handleSaveAndContinue = () => {
    if (!validate()) return;
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm">
      <div className="bg-cream-50 rounded-2xl shadow-card w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-semibold text-ink-800">
              {editMagnet ? '编辑旅行记忆' : isBatch ? '批量添加旅行记忆' : '添加旅行记忆'}
            </h2>
            {isBatch && !editMagnet && (
              <span className="chip bg-sage-100 text-sage-600">批量模式</span>
            )}
          </div>
          <button onClick={onClose} className="btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-ink-100 bg-white">
          {[
            { key: 'basic', label: '基本信息', icon: MapPin },
            { key: 'photos', label: '照片相册', icon: ImagePlus },
            { key: 'story', label: '旅行故事', icon: Sparkles },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'text-terracotta-600 border-b-2 border-terracotta-500 bg-terracotta-50/50'
                  : 'text-ink-500 hover:text-ink-700 hover:bg-ink-50'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'basic' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="label-text">冰箱贴名称 *</label>
                  <input
                    type="text"
                    className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-200' : ''}`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="如：埃菲尔铁塔"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="label-text">国家 *</label>
                  <input
                    type="text"
                    className={`input-field ${errors.country ? 'border-red-400 focus:ring-red-200' : ''}`}
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="如：法国"
                  />
                  {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
                </div>

                <div>
                  <label className="label-text">城市 *</label>
                  <div className="relative">
                    <input
                      type="text"
                      className={`input-field pr-20 ${errors.city ? 'border-red-400 focus:ring-red-200' : ''}`}
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="如：巴黎"
                    />
                    {CITY_COORDINATES[formData.city] && !formData.coordinates && (
                      <button
                        type="button"
                        onClick={handleAutoFillCoordinates}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-terracotta-100 text-terracotta-600 rounded-md hover:bg-terracotta-200 transition-colors"
                      >
                        一键填充坐标
                      </button>
                    )}
                  </div>
                  {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="label-text flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-terracotta-500" />
                    坐标（选填，用于地图标记）
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      step="0.0001"
                      className="input-field"
                      value={formData.coordinates?.lat ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coordinates: e.target.value
                            ? { lat: parseFloat(e.target.value), lng: formData.coordinates?.lng ?? 0 }
                            : null,
                        })
                      }
                      placeholder="纬度，如 48.8584"
                    />
                    <input
                      type="number"
                      step="0.0001"
                      className="input-field"
                      value={formData.coordinates?.lng ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coordinates: e.target.value
                            ? { lat: formData.coordinates?.lat ?? 0, lng: parseFloat(e.target.value) }
                            : null,
                        })
                      }
                      placeholder="经度，如 2.2945"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-text">购买地点</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.purchaseLocation}
                    onChange={(e) => setFormData({ ...formData, purchaseLocation: e.target.value })}
                    placeholder="如：埃菲尔铁塔纪念品店"
                  />
                </div>

                <div>
                  <label className="label-text">店铺名</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    placeholder="如：La Tour Eiffel Gift Shop"
                  />
                </div>

                <div>
                  <label className="label-text flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-sage-500" />
                    同行人
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.travelCompanions}
                    onChange={(e) => setFormData({ ...formData, travelCompanions: e.target.value })}
                    placeholder="多人用逗号分隔，如：家人, 朋友"
                  />
                </div>

                <div>
                  <label className="label-text flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-terracotta-500" />
                    旅行标签
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.travelTags}
                    onChange={(e) => setFormData({ ...formData, travelTags: e.target.value })}
                    placeholder="用逗号分隔，如：浪漫, 地标, 经典"
                  />
                </div>

                <div>
                  <label className="label-text">购买日期 *</label>
                  <input
                    type="date"
                    className={`input-field ${errors.purchaseDate ? 'border-red-400 focus:ring-red-200' : ''}`}
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  />
                  {errors.purchaseDate && (
                    <p className="mt-1 text-xs text-red-500">{errors.purchaseDate}</p>
                  )}
                </div>

                <div>
                  <label className="label-text">展示状态</label>
                  <select
                    className="select-field"
                    value={formData.displayStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, displayStatus: e.target.value as DisplayStatus })
                    }
                  >
                    {DISPLAY_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label-text">材质</label>
                  <select
                    className="select-field"
                    value={formData.material}
                    onChange={(e) =>
                      setFormData({ ...formData, material: e.target.value as Material })
                    }
                  >
                    {MATERIALS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label-text">类型</label>
                  <select
                    className="select-field"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as FridgeMagnetCategory })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label-text">宽度 (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className={`input-field ${errors.width ? 'border-red-400 focus:ring-red-200' : ''}`}
                    value={formData.width}
                    onChange={(e) =>
                      setFormData({ ...formData, width: parseFloat(e.target.value) || 0 })
                    }
                  />
                  {errors.width && <p className="mt-1 text-xs text-red-500">{errors.width}</p>}
                </div>

                <div>
                  <label className="label-text">高度 (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className={`input-field ${errors.height ? 'border-red-400 focus:ring-red-200' : ''}`}
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })
                    }
                  />
                  {errors.height && <p className="mt-1 text-xs text-red-500">{errors.height}</p>}
                </div>

                <div>
                  <label className="label-text">价格</label>
                  <input
                    type="number"
                    step="0.01"
                    className={`input-field ${errors.price ? 'border-red-400 focus:ring-red-200' : ''}`}
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                  />
                  {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                </div>

                <div>
                  <label className="label-text">货币</label>
                  <select
                    className="select-field"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  >
                    <option value="CNY">CNY 人民币</option>
                    <option value="EUR">EUR 欧元</option>
                    <option value="USD">USD 美元</option>
                    <option value="JPY">JPY 日元</option>
                    <option value="GBP">GBP 英镑</option>
                    <option value="KRW">KRW 韩元</option>
                    <option value="MXN">MXN 墨西哥比索</option>
                    <option value="SGD">SGD 新加坡元</option>
                    <option value="THB">THB 泰铢</option>
                    <option value="AUD">AUD 澳元</option>
                    <option value="CAD">CAD 加元</option>
                    <option value="CHF">CHF 瑞士法郎</option>
                    <option value="HKD">HKD 港币</option>
                    <option value="TWD">TWD 新台币</option>
                  </select>
                </div>

                <div>
                  <label className="label-text flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500" />
                    喜爱评分
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={cn(
                            'w-6 h-6',
                            star <= formData.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-ink-200'
                          )}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-ink-500">{formData.rating} 星</span>
                  </div>
                </div>

                <div>
                  <label className="label-text flex items-center gap-1.5">
                    <Gem className="w-4 h-4 text-terracotta-500" />
                    珍藏标记
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isTreasure: !formData.isTreasure })}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all',
                      formData.isTreasure
                        ? 'border-terracotta-400 bg-terracotta-50 text-terracotta-600'
                        : 'border-ink-200 bg-white text-ink-500 hover:border-ink-300'
                    )}
                  >
                    <Gem
                      className={cn('w-5 h-5', formData.isTreasure ? 'fill-terracotta-500' : '')}
                    />
                    {formData.isTreasure ? '已标记为珍藏' : '点击标记为珍藏'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="label-text">正面照片 *</label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                      errors.frontImage
                        ? 'border-red-300 bg-red-50/30'
                        : 'border-ink-200 hover:border-terracotta-300 bg-white'
                    }`}
                  >
                    {formData.frontImage ? (
                      <div className="relative">
                        <img
                          src={formData.frontImage}
                          alt="正面"
                          className="w-full h-40 object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, frontImage: '' })}
                          className="absolute top-1 right-1 p-1 bg-ink-900/60 text-white rounded-full hover:bg-ink-900/80"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block py-8">
                        <Upload className="w-10 h-10 mx-auto text-ink-400 mb-2" />
                        <p className="text-sm text-ink-500">点击上传或粘贴图片链接</p>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files?.[0] && handleFileUpload('frontImage', e.target.files[0])
                          }
                        />
                      </label>
                    )}
                  </div>
                  {!formData.frontImage && (
                    <input
                      type="text"
                      placeholder="或粘贴图片URL"
                      className="input-field mt-2 text-xs"
                      onChange={(e) => handleImageUrl('frontImage', e.target.value)}
                    />
                  )}
                  {errors.frontImage && (
                    <p className="mt-1 text-xs text-red-500">{errors.frontImage}</p>
                  )}
                </div>

                <div>
                  <label className="label-text">侧面照片（选填）</label>
                  <div className="relative border-2 border-dashed border-ink-200 hover:border-terracotta-300 rounded-xl p-4 text-center bg-white transition-all">
                    {formData.sideImage ? (
                      <div className="relative">
                        <img
                          src={formData.sideImage}
                          alt="侧面"
                          className="w-full h-40 object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, sideImage: '' })}
                          className="absolute top-1 right-1 p-1 bg-ink-900/60 text-white rounded-full hover:bg-ink-900/80"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block py-8">
                        <Upload className="w-10 h-10 mx-auto text-ink-400 mb-2" />
                        <p className="text-sm text-ink-500">点击上传或粘贴图片链接</p>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files?.[0] && handleFileUpload('sideImage', e.target.files[0])
                          }
                        />
                      </label>
                    )}
                  </div>
                  {!formData.sideImage && (
                    <input
                      type="text"
                      placeholder="或粘贴图片URL"
                      className="input-field mt-2 text-xs"
                      onChange={(e) => handleImageUrl('sideImage', e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div className="border-t border-ink-100 pt-5">
                <label className="label-text mb-3 block">更多照片相册（背面、包装、购买场景等）</label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {formData.photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.url}
                        alt={photo.caption || photo.type}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-ink-900/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-900/80 to-transparent p-2 rounded-b-lg">
                        <p className="text-[10px] text-white truncate">
                          {PHOTO_TYPES.find((t) => t.value === photo.type)?.label}
                          {photo.caption ? `: ${photo.caption}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card p-4 bg-ink-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-ink-500 mb-1 block">照片类型</label>
                      <select
                        className="select-field text-sm"
                        value={newPhotoType}
                        onChange={(e) => setNewPhotoType(e.target.value as PhotoType)}
                      >
                        {PHOTO_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-ink-500 mb-1 block">图片说明（选填）</label>
                      <input
                        type="text"
                        className="input-field text-sm"
                        value={newPhotoCaption}
                        onChange={(e) => setNewPhotoCaption(e.target.value)}
                        placeholder="如：精美的包装盒"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      className="input-field text-sm flex-1"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="粘贴图片URL..."
                    />
                    <label className="btn-secondary gap-1.5 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      上传
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] && handleFileUploadPhoto(e.target.files[0])
                        }
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      disabled={!newPhotoUrl.trim()}
                      className="btn-primary gap-1.5 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      添加
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'story' && (
            <div className="space-y-5">
              <div>
                <label className="label-text">旅行故事 / 购买场景</label>
                <textarea
                  className="input-field min-h-[200px] resize-y"
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  placeholder="记录一下这枚冰箱贴背后的故事吧..."
                />
              </div>

              <div>
                <label className="label-text">备注</label>
                <textarea
                  className="input-field min-h-[100px] resize-y"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="其他需要记录的信息..."
                />
              </div>
            </div>
          )}
        </form>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-ink-100 bg-white">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'w-4 h-4',
                    star <= formData.rating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-ink-200'
                  )}
                />
              ))}
            </div>
            {formData.isTreasure && (
              <span className="chip bg-terracotta-100 text-terracotta-600">
                <Gem className="w-3 h-3 mr-1" />
                珍藏
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">
              取消
            </button>
            {isBatch && !editMagnet && (
              <button
                type="button"
                onClick={handleSaveAndContinue}
                className="btn-secondary border-terracotta-300 text-terracotta-600 hover:bg-terracotta-50"
              >
                保存并继续添加
              </button>
            )}
            <button type="submit" onClick={handleSubmit} className="btn-primary">
              {editMagnet ? '保存修改' : '添加收藏'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
