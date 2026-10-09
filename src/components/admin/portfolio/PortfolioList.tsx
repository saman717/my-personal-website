'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminPortfolioActions from './AdminPortfolioActions';

export type ProjectRow = {
  id: string;
  slug: string;
  status: string;
  sortOrder: number | null;
  updatedAtFormatted: string | null;
  title: string | null;
};

const statusColors: Record<string, string> = {
  published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  draft:     'bg-yellow-500/10  text-yellow-400  border-yellow-500/20',
  archived:  'bg-gray-500/10   text-gray-400    border-gray-500/20',
};

const statusLabels: Record<string, string> = {
  published: 'منتشر شده',
  draft:     'پیش‌نویس',
  archived:  'بایگانی',
};

export default function PortfolioList({
  initialProjects,
  locale,
}: {
  initialProjects: ProjectRow[];
  locale: string;
}) {
  const [projects, setProjects] = useState(initialProjects);

  // حذف ردیف از state محلی — بدون router.refresh و بدون query مجدد
  function removeProject(id: string) {
    setProjects(prev => prev.filter(p => p.id !== id));
  }

  // آپدیت وضعیت در state محلی — بدون router.refresh
  function updateStatus(id: string, status: string) {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, status } : p))
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-5xl">🗂️</span>
        <p className="text-gray-500 text-sm">هنوز هیچ پروژه‌ای ثبت نشده</p>
        <Link
          href={`/${locale}/admin/portfolio/new`}
          className="mt-2 text-purple-400 text-sm hover:text-purple-300 underline underline-offset-4"
        >
          اولین پروژه را اضافه کن
        </Link>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
          <th className="px-5 py-3.5 text-right font-medium">ردیف</th>
          <th className="px-5 py-3.5 text-right font-medium">عنوان</th>
          <th className="px-5 py-3.5 text-right font-medium">Slug</th>
          <th className="px-5 py-3.5 text-right font-medium">وضعیت</th>
          <th className="px-5 py-3.5 text-right font-medium">آخرین ویرایش</th>
          <th className="px-5 py-3.5 text-right font-medium">عملیات</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p, idx) => (
          <tr
            key={p.id}
            className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
          >
            <td className="px-5 py-4 text-gray-600 w-10">{p.sortOrder ?? idx + 1}</td>
            <td className="px-5 py-4">
              <span className="text-gray-200 font-medium">{p.title ?? '—'}</span>
            </td>
            <td className="px-5 py-4">
              <code className="text-xs text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded-md border border-purple-500/10">
                {p.slug}
              </code>
            </td>
            <td className="px-5 py-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  statusColors[p.status] ?? statusColors.draft
                }`}
              >
                {statusLabels[p.status] ?? p.status}
              </span>
            </td>
            <td className="px-5 py-4 text-gray-500 text-xs">
              {p.updatedAtFormatted ?? '—'}
            </td>
            <td className="px-5 py-4">
              <AdminPortfolioActions
                projectId={p.id}
                projectSlug={p.slug}
                currentStatus={p.status as 'draft' | 'published' | 'archived'}
                locale={locale}
                onDeleted={() => removeProject(p.id)}
                onStatusChanged={(s) => updateStatus(p.id, s)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
