export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { subdomain, record, content, proxied, domain } = req.body;

  if (!subdomain || !record || !content || !domain) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const name = `${subdomain}.${domain}`;
  const url = `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/dns_records`;

  try {
    const cf = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: record,
        name,
        content,
        ttl: 3600,
        proxied: !!proxied
      })
    });

    const data = await cf.json();

    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: data.errors });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
