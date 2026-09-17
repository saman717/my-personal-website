'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { deleteProject, toggleProjectStatus } from '@/actions/admin-portfolio';
import { useRouter } from 'next/navigation';

interface Props {
  projectId: string;
  projectSlug: string;
  currentStatus: 'draft' | 'published' | 'archived';
  locale: string;
}

export default function AdminPortfolioActions({ projectId, projectSlug, currentStatus, locale }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
  const nextStatusLabel = currentStatus === 'published' ? 'برگردوندن به پیش‌نویس' : 'انتشار';

  function handleToggleStatus() {
    startTransition(async () => {
      await toggleProjectStatus(projectId, nextStatus);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteProject(projectId);
      setShowConfirm(false);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      {/* دکمه مشاهده در سایت */}
      <Link
        href={`/${locale}/portfolio/${projectSlug}`}
        target="_blank"
        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
        title="مشاهده در سایت"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </Link>

      {/* دکمه ویرایش */}
      <Link
        href={`/${locale}/admin/portfolio/${projectId}/edit`}
        className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
        title="ویرایش"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </Link>

      {/* دکمه تغییر وضعیت */}
      <button
        onClick={handleToggleStatus}
        disabled={isPending}
        title={nextStatusLabel}
        className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-40"
      >
        {currentStatus === 'published' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        )}
      </button>

      {/* دکمه حذف */}
      {showConfirm ? (
        <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-1">
          <span className="text-xs text-red-400">مطمئنی؟</span>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-xs text-red-400 hover:text-red-300 font-medium disabled:opacity-40"
          >
            بله
          </button>
          <span className="text-red-500/30">|</span>
          <button
            onClick={() => setShowConfirm(false)}
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            خیر
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="حذف"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      )}
    </div>
  );
}
