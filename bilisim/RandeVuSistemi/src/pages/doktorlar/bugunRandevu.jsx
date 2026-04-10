import React from 'react';
import { useState,useEffect,useContext } from 'react';
import axios from 'axios';
import style from './bugunRandevu.module.css'
import NavbarDoktor from './navbar';
import { UserContext } from '../contextAPI/randevuSayiContext';


function DoctorBugunkuRandevu() {
    const [appointments, setAppointments] = useState([]);
    
    // 1. On récupère le setter du contexte global
    const { setBugunRandevuSayisi,setHastaRandevusayisi } = useContext(UserContext);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            const doktorId = localStorage.getItem('doktorId');
            try {
                const response = await axios.post("http://localhost/BilisimTekno/getDoktorBugunkuRandevu.php", {
                    doktorId: doktorId
                });
                if (response.data.success) {
                    console.log(response.data);
                    setAppointments(response.data.data);
                    setBugunRandevuSayisi(response.data.RandevuSayisi)
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des RDV", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);
    const today = new Intl.DateTimeFormat('tr-TR', { 
        weekday: 'long', day: 'numeric', month: 'long' 
    }).format(new Date());


    const getStatusStyle = (status) => {
        switch(status) {
            case 'Onaylandı': return style.statusConfirmed;
            case 'Beklemede': return style.statusPending;
            case 'iptal Edildi': return style.statusCancelled;
            default: return style.statusDefault;
        }
    };
    //doktor tarafindan randevu oynalamak
    const handleOnayla = async (id) => {
        try {
            const response = await axios.post("http://localhost/BilisimTekno/updateRandevuStatus.php", { id });

            if (response.data.success) {
                // Mise à jour de la liste locale
                setAppointments(prev => 
                    prev.map(apt => 
                        apt.id === id ? { ...apt, status: "Onaylandı" } : apt
                    )
                );
                setBugunRandevuSayisi(prev => prev - 1);
                setHastaRandevusayisi(prev => prev - 1);
            }
        } catch (error) {
            console.error("Hata:", error);
        }
    };
  return (
    <div className={style.container}>
            <NavbarDoktor/>
            <div className={style.content}>
                <header className={style.header}>
                    <h1><i className="fa-solid fa-calendar-check"></i> Bugünkü Randevularım</h1>
                    <p>Bugünkü randevularınızı yönetin ve tıbbi geçmişinizi takip edin.</p>
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

                                {/* Section Centre : patient et Clinique */}
                                <div className={style.infoSection}>
                                    <div className={style.hastaInfo}>
                                        <h3><span className={style.sayin}>Sayin</span> {apt.patientName} {apt.patientSurname}</h3>
                                    </div>
                                    <div className={style.clinicInfo}>
                                        <p><i className="fa-solid fa-hospital-user"></i> {apt.clinicName}</p>
                                        <p><i className="fa-solid fa-location-dot"></i>  {apt.clinicCity}</p>
                                    </div>
                                </div>

                                {/* Section Droite : Actions */}
                                <div className={style.actionSection}>
                                    <button className={style.extendBtn} onClick={() => handleOnayla(apt.id)}
                                        disabled={apt.status !== "Beklemede"}>
                                        <i className="fa-solid fa-clock"></i> Oynala
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
                        <p>Bugün için planlanmış herhangi bir randevunuz bulunmamaktadır.</p>
                    </div>
                )}
            </div>
        </div>
  );
}

export default DoctorBugunkuRandevu;