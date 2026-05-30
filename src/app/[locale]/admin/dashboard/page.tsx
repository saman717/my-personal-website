import StatsGrid from "@/components/admin/dashboard/StatsGrid";
import AnalyticsChart from "@/components/admin/dashboard/AnalyticsChart";
import ServerTelemetryCard from "@/components/admin/dashboard/ServerTelemetryCard";
import RecentMessagesCard from "@/components/admin/dashboard/RecentMessagesCard";
import ActivityTimelineCard from "@/components/admin/dashboard/ActivityTimelineCard";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> | { locale: string } }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  return (
    <div className="flex flex-col w-full gap-5 pb-10">
      {/* ردیف اول: کارت‌های آماری */}
      <StatsGrid />
      
      {/* ردیف دوم: نمودار (دو ستون) و تلمتری (یک ستون) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
         <div className="lg:col-span-2">
            <AnalyticsChart />
         </div>
         <div className="lg:col-span-1">
            <ServerTelemetryCard />
         </div>
      </div>

      {/* ردیف سوم: پیام‌های اخیر و تایم‌لاین فعالیت‌ها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full mt-2">
         <RecentMessagesCard locale={locale} />
         <ActivityTimelineCard />
      </div>
    </div>
  );
}