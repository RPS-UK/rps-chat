export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const location = req.query.q;
  if (!location) return res.status(400).json({ error: 'Missing location' });

  try {
    const query = encodeURIComponent(location + ', UK');
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=gb`,
      { headers: { 'User-Agent': 'RPS-Chat-Widget/1.0', 'Accept-Language': 'en' } }
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return res.status(200).json({
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        formatted: data[0].display_name.split(',')[0].trim()
      });
    }
    return res.status(200).json({ lat: null, lng: null, formatted: location });
  } catch (err) {
    return res.status(200).json({ lat: null, lng: null, formatted: location });
  }
}
