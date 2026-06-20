import React from "react";
import { t } from "@/lib/translate";
import ContactCardAnimated from "./ContactCardAnimated";

interface Props {
    locale: string;
}

export default async function ContactMethods({ locale }: Props) {
    const emailLabel = await t(locale, "contact.methods.email_label");
    const phoneLabel = await t(locale, "contact.methods.phone_label");
    const locationLabel = await t(locale, "contact.methods.location_label");
    const locationVal = await t(locale, "contact.methods.location_val");
    const socialLabel = await t(locale, "contact.methods.social_label");

    // ساختار دیتا با آرایه‌های امن برای جلوگیری از خطای undefined
    // ... بقیه کدهای بالا
    const methods = [
        {
            label: emailLabel,
            value: "mohamad.khoshnoo.10@gmail.com",
            href: "mailto:mohamad.khoshnoo.10@gmail.com",
            forceLtr: true // 🌟 اجبار به خوانش چپ‌به‌راست
        },
        {
            label: phoneLabel,
            value: "+98 993 586 7279",
            href: "tel:+989935867279",
            forceLtr: true // 🌟 اجبار به خوانش چپ‌به‌راست
        },
        {
            label: locationLabel,
            value: locationVal,
            // برای لوکیشن forceLtr نمی‌دهیم تا همان RTL بماند
        },
        {
            label: socialLabel,
            isSocial: true,
            links: [
                { name: "LinkedIn", href: "https://www.linkedin.com/in/saman-khoshnoud-a72a73351/" },
                { name: "GitHub", href: "https://github.com/saman717" }
            ],
        }
    ];
    // ... بقیه کدهای پایین

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {methods.map((method, idx) => (
                <ContactCardAnimated key={idx} {...method} index={idx} />
            ))}
        </section>
    );
}