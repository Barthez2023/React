import React, { useState } from 'react';
import style from './sonuc.module.css';

const SonucPopup = ({ isOpen, onClose, onConfirm, patientName }) => {
  const [formData, setFormData] = useState({
    rapor: '',
    Diagnostic: '',
    Recipe: ''
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
          <h2>Randevu :Hasta - {patientName}</h2>
          <button className={style.closeCross} onClick={onClose}>&times;</button>
        </header>

        <div className={style.modalBody}>
          {/* 1. Histoire du patient */}
          <div className={style.inputGroup}>
            <label htmlFor="Randevu Raporu">Randevu Raporu</label>
            <textarea
              id="rapor"
              name="rapor"
              placeholder="Buraya yazabilirsiniz......"
              value={formData.history}
              onChange={handleChange}
            />
          </div>

          {/* 2. Symptômes */}
          <div className={style.inputGroup}>
            <label htmlFor="Diagnostic">Mevcut Teşhis</label>
            <input
              type="text"
              id="Diagnostic"
              name="Diagnostic"
              placeholder="Buraya yazabilirsiniz......"
              value={formData.symptoms}
              onChange={handleChange}
            />
          </div>

          {/* 3. Médicaments et Doses */}
          <div className={style.inputGroup}>
            <label htmlFor="Recipe">Reçete</label>
            <textarea
              id="Recipe"
              name="Recipe"
              placeholder="Buraya yazabilirsiniz..."
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
export default SonucPopup;