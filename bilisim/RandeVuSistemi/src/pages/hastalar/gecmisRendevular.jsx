import React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import style from './gecmisRendevular.module.css'
import NavbarHasta from './navbar';

function HastaGecmisRandevularim() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            const hastaId = localStorage.getItem('hastaId');
            try {
                const response = await axios.post("http://localhost/BilisimTekno/getHastaGecmisRandevu.php", {
                    hastaId: hastaId
                });
                if (response.data.success) {
                    console.log(response.data);
                    setAppointments(response.data.data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des RDV", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);
    const handleDelete = (id) => {
        if(window.confirm("Bu randevuyu iptal etmek istediğinizden emin misiniz?")) {
            // Logique de suppression ici
            console.log("Supprimer RDV:", id);
        }
    };

    const handleExtend = (id) => {
        // Logique pour prolonger/modifier
        console.log("Prolonger RDV:", id);
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Onaylandı': return style.statusConfirmed;
            case 'Beklemede': return style.statusPending;
            case 'iptal Edildi': return style.statusCancelled;
            case 'Onaylamamıs': return style.statusOnaylamamis;
            default: return style.statusDefault;
        }
    };
    const [showAll, setShowAll] = useState(false);
    // On définit les rendez-vous à afficher selon l'état showAll
    const displayedAppointments = showAll ? appointments : appointments.slice(0, 4);
  return (
    <div className={style.container}>
            <NavbarHasta />
            <div className={style.content}>
            <header className={style.header}>
                <div className={style.headerInfo}>
                    <h1><i className="fa-solid fa-calendar-check"></i> Geçmiş Randevularım</h1>
                    <p>Geçmiş randevularınızı yönetin ve tıbbi geçmişinizi takip edin.</p>
                </div>
                {appointments.length > 4 && (
                    <button 
                        className={style.viewAllBtn}
                        onClick={() => setShowAll(!showAll)}
                    >
                        <i className={`fa-solid ${showAll ? 'fa-compress' : 'fa-list'}`}></i> 
                        {showAll ? 'Daha Az Görüntüle' : `Tüm Listeyi Görüntüle (${appointments.length})`}
                    </button>
                )}
            </header>

                {loading ? (
                    <div className={style.loader}>Randevularınız yükleniyor...</div>
                ) : appointments.length > 0 ? (
                    <div className={style.appointmentList}>
                        {displayedAppointments.map((apt) => (
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
                                        <h3>Dr. {apt.docName} {apt.docSurname}</h3>
                                        <span className={style.specialty}>{apt.speciality}</span>
                                    </div>
                                    <div className={style.clinicInfo}>
                                        <p><i className="fa-solid fa-hospital-user"></i> {apt.clinicName}</p>
                                        <p><i className="fa-solid fa-location-dot"></i>  {apt.clinicCity}</p>
                                    </div>
                                </div>

                                {/* Section Droite : Actions */}
                                <div className={style.actionSection}>
                                    <button className={style.extendBtn} onClick={() => handleExtend(apt.id)} disabled>
                                        <i className="fa-solid fa-clock"></i> Uzatmak
                                    </button>
                                    <button className={style.deleteBtn} onClick={() => handleDelete(apt.id)} disabled>
                                        <i className="fa-solid fa-trash-can"></i> Iptal Et
                                    </button>
                                    <button className={style.gecmisBtn}>
                                        <i className="fa-solid fa-clock-rotate-left"></i> 
                                        <span>Geçmiş</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={style.emptyState}>
                        <i className="fa-solid fa-calendar-xmark"></i>
                        <p>Geçmişinizde henüz herhangi bir randevu kaydı bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
  );
}

export default HastaGecmisRandevularim;