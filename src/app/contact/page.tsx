"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-24 grid md:grid-cols-2 gap-12">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-6">تواصل معنا</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">
            نحن هنا لمساعدتك! إذا كان لديك أي أسئلة حول خدماتنا، أو واجهت مشكلة تقنية، أو ترغب في تقديم اقتراح، فلا تتردد في مراسلتنا.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-on-surface">البريد الإلكتروني</p>
                <p className="text-on-surface-variant">support@smartinterview.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-on-surface">الهاتف</p>
                <p className="text-on-surface-variant">+966 50 000 0000</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-on-surface">العنوان</p>
                <p className="text-on-surface-variant">الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl shadow-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6">أرسل رسالة</h2>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا."); }}>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">الاسم الكامل</label>
              <input type="text" className="w-full bg-surface-container border border-outline-variant rounded-xl p-3 focus:outline-none focus:border-primary transition-colors" placeholder="أدخل اسمك" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">البريد الإلكتروني</label>
              <input type="email" className="w-full bg-surface-container border border-outline-variant rounded-xl p-3 focus:outline-none focus:border-primary transition-colors" placeholder="example@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">الرسالة</label>
              <textarea rows={4} className="w-full bg-surface-container border border-outline-variant rounded-xl p-3 focus:outline-none focus:border-primary transition-colors resize-none" placeholder="كيف يمكننا مساعدتك؟" required></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
              إرسال الرسالة
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
