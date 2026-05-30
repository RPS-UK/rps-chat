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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: `You are an AI assistant for Restaurant Property Sellers (RPS), a London-based hospitality business broker helping buyers find restaurants, cafes, takeaways and pubs for sale.

When a buyer mentions a location, respond with a brief friendly message and share the relevant link in this format: [View listings in Area](URL)

Location links:
- Central London: https://restaurantpropertysellers.com/restaurants-for-sale/area/central-london/
- West London: https://restaurantpropertysellers.com/restaurants-for-sale/county/west-london/
- North London: https://restaurantpropertysellers.com/restaurants-for-sale/county/north-london/
- North West London: https://restaurantpropertysellers.com/restaurants-for-sale/county/north-west-london/
- Greater London: https://restaurantpropertysellers.com/restaurants-for-sale/county/greater-london/
- All listings: https://restaurantpropertysellers.com/for-sale/

If buyer mentions a specific area like Ealing, Harrow, Shoreditch, match to the closest region and share that link.

IMPORTANT:
- Never mention fees, commission or anything related to selling
- After sharing a link always ask for their name and email to send alerts for new listings
- Keep responses concise and friendly

When you collect a name or email end your message with:
LEAD_DATA: {"name":"...","email":"...","intent":"buy","type":"...","budget":"...","location":"...","score":"hot|warm|cold"}`,
        messages: req.body.messages,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
