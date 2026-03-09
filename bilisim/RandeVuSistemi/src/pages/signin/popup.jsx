import style from './popup.module.css'
import React, { useState } from 'react';

// Composant Popup
const SuccessPopup = ({ isOpen, onClose, message, userName }) => {
  if (!isOpen) return null;
  return (
    <div className={style.container1} onClick={onClose}>
      <div className={style.container2} onClick={(e) => e.stopPropagation()}>
        {/* Icône de succès */}
        <div className={style.icon}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path 
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" 
              fill="white"
            />
          </svg>
        </div>

        {/* Titre */}
        <h2 className={style.title}>
          Kayıt işlemi başarıyla tamamlandı!
        </h2>

        {/* Message principal */}
        <p className={style.message}>
          {`Hoş geldiniz ${userName} ! ${message}`}
        </p>

        {/* Sous-message */}
        <p className= {style.submessage}>
          Hesabınız başarıyla oluşturuldu. 
          <br />
          Giriş sayfasına yönlendirileceksiniz...
        </p>

        {/* Bouton principal */}
        <button 
          onClick={onClose}
          className={style.confirmbtn}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#45a049';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#4CAF50';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
          }}
        >
          Tamam
        </button>

        {/* Bouton fermeture */}
        <button 
          onClick={onClose}
          className={style.cancelbtn}
          onMouseEnter={(e) => e.target.style.color = '#333'}
          onMouseLeave={(e) => e.target.style.color = '#999'}
        >
          ×
        </button>
      </div>
    </div>
  );
};
export default SuccessPopup;