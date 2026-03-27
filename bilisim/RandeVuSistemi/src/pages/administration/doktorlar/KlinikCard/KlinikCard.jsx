import { useState } from 'react';
import style from './KlinikCard.module.css';

function KlinikCard({ clinics, isOpen, onClose, onConfirm }) {
  const [selected, setSelected] = useState(null);

  if (!isOpen) return null;

  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <div className={style.header}>
          <h3>Klinik Seçin</h3>
          <p>Lütfen doktor için bir çalışma kliniği belirleyin.</p>
        </div>

        <div className={style.body}>
          {clinics.length > 0 ? (
            <div className={style.clinicGrid}>
              {clinics.map((clinic, index) => (
                <div 
                  key={index} 
                  className={`${style.clinicRow} ${selected === clinic ? style.active : ''}`}
                  onClick={() => setSelected(clinic)}
                >
                  <div className={style.radioCircle}>
                    {selected === clinic && <div className={style.innerCircle} />}
                  </div>
                  <span className={style.clinicName}>{clinic}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={style.empty}>Bu uzmanlık için klinik bulunamadı.</p>
          )}
        </div>

        <div className={style.footer}>
          <button className={style.cancelBtn} onClick={onClose}>Iptal</button>
          <button 
            className={style.confirmBtn} 
            disabled={!selected}
            onClick={() => onConfirm(selected)}
          >
            Onayla
          </button>
        </div>
      </div>
    </div>
  );
}
export default KlinikCard
