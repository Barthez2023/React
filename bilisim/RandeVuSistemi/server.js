import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import React from 'react';
import { render } from '@react-email/render';
import mysql from 'mysql2/promise'; // Import de MySQL avec support des Promesses (async/await)
import Confirm from './emails/Confirm.jsx'; 

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// Configuration de la connexion à la base de données MySQL
const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

app.post('/api/send', async (req, res) => {
  const { patientId, departmentName, hospitalName, ville, appointmentDate } = req.body;

  if (!patientId) {
    return res.status(400).json({ error: "L'ID du patient et la date sont requis." });
  }

  try {
    // 1.REQUÊTE MYSQL : Récupérer les infos du patient depuis phpMyAdmin
    
    const [rows] = await dbPool.query(
      `SELECT 
          p.email,            
          r.randevu_date,
          r.baslangic_saat,
          d.speciality ,
          p.name AS nom,
          p.surname AS prenom,
          k.name AS clinicName,
          k.city AS clinicCity
      FROM randevular r
      JOIN doktorlar d ON r.doktor_id = d.id
      JOIN klinik k ON d.klinik_id = k.id
      JOIN hastalar p ON r.patient_id = p.id
      WHERE p.id = ? AND 	r.status='Beklemede'
      ORDER BY r.randevu_date DESC, r.baslangic_saat DESC
      LIMIT 1`,
      
      [patientId]
    );

    // Vérifier si le patient existe
    if (rows.length === 0) {
      return res.status(404).json({ error: "Patient introuvable dans la base de données." });
    }

    const patient = rows[0];
    const nomComplet = `${patient.prenom} ${patient.nom}`;

    // 2. 🎨 RENDU DE L'EMAIL : On fusionne les données de la DB
    const emailHtml = await render(
      React.createElement(Confirm, { 
        patientName: nomComplet,
        departmentName: patient.speciality,
        hospitalName: patient.clinicName,
        ville: patient.clinicCity,
        appointmentDate: patient.randevu_date,
        time: patient.baslangic_saat,
      })
    );

    // 3. 🚀 ENVOI VIA RESEND
    const { data, error } = await resend.emails.send({
      from: 'Hastane@mhr.today',
      to: patient.email, // L'adresse email récupérée directement depuis phpMyAdmin !
      subject: `Randevunuzun onayı - ${patient.clinicName}`,
      html: emailHtml, 
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Erreur Serveur :", err);
    return res.status(500).json({ error: "Erreur lors de la communication avec la base de données ou Resend." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur connecté à la DB et actif sur http://localhost:${PORT}`);
});