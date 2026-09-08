module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { imageBase64, prompt } = body;

    if (!imageBase64 || !prompt) {
      return res.status(400).json({ error: 'Missing imageBase64 or prompt' });
    }

    const hfToken = process.env.HF_TOKEN;
    if (!hfToken) {
      return res.status(500).json({ error: 'HF_TOKEN nao configurado no Vercel' });
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

    const contentType = hfResp.headers.get('content-type') || '';

    if (!hfResp.ok || !contentType.startsWith('image/')) {
      const detail = await hfResp.text().catch(() => '');
      return res.status(502).json({
        error: 'HuggingFace respondeu sem imagem',
        hfStatus: hfResp.status,
        hfContentType: contentType,
        hfBody: detail.slice(0, 500)
      });
    }

    const buf = await hfResp.arrayBuffer();
    const b64 = Buffer.from(buf).toString('base64');
    return res.status(200).json({ image: `data:image/jpeg;base64,${b64}` });

  } catch (err) {
    return res.status(500).json({ error: 'Crash na function', detail: String(err && err.message || err) });
  }
};
