'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProject, updateProject, createTechnology, type ProjectFormData } from '@/actions/admin-portfolio';

interface TechOption {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
}

interface ProjectFormProps {
  locale: string;
  initialData?: Partial<ProjectFormData> & { id?: string };
  mode: 'create' | 'edit';
  availableTechnologies?: TechOption[];
}

type TabKey = 'fa' | 'en' | 'html' | 'meta';

const tabLabels: Record<TabKey, string> = {
  fa: 'فارسی',
  en: 'English',
  html: 'محتوای HTML',
  meta: 'متا / لینک‌ها',
};

// ─── JSON Validation ──────────────────────────────────────────────────────────
function validateJson(value: string): string | null {
  if (!value || value.trim() === '[]' || value.trim() === '') return null;
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return 'باید آرایه باشد — مثال: [{"key":"value"}, ...]';
    return null;
  } catch {
    return 'فرمت JSON نادرست — باید آرایه باشد، مثال: [{"type":"live","url":"https://..."}]';
  }
}

// ─── InputField ───────────────────────────────────────────────────────────────
function InputField({ label, name, value, onChange, placeholder, required, dir }: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; dir?: 'rtl' | 'ltr';
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-gray-400">{label}{required && <span className="text-red-400 mr-0.5">*</span>}</label>
      <input
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
      />
    </div>
  );
}

// ─── TextareaField ────────────────────────────────────────────────────────────
function TextareaField({ label, name, value, onChange, placeholder, rows, dir, error }: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number; dir?: 'rtl' | 'ltr'; error?: string | null;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs text-gray-400">{label}</label>}
      <textarea
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows ?? 4}
        dir={dir}
        className={`bg-white/[0.03] border rounded-xl px-3.5 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:bg-white/[0.05] transition-all resize-y admin-neon-scrollbar ${
          error
            ? 'border-red-500/60 focus:border-red-500/80'
            : 'border-white/10 focus:border-purple-500/50'
        }`}
      />
      {error && (
        <p className="text-xs text-red-400 flex items-start gap-1.5 mt-0.5">
          <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── TechnologySelector ───────────────────────────────────────────────────────
function TechnologySelector({
  selected,
  onChange,
  available,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
  available: TechOption[];
}) {
  const [localTechs, setLocalTechs] = useState<TechOption[]>(available);
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [addSlug, setAddSlug] = useState('');
  const [addIcon, setAddIcon] = useState('');
  const [addPending, startAddTransition] = useTransition();
  const [addError, setAddError] = useState<string | null>(null);

  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  }

  function handleAdd() {
    if (!addName.trim() || !addSlug.trim()) {
      setAddError('نام و Slug الزامی هستند');
      return;
    }
    setAddError(null);
    startAddTransition(async () => {
      try {
        const result = await createTechnology(addName, addSlug, addIcon || undefined);
        if (result.success && result.tech) {
          const newTech: TechOption = result.tech;
          setLocalTechs(prev => [...prev, newTech]);
          onChange([...selected, newTech.id]);
          setAddName(''); setAddSlug(''); setAddIcon('');
          setShowAdd(false);
        }
      } catch (e) {
        setAddError(String(e));
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Chips */}
      {localTechs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {localTechs.map(tech => {
            const isSelected = selected.includes(tech.id);
            return (
              <button
                key={tech.id}
                type="button"
                onClick={() => toggle(tech.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  isSelected
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                    : 'bg-white/[0.03] border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20'
                }`}
              >
                {tech.icon && <span>{tech.icon}</span>}
                {tech.name}
                {isSelected && (
                  <svg className="w-3 h-3 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}

      {localTechs.length === 0 && !showAdd && (
        <p className="text-xs text-gray-600">هیچ تکنولوژی‌ای تعریف نشده — اولین مورد را اضافه کنید</p>
      )}

      {/* Add new inline */}
      {!showAdd ? (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-white/15 text-xs text-gray-500 hover:text-gray-300 hover:border-purple-500/40 transition-all"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          افزودن تکنولوژی جدید
        </button>
      ) : (
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/8 flex flex-col gap-3">
          <p className="text-xs font-medium text-gray-400">تکنولوژی جدید</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              value={addName}
              onChange={e => setAddName(e.target.value)}
              placeholder="نام (مثلاً: React)"
              className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
            />
            <input
              value={addSlug}
              onChange={e => setAddSlug(e.target.value)}
              placeholder="Slug (مثلاً: react)"
              dir="ltr"
              className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
            />
            <input
              value={addIcon}
              onChange={e => setAddIcon(e.target.value)}
              placeholder="آیکون اختیاری (مثلاً: ⚛️)"
              className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
            />
          </div>
          {addError && <p className="text-xs text-red-400">{addError}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={addPending}
              className="px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-500 text-white text-xs transition-all disabled:opacity-50"
            >
              {addPending ? 'در حال ذخیره...' : 'ذخیره و انتخاب'}
            </button>
            <button
              type="button"
              onClick={() => { setShowAdd(false); setAddError(null); setAddName(''); setAddSlug(''); setAddIcon(''); }}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-500 hover:text-gray-300 transition-all"
            >
              انصراف
            </button>
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <p className="text-xs text-gray-600">{selected.length} تکنولوژی انتخاب شده</p>
      )}
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function ProjectForm({ locale, initialData, mode, availableTechnologies = [] }: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<TabKey>('fa');
  const [error, setError] = useState<string | null>(null);
  const [jsonErrors, setJsonErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

  const [form, setForm] = useState<ProjectFormData>({
    slug: initialData?.slug ?? '',
    status: initialData?.status ?? 'draft',
    sortOrder: initialData?.sortOrder ?? 0,
    fa_title: initialData?.fa_title ?? '',
    fa_brief: initialData?.fa_brief ?? '',
    fa_badge: initialData?.fa_badge ?? '',
    fa_metaRole: initialData?.fa_metaRole ?? '',
    fa_metaPlatform: initialData?.fa_metaPlatform ?? '',
    fa_metaCategory: initialData?.fa_metaCategory ?? '',
    fa_metaStatus: initialData?.fa_metaStatus ?? '',
    fa_challengeTitle: initialData?.fa_challengeTitle ?? '',
    fa_challengeText: initialData?.fa_challengeText ?? '',
    fa_solutionTitle: initialData?.fa_solutionTitle ?? '',
    fa_solutionSteps: initialData?.fa_solutionSteps ?? '[]',
    fa_resultsTitle: initialData?.fa_resultsTitle ?? '',
    fa_resultsItems: initialData?.fa_resultsItems ?? '[]',
    fa_techStackTitle: initialData?.fa_techStackTitle ?? '',
    en_title: initialData?.en_title ?? '',
    en_brief: initialData?.en_brief ?? '',
    en_badge: initialData?.en_badge ?? '',
    en_metaRole: initialData?.en_metaRole ?? '',
    en_metaPlatform: initialData?.en_metaPlatform ?? '',
    en_metaCategory: initialData?.en_metaCategory ?? '',
    en_metaStatus: initialData?.en_metaStatus ?? '',
    en_challengeTitle: initialData?.en_challengeTitle ?? '',
    en_challengeText: initialData?.en_challengeText ?? '',
    en_solutionTitle: initialData?.en_solutionTitle ?? '',
    en_solutionSteps: initialData?.en_solutionSteps ?? '[]',
    en_resultsTitle: initialData?.en_resultsTitle ?? '',
    en_resultsItems: initialData?.en_resultsItems ?? '[]',
    en_techStackTitle: initialData?.en_techStackTitle ?? '',
    fa_contentHtml: initialData?.fa_contentHtml ?? '',
    en_contentHtml: initialData?.en_contentHtml ?? '',
    links: initialData?.links ?? '[]',
    technologyIds: initialData?.technologyIds ?? '[]',
  });

  function set(key: keyof ProjectFormData) {
    return (value: string | number) => setForm(f => ({ ...f, [key]: value }));
  }

  function setJsonField(key: keyof ProjectFormData) {
    return (value: string) => {
      setForm(f => ({ ...f, [key]: value }));
      const err = validateJson(value as string);
      setJsonErrors(e => ({ ...e, [key]: err ?? undefined }));
    };
  }

  const selectedTechIds: string[] = (() => {
    try { return JSON.parse(form.technologyIds ?? '[]') as string[]; }
    catch { return []; }
  })();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.slug || !form.fa_title || !form.en_title) {
      setError('لطفاً Slug، عنوان فارسی و عنوان انگلیسی را وارد کنید.');
      return;
    }
    const hasJsonError = Object.values(jsonErrors).some(Boolean);
    if (hasJsonError) {
      setError('لطفاً خطاهای فرمت JSON را رفع کنید (فیلدهای قرمز).');
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        if (mode === 'create') {
          const result = await createProject(form);
          if (result.success) router.push(`/${locale}/admin/portfolio`);
        } else if (mode === 'edit' && initialData?.id) {
          const result = await updateProject(initialData.id, form);
          if (result.success) router.push(`/${locale}/admin/portfolio`);
        }
      } catch (err) {
        setError(String(err));
      }
    });
  }

  const tabs: TabKey[] = ['fa', 'en', 'html', 'meta'];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" dir="rtl">

      {/* ─── Basic Info ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/5 bg-[#0d0d12]/60 backdrop-blur-xl p-5 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-300 border-b border-white/5 pb-3">اطلاعات پایه</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField label="Slug (URL)" name="slug" value={form.slug} onChange={set('slug')} placeholder="my-project" required dir="ltr" />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">وضعیت</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as ProjectFormData['status'] }))}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 transition-all"
            >
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشر شده</option>
              <option value="archived">بایگانی</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">ترتیب نمایش</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ─── Tabbed content ──────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/5 bg-[#0d0d12]/60 backdrop-blur-xl overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-white/5">
          {tabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-medium transition-all ${
                activeTab === tab
                  ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-500/5'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* ─── فارسی ─── */}
          {activeTab === 'fa' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="عنوان فارسی" name="fa_title" value={form.fa_title} onChange={set('fa_title')} required dir="rtl" />
                <InputField label="بج / تگ (مثلاً: پروژه شخصی)" name="fa_badge" value={form.fa_badge ?? ''} onChange={set('fa_badge')} dir="rtl" />
              </div>
              <TextareaField label="توضیح کوتاه (Brief)" name="fa_brief" value={form.fa_brief} onChange={set('fa_brief')} rows={3} dir="rtl" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="عنوان بخش چالش" name="fa_challengeTitle" value={form.fa_challengeTitle ?? ''} onChange={set('fa_challengeTitle')} dir="rtl" />
                <InputField label="عنوان بخش راه‌حل" name="fa_solutionTitle" value={form.fa_solutionTitle ?? ''} onChange={set('fa_solutionTitle')} dir="rtl" />
              </div>
              <TextareaField label="متن چالش" name="fa_challengeText" value={form.fa_challengeText ?? ''} onChange={set('fa_challengeText')} rows={3} dir="rtl" />
              <TextareaField
                label='گام‌های راه‌حل (JSON آرایه)'
                name="fa_solutionSteps"
                value={form.fa_solutionSteps ?? '[]'}
                onChange={setJsonField('fa_solutionSteps')}
                placeholder='[{"step":"گام اول","detail":"توضیح اختیاری"},{"step":"گام دوم"}]'
                rows={4}
                dir="ltr"
                error={jsonErrors.fa_solutionSteps}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="عنوان بخش نتایج" name="fa_resultsTitle" value={form.fa_resultsTitle ?? ''} onChange={set('fa_resultsTitle')} dir="rtl" />
                <InputField label="عنوان بخش تکنولوژی‌ها" name="fa_techStackTitle" value={form.fa_techStackTitle ?? ''} onChange={set('fa_techStackTitle')} dir="rtl" />
              </div>
              <TextareaField
                label='آیتم‌های نتایج (JSON آرایه)'
                name="fa_resultsItems"
                value={form.fa_resultsItems ?? '[]'}
                onChange={setJsonField('fa_resultsItems')}
                placeholder='[{"label":"نرخ رشد ارگانیک","value":"۴۰٪"},{"label":"زمان بارگذاری","value":"۱.۲ ثانیه"}]'
                rows={4}
                dir="ltr"
                error={jsonErrors.fa_resultsItems}
              />
            </div>
          )}

          {/* ─── English ─── */}
          {activeTab === 'en' && (
            <div className="flex flex-col gap-4" dir="ltr">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="English Title" name="en_title" value={form.en_title} onChange={set('en_title')} required dir="ltr" />
                <InputField label="Badge / Tag" name="en_badge" value={form.en_badge ?? ''} onChange={set('en_badge')} dir="ltr" />
              </div>
              <TextareaField label="Brief" name="en_brief" value={form.en_brief} onChange={set('en_brief')} rows={3} dir="ltr" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Challenge Section Title" name="en_challengeTitle" value={form.en_challengeTitle ?? ''} onChange={set('en_challengeTitle')} dir="ltr" />
                <InputField label="Solution Section Title" name="en_solutionTitle" value={form.en_solutionTitle ?? ''} onChange={set('en_solutionTitle')} dir="ltr" />
              </div>
              <TextareaField label="Challenge Text" name="en_challengeText" value={form.en_challengeText ?? ''} onChange={set('en_challengeText')} rows={3} dir="ltr" />
              <TextareaField
                label="Solution Steps (JSON array)"
                name="en_solutionSteps"
                value={form.en_solutionSteps ?? '[]'}
                onChange={setJsonField('en_solutionSteps')}
                placeholder='[{"step":"Step one","detail":"optional detail"},{"step":"Step two"}]'
                rows={4}
                dir="ltr"
                error={jsonErrors.en_solutionSteps}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Results Section Title" name="en_resultsTitle" value={form.en_resultsTitle ?? ''} onChange={set('en_resultsTitle')} dir="ltr" />
                <InputField label="Tech Stack Title" name="en_techStackTitle" value={form.en_techStackTitle ?? ''} onChange={set('en_techStackTitle')} dir="ltr" />
              </div>
              <TextareaField
                label="Results Items (JSON array)"
                name="en_resultsItems"
                value={form.en_resultsItems ?? '[]'}
                onChange={setJsonField('en_resultsItems')}
                placeholder='[{"label":"Organic Growth","value":"40%"},{"label":"Load Time","value":"1.2s"}]'
                rows={4}
                dir="ltr"
                error={jsonErrors.en_resultsItems}
              />
            </div>
          )}

          {/* ─── HTML Content ─── */}
          {activeTab === 'html' && (
            <div className="flex flex-col gap-4">
              <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl text-xs text-purple-400">
                💡 اینجا محتوای اصلی صفحه پروژه رو به صورت HTML وارد کن. این قسمت بخش آزاد صفحه‌ست که کنترل کامل روی چیدمان و سئو داری.
              </div>
              <TextareaField label="محتوای HTML فارسی" name="fa_contentHtml" value={form.fa_contentHtml ?? ''} onChange={set('fa_contentHtml')} rows={12} dir="rtl" />
              <TextareaField label="English HTML Content" name="en_contentHtml" value={form.en_contentHtml ?? ''} onChange={set('en_contentHtml')} rows={12} dir="ltr" />
            </div>
          )}

          {/* ─── Meta / Links ─── */}
          {activeTab === 'meta' && (
            <div className="flex flex-col gap-5">
              {/* متادیتای فارسی */}
              <div>
                <h3 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">متادیتای سایدبار — فارسی</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="نقش / Role" name="fa_metaRole" value={form.fa_metaRole ?? ''} onChange={set('fa_metaRole')} dir="rtl" />
                  <InputField label="پلتفرم" name="fa_metaPlatform" value={form.fa_metaPlatform ?? ''} onChange={set('fa_metaPlatform')} dir="rtl" />
                  <InputField label="دسته‌بندی" name="fa_metaCategory" value={form.fa_metaCategory ?? ''} onChange={set('fa_metaCategory')} dir="rtl" />
                  <InputField label="وضعیت پروژه" name="fa_metaStatus" value={form.fa_metaStatus ?? ''} onChange={set('fa_metaStatus')} dir="rtl" />
                </div>
              </div>
              {/* متادیتای انگلیسی */}
              <div dir="ltr">
                <h3 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider text-left">Sidebar Meta — English</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Role" name="en_metaRole" value={form.en_metaRole ?? ''} onChange={set('en_metaRole')} dir="ltr" />
                  <InputField label="Platform" name="en_metaPlatform" value={form.en_metaPlatform ?? ''} onChange={set('en_metaPlatform')} dir="ltr" />
                  <InputField label="Category" name="en_metaCategory" value={form.en_metaCategory ?? ''} onChange={set('en_metaCategory')} dir="ltr" />
                  <InputField label="Project Status" name="en_metaStatus" value={form.en_metaStatus ?? ''} onChange={set('en_metaStatus')} dir="ltr" />
                </div>
              </div>
              {/* تکنولوژی‌ها */}
              <div>
                <h3 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">تکنولوژی‌های پروژه</h3>
                <TechnologySelector
                  selected={selectedTechIds}
                  onChange={ids => setForm(f => ({ ...f, technologyIds: JSON.stringify(ids) }))}
                  available={availableTechnologies}
                />
              </div>
              {/* لینک‌ها */}
              <div>
                <h3 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">لینک‌های پروژه (JSON آرایه)</h3>
                <div className="p-3 mb-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-500 font-mono leading-relaxed" dir="ltr">
                  {'['}
                  <br />
                  {'  {"type":"live","url":"https://example.com","label":"View Live Site"},'}
                  <br />
                  {'  {"type":"github","url":"https://github.com/...","label":"Source Code"}'}
                  <br />
                  {']'}
                </div>
                <TextareaField
                  label=""
                  name="links"
                  value={form.links ?? '[]'}
                  onChange={setJsonField('links')}
                  placeholder='[{"type":"live","url":"https://...","label":"نمایش زنده"}]'
                  rows={5}
                  dir="ltr"
                  error={jsonErrors.links}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Error ──────────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400 flex items-start gap-2">
          <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* ─── Submit ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.push(`/${locale}/admin/portfolio`)}
          className="px-5 py-2.5 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-gray-200 hover:border-white/20 transition-all"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all shadow-[0_0_20px_rgba(147,51,234,0.25)] hover:shadow-[0_0_25px_rgba(147,51,234,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {mode === 'create' ? 'در حال ذخیره...' : 'در حال بروزرسانی...'}
            </span>
          ) : mode === 'create' ? 'ایجاد پروژه' : 'ذخیره تغییرات'}
        </button>
      </div>
    </form>
  );
}
