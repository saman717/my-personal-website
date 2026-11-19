'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { LuExternalLink, LuPencil, LuMinusCircle, LuCheckCircle, LuTrash2 } from 'react-icons/lu';
import { deleteProject, toggleProjectStatus } from '@/actions/admin-portfolio';

interface Props {
  projectId: string;
  projectSlug: string;
  currentStatus: 'draft' | 'published' | 'archived';
  locale: string;
  // کال‌بک‌های والد — به‌جای router.refresh، state محلی رو آپدیت می‌کنن
  onDeleted?: () => void;
  onStatusChanged?: (status: 'draft' | 'published' | 'archived') => void;
}

export default function AdminPortfolioActions({
  projectId,
  projectSlug,
  currentStatus,
  locale,
  onDeleted,
  onStatusChanged,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
  const nextStatusLabel = currentStatus === 'published' ? 'برگردوندن به پیش‌نویس' : 'انتشار';

  function handleToggleStatus() {
    startTransition(async () => {
      await toggleProjectStatus(projectId, nextStatus);
      // آپدیت state والد — بدون router.refresh
      onStatusChanged?.(nextStatus as 'draft' | 'published' | 'archived');
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteProject(projectId);
      setShowConfirm(false);
      // حذف ردیف از state والد — بدون router.refresh و بدون 42 ثانیه انتظار
      onDeleted?.();
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
        <LuExternalLink size={16} />
      </Link>

      {/* دکمه ویرایش */}
      <Link
        href={`/${locale}/admin/portfolio/${projectId}/edit`}
        className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
        title="ویرایش"
      >
        <LuPencil size={16} />
      </Link>

      {/* دکمه تغییر وضعیت */}
      <button
        onClick={handleToggleStatus}
        disabled={isPending}
        title={nextStatusLabel}
        className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-40"
      >
        {currentStatus === 'published' ? <LuMinusCircle size={16} /> : <LuCheckCircle size={16} />}
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
            {isPending ? (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin inline-block" />
              </span>
            ) : 'بله'}
          </button>
          <span className="text-red-500/30">|</span>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isPending}
            className="text-xs text-gray-500 hover:text-gray-300 disabled:opacity-40"
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
          <LuTrash2 size={16} />
        </button>
      )}
    </div>
  );
}
