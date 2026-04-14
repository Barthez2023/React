
import React, { useState,useEffect } from 'react';
import style from './popupsetTime.module.css';
import axios from 'axios';

const PopUpSetTime= ({ isOpen, onClose, clinicName, onAddSlot }) => {
    const [newplage, setPlage] = useState({ 
        gun: 'Pazartesi', 
        start: '08:00', 
        end: '09:00' ,
        slots:[]
    });
  // Date du jour formatée proprement
  const today = new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const saveSchedule = async (id,plage) => {
        const response = await axios.post("http://localhost/BilisimTekno/SaveSchedule.php", {
            idDoktor:id,
            TimePlage:plage
        });
        if(response.data.success) alert("Zaman eklendi!");
  };

  const saveScheduleAraligi = async (id,plage) => {
      const response = await axios.post("http://localhost/BilisimTekno/SaveScheduleAraligi.php", {
          idDoktor:id,
          TimePlage:plage
      });
      if(response.data.success) alert("Zaman aralığı eklendi!");
  };
  const [idDoktor, setIdDoktor] = useState(null);
  useEffect(() => {
          // 1. On récupère l'ID du docteur connecter
          const savedId = localStorage.getItem('doktorId');
          if (savedId) {
              setIdDoktor(savedId);
          } else {
              console.error("Aucun ID trouvé dans le localStorage");
          }
  }, []);
  const handleEndChange = (e) => {
    const endValue = e.target.value;
    const startTime = newplage.start; 

    // 1. Convertir les heures en minutes totales pour faciliter le calcul
    const startInMinutes = (parseInt(startTime.split(':')[0]) * 60) + parseInt(startTime.split(':')[1]);
    const endInMinutes = (parseInt(endValue.split(':')[0]) * 60) + parseInt(endValue.split(':')[1]);

    const ZamanAraligi = [];
    let current = startInMinutes;

    // 2. Boucle de génération avec un écart de 90 minutes (1h30)
    while (current <= endInMinutes) {
        const h = Math.floor(current / 60).toString().padStart(2, '0');
        const m = (current % 60).toString().padStart(2, '0');
        ZamanAraligi.push(`${h}:${m}`);
        current += 90; // Ajouter 1h30
    }

    // 3. Mise à jour unique de l'état (Atomique)
    setPlage({
        ...newplage,
        end: endValue,
        slots: ZamanAraligi
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // onAddSlot({ day: selectedDay, start: startTime, end: endTime });
    saveSchedule(idDoktor,newplage);
    onClose();
  };
  const handleSubmitslots = (e) => {
    e.preventDefault();
    // onAddSlot({ day: selectedDay, start: startTime, end: endTime });
    console.log("end :",newplage.end)
    console.log("start :",newplage.start)
    console.log("le temps est :",newplage.slots)
    saveScheduleAraligi(idDoktor,newplage);
    onClose();
  };
    if (!isOpen) return null;

  return (
    <div className={style.overlay}>
      <div className={style.popupCard}>
        {/* Header du Popup */}
        <div className={style.header}>
          <div className={style.titleSection}>
            <h2>Randevu için müsaitlik ekleyin.</h2>
            <p className={style.dateText}>{today}</p>
          </div>
          <button onClick={onClose} className={style.closeBtn}>&times;</button>
        </div>

        {/* Corps du formulaire */}
        <form className={style.body}>
          <div className={style.infoSection}>
            <i className="fa-solid fa-hospital"></i>
            <span>{clinicName ? (
                clinicName
            ) : (
                <span style={{ color: '#e17055', fontWeight: 'bold' }}>
                <i className="fa-solid fa-clock-rotate-left"></i> Klinik görevlendirme devam ediyor...
                </span>
            )}</span>
          </div>

          <div className={style.inputGroup}>
            <label>Haftanın günü</label>
            <select 
              value={newplage.gun} 
              onChange={(e) => setPlage({...newplage, gun: e.target.value})}
              className={style.selectInput}
            >
              {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div className={style.timeRow}>
            <div className={style.inputGroup}>
              <label>Başlangıç ​​Saati</label>
              <input 
                type="time" 
                value={newplage.start} 
                onChange={(e) => setPlage({...newplage, start: e.target.value})}
                className={style.timeInput}
              />
            </div>
            <div className={style.arrow}><i className="fa-solid fa-arrow-right"></i></div>
            <div className={style.inputGroup}>
              <label>Bitiş Saati</label>
              <input 
                type="time" 
                value={newplage.end} 
                onChange={handleEndChange}
                className={style.timeInput}
              />
            </div>
          </div>

          {/* Footer avec boutons d'action */}
          <div className={style.footer}>
            <button type="button" onClick={onClose} className={style.cancelBtn}>Iptal</button>
            <button type="submit" className={style.submitBtn} onClick={handleSubmit}>Onayla</button>
            <button type="submit" className={style.submitBtn} onClick={handleSubmitslots}>Zaman Aralığı</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopUpSetTime;