export async function GET() {
    const baseUrl = "https://senko-five.vercel.app/";
  
    const staticPages = [
      `${baseUrl}/`,
      `${baseUrl}/questions`,
      `${baseUrl}/about`,
      `${baseUrl}/contact`,
    ];
  
    const dynamicPages = await fetchQuestions(); // استدعاء الأسئلة من API
  
    const urls = [...staticPages, ...dynamicPages]
      .map((url) => `<url><loc>${url}</loc></url>`)
      .join("");
  
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`;
  
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
  
  // دالة لجلب الأسئلة وإضافة روابطها إلى خريطة الموقع
  async function fetchQuestions() {
    try {
      const res = await fetch("https://senko-five.vercel.app/api/questions");
      const data = await res.json();
  
      return data.questions.map(
        (q) => `https://senko-five.vercel.app/question/${q.id}`
      );
    } catch (error) {
      console.error("Error fetching questions for sitemap:", error);
      return [];
    }
  }
  