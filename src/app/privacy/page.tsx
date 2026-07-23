
export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-24">
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-8">سياسة الخصوصية</h1>
        <div className="prose prose-lg dark:prose-invert text-on-surface-variant space-y-6">
          <p>
            توضح سياسة الخصوصية هذه كيف نقوم بجمع واستخدام وحماية معلوماتك الشخصية عند استخدامك لمنصة &quot;تحضير المقابلة الذكية&quot;. نحن نأخذ خصوصيتك على محمل الجد وملتزمون بحماية بياناتك.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8 mb-4">1. البيانات التي نجمعها</h2>
          <p>
            نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل، مثل اسمك وبريدك الإلكتروني، بالإضافة إلى البيانات الصوتية والنصية التي تنشأ أثناء محاكاة المقابلات لأغراض التحليل فقط.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8 mb-4">2. كيف نستخدم معلوماتك</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>لتوفير وتحسين خدماتنا لك.</li>
            <li>لتحليل إجاباتك باستخدام تقنيات الذكاء الاصطناعي لتزويدك بتقارير الأداء.</li>
            <li>للتواصل معك بشأن أي تحديثات متعلقة بحسابك.</li>
          </ul>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8 mb-4">3. أمان البيانات</h2>
          <p>
            نحن نستخدم إجراءات أمنية متقدمة لحماية بياناتك من الوصول غير المصرح به. لا نشارك بيانات المقابلات الخاصة بك مع أي أطراف ثالثة لأغراض تسويقية.
          </p>
        </div>
      </main>
    </div>
  );
}
