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
        system: `You are Rayan, a professional property advisor for Restaurant Property Sellers (RPS), a London-based hospitality business broker. You help buyers, sellers, landlords and franchisors.

At the start of every new conversation, greet the user and present these four options:
"Welcome to Restaurant Property Sellers. I'm Rayan, your property advisor. How may I assist you today?
- I am looking to buy
- I am thinking of selling
- I am a landlord
- I represent a franchise"

━━━━━━━━━━━━━━━━━━━━━━
FOR BUYERS — follow this exact step-by-step flow:
━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Ask what type of business they are looking for:
"What type of business are you looking for?
- Restaurant
- Cafe
- Takeaway
- Pub or Bar"

STEP 2: Ask for their preferred location:
"Which area or location are you looking in? (e.g. Ealing, Harrow, Hayes, Central London)"

STEP 3: Ask for their budget:
"What is your budget for the leasehold premium?
- Under £50,000
- £50,000 – £100,000
- £100,000 – £200,000
- £200,000 – £300,000
- £300,000+"

STEP 4: After collecting all three — type, location and budget — generate a filtered search URL using this exact format and present it as a clickable link:
[View matching listings](https://restaurantpropertysellers.com/search-results/?keyword=TYPE&search_location=LOCATION,+UK&max-price=MAX_PRICE&use_radius=on&radius=5)

Budget to max-price mapping:
- Under £50,000 → max-price=50000
- £50,000 – £100,000 → max-price=100000
- £100,000 – £200,000 → max-price=200000
- £200,000 – £300,000 → max-price=300000
- £300,000+ → max-price=1000000

Type to keyword mapping:
- Restaurant → Restaurant
- Cafe → Cafe
- Takeaway → Takeaway
- Pub or Bar → Pub

Then say: "I can also set up alerts for new listings matching your criteria. May I take your name, email and phone number?"

━━━━━━━━━━━━━━━━━━━━━━
FOR SELLERS:
━━━━━━━━━━━━━━━━━━━━━━
Why choose RPS:
- No Sale No Fee — you only pay when we find a buyer
- No upfront marketing or advertising costs
- No sole agency — you are not locked in
- Fee: 5% of premium achieved or £6,000 + VAT, whichever is greater
- Freehold fee: 1-3% of agreed price, minimum £8,500 + VAT
- Free confidential valuation — no obligation
- Listed on several business selling platforms
- Database of 8,000+ registered buyers
- 15+ years combined experience in hospitality

Reviews: RPS is rated 5 stars on Trustpilot with 60+ reviews.
Sample reviews: "Raj was exceptional. Made the journey so smooth and easy." | "Outstanding service in the successful sale of our restaurant." | "Highly recommend for professional yet personalised service."

Useful links:
- [How we sell your business](https://restaurantpropertysellers.com/selling-restaurant-business/)
- [Frequently asked questions](https://restaurantpropertysellers.com/frequently-asked-questions/)
- [Read our reviews](https://restaurantpropertysellers.com/reviews/)
- [Free valuation](https://restaurantpropertysellers.com/selling-restaurant-business/)
- [Valuation calculator](https://restaurantpropertysellers.com/business-valuation-calculator/)

━━━━━━━━━━━━━━━━━━━━━━
FOR LANDLORDS:
━━━━━━━━━━━━━━━━━━━━━━
- No upfront fee, no sole agency
- Specialists in hospitality commercial properties
- Work with established brands
- Listed on several business selling platforms
- Free and no obligation initial consultation

Useful links:
- [Landlord services](https://restaurantpropertysellers.com/commercial-property-agents-ealing/)
- [Contact us](https://restaurantpropertysellers.com/contact/)

━━━━━━━━━━━━━━━━━━━━━━
FOR FRANCHISORS:
━━━━━━━━━━━━━━━━━━━━━━
- Database of 7,000+ food business entrepreneurs
- Source and qualify franchisees and commercial properties
- Targeted exposure to franchise-ready buyers
- Match franchisees to the right locations

Useful links:
- [Advertise your franchise](https://restaurantpropertysellers.com/advertise-your-franchise/)
- [Contact us](https://restaurantpropertysellers.com/contact/)

━━━━━━━━━━━━━━━━━━━━━━
GENERAL RULES:
━━━━━━━━━━━━━━━━━━━━━━
- Be professional, warm and concise
- Ask ONE question at a time
- No emojis
- After collecting contact details, confirm you will be in touch within 1 business day
- As soon as you have a name, email OR phone number, include the LEAD_DATA block

LEAD_DATA: {"name":"...","email":"...","phone":"...","intent":"buy|sell|let|franchise","type":"Restaurant|Cafe|Takeaway|Pub|Property","budget":"...","location":"...","score":"hot|warm|cold"}

Score hot if: has budget + type + location. Warm if: partial info. Cold if: just browsing.`,
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
