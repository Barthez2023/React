import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarDoktor from './navbar';
import axios from 'axios';
import style from './homePage.module.css'
import PopUpSetTime from './popupsetTime';


function WelcomeDoktor() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dateTime, setDateTime] = useState(new Date());

    //utiliser pour gerer la date et le tem^ps
    useEffect(() => {
        // On met à jour l'heure toutes les minutes (60000ms)
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 60000);

        // Nettoyage de l'intervalle si on quitte la page
        return () => clearInterval(timer);
    }, []);

    // Formater la date : "Mardi 31 Mars 2026"
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('tr-TR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    // Formater l'heure : "17:46"
    const formatTime = (date) => {
        return new Intl.DateTimeFormat('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Format 24h
        }).format(date);
    };
    const navigate = useNavigate();
    const [idDoktor, setIdDoktor] = useState(null);
    const [doktor, setDoktor] = useState(null); 
    useEffect(() => {
        const getDoktorInfo = async (id) => {
            if (!id) return; // Sécurité : n'appelle pas l'API si l'ID est absent

            try {
                const result = await axios.post("http://localhost/BilisimTekno/getDoktorInfo.php", {
                    idDoktor: id
                });

                console.log("Réponse du serveur:", result.data);
                if (result.data.success) {
                    setDoktor(result.data.data);
                }
            } catch (error) {
                console.error("Error API :", error);
            }
        };
        // 1. On récupère l'ID
        const savedId = localStorage.getItem('doktorId');
        if (savedId) {
            setIdDoktor(savedId);
            // 2. On lance l'appel API seulement si l'ID existe
            getDoktorInfo(savedId);
        } else {
            console.error("Aucun ID trouvé dans le localStorage");
        }
        }, []);
        // Dans ton return
        if (!doktor) {
            return <div className={style.loading}>Chargement du profil...</div>;
        }
    return (
        <div className={style.pageWrapper}>
            <NavbarDoktor />
            
            <div className={style.topBar}>
                <div className={style.welcome}>
                    <h1>Hoş Geldiniz Dr. {doktor.docName} {doktor.docSurname}</h1>
                    <p className={style.dateDisplay}>
                        {formatDate(dateTime)} •  {formatTime(dateTime)} 
                        <span className={style.locationDot}> </span>
                        {doktor?.clinicName ? (
                            doktor.clinicName
                        ) : (
                            <span style={{ color: '#e17055', fontWeight: 'bold' }}>
                            <i className="fa-solid fa-clock-rotate-left"></i> Klinik görevlendirme devam ediyor...
                            </span>
                        )}
                    </p>
                </div>
                <div className={style.statusIndicator}>
                    <span className={style.pulse}></span>Hizmette
                </div>
            </div>

            <div className={style.gridContainer}>
                
                {/* 2. Carte de Profil "Elite" */}
                <div className={`${style.card} ${style.profileCard}`}>
                    <div className={style.profileHeader}>
                        <div className={style.avatar}>
                            <i className="fa-solid fa-user-tie"></i>
                        </div>
                        <div>
                            <h2>{doktor.docName} {doktor.docSurname}</h2>
                            <span className={style.specialtyTag}>{doktor.speciality}</span>
                        </div>
                    </div>

                    <div className={style.details}>
                        {/* ID Service */}
                        <div className={style.detailItem}>
                            <i className="fa-solid fa-id-badge"></i>
                            <div>
                                <label>Iş Numarası</label>
                                <p>DOC-{doktor.worknumber}-TR</p>
                            </div>
                        </div>

                        {/* Établissement */}
                        <div className={style.detailItem}>
                            <i className="fa-solid fa-hospital"></i>
                            <div>
                                <label>Çalıştığım Klinik</label>
                                <p>
                                    {doktor?.clinicName ? (
                                        doktor.clinicName
                                    ) : (
                                        <span style={{ color: '#e17055', fontWeight: 'bold' }}>
                                        <i className="fa-solid fa-clock-rotate-left"></i> Klinik görevlendirme devam ediyor...
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* VILLE (Nouveau) */}
                        <div className={style.detailItem}>
                            <i className="fa-solid fa-location-dot"></i>
                            <div>
                                <label>Konum / Şehir</label>
                                <p>{doktor.clinicCity}</p>
                            </div>
                        </div>

                        {/* HORAIRES (Nouveau) */}
                        <div className={style.detailItem}>
                            <i className="fa-solid fa-calendar-day"></i>
                            <div>
                                <label>Hizmet Saatleri</label>
                                <p>{doktor.clinicHoraire}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Bloc Disponibilité Interactif */}
                <div className={`${style.card} ${style.scheduleCard}`}>
                    <h3><i className="fa-solid fa-clock-rotate-left"></i> Zaman Yönetimi</h3>
                    <p>Hastaların randevu alabilmeleri için zaman dilimlerinizi yapılandırın..</p>
                    
                    <div className={style.timePreview}>
                        <div className={style.timeBadge}>09:00 - 12:00</div>
                        <div className={style.timeBadge}>14:00 - 18:30</div>
                    </div>

                    <button className={style.primaryBtn} onClick={() => setIsPopupOpen(true)}>
                        Randevu programımı düzenle
                    </button>
                </div>

                {/* 4. Mini Stats */}
                <div className={style.statsContainer}>
                    <div className={style.statBox}>
                        <span className={style.statVal}>0</span>
                        <span className={style.statLabel}>Beklenen Hastalar</span>
                    </div>
                    <div className={style.statBox}>
                        <span className={style.statVal}>0</span>
                        <span className={style.statLabel}>Iptal Edilenler Randevuları</span>
                    </div>
                    <div className={style.statBox}>
                        <span className={style.statVal}>0</span>
                        <span className={style.statLabel}>Acil Randevu</span>
                    </div>
                </div>

            </div>
            {/* on va afficher le popup pour la gestion des palge de rendevous */}
            <PopUpSetTime
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                clinicName={doktor?.clinicName}
                onAddSlot={(newSlot) => console.log("Ajout du créneau :", newSlot)}
            />
        </div>
        
    );
}

export default WelcomeDoktor;