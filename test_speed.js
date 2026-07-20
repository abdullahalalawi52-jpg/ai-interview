const url = "https://ai-interview.vercel.app";
const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=mobile`;

fetch(api)
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      console.error("Error:", data.error.message);
      return;
    }
    const score = data.lighthouseResult.categories.performance.score * 100;
    const fcp = data.lighthouseResult.audits['first-contentful-paint'].displayValue;
    const lcp = data.lighthouseResult.audits['largest-contentful-paint'].displayValue;
    console.log(`Performance Score: ${score}/100`);
    console.log(`First Contentful Paint (FCP): ${fcp}`);
    console.log(`Largest Contentful Paint (LCP): ${lcp}`);
  })
  .catch(err => console.error(err));
