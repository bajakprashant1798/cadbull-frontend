// pages/api/logs.js - Simple log collection endpoint for EC2 deployment

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { logs } = req.body;

    if (!logs || !Array.isArray(logs)) {
      return res.status(400).json({ error: 'Invalid logs format' });
    }

    // Log each entry to the server console (visible in PM2 logs or server logs)
    logs.forEach(log => {
      const timestamp = new Date().toISOString();
      const logLevel = log.type === 'ERROR' ? 'ERROR' : 'INFO';
      
      // Format log for easy parsing
      console.log(`[${timestamp}] [${logLevel}] [FRONTEND-LOG] ${JSON.stringify(log)}`);
    });

    res.status(200).json({ success: true, processed: logs.length });

  } catch (error) {
    console.error('[LOGS-API-ERROR]', error);
    res.status(500).json({ error: 'Failed to process logs' });
  }
}
