import React from 'react';
import style from './DoctorPopup.module.css';

const DoctorPopup = ({ isOpen, onClose, doctors, specialtyName }) => {
  if (!isOpen) return null;

  return (
    <div className={style.overlay} onClick={onClose}>
      <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.header}>
            <h3>{specialtyName} -Mevcut Doktorlar</h3>
            <button className={style.closeBtn} onClick={onClose}>&times;</button>
            </div>
            <div className={style.body}>
            {doctors && doctors.length > 0 ? (
                <ul className={style.doctorList}>
                {doctors.map((doc) => (
                    <li key={doc.id} className={style.doctorItem}>
                    <span className={style.avatar}>👨‍⚕️</span>
                    <span className={style.docName}>{doc.name} {doc.surname}</span>
                    </li>
                ))}
                </ul>
            ) : (
                <p className={style.noData}>Aucun médecin trouvé pour cette spécialité.</p>
            )}
            </div>
            <div className={style.footer}>
                <button className={style.cancelBtn} onClick={onClose}>İptal</button>
                <button
                    className={style.confirmBtn}
                >
                    Devam et →
                </button>
            </div>
      </div>
    </div>
  );
};

export default DoctorPopup;