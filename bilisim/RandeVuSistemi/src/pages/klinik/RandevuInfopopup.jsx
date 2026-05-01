import React, { useState } from 'react';
import style from './RandevuInfopopup.module.css';

const ConsultationModalPopup = ({ isOpen, onClose, onConfirm, patientName }) => {
  const [formData, setFormData] = useState({
    history: '',
    symptoms: '',
    medications: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    onConfirm(formData); // Envoie les données vers ton API PHP
    onClose();
  };

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
          <button className={style.confirmBtn} onClick={handleConfirm}>
            Onay
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ConsultationModalPopup;