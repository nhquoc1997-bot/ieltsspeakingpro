export default async function handler(req, res) {
  // Đảm bảo chỉ nhận request POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Chưa cài đặt GEMINI_API_KEY trên Vercel Environment Variables!' });
  }

  try {
    const { prompt } = req.body;

    // Sử dụng endpoint chuẩn của Gemini 1.5 Flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error?.message || 'Lỗi khi gọi tới Gemini API';
      return res.status(response.status).json({ error: errorMsg });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Lỗi xử lý server nội bộ' });
  }
}
