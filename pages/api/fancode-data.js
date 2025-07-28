export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');

  try {
    const response = await fetch('https://raw.githubusercontent.com/drmlive/fancode-live-events/refs/heads/main/fancode.json', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch fancode data');
    }
    
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching fancode data:', error);
    res.status(500).json({ error: 'Failed to fetch live events data' });
  }
}
