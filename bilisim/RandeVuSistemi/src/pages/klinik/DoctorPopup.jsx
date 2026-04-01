import React from 'react';
import { useState,useEffect } from 'react';
import style from './DoctorPopup.module.css';
import axios from 'axios';
import RandevuTimePopup from './randevuTime';

const DoctorPopup = ({ isOpen, onClose, doctors, specialtyName }) => {
  //on va gere l'ouverture et la fermeture du pop qui contient les heure du docteur
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [slots, setSlots] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isTimePopupOpen, setIsTimePopupOpen] = useState(false);

    const handleDoctorClick = async (doctor) => {
        // 1. Obtenir le jour actuel (ex: "Çarşamba")
        const currentDay = new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(new Date());
        try {
            // 2. Récupérer les créneaux de ce docteur pour CE jour précis
            const response = await axios.post("http://localhost/BilisimTekno/GetTime_fromDoktor.php", {
                idDoktor: doctor.id,
                caslisma_gun: currentDay
            });

            if (response.data.success) {
                setSlots(response.data.data);
                setSelectedDoctor(doctor);
                setIsTimePopupOpen(true);  // On ouvre le deuxième popup celui des temps
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des créneaux", error);
        }
    };
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
                    <li key={doc.id} className={style.doctorItem} onClick={() => handleDoctorClick(doc)}>
                    <span className={style.avatar}>👨‍⚕️</span>
                    <span className={style.docName}>{doc.name} {doc.surname}</span>
                    </li>
                ))}
                </ul>
            ) : (
                <p className={style.noData}>Bu uzmanlık dalında doktor bulunamadı.</p>
            )}
            </div>
            <div className={style.footer}>
                {/* <button className={style.cancelBtn} onClick={onClose}>İptal</button>
                <button
                    className={style.confirmBtn}
                >
                    Devam et →
                </button> */}
            </div>
            {/* APPEL DU DEUXIÈME POPUP CELUI CONTENANT LES HEURES DU DOCTEUR SELECTIONNER */}
            <RandevuTimePopup
                isOpen={isTimePopupOpen} 
                onClose={() => setIsTimePopupOpen(false)} 
                slots={slots} 
                selectedDoctor={selectedDoctor} 
            />
      </div>
    </div>
  );
};

export default DoctorPopup;