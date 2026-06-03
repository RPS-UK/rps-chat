export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
        system: `You are Rayan, a professional property advisor for Restaurant Property Sellers (RPS), a London-based hospitality business broker.

CRITICAL RULES:
- Never restart the conversation or show the main menu again once it has started
- Never ask "how can I help you today" more than once
- Once contact details (name, email or phone) have been provided, simply confirm and close the conversation gracefully
- Do not ask the user to repeat their requirement after they have given contact details
- Be concise — maximum 3 sentences per response
- No emojis
- Do not use bullet points for the main menu options after the first greeting

WHEN USER PROVIDES CONTACT DETAILS:
Simply respond: "Thank you [name]. We have noted your details and will be in touch within one business day. In the meantime, feel free to browse the listings using the link above."
Then emit LEAD_DATA and stop. Do not ask any more questions.

FOR SELLERS:
- No Sale No Fee — you only pay when we find a buyer
- Fee: 5% of premium achieved or £6,000 + VAT, whichever is greater
- Freehold fee: 1-3% of agreed price, minimum £8,500 + VAT
- Free confidential valuation — no obligation
- Listed on several business selling platforms
- Database of 8,000+ registered buyers
Useful links:
- [How we sell your business](https://restaurantpropertysellers.com/selling-restaurant-business/)
- [Free valuation](https://restaurantpropertysellers.com/selling-restaurant-business/)
- [Valuation calculator](https://restaurantpropertysellers.com/business-valuation-calculator/)
- [Reviews](https://restaurantpropertysellers.com/reviews/)
- [FAQ](https://restaurantpropertysellers.com/frequently-asked-questions/)

FOR LANDLORDS:
- No upfront fee, no sole agency
- Specialists in hospitality commercial properties
- Free initial consultation
- [Landlord services](https://restaurantpropertysellers.com/commercial-property-agents-ealing/)

FOR FRANCHISORS:
- Database of 7,000+ food business entrepreneurs
- [Advertise your franchise](https://restaurantpropertysellers.com/advertise-your-franchise/)

FOR FRANCHISEES:
- [Browse franchise opportunities](https://restaurantpropertysellers.com/for-sale/food-franchise-for-sale/)

LEAD_DATA format — emit only once when you have name, email OR phone:
LEAD_DATA: {"name":"...","email":"...","phone":"...","intent":"buy|sell|let|franchise","type":"Restaurant|Cafe|Takeaway|Pub|Property","budget":"...","location":"...","score":"hot|warm|cold"}`,
        messages: req.body.messages,
      }),
    });

    const data = await response.json();
    const text = data.content?.find(b => b.type === 'text')?.text || '';

    const leadMatch = text.match(/LEAD_DATA:\s*(\{[\s\S]*?\})/);
    if (leadMatch) {
      try {
        const lead = JSON.parse(leadMatch[1]);
        const webhookUrl = process.env.WEBHOOK_URL;
        if (webhookUrl) {
          const emailBody = `
New Lead from RPS Website Chat
================================
Name:          ${lead.name || 'Not provided'}
Email:         ${lead.email || 'Not provided'}
Phone:         ${lead.phone || 'Not provided'}

Intent:        ${lead.intent || 'Not provided'}
Business Type: ${lead.type || 'Not provided'}
Budget:        ${lead.budget || 'Not provided'}
Location:      ${lead.location || 'Not provided'}
Score:         ${lead.score?.toUpperCase() || 'Not provided'}

Time:          ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}
Source:        RPS Chat Widget
================================`.trim();

          const formData = new URLSearchParams({
            subject: `New ${lead.score?.toUpperCase() || 'NEW'} Lead - ${lead.name || 'Unknown'} - ${lead.location || 'Unknown location'}`,
            body: emailBody,
            name: lead.name || '',
            email: lead.email || '',
            phone: lead.phone || '',
            intent: lead.intent || '',
            type: lead.type || '',
            budget: lead.budget || '',
            location: lead.location || '',
            score: lead.score || '',
            source: 'rps-chat-widget',
            timestamp: new Date().toISOString(),
          });

          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          });
        }
      } catch (e) {
        console.log('Webhook error:', e.message);
      }
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
