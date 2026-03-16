import React, { useState } from 'react';
import  style from './klinik.module.css'

// Composant ClinicCard amélioré
function ClinicCard({ clinic }) {
  return (
    <div className={style.clinic_card}>
      <div className={style.clinic_header}>
        <div className={style.clinic_image}>
          <div className={style.hospital_icon}>
            <i className="fa-solid fa-briefcase-medical" style={{fontSize:'60px'}}></i>
          </div>
        </div>
      </div>
      
      <div className={style.clinic_content}>
        <h3 className={style.clinic_name}>{clinic.name}</h3>
        <div className={style.clinic_meta}>
          <div className={style.meta_item}>
            <svg viewBox="0 0 24 24" fill="currentColor" className={style.meta_icon}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>{clinic.city}</span>
          </div>
          
          <div className={style.meta_item}>
            <svg viewBox="0 0 24 24" fill="currentColor" className={style.meta_icon}>
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
            <span>{clinic.horaire}</span>
          </div>
        </div>
        
        <p className={style.clinic_description}>{clinic.description}</p>
        
        <div className={style.clinic_stats}>
          <div className={style.stat_item}>
            <span className={style.stat_number}>{clinic.branches || 12}</span>
            <span className={style.stat_label}>Branches</span>
          </div>
          <div className={style.stat_item}>
            <span className={style.stat_number}>{clinic.doctors || 45}</span>
            <span className={style.stat_label}>Médecins</span>
          </div>
          <div className={style.stat_item}>
            <span className={style.stat_number}>{clinic.rating || '4.8'}</span>
            <span className={style.stat_label}>★ Avis</span>
          </div>
        </div>
        
        <button className={style.clinic_btn}>
          <span>Prendre rendez-vous</span>
          <svg viewBox="0 0 24 24" fill="currentColor" className={style.btn_icon}>
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
export default ClinicCard