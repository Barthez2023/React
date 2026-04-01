import React from 'react';
import { useState,useEffect } from 'react';
import style from './randevuTime.module.css';

const RandevuTimePopup = ({slots, selectedDoctor,isOpen, onClose }) => {
    // Si le popup n'est pas censé être ouvert, on n'affiche rien
    if (!isOpen) return null;
    const handleBooking = (slot) => {
        console.log("Rendez-vous choisi :", slot);
        alert(`Rendez-vous sélectionné à ${slot.baslangic_saat}`);
    };
    const currentDay = new Intl.DateTimeFormat('tr-TR', { weekday: 'long',day: 'numeric',month: 'long',year: 'numeric' }).format(new Date());
  return (
    <div className={style.overlay} onClick={onClose}>
        <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            {/* onClick={(e) => e.stopPropagation()} : Ajouté sur les .modal. Sans cela, quand tu cliques à 
            l'intérieur du popup, il se ferme tout seul (car le clic "remonte" jusqu'à l'overlay). */}
            <button className={style.closeBtn} onClick={onClose}>×</button>
            
            <div className={style.header}>
                <div className={style.docAvatar}><i className="fa-solid fa-user-md"></i></div>
                <div>
                    <h2>Dr.{selectedDoctor?.name} {selectedDoctor?.surname}</h2>
                    <span className={style.specialty}>{selectedDoctor?.speciality}</span>
                </div>
            </div>

            <div className={style.body}>
                <h3><i className="fa-regular fa-calendar-check"></i>Bugünün Müsait Saatleri</h3>
                <p className={style.dateText}>{currentDay}</p>
                
                <div className={style.slotsGrid}>
                    {slots.length > 0 ? (
                        slots.map((slot, index) => (
                            <button 
                                key={index} 
                                className={style.timeChip}
                                onClick={() => handleBooking(slot)}
                            >
                                {slot.baslangic_saat} - {slot.bitis_saat}
                            </button>
                        ))
                    ) : (
                        <div className={style.emptyState}>
                            <i className="fa-solid fa-calendar-xmark"></i>
                            <p>Bugün için uygun randevu bulunmamaktadır.</p>
                        </div>
                    )}
                </div>
            </div>
             <div className={style.footer}></div>
        </div>
    </div>
  )
    
};

export default RandevuTimePopup;