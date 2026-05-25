import { redirect } from 'next/navigation';

export default function RootPage() {
  // کاربر به محض ورود به آدرس اصلی، به پوشه لوکال منتقل می‌شود
  redirect('/fa'); 
}