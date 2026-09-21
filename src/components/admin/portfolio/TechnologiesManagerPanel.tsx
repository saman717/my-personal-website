'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  getTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from '@/actions/admin-portfolio';

type Tech = { id: string; name: string; slug: string; icon: string | null; website: string | null };

export default function TechnologiesManagerPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [technologies, setTechnologies] = useState<Tech[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', slug: '', icon: '', website: '' });
  const [addForm, setAddForm] = useState({ name: '', slug: '', icon: '', website: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadTechnologies = async () => {
    setLoading(true);
    try {
      const techs = await getTechnologies();
      setTechnologies(techs as Tech[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadTechnologies();
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setEditingId(null);
    setShowAdd(false);
  };

  const handleEdit = (tech: Tech) => {
    setEditingId(tech.id);
    setEditForm({ name: tech.name, slug: tech.slug, icon: tech.icon ?? '', website: tech.website ?? '' });
  };

  const handleSaveEdit = (id: string) => {
    startTransition(async () => {
      await updateTechnology(id, editForm.name, editForm.slug, editForm.icon || undefined, editForm.website || undefined);
      setEditingId(null);
      await loadTechnologies();
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`آیا مطمئن هستید که می‌خواهید "${name}" را حذف کنید؟\nاین تکنولوژی از تمام پروژه‌ها نیز حذف خواهد شد.`)) return;
    startTransition(async () => {
      await deleteTechnology(id);
      await loadTechnologies();
    });
  };

  const handleAdd = () => {
    if (!addForm.name.trim() || !addForm.slug.trim()) return;
    startTransition(async () => {
      await createTechnology(addForm.name, addForm.slug, addForm.icon || undefined, addForm.website || undefined);
      setAddForm({ name: '', slug: '', icon: '', website: '' });
      setShowAdd(false);
      await loadTechnologies();
    });
  };

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <>
      {/* ─── Trigger button ───────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 text-sm transition-all duration-200 border border-white/5"
        title="مدیریت تکنولوژی‌ها"
      >
        {/* stack layers icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        <span className="hidden sm:inline text-xs font-medium">تکنولوژی‌ها</span>
      </button>

      {/* ─── Backdrop ─────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      {/* ─── Slide-in panel (from right in RTL = left edge on screen) ─── */}
      {isOpen && (
        <div
          className="fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-[#0b0b10] border-l border-white/10 shadow-2xl flex flex-col"
          dir="rtl"
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-shrink-0">
            <div>
              <h2 className="text-sm font-semibold text-white">مدیریت تکنولوژی‌ها</h2>
              <p className="text-xs text-gray-600 mt-0.5">
                {loading ? 'در حال بارگذاری...' : `${technologies.length} تکنولوژی`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowAdd(v => !v); setEditingId(null); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all"
              >
                <span className="text-sm leading-none">+</span>
                جدید
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Add form */}
          {showAdd && (
            <div className="px-5 py-4 border-b border-white/5 bg-purple-500/5 flex flex-col gap-3 flex-shrink-0">
              <p className="text-xs font-medium text-purple-300">افزودن تکنولوژی جدید</p>
              <input
                placeholder="نام (مثال: React)"
                value={addForm.name}
                onChange={e => {
                  const name = e.target.value;
                  setAddForm(f => ({ ...f, name, slug: f.slug || autoSlug(name) }));
                }}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              <input
                placeholder="Slug (مثال: react)"
                value={addForm.slug}
                onChange={e => setAddForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 font-mono transition-colors"
              />
              <input
                placeholder="آیکون — SVG string یا emoji (اختیاری)"
                value={addForm.icon}
                onChange={e => setAddForm(f => ({ ...f, icon: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              <input
                placeholder="آدرس سایت رسمی (اختیاری) — مثال: https://react.dev"
                value={addForm.website}
                onChange={e => setAddForm(f => ({ ...f, website: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 font-mono transition-colors"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={isPending || !addForm.name.trim() || !addForm.slug.trim()}
                  className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-all"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                      در حال افزودن...
                    </span>
                  ) : 'افزودن'}
                </button>
                <button
                  onClick={() => { setShowAdd(false); setAddForm({ name: '', slug: '', icon: '', website: '' }); }}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition-all"
                >
                  انصراف
                </button>
              </div>
            </div>
          )}

          {/* Technology list */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : technologies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
                <p className="text-sm">هیچ تکنولوژی‌ای ثبت نشده</p>
              </div>
            ) : (
              technologies.map(tech => (
                <div
                  key={tech.id}
                  className="rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] p-3 transition-colors"
                >
                  {editingId === tech.id ? (
                    /* ── Inline edit form ── */
                    <div className="flex flex-col gap-2">
                      <input
                        value={editForm.name}
                        onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="نام"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 transition-colors"
                      />
                      <input
                        value={editForm.slug}
                        onChange={e => setEditForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                        placeholder="Slug"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-200 font-mono focus:outline-none focus:border-purple-500/50 transition-colors"
                      />
                      <input
                        value={editForm.icon}
                        onChange={e => setEditForm(f => ({ ...f, icon: e.target.value }))}
                        placeholder="آیکون (اختیاری)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 transition-colors"
                      />
                      <input
                        value={editForm.website}
                        onChange={e => setEditForm(f => ({ ...f, website: e.target.value }))}
                        placeholder="آدرس سایت رسمی (اختیاری)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-200 font-mono focus:outline-none focus:border-purple-500/50 transition-colors"
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleSaveEdit(tech.id)}
                          disabled={isPending || !editForm.name.trim() || !editForm.slug.trim()}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium transition-all"
                        >
                          {isPending ? (
                            <span className="flex items-center justify-center gap-1.5">
                              <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                              ذخیره...
                            </span>
                          ) : 'ذخیره تغییرات'}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 text-xs transition-all"
                        >
                          انصراف
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Display row ── */
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-lg bg-white/5 text-lg">
                        {tech.icon ? tech.icon : (
                          <span className="text-gray-700 text-xs font-bold">
                            {tech.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 font-medium truncate">{tech.name}</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-purple-400/70">{tech.slug}</code>
                          {tech.website && (
                            <a
                              href={tech.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-xs text-blue-400/60 hover:text-blue-400 transition-colors"
                              title={tech.website}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(tech)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-gray-600 hover:text-gray-300 transition-colors"
                          title="ویرایش"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(tech.id, tech.name)}
                          disabled={isPending}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 disabled:opacity-40 transition-colors"
                          title="حذف"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
