export async function GET() {
    const content = `
  User-agent: *
  Allow: /
  Disallow: /admin
  
  Sitemap: https://yourwebsite.com/sitemap.xml
    `.trim();
  
    return new Response(content, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
  