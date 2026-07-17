const fs = require('fs');

const pages = [
  {
    path: 'src/app/page.tsx',
    metadata: `export const metadata = { title: "AI Interview Prep | الرئيسية", description: "استعد لمقابلتك القادمة بذكاء مع محاكي المقابلات المدعوم بالذكاء الاصطناعي." };\n`
  },
  {
    path: 'src/app/dashboard/page.tsx',
    metadata: `export const metadata = { title: "لوحة التحكم | AI Interview Prep", description: "لوحة التحكم لمتابعة تقدمك وإدارة مقابلاتك." };\n`
  },
  {
    path: 'src/app/leaderboard/page.tsx',
    metadata: `export const metadata = { title: "لوحة الصدارة | AI Interview Prep", description: "تعرف على أفضل المحترفين في منصتنا ونافسهم." };\n`
  },
  {
    path: 'src/app/ats-scanner/page.tsx',
    metadata: `export const metadata = { title: "فاحص السيرة الذاتية ATS | AI Interview Prep", description: "تأكد من أن سيرتك الذاتية قادرة على تخطي روبوتات الفرز الآلي بنجاح." };\n`
  },
  {
    path: 'src/app/gap-analyzer/page.tsx',
    metadata: `export const metadata = { title: "محلل الفجوات | AI Interview Prep", description: "اكتشف نقاط الضعف والفجوات في مهاراتك للحصول على الوظيفة." };\n`
  },
  {
    path: 'src/app/quiz/page.tsx',
    metadata: `export const metadata = { title: "الاختبارات الذكية | AI Interview Prep", description: "اختبر مهاراتك التقنية بأسئلة مخصصة لشركتك المستهدفة." };\n`
  },
  {
    path: 'src/app/interview/page.tsx',
    metadata: `export const metadata = { title: "محاكي المقابلات | AI Interview Prep", description: "ابدأ محاكاة مقابلة حقيقية بالصوت والصورة مع الذكاء الاصطناعي." };\n`
  },
  {
    path: 'src/app/profile/page.tsx',
    metadata: `export const metadata = { title: "الملف الشخصي | AI Interview Prep", description: "استعرض تفاصيل ملفك الشخصي وتقارير المقابلات الخاصة بك." };\n`
  }
];

pages.forEach(page => {
  if (fs.existsSync(page.path)) {
    let content = fs.readFileSync(page.path, 'utf8');
    if (!content.includes('export const metadata')) {
      const lines = content.split('\n');
      if (lines[0].includes('use client')) {
        console.log("Skipping " + page.path + " because it is a client component.");
      } else {
        const lastImportIndex = content.lastIndexOf('import ');
        let insertPos = 0;
        if (lastImportIndex !== -1) {
          insertPos = content.indexOf('\n', lastImportIndex) + 1;
        }
        content = content.slice(0, insertPos) + '\n' + page.metadata + '\n' + content.slice(insertPos);
        fs.writeFileSync(page.path, content);
        console.log("Added metadata to " + page.path);
      }
    }
  }
});
