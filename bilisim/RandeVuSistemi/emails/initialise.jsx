import { Resend } from 'resend';
import NewEmail from './NewEmail'; 

// Initialisation côté serveur avec la variable d'environnement système
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { email } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: "Hastane@mhr.com", 
      to: email,
      subject: "Test d'envoi d'email",
      react: <NewEmail verificationCode="123456" />, // Format JSX correct
    });

    if (error) {
      return res.status(400).json({ error });
    }

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}