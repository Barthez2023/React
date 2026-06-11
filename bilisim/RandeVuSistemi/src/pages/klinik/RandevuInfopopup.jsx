import React, { useState } from 'react';
import style from './RandevuInfopopup.module.css';

const ConsultationModalPopup = ({ isOpen, onClose, onConfirm, patientName }) => {
  const [formData, setFormData] = useState({
    history: '',
    symptoms: '',
    medications: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //ici on va mettre le code de gestion des emails
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const currentPatientId=localStorage.getItem('hastaId');
  const handleSubmit = async () => {
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("http://localhost:3000/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: currentPatientId
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("Email envoyé !");
      } else {
        setStatus(`Erreur : ${result.error}`);
      }
    } catch (error) {
      setStatus("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    onConfirm(formData);
    await handleSubmit();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalBox}>
        <header className={style.modalHeader}>
          <h2>Randevu :  {patientName}</h2>
          <button className={style.closeCross} onClick={onClose}>&times;</button>
        </header>

        <div className={style.modalBody}>
          {/* 1. Histoire du patient */}
          <div className={style.inputGroup}>
            <label htmlFor="history">Hasta öyküsü (Anamnez)</label>
            <textarea
              id="history"
              name="history"
              placeholder="Örneğin: Dün gece pirinç yedim ve sonra..."
              value={formData.history}
              onChange={handleChange}
            />
          </div>

          {/* 2. Symptômes */}
          <div className={style.inputGroup}>
            <label htmlFor="symptoms">Mevcut semptomlar</label>
            <input
              type="text"
              id="symptoms"
              name="symptoms"
              placeholder="Örnek: Karın ağrısı, mide bulantısı..."
              value={formData.symptoms}
              onChange={handleChange}
            />
          </div>

          {/* 3. Médicaments et Doses */}
          <div className={style.inputGroup}>
            <label htmlFor="medications">Alınan ilaçlar ve dozları</label>
            <textarea
              id="medications"
              name="medications"
              placeholder="Örnek: Parasetamol 500 mg (günde iki kez)..."
              value={formData.medications}
              onChange={handleChange}
            />
          </div>
        </div>

        <footer className={style.modalFooter}>
          <button className={style.cancelBtn} onClick={onClose}>
            İptal
          </button>
          <button className={style.confirmBtn} onClick={handleClick}>
            Onay
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ConsultationModalPopup;