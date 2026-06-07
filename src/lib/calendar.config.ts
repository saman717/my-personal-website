// src/lib/calendar.config.ts

/**
 * تابع ساخت اتوماتیکِ تایم‌اسلات‌ها
 * @param startHour ساعت شروع (مثلا 8 برای ۸ صبح)
 * @param endHour ساعت پایان (مثلا 21 برای ۹ شب)
 * @param intervalMinutes فاصله بین هر رزرو (مثلا 60 دقیقه)
 */
function generateMasterTimeSlots(startHour = 8, endHour = 21, intervalMinutes = 60) {
  const slots: string[] = [];
  
  // حلقه برای تولید ساعت‌ها
  for (let time = startHour * 60; time <= endHour * 60; time += intervalMinutes) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    
    // تشخیص AM یا PM
    const ampm = hours >= 12 ? "PM" : "AM";
    
    // تبدیل ساعت ۲۴ ساعته به ۱۲ ساعته (مثلا ۱۴ میشه ۲)
    const displayHour = hours % 12 || 12; 
    
    // فرمت‌بندی دو رقمی (مثلاً 08:00 AM)
    const formattedHour = String(displayHour).padStart(2, "0");
    const formattedMinute = String(minutes).padStart(2, "0");
    
    slots.push(`${formattedHour}:${formattedMinute} ${ampm}`);
  }
  
  return slots;
}

// 🌟 این متغیر طلایی حالا همه‌جا ایمپورت میشه
// از ساعت ۸ تا ۲۱ با بازه‌های ۶۰ دقیقه‌ای تولید می‌شود
export const MASTER_TIME_SLOTS = generateMasterTimeSlots(6, 22, 60);