import ProjectForm from '@/components/admin/portfolio/ProjectForm';

export default async function NewPortfolioProjectPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-white">پروژه جدید</h1>
        <p className="text-sm text-gray-500 mt-0.5">اطلاعات پروژه را وارد کنید</p>
      </div>
      <ProjectForm locale={locale} mode="create" />
    </div>
  );
}
