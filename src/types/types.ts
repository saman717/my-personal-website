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