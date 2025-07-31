export default async function handler(req, res) {
  try {
    const response = await fetch('https://raw.githubusercontent.com/scoobyff/test/main/sitetest.txt', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch channel data');
    }

    const data = await response.text();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'text/plain');

    res.status(200).send(data);
  } catch (error) {
    console.error('Error fetching channel data:', error);
    res.status(500).json({ error: 'Failed to fetch channel data' });
  }
}