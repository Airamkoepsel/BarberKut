module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64, prompt } = req.body || {};
  if (!imageBase64 || !prompt) {
    return res.status(400).json({ error: 'Missing imageBase64 or prompt' });
  }

  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) {
    return res.status(500).json({ error: 'HF_TOKEN not configured on server' });
  }

  const hfResp = await fetch(
    'https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: imageBase64,
        parameters: {
          prompt,
          negative_prompt: 'blurry, bad quality, distorted face, changed identity',
          num_inference_steps: 30,
          image_guidance_scale: 1.5,
          guidance_scale: 7.5
        }
      })
    }
  );

  if (hfResp.status === 503) {
    const json = await hfResp.json().catch(() => ({}));
    return res.status(503).json({ estimated_time: json.estimated_time || 30 });
  }

  if (!hfResp.ok) {
    const txt = await hfResp.text().catch(() => '');
    return res.status(hfResp.status).json({ error: txt });
  }

  const buf = await hfResp.arrayBuffer();
  const b64 = Buffer.from(buf).toString('base64');
  return res.status(200).json({ image: `data:image/jpeg;base64,${b64}` });
}
