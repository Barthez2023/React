import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import React from 'react';
import { render } from '@react-email/render';

// On importe le  template d'email
import NewEmail from './emails/NewEmail.jsx'; 

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/api/send', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "L'email est requis." });
  }

  try {
    // 1. On transforme le composant React en HTML pur à la volée
    const emailHtml = await render(
      React.createElement(NewEmail, { verificationCode: "951753" })
    );

    // 2. On envoie ce HTML via Resend
    const { data, error } = await resend.emails.send({
      from: 'Hastane@mhr.today', // Reste sur ça pour tes tests
      to: email,
      subject: "Ton code de vérification !",
      html: emailHtml, // ✨ C'est ici que la magie opère
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur prêt à envoyer des composants React sur http://localhost:${PORT}`);
});