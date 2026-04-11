import React from 'react';
import { useState,useEffect,useContext } from 'react';
import axios from 'axios';
import style from './randevularim.module.css'
import NavbarHasta from './navbar';
import { UserContext } from '../contextAPI/randevuSayiContext';
import RandevuTimePopup from '../klinik/randevuTime';

function RandevularimHasta({isOpen, onClose}) {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    // 1. On récupère le setter du contexte global
    const { setHastaRandevusayisi } = useContext(UserContext);

    useEffect(() => {
        const fetchAppointments = async () => {
            const hastaId = localStorage.getItem('hastaId');
            try {
                const response = await axios.post("http://localhost/BilisimTekno/getHastatAppointments.php", {
                    hastaId: hastaId
                });
                if (response.data.success) {
                    console.log(response.data);
                    setAppointments(response.data.data);
                    setHastaRandevusayisi(response.data.randevuSayisi);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des RDV", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);
    const getStatusStyle = (status) => {
        switch(status) {
            case 'Onaylandı': return style.statusConfirmed;
            case 'Beklemede': return style.statusPending;
            case 'iptal Edildi': return style.statusCancelled;
            case 'Onaylamamıs': return style.statusOnaylamamis;
            default: return style.statusDefault;
        }
    };
    //on va gere l'ouverture et la fermeture du pop qui contient les heure du docteur
    const [slots, setSlots] = useState([]);
    const [isTimePopupOpen, setIsTimePopupOpen] = useState(false);
    const [selectedDocForUpdate, setSelectedDocForUpdate] = useState(null);

    const handleExtend = async (doctor) => {
        // 1. Obtenir le jour actuel (ex: "Çarşamba")
        const currentDay = new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(new Date());
        try {
            // Sauvegarder le docteur sélectionné pour le popup
            setSelectedDocForUpdate(doctor);
            // 2. Récupérer les créneaux de ce docteur pour CE jour précis
            const response = await axios.post("http://localhost/BilisimTekno/GetTime_fromDoktor.php", {
                idDoktor: doctor.id,
                caslisma_gun: currentDay
            });

            if (response.data.success) {
                setSlots(response.data.data);
                setIsTimePopupOpen(true);  // On ouvre le deuxième popup celui des temps
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des créneaux", error);
        }
    };
    const handleDelete = (id) => {
        if(window.confirm("Bu randevuyu iptal etmek istediğinizden emin misiniz?")) {
            // Logique de suppression ici
            console.log("Supprimer RDV:", id);
        }
    };
  return (
    <div className={style.container}>
            <NavbarHasta />
            <div className={style.content}>
                <header className={style.header}>
                    <h1><i className="fa-solid fa-calendar-check"></i> Randevularım</h1>
                    <p>Randevularınızı yönetin ve tıbbi geçmişinizi takip edin.</p>
                </header>

                {loading ? (
                    <div className={style.loader}>Randevularınız yükleniyor...</div>
                ) : appointments.length > 0 ? (
                    <div className={style.appointmentList}>
                        {appointments.map((apt) => (
                            <div key={apt.id} className={style.appointmentCard}>
                                {/* Section Gauche : Date et Heure */}
                                <div className={style.timeSection}>
                                    {/* Ajout d'une icône calendrier discrète */}
                                    <div className={style.dateContainer}>
                                        <i className="fa-regular fa-calendar-check"></i>
                                        <span className={style.date}>{apt.randevu_date}</span>
                                    </div>

                                    <span className={style.hours}>
                                        <i className="fa-regular fa-clock" style={{marginRight: '6px'}}></i>
                                        {apt.baslangic_saat} - {apt.bitis_saat}
                                    </span>

                                    <div className={`${style.statusBadge} ${getStatusStyle(apt.status)}`}>
                                        {apt.status}
                                    </div>
                                </div>

                                {/* Section Centre : Docteur et Clinique */}
                                <div className={style.infoSection}>
                                    <div className={style.doctorInfo}>
                                        <h3>Dr. {apt.doc.name} {apt.doc.surname}</h3>
                                        <span className={style.specialty}>{apt.doc.speciality}</span>
                                    </div>
                                    <div className={style.clinicInfo}>
                                        <p><i className="fa-solid fa-hospital-user"></i> {apt.doc.clinic}</p>
                                        <p><i className="fa-solid fa-location-dot"></i>  {apt.doc.city}</p>
                                    </div>
                                </div>

                                {/* Section Droite : Actions */}
                                <div className={style.actionSection}>
                                    <button className={style.extendBtn} onClick={() => handleExtend(apt.doc)}
                                        disabled={apt.status !== "Beklemede"}>
                                        <i className="fa-solid fa-clock"></i> Uzatmak
                                    </button>
                                    <button className={style.deleteBtn} onClick={() => handleDelete(apt.id)}
                                        disabled={apt.status !== "Beklemede"}>
                                        <i className="fa-solid fa-trash-can"></i> Iptal Et
                                    </button>
                                </div>
                            </div>
                            
                        ))}
                    </div>
                ) : (
                    <div className={style.emptyState}>
                        <i className="fa-solid fa-calendar-xmark"></i>
                        <p>Henüz planlanmış bir randevunuz bulunmamaktadır.</p>
                    </div>
                )}
            </div>
            <RandevuTimePopup
                isOpen={isTimePopupOpen} 
                onClose={() => setIsTimePopupOpen(false)} 
                slots={slots} 
                selectedDoctor={selectedDocForUpdate} 
            />
        </div>
  );
}

export default RandevularimHasta;