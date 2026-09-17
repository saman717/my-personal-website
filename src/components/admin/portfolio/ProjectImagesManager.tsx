'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import {
  addProjectImage,
  deleteProjectImage,
  setImageAsPrimary,
  updateImageAlt,
  type ProjectImage,
} from '@/actions/admin-portfolio';
import { useRouter } from 'next/navigation';

interface Props {
  projectId: string;
  initialImages: ProjectImage[];
}

function isValidUrl(str: string) {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function ProjectImagesManager({ projectId, initialImages }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<ProjectImage[]>(initialImages);

  // فرم افزودن تصویر جدید
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [newIsPrimary, setNewIsPrimary] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // ویرایش alt هر تصویر
  const [editingAltId, setEditingAltId] = useState<string | null>(null);
  const [editingAltValue, setEditingAltValue] = useState('');

  function handleAdd() {
    if (!newUrl.trim()) { setAddError('URL تصویر را وارد کنید.'); return; }
    if (!isValidUrl(newUrl.trim())) { setAddError('URL باید با https:// یا http:// شروع شود.'); return; }
    setAddError(null);

    startTransition(async () => {
      const result = await addProjectImage(projectId, newUrl.trim(), newAlt.trim(), newIsPrimary);
      if (result.success && result.image) {
        // از real DB id استفاده می‌کنیم — هرگز Date.now() نه
        const newImg: ProjectImage = result.image as ProjectImage;
        setImages(prev =>
          newIsPrimary
            ? [...prev.map(i => ({ ...i, isPrimary: 0 })), newImg]
            : [...prev, newImg]
        );
      }
      setNewUrl('');
      setNewAlt('');
      setNewIsPrimary(false);
      router.refresh();
    });
  }

  function handleDelete(imageId: string) {
    startTransition(async () => {
      await deleteProjectImage(imageId, projectId);
      setImages(prev => prev.filter(i => i.id !== imageId));
      router.refresh();
    });
  }

  function handleSetPrimary(imageId: string) {
    startTransition(async () => {
      await setImageAsPrimary(imageId, projectId);
      setImages(prev => prev.map(i => ({ ...i, isPrimary: i.id === imageId ? 1 : 0 })));
      router.refresh();
    });
  }

  function handleSaveAlt(imageId: string) {
    startTransition(async () => {
      await updateImageAlt(imageId, editingAltValue);
      setImages(prev => prev.map(i => i.id === imageId ? { ...i, alt: editingAltValue || null } : i));
      setEditingAltId(null);
    });
  }

  const primaryImage = images.find(i => i.isPrimary === 1);
  const galleryImages = images.filter(i => i.isPrimary !== 1);

  return (
    <div className="flex flex-col gap-5">
      {/* ─── راهنما ────────────────────────────────────────────────────── */}
      <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-xs text-blue-400">
        🖼️ تصویر شاخص در کارت پروژه و هِدِر صفحه نمایش داده می‌شه. بقیه تصاویر در گالری پایین صفحه ظاهر می‌شن. URL تصاویر رو از Supabase Storage کپی کن.
      </div>

      {/* ─── تصویر شاخص ───────────────────────────────────────────────── */}
      {primaryImage && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">تصویر شاخص</span>
          <div className="relative flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-white/5">
              {isValidUrl(primaryImage.url) ? (
                <Image src={primaryImage.url} alt={primaryImage.alt ?? ''} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">{primaryImage.url}</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-emerald-400 font-medium mb-1">✓ تصویر شاخص</p>
              {editingAltId === primaryImage.id ? (
                <div className="flex gap-2">
                  <input
                    value={editingAltValue}
                    onChange={e => setEditingAltValue(e.target.value)}
                    placeholder="متن جایگزین (alt)"
                    className="flex-1 text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-gray-300 focus:outline-none focus:border-purple-500/50"
                  />
                  <button onClick={() => handleSaveAlt(primaryImage.id)} className="text-xs text-emerald-400 hover:text-emerald-300 px-2">ذخیره</button>
                  <button onClick={() => setEditingAltId(null)} className="text-xs text-gray-500 hover:text-gray-300 px-1">×</button>
                </div>
              ) : (
                <button
                  onClick={() => { setEditingAltId(primaryImage.id); setEditingAltValue(primaryImage.alt ?? ''); }}
                  className="text-xs text-gray-500 hover:text-gray-300 text-right w-full truncate"
                >
                  {primaryImage.alt ? `alt: ${primaryImage.alt}` : 'کلیک کنید تا alt تنظیم کنید'}
                </button>
              )}
            </div>
            <button
              onClick={() => handleDelete(primaryImage.id)}
              disabled={isPending}
              className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ─── گالری ────────────────────────────────────────────────────── */}
      {galleryImages.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">تصاویر گالری ({galleryImages.length})</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {galleryImages.map(img => (
              <div key={img.id} className="group relative flex flex-col gap-1.5 p-2.5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-white/5">
                  {isValidUrl(img.url) ? (
                    <Image src={img.url} alt={img.alt ?? ''} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">{img.url}</div>
                  )}
                  {/* overlay buttons */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleSetPrimary(img.id)}
                      disabled={isPending}
                      title="تعیین به عنوان شاخص"
                      className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(img.id)}
                      disabled={isPending}
                      title="حذف"
                      className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
                {/* alt editor */}
                {editingAltId === img.id ? (
                  <div className="flex gap-1.5">
                    <input
                      value={editingAltValue}
                      onChange={e => setEditingAltValue(e.target.value)}
                      placeholder="alt"
                      className="flex-1 text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-gray-300 focus:outline-none focus:border-purple-500/50"
                    />
                    <button onClick={() => handleSaveAlt(img.id)} className="text-xs text-emerald-400">✓</button>
                    <button onClick={() => setEditingAltId(null)} className="text-xs text-gray-500">×</button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingAltId(img.id); setEditingAltValue(img.alt ?? ''); }}
                    className="text-xs text-gray-600 hover:text-gray-400 text-right truncate"
                  >
                    {img.alt || 'تنظیم alt...'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-600">
          <span className="text-3xl">🖼️</span>
          <p className="text-sm">هنوز تصویری اضافه نشده</p>
        </div>
      )}

      {/* ─── افزودن تصویر جدید ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3 p-4 border border-dashed border-white/10 rounded-xl hover:border-purple-500/20 transition-colors">
        <span className="text-xs font-medium text-gray-400">افزودن تصویر جدید</span>
        <div className="flex flex-col gap-2.5">
          <input
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="URL تصویر (https://...)"
            dir="ltr"
            className="bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all"
          />
          <div className="flex gap-2.5">
            <input
              value={newAlt}
              onChange={e => setNewAlt(e.target.value)}
              placeholder="متن جایگزین (alt) — اختیاری"
              dir="rtl"
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all"
            />
            <label className="flex items-center gap-2 px-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={newIsPrimary}
                onChange={e => setNewIsPrimary(e.target.checked)}
                className="w-4 h-4 accent-emerald-500"
              />
              <span className="text-sm text-gray-400">تصویر شاخص</span>
            </label>
          </div>
          {newUrl && isValidUrl(newUrl) && (
            <div className="relative w-full h-24 rounded-lg overflow-hidden bg-white/5">
              <Image src={newUrl} alt="پیش‌نمایش" fill className="object-cover" />
            </div>
          )}
          {addError && <p className="text-xs text-red-400">{addError}</p>}
          <button
            onClick={handleAdd}
            disabled={isPending || !newUrl.trim()}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            )}
            افزودن تصویر
          </button>
        </div>
      </div>
    </div>
  );
}
