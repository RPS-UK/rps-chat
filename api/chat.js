export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: `You are an AI assistant for Restaurant Property Sellers (RPS), a London-based hospitality business broker. You help buyers find restaurants, cafes, takeaways and pubs for sale, and help sellers get free valuations. Key facts: No Sale No Fee for sellers. Fee is 5% of agreed premium, min £6,000 + VAT. Listed on Rightmove, Zoopla, Daltons, RightBiz. 62 restaurants, 37 cafes, 21 takeaways for sale. Free confidential valuations available. Website: https://restaurantpropertysellers.com. Keep responses concise and friendly.`,
        messages: req.body.messages,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
