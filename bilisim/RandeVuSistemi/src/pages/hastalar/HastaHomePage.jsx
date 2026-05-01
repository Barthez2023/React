import NavbarHasta from './navbar';
import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import style from './HastaHomePage.module.css'
import { UserContext } from '../contextAPI/randevuSayiContext';

const WelcomeHasta = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    const [hasta, setHasta] = useState(null);
    const [appointment, setAppointment] = useState(null);
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
                    setAppointment(resHasta.data.patientrandevu);
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
        return new Intl.DateTimeFormat('tr-TR', {
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

                    {appointment ? (
                        /* --- ÉTAT : RENDEZ-VOUS TROUVÉ --- */
                        <div className={style.activeAppointment}>
                            <div className={style.docInfoSection}>
                                <div className={style.docAvatarMini}>
                                <i className="fa-solid fa-user-md"></i>
                                </div>
                                <div className={style.docText}>
                                <h4>Dr. {appointment.docName} {appointment.docSurname}</h4>
                                <p>{appointment.klinikName}</p>
                                </div>
                            </div>

                            <div className={style.appointmentDetails}>
                                <div className={style.detailRow}>
                                <i className="fa-solid fa-calendar-day"></i>
                                <span>{new Date(appointment.randevu_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className={style.detailRow}>
                                <i className="fa-solid fa-clock"></i>
                                <span>{appointment.baslangic_saat.substring(0, 5)} - {appointment.bitis_saat.substring(0, 5)}</span>
                                </div>
                            </div>
                            <div className={style.approachingBadge}>
                                <span className={style.dotPulse}></span>
                                <span className={style.movingText}>Randevunuz Yaklaşıyor...</span>
                            </div>
                        </div>
                    ) : (
                        /* --- ÉTAT : VIDE (EXISTANT) --- */
                        <div className={style.emptyState}>
                        <i className="fa-solid fa-calendar-day" style={{fontSize: '3rem', color: '#cbd5e1', marginBottom: '15px'}}></i>
                        <p>Şu anda planlanmış nherhangi bir randevu bulunmamaktadır.</p>
                        <button className={style.secondaryBtn}>
                            <i className="fa-solid fa-clock-rotate-left"></i> Geçmişi görüntüle
                        </button>
                        </div>
                    )}
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