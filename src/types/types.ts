export interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  message: string;
}

export interface ContactInfoProps {
  email: string;
  phone: string;
  socialCount?: number;
}

export interface MessageType {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: Date | string;
  isRead: boolean;
  locale?: string;
}

export type FilterType = "all" | "unread" | "read";