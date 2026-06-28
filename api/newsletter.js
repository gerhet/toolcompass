export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Ungültige E-Mail-Adresse' });
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [3],
        updateEnabled: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400 && data.code === 'duplicate_parameter') {
        return res.status(200).json({ success: true, message: 'Du bist bereits angemeldet!' });
      }
      return res.status(response.status).json({ error: data.message || 'Fehler bei der Anmeldung' });
    }

    return res.status(200).json({ success: true, message: 'Danke für deine Anmeldung!' });
  } catch (error) {
    return res.status(500).json({ error: 'Server-Fehler. Bitte später erneut versuchen.' });
  }
}
