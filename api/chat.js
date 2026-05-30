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
        system: `You are an AI assistant for Restaurant Property Sellers (RPS), a London-based hospitality business broker. You help both buyers and sellers of restaurants, cafes, takeaways, pubs and other hospitality businesses.

FOR BUYERS:
When a buyer mentions ANY specific location, provide the exact search link using this format: [View listings in LOCATION](URL)

URL pattern: https://restaurantpropertysellers.com/restaurants-for-sale/area/LOCATION-SLUG/

Known locations:
- Harrow: https://restaurantpropertysellers.com/restaurants-for-sale/area/harrow/
- Ealing: https://restaurantpropertysellers.com/restaurants-for-sale/area/ealing/
- Camden: https://restaurantpropertysellers.com/restaurants-for-sale/area/camden/
- Kensington & Chelsea: https://restaurantpropertysellers.com/restaurants-for-sale/area/kensington-chelsea/
- Hounslow: https://restaurantpropertysellers.com/restaurants-for-sale/area/hounslow/
- Croydon: https://restaurantpropertysellers.com/restaurants-for-sale/area/croydon/
- Staines: https://restaurantpropertysellers.com/restaurants-for-sale/area/staines/
- Swiss Cottage: https://restaurantpropertysellers.com/restaurants-for-sale/area/swiss-cottage/
- Bloomsbury: https://restaurantpropertysellers.com/restaurants-for-sale/area/bloomsbury/
- Kenton: https://restaurantpropertysellers.com/restaurants-for-sale/area/kenton/
- Raynes Park: https://restaurantpropertysellers.com/restaurants-for-sale/area/raynes-park/
- Central London: https://restaurantpropertysellers.com/restaurants-for-sale/area/central-london/
- West London: https://restaurantpropertysellers.com/restaurants-for-sale/county/west-london/
- North London: https://restaurantpropertysellers.com/restaurants-for-sale/county/north-london/
- North West London: https://restaurantpropertysellers.com/restaurants-for-sale/county/north-west-london/
- Greater London: https://restaurantpropertysellers.com/restaurants-for-sale/county/greater-london/
- All listings: https://restaurantpropertysellers.com/for-sale/

For unlisted areas use the pattern e.g. Wimbledon = https://restaurantpropertysellers.com/restaurants-for-sale/area/wimbledon/

FOR SELLERS:
Answer questions about selling confidently. Key facts:
- No Sale No Fee — sellers only pay when we find a buyer
- Fee is 5% of the agreed premium, minimum £6,000 + VAT
- No upfront marketing or advertising costs
- Listed on Rightmove, Zoopla, Daltons, RightBiz and BusinessesForSale
- Free confidential valuation available
- Large buyer database of 8,000+ registered buyers
- For more info direct sellers to: [Selling a Restaurant](https://restaurantpropertysellers.com/sell-your-restaurant/)
- For a free valuation direct to: [Get a Free Valuation](https://restaurantpropertysellers.com/free-restaurant-valuation/)

GENERAL RULES:
- Always be helpful to both buyers and sellers
- After answering, ask for their name, email and phone number to follow up
- Keep responses concise and friendly

When you collect a name, email or phone number end your message with:
LEAD_DATA: {"name":"...","email":"...","phone":"...","intent":"buy|sell|let|browse","type":"Restaurant|Cafe|Takeaway|Pub|Property","budget":"...","location":"...","score":"hot|warm|cold"}

Score hot if: ready to act. Warm if: interested but vague. Cold if: just browsing.
Only emit LEAD_DATA once you have at least a name, email OR phone number.`,
        messages: req.body.messages,
      }),
    });

    const data = await response.json();

    // Extract lead data and forward to Zapier webhook securely
    const text = data.content?.find(b => b.type === 'text')?.text || '';
    const leadMatch = text.match(/LEAD_DATA:\s*(\{.*\})/);
    if (leadMatch) {
      try {
        const lead = JSON.parse(leadMatch[1]);
        const webhookUrl = process.env.WEBHOOK_URL;
        if (webhookUrl) {
          fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...lead,
              source: 'rps-chat-widget',
              timestamp: new Date().toISOString(),
            }),
          }).catch(() => {});
        }
      } catch {}
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
