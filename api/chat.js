export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Allow requests from your website only (update this to your domain)
  const allowedOrigins = [
    'https://restaurantpropertysellers.com',
    'https://www.restaurantpropertysellers.com',
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY, // stored securely in Vercel
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are an AI assistant for Restaurant Property Sellers (RPS), a London-based hospitality business broker. You help buyers find restaurants, cafes, takeaways and pubs for sale, and help sellers get free valuations.

Key facts:
- No Sale No Fee for sellers. Fee is 5% of agreed premium, min £6,000 + VAT
- Letting fee: 10% of annual rent + VAT
- Listed on Rightmove, Zoopla, Daltons, RightBiz, BusinessesForSale
- Current listings: 62 restaurants, 37 cafes, 21 takeaways, 9 freehold properties, 3 franchises
- Serve London and wider UK
- Free confidential valuations available
- Website: https://restaurantpropertysellers.com

When you detect intent (buying, selling, letting) and collect a name or email, end your message with a JSON block on its own line like:
LEAD_DATA: {"name":"...","email":"...","intent":"buy|sell|let|browse","type":"Restaurant|Cafe|Takeaway|Pub|Property","budget":"...","location":"...","score":"hot|warm|cold"}

Score hot if: has budget, specific type, ready to act. Warm if: interested but vague. Cold if: just browsing.
Only emit LEAD_DATA once you have at least a name OR email. Keep responses concise and friendly.`,
        messages: req.body.messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return res.status(500).json({ error: 'API error' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
