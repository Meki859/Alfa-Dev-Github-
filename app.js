document.getElementById('subForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const payload = {
    subdomain: f.get('subdomain'),
    record: f.get('record'),
    content: f.get('content'),
    proxied: f.get('proxied') === 'on'
  };
  const resp = await fetch('/api/create-subdomain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await resp.json();
  const out = document.getElementById('result');
  if(json.success) {
    out.textContent = `✅ ${payload.subdomain}.${process.env.CF_DOMAIN} created!`;
  } else {
    out.textContent = `❌ Error: ${json.error?.[0]?.message || 'Failed'}`;
  }
});