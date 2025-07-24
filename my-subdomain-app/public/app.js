document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('subForm');
  const result = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    result.style.display = 'block';
    result.innerHTML = '⏳ Creating subdomain...';

    const f = new FormData(form);
    const payload = {
      subdomain: f.get('subdomain'),
      record: f.get('record'),
      content: f.get('content'),
      domain: f.get('domain'),
      proxied: f.get('proxied') === 'on'
    };

    try {
      const res = await fetch('/api/create-subdomain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (res.ok && json.success) {
        result.innerHTML = `
          <b>✅ Subdomain Created Successfully!</b><br><br>
          🔗 <b>Name:</b> ${payload.subdomain}.${payload.domain}<br>
          📡 <b>IP/Content:</b> ${payload.content}<br>
          💾 <b>Type:</b> ${payload.record}<br>
          🛡️ <b>Proxy:</b> ${payload.proxied ? 'Enabled' : 'Disabled'}
        `;
      } else {
        result.innerHTML = `❌ <b>Error:</b> ${json?.error?.[0]?.message || 'Unknown error'}`;
      }
    } catch (err) {
      result.innerHTML = `❌ <b>Server Error:</b> ${err.message}`;
    }
  });
});
