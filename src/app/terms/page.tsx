
export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-24">
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-8">شروط الاستخدام</h1>
        <div className="prose prose-lg dark:prose-invert text-on-surface-variant space-y-6">
          <p>
            باستخدامك لمنصة &quot;تحضير المقابلة الذكية&quot;، فإنك توافق على الالتزام بشروط الاستخدام التالية. يرجى قراءتها بعناية.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8 mb-4">1. استخدام الخدمة</h2>
          <p>
            يُسمح لك باستخدام المنصة فقط للأغراض الشخصية لتحسين مهاراتك في المقابلات. يمنع استخدام خدماتنا لأي غرض غير قانوني أو غير مصرح به.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8 mb-4">2. الحسابات</h2>
          <p>
            أنت مسؤول عن الحفاظ على سرية معلومات حسابك، بما في ذلك كلمة المرور. ويجب إبلاغنا فوراً بأي استخدام غير مصرح به لحسابك.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8 mb-4">3. دقة التقييمات (الذكاء الاصطناعي)</h2>
          <p>
            تعتمد التقييمات المقدمة على نماذج ذكاء اصطناعي. بينما نسعى لتقديم ملاحظات دقيقة ومفيدة، إلا أنها لأغراض التدريب والتوجيه فقط ولا تضمن نجاحك في المقابلات الوظيفية الحقيقية.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8 mb-4">4. التعديلات</h2>
          <p>
            نحتفظ بالحق في تعديل أو استبدال هذه الشروط في أي وقت. سيتم إشعارك بأي تغييرات جوهرية قبل أن تصبح سارية المفعول.
          </p>
        </div>
      </main>
    </div>
  );
}
