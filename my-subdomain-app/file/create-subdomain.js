export default async function handler(req, res) {
  if(req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { subdomain, record, content, proxied } = req.body;
  const name = `${subdomain}.${process.env.CF_DOMAIN}`;
  const url = `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/dns_records`;
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
  if(data.success) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, error: data.errors });
  }
  }
