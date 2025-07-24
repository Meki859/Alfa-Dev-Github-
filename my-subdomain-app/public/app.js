document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('subForm');
  const output = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    output.textContent = "⏳ Membuat subdomain...";

    const f = new FormData(form);
    const payload = {
      subdomain: f.get('subdomain'),
      record: f.get('record'),
      content: f.get('content'),
      proxied: f.get('proxied') === 'on'
    };

    try {
      const resp = await fetch('/api/create-subdomain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await resp.json();

      if (resp.ok && json.success) {
        output.textContent = `✅ Subdomain ${payload.subdomain}.${location.hostname} berhasil dibuat!`;
      } else {
        output.textContent = `❌ Gagal: ${json?.error?.[0]?.message || 'Unknown error'}`;
      }
    } catch (err) {
      console.error(err);
      output.textContent = `❌ ERROR: ${err.message}`;
    }
  });
});
