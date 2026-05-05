// import React from 'react';
// import { useState,useEffect } from 'react';
// import style from './randevuTime.module.css';
// import axios from 'axios';

// const RandevuTimePopup = ({slots, selectedDoctor,isOpen, onClose,randevuday }) => {
//     // Si le popup n'est pas censé être ouvert, on n'affiche rien
//     if (!isOpen) return null;
//     // const handleBooking = (slot) => {
//     //     console.log("Rendez-vous choisi :", slot);
//     //     alert(`Rendez-vous sélectionné à ${slot.baslangic_saat}`);
//     // };
//     const currentDay = new Intl.DateTimeFormat('tr-TR', { weekday: 'long',day: 'numeric',month: 'long',year: 'numeric' }).format(new Date());
  
//   //ici on va gerer la prise de rendez-vous pour un partient on a deja l'id du docteur selectionner
//   //et le patient connecter .

//   //affichage de l'heure sous le format jour-mois-annee
//     const d = new Date();
//     const day = String(d.getDate()).padStart(2, '0');
//     const month = String(d.getMonth() + 1).padStart(2, '0'); // d.getMonth() + 1: Janvier est 0 !
//     const year = d.getFullYear();
//     const currentDate = `${year}-${month}-${day}`;
//     // Déclare un état pour suivre quel créneau est en train d'être réservé afin d'eviter a deux patient de reserver un rendevu a la meme heure
//     const [isBookingId, setIsBookingId] = useState(null);

//     const handleBooking = async (slot) => {
//         // On bloque le bouton immédiatement
//         setIsBookingId(slot.id);
//         const patientId = localStorage.getItem('hastaId');
//         // On prépare les données
//         const bookingData = {
//             patientId: patientId,
//             doktorId: selectedDoctor.id,
//             date: currentDate, //date aleatoire elle sera modifier plus tard
//             start: slot.baslangic_saat,
//             end: slot.bitis_saat,
//             durum:"mesgul"
//         };

//         try {
//             const response = await axios.post("http://localhost/BilisimTekno/randevuKaydet.php", bookingData);
            
//             if (response.data.success) {
//                 alert("Randevu başarıyla alındı !");
//                 onClose(); // On ferme le popup
//                 // Optionnel : rediriger vers la page d'accueil pour voir le RDV s'afficher
//             } else {
//                 alert("Hata: " + response.data.message);
//                 setIsBookingId(null); // On débloque seulement en cas d'erreur pour qu'il puisse réessayer
//             }
//         } catch (error) {
//             console.error("Erreur lors de la réservation", error);
//             setIsBookingId(null);
//         }
//     };
//     //On récupère l'heure actuelle (ex: "14:30")
//     const now = new Date();
//     const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
//     // On récupère le nom du jour actuel (ex: "Pazartesi")
//     const todayName = new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(now);
    

//     return (
//     <div className={style.overlay} onClick={onClose}>
//         <div className={style.modal} onClick={(e) => e.stopPropagation()}>
//             {/* onClick={(e) => e.stopPropagation()} : Ajouté sur les .modal. Sans cela, quand tu cliques à 
//             l'intérieur du popup, il se ferme tout seul (car le clic "remonte" jusqu'à l'overlay). */}
//             <button className={style.closeBtn} onClick={onClose}>×</button>
            
//             <div className={style.header}>
//                 <div className={style.docAvatar}><i className="fa-solid fa-user-md"></i></div>
//                 <div>
//                     <h2>Dr.{selectedDoctor?.name} {selectedDoctor?.surname}</h2>
//                     <span className={style.specialty}>{selectedDoctor?.speciality}</span>
//                 </div>
//             </div>

//             <div className={style.body}>
//                 <h3><i className="fa-regular fa-calendar-check"></i>Bugünün Müsait Saatleri</h3>
//                 <p className={style.dateText}>{currentDay}</p>
                
//                 <div className={style.slotsGrid}>
//                     {slots.length > 0 ? (
//                         slots.map((slot, index) => {
//                             // On vérifie si le créneau est expiré
//                             // Un créneau est passé SEULEMENT si c'est aujourd'hui ET que l'heure de fin est dépassée
//                             const isToday = randevuday === todayName; 
//                             const isPast = isToday && (slot.bitis_saat < currentTime);
//                             return(
//                                 <button 
//                                     key={index} 
//                                     className={`${style.timeChip} ${isPast ? style.pastSlot : ''}`}
//                                     /* Le bouton est désactivé si son ID est celui en cours de traitement */
//                                     disabled={isBookingId === slot.id || isPast}
//                                     onClick={() => handleBooking(slot)}
//                                 >
//                                     {isBookingId === slot.id ? (
//                                             <span><i className="fa-solid fa-spinner fa-spin"></i> ...</span>
//                                         ) : (
//                                             `${slot.baslangic_saat} - ${slot.bitis_saat}`
//                                         )
//                                     }
//                                 </button>
//                             ) 
//                         })
//                     ) : (
//                         <div className={style.emptyState}>
//                             <i className="fa-solid fa-calendar-xmark"></i>
//                             <p>Bugün için uygun randevu saati bulunmamaktadır.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//              <div className={style.footer}></div>
//         </div>
//     </div>
//   )
    
// };

// export default RandevuTimePopup;



import NavbarHasta from './navbar';
import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import style from './HastaHomePage.module.css'
import { UserContext } from '../contextAPI/randevuSayiContext';

const WelcomeHasta = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    const [hasta, setHasta] = useState(null);
    const { HastaRandevusayisi } = useContext(UserContext);
    useEffect(() => {
          const hastaId=localStorage.getItem("hastaId");
        if (!hastaId) {
            console.error("Aucun ID trouvé");  // Sécurité : n'appelle pas l'API si l'ID est absent
            return;
        }
        const loadDashboardData = async () => {
            try {
                // Infos hasta
                const resHasta = await axios.post("http://localhost/BilisimTekno/getHastaInfo.php", {
                    hastaId: hastaId
                });
                if (resHasta.data.success){
                    setHasta(resHasta.data.data);
                } 
                console.log("Réponse du serveur docteur:", resHasta.data);

            } catch (error) {
                console.error("Error API :", error);
            }
        };
            loadDashboardData();
            // 2. Horloge dynamique
            const timer = setInterval(() => setCurrentTime(new Date()), 60000);
            return () => clearInterval(timer);
        }, []);
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('fr-FR', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        }).format(date);
    };
    const navigate=useNavigate();
    const handlerrandevu=()=>{
        navigate("/hasta/klinik")
    }


    //permet de recupperer les nom des villes en fonction du code
    const [locationNames, setLocationNames] = useState({ city: '', il: '', ilce: '' });

    useEffect(() => {
        // On ne lance la recherche que si on a les infos du patient (et ses codes)
        if (!hasta) return;
        const fetchLocationData = async () => {
            try {
                // 1. Récupérer et trouver la VILLE
                const resCities = await fetch("https://beterali.com/api/v1/cities");
                const dataCities = await resCities.json();
                // On cherche la ville dont le code correspond à hasta.Il (ou hastacity)
                const cityObj = dataCities.data.cities.find(c => c.city_code === hasta.hastacity);
                
                // 2. Récupérer et trouver le DISTRICT (İlçe)
                const resDistricts = await fetch(`https://beterali.com/api/v1/districts?city_code=${hasta.hastacity}`);
                const dataDistricts = await resDistricts.json();
                const districtObj = dataDistricts.data.districts.find(d => d.district_code === hasta.Il);

                // 3. Récupérer et trouver le QUARTIER (Mahalle)
                // Note: Adapte le nom du champ (ex: hasta.mahalle_code) selon ta DB
                const resNeighbours = await fetch(`https://beterali.com/api/v1/neighbourhoods?districts_code=${hasta.Il}`);
                const dataNeighbours = await resNeighbours.json();
                const neighbourObj = dataNeighbours.data.neighbourhoods.find(n => n.neighbourhood_code === hasta.Ilce);

                // On met à jour les noms lisibles
                setLocationNames({
                    city: cityObj ? cityObj.city_name : 'Belirtilmemiş',
                    il: districtObj ? districtObj.district_name : 'Belirtilmemiş',
                    ilce: neighbourObj ? neighbourObj.neighbourhood_name : 'Belirtilmemiş'
                });

            } catch (err) {
                console.error("Erreur lors de la conversion des codes :", err);
            }
        };

        fetchLocationData();
    }, [hasta]); // Se déclenche dès que les infos 'hasta' (et donc les codes) sont chargées
    if (!hasta) return <div className={style.loader}>Alanınız yükleniyor...</div>;
    return (
        <div className={style.pageWrapper}>
            <NavbarHasta/>
            {/* Header Dynamique */}
            <div className={style.topBar}>
                <div className={style.welcome}>
                    <h1>Hoş Geldin ,  {hasta.hastaName}</h1>
                    <p>{formatDate(currentTime)} • {locationNames.city}, {locationNames.il}</p>
                </div>
                <div className={style.quickActions}>
                    <button className={style.btnAppointment} onClick={handlerrandevu}>
                        <i className="fa-solid fa-calendar-plus"></i> Randevu Al
                    </button>
                </div>
            </div>

            <div className={style.gridContainer}>
                {/* 1. Carte de Profil Patient */}
                <div className={`${style.card} ${style.profileCard}`}>
                    <div className={style.cardHeader}>
                        <div className={style.avatar}>
                            <i className="fa-solid fa-user"></i>
                        </div>
                        <div>
                            <h2>{hasta.hastaName} {hasta.hastaSurname}</h2>
                            <div className={style.point}>
                                <span className={style.pulse}></span>
                                <span className={style.patientTag}>Doğrulanmış Hasta</span>
                            </div>
                            
                        </div>
                    </div>
                    
                    <div className={style.infoGrid}>
                        <div className={style.infoItem}>
                            <label><i className="fa-solid fa-user-tag"></i> Cinsiyet</label>
                            <p style={{textTransform:'capitalize'}}>{hasta.gender}</p>
                        </div>
                        <div className={style.infoItem}>
                            <label><i className="fa-solid fa-map-location-dot"></i> Şehir</label>
                            <p>{locationNames.city}</p>
                        </div>
                        <div className={style.infoItem}>
                            <label><i className="fa-solid fa-house-medical"></i> Il</label>
                            <p>{locationNames.il}</p>
                        </div>
                        <div className={style.infoItem}>
                            <label><i className="fa-solid fa-road"></i> Ilçe</label>
                            <p>{locationNames.ilce}</p>
                        </div>
                    </div>
                </div>

                {/* 2. Résumé des rendez-vous à venir */}
                <div className={`${style.card} ${style.appointmentCard}`}>
                    <h3><i className="fa-solid fa-calendar-check"></i> Yaklaşan Randevularınız</h3>
                    <div className={style.emptyState}>
                        {/* Ajout d'une icône d'illustration discrète */}
                        <i className="fa-solid fa-calendar-day" style={{fontSize: '3rem', color: '#cbd5e1', marginBottom: '15px'}}></i>
                        
                        <p>Şu anda planlanmış herhangi bir randevu bulunmamaktadır.</p>
                        
                        <button className={style.secondaryBtn}>
                            <i className="fa-solid fa-clock-rotate-left"></i> Geçmişi görüntüle
                        </button>
                    </div>
                </div>

                {/* 3. Section Statistiques Santé (Optionnel) */}
                <div className={style.statsGrid}>
                    <div className={style.statBox}>
                        <span className={style.statVal}>{HastaRandevusayisi}</span>
                        <span className={style.statLabel}>RandeVu</span>
                    </div>
                    <div className={style.statBox}>
                        <span className={style.statVal}>0</span>
                        <span className={style.statLabel}>Reçeteler</span>
                    </div>
                    <div className={style.statBox}>
                        <span className={style.statVal}>0</span>
                        <span className={style.statLabel}>Analitik</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeHasta;

