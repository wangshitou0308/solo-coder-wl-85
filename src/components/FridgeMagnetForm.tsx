import { useState, useEffect } from 'react';
import { X, Upload, MapPin } from 'lucide-react';
import type { FridgeMagnet, Material, FridgeMagnetCategory, DisplayStatus, Coordinates } from '@/types';
import { MATERIALS, CATEGORIES, DISPLAY_STATUSES } from '@/types';
import { useFridgeMagnetStore } from '@/store/useFridgeMagnetStore';

interface FridgeMagnetFormProps {
  open: boolean;
  onClose: () => void;
  editMagnet?: FridgeMagnet | null;
}

interface FormData {
  name: string;
  city: string;
  country: string;
  coordinates: Coordinates | null;
  purchaseDate: string;
  material: Material;
  category: FridgeMagnetCategory;
  width: number;
  height: number;
  price: number;
  currency: string;
  frontImage: string;
  sideImage: string;
  story: string;
  displayStatus: DisplayStatus;
}

const defaultFormData: FormData = {
  name: '',
  city: '',
  country: '',
  coordinates: null,
  purchaseDate: new Date().toISOString().split('T')[0],
  material: '树脂',
  category: '城市地标',
  width: 5,
  height: 5,
  price: 0,
  currency: 'CNY',
  frontImage: '',
  sideImage: '',
  story: '',
  displayStatus: '在冰箱上',
};

export default function FridgeMagnetForm({ open, onClose, editMagnet }: FridgeMagnetFormProps) {
  const { addMagnet, updateMagnet } = useFridgeMagnetStore();
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editMagnet) {
      setFormData({
        name: editMagnet.name,
        city: editMagnet.city,
        country: editMagnet.country,
        coordinates: editMagnet.coordinates || null,
        purchaseDate: editMagnet.purchaseDate,
        material: editMagnet.material,
        category: editMagnet.category,
        width: editMagnet.width,
        height: editMagnet.height,
        price: editMagnet.price,
        currency: editMagnet.currency,
        frontImage: editMagnet.frontImage,
        sideImage: editMagnet.sideImage || '',
        story: editMagnet.story,
        displayStatus: editMagnet.displayStatus,
      });
    } else {
      setFormData(defaultFormData);
    }
    setErrors({});
  }, [editMagnet, open]);

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

    const magnetData = {
      name: formData.name.trim(),
      city: formData.city.trim(),
      country: formData.country.trim(),
      coordinates: formData.coordinates || undefined,
      purchaseDate: formData.purchaseDate,
      material: formData.material,
      category: formData.category,
      width: formData.width,
      height: formData.height,
      price: formData.price,
      currency: formData.currency,
      frontImage: formData.frontImage,
      sideImage: formData.sideImage || undefined,
      story: formData.story.trim(),
      displayStatus: formData.displayStatus,
    };

    if (editMagnet) {
      updateMagnet(editMagnet.id, magnetData);
    } else {
      addMagnet(magnetData);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm">
      <div className="bg-cream-50 rounded-2xl shadow-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100 bg-white">
          <h2 className="font-display text-xl font-semibold text-ink-800">
            {editMagnet ? '编辑冰箱贴' : '添加新冰箱贴'}
          </h2>
          <button onClick={onClose} className="btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
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
              <input
                type="text"
                className={`input-field ${errors.city ? 'border-red-400 focus:ring-red-200' : ''}`}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="如：巴黎"
              />
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
              <label className="label-text">购买日期 *</label>
              <input
                type="date"
                className={`input-field ${errors.purchaseDate ? 'border-red-400 focus:ring-red-200' : ''}`}
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
              {errors.purchaseDate && <p className="mt-1 text-xs text-red-500">{errors.purchaseDate}</p>}
            </div>

            <div>
              <label className="label-text">展示状态</label>
              <select
                className="select-field"
                value={formData.displayStatus}
                onChange={(e) => setFormData({ ...formData, displayStatus: e.target.value as DisplayStatus })}
              >
                {DISPLAY_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-text">材质</label>
              <select
                className="select-field"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value as Material })}
              >
                {MATERIALS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-text">类型</label>
              <select
                className="select-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as FridgeMagnetCategory })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
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
                onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) || 0 })}
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
                onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
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
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
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
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label-text">正面照片 *</label>
              <div className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                errors.frontImage ? 'border-red-300 bg-red-50/30' : 'border-ink-200 hover:border-terracotta-300 bg-white'
              }`}>
                {formData.frontImage ? (
                  <div className="relative">
                    <img src={formData.frontImage} alt="正面" className="w-full h-32 object-contain rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, frontImage: '' })}
                      className="absolute top-1 right-1 p-1 bg-ink-900/60 text-white rounded-full hover:bg-ink-900/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block py-6">
                    <Upload className="w-8 h-8 mx-auto text-ink-400 mb-2" />
                    <p className="text-sm text-ink-500">点击上传或粘贴图片链接</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('frontImage', e.target.files[0])}
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
              {errors.frontImage && <p className="mt-1 text-xs text-red-500">{errors.frontImage}</p>}
            </div>

            <div>
              <label className="label-text">侧面照片（选填）</label>
              <div className="relative border-2 border-dashed border-ink-200 hover:border-terracotta-300 rounded-xl p-4 text-center bg-white transition-all">
                {formData.sideImage ? (
                  <div className="relative">
                    <img src={formData.sideImage} alt="侧面" className="w-full h-32 object-contain rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, sideImage: '' })}
                      className="absolute top-1 right-1 p-1 bg-ink-900/60 text-white rounded-full hover:bg-ink-900/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block py-6">
                    <Upload className="w-8 h-8 mx-auto text-ink-400 mb-2" />
                    <p className="text-sm text-ink-500">点击上传或粘贴图片链接</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('sideImage', e.target.files[0])}
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

          <div>
            <label className="label-text">旅行故事 / 购买场景</label>
            <textarea
              className="input-field min-h-[100px] resize-y"
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              placeholder="记录一下这枚冰箱贴背后的故事吧..."
            />
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-ink-100 bg-white">
          <button type="button" onClick={onClose} className="btn-secondary">取消</button>
          <button type="submit" onClick={handleSubmit} className="btn-primary">
            {editMagnet ? '保存修改' : '添加收藏'}
          </button>
        </div>
      </div>
    </div>
  );
}
