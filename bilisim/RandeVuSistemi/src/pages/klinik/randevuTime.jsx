import React from 'react';
import { useState,useEffect } from 'react';
import style from './randevuTime.module.css';
import axios from 'axios';

const RandevuTimePopup = ({slots, selectedDoctor,isOpen, onClose,randevuday }) => {
    // Si le popup n'est pas censé être ouvert, on n'affiche rien
    if (!isOpen) return null;
    // const handleBooking = (slot) => {
    //     console.log("Rendez-vous choisi :", slot);
    //     alert(`Rendez-vous sélectionné à ${slot.baslangic_saat}`);
    // };
    const currentDay = new Intl.DateTimeFormat('tr-TR', { weekday: 'long',day: 'numeric',month: 'long',year: 'numeric' }).format(new Date());
  
  //ici on va gerer la prise de rendez-vous pour un partient on a deja l'id du docteur selectionner
  //et le patient connecter .

  //affichage de l'heure sous le format jour-mois-annee
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // d.getMonth() + 1: Janvier est 0 !
    const year = d.getFullYear();
    const currentDate = `${year}-${month}-${day}`;
    // Déclare un état pour suivre quel créneau est en train d'être réservé afin d'eviter a deux patient de reserver un rendevu a la meme heure
    const [isBookingId, setIsBookingId] = useState(null);

    const handleBooking = async (slot) => {
        // On bloque le bouton immédiatement
        setIsBookingId(slot.id);
        const patientId = localStorage.getItem('hastaId');
        // On prépare les données
        const bookingData = {
            patientId: patientId,
            doktorId: selectedDoctor.id,
            date: currentDate, //date aleatoire elle sera modifier plus tard
            start: slot.baslangic_saat,
            end: slot.bitis_saat,
            durum:"mesgul"
        };

        try {
            const response = await axios.post("http://localhost/BilisimTekno/randevuKaydet.php", bookingData);
            
            if (response.data.success) {
                alert("Randevu başarıyla alındı !");
                onClose(); // On ferme le popup
                // Optionnel : rediriger vers la page d'accueil pour voir le RDV s'afficher
            } else {
                alert("Hata: " + response.data.message);
                setIsBookingId(null); // On débloque seulement en cas d'erreur pour qu'il puisse réessayer
            }
        } catch (error) {
            console.error("Erreur lors de la réservation", error);
            setIsBookingId(null);
        }
    };
    //On récupère l'heure actuelle (ex: "14:30")
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    // On récupère le nom du jour actuel (ex: "Pazartesi")
    const todayName = new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(now);

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
                        slots.map((slot, index) => {
                            // On vérifie si le créneau est expiré
                            // Un créneau est passé SEULEMENT si c'est aujourd'hui ET que l'heure de fin est dépassée
                            const isToday = randevuday === todayName; 
                            const isPast = isToday && (slot.bitis_saat < currentTime);
                            return(
                                <button 
                                    key={index} 
                                    className={`${style.timeChip} ${isPast ? style.pastSlot : ''}`}
                                    /* Le bouton est désactivé si son ID est celui en cours de traitement */
                                    disabled={isBookingId === slot.id || isPast}
                                    onClick={() => handleBooking(slot)}
                                >
                                    {isBookingId === slot.id ? (
                                            <span><i className="fa-solid fa-spinner fa-spin"></i> ...</span>
                                        ) : (
                                            `${slot.baslangic_saat} - ${slot.bitis_saat}`
                                        )
                                    }
                                </button>
                            ) 
                        })
                    ) : (
                        <div className={style.emptyState}>
                            <i className="fa-solid fa-calendar-xmark"></i>
                            <p>Bugün için uygun randevu saati bulunmamaktadır.</p>
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