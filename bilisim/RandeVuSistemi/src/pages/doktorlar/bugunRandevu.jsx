import React from 'react';
import { useState,useEffect,useContext } from 'react';
import axios from 'axios';
import style from './bugunRandevu.module.css'
import NavbarDoktor from './navbar';
import { UserContext } from '../contextAPI/randevuSayiContext';
import DetailsPopup from '../details';
import ResultPopup from '../result';
import SonucPopup from './sonuc';


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
            case 'Onaylamamıs': return style.statusOnaylamamis;
            default: return style.statusDefault;
        }
    };

    //ouverture de popup et affectation des donnes 
    const [isopen, setIsOpen] = useState(false);             // État pour ouvrir/fermer le modal
    const [pateintName, setPateintName] = useState(null);
    const [SelectedId, setSelectedId] = useState(null);
    const handleOpenPopup = (patient) => {
        setIsOpen(true); //On affiche le popup
        setPateintName(patient.pateintName); 
        setSelectedId(patient.id); 
    };



    // La fonction handleOnayla reçoit automatiquement l'objet formData envoyé par le popup
    const handleOnayla = async (dataFromPopup) => {
        // 1. Extraction des données saisies dans le popup
        const { rapor, Diagnostic, Recipe } = dataFromPopup;
        console.log("Rapport :", rapor);
        console.log("Diagnostic :", Diagnostic);
        console.log("Reçete :", Recipe);

        try {
            // 2. Envoi direct vers votre API PHP
            const response = await axios.post("http://localhost/BilisimTekno/updateRandevuStatus.php", {
                id: SelectedId, // Assurez-vous d'avoir l'ID du rendez-vous actif dans un state du parent
                rapor: rapor,
                Diagnostic: Diagnostic,
                Recipe: Recipe
            });

            if (response.data.success) {
                // Mettre à jour l'affichage de vos rendez-vous localement
                setAppointments(prev => 
                    prev.map(apt => 
                        apt.id === SelectedId ? { ...apt, status: "Onaylandı" } : apt
                    )
                );
                setBugunRandevuSayisi(prev => prev - 1);
                setHastaRandevusayisi(prev => prev - 1);
            }
        } catch (error) {
            console.error("Enregistrement de la consultation échoué", error);
        }
    };
        
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const handleDetails=(hasta) => {
        setSelectedPatient(hasta); // On enregistre les données du patient cliqué
        setIsModalOpen(true);
    };
    const [popOpen, setpopOpen] = useState(false);
    const handleResult=(hasta) => {
        setSelectedPatient(hasta); // On enregistre les données du patient cliqué
        setpopOpen(true);
    };


    const [showAll, setShowAll] = useState(false);
    // On définit les rendez-vous à afficher selon l'état showAll
    const displayedAppointments = showAll ? appointments : appointments.slice(0, 4);
  return (
    <div className={style.container}>
            <NavbarDoktor/>
            <div className={style.content}>
                <header className={style.header}>
                    <div className={style.headerInfo}>
                        <h1><i className="fa-solid fa-calendar-check"></i> Bugünkü Randevularım</h1>
                        <p>Bugünkü randevularınızı yönetin ve tıbbi geçmişinizi takip edin.</p>
                    </div>
                    {appointments.length >4 && (
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
                                    <button className={style.extendBtn} onClick={() => handleOpenPopup(apt)}
                                        disabled={apt.status !== "Beklemede"}>
                                        <i className="fa-solid fa-clock"></i> Oynala
                                    </button>
                                    <button className={style.deleteBtn} onClick={() => handleDelete(apt.id)}
                                        disabled={apt.status !== "Beklemede"}>
                                        <i className="fa-solid fa-trash-can"></i> Iptal Et
                                    </button>
                                    <button className={style.detailsBtn} onClick={() => handleDetails(apt)}>
                                        <i className="fas fa-eye"></i> Detaylar 
                                    </button>
                                    <button className={style.resultBtn} onClick={() => handleResult(apt)}>
                                        <i className="fa-solid fa-file-medical"></i>Teşhis
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

            {isModalOpen && (<DetailsPopup 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                Detaylar={selectedPatient} 
            />
            )}
            <SonucPopup
                isOpen={isopen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleOnayla} // La fonction de sauvegarde
                patientName={pateintName} // Optionnel
            />
            {popOpen && (<ResultPopup 
                isOpen={popOpen} 
                onClose={() => setpopOpen(false)} 
                Result={selectedPatient} 
            />
            )}
        </div>
  );
}

export default DoctorBugunkuRandevu;