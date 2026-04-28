import axios from 'axios';
import style from './homePage.module.css'
import NavbarAmin from './navBarAdmin';
import React, { useState, useEffect,useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
const AdminHomePage = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading]     = useState(true);
    //Définition de l'état (format YYYY-MM-DD pour l'input date)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const isToday = useMemo(
        () => selectedDate === new Date().toISOString().split('T')[0],
        [selectedDate]
    );
    const[randevu,setRandevu]=useState({ beklemede: [], Iptal: [], onaylandi: [] ,current:[]});
    const [showAll, setShowAll] = useState(false);
    const [showAll1, setShowAll1] = useState(false);
    const [showAll2, setShowAll2] = useState(false);

    // 1. Récupérer l'année en cours (ex: 2026)
    const currentYear = new Date().getFullYear();
    // 2. Créer la chaîne pour le 1er janvier (Format YYYY-MM-DD)
    const firstDayOfYear = `${currentYear}-01-01`;
    // 3. Récupérer la date du jour proprement (Format YYYY-MM-DD)
    // On utilise toLocaleDateString avec 'en-CA' car c'est le format YYYY-MM-DD standard
    const today = new Date().toLocaleDateString('en-CA');

    //declaration des variable
    const [startDate, setStartDate] = useState(firstDayOfYear); 
    const [endDate, setEndDate] = useState(today);
    const [viewMode, setViewMode] = useState('day'); // 'day' ou 'range'
    // On définit les rendez-vous à afficher selon l'état showAll
    useEffect(()=>{
      const fecthDatat=async()=>{
        // Empêcher l'appel si on est en mode 'range' mais que les dates sont vides
        if (viewMode === 'range' && (!startDate || !endDate)) return;
        setLoading(true); // On met le loader au début du changement de date
        try {
          const res = await axios.get(`http://localhost/BilisimTekno/globalStats.php`, {
            params: {
                date: selectedDate,    // Pour les stats du jour
                startDate: startDate,  // Pour le nouveau graphique
                endDate: endDate       // Pour le nouveau graphique
            }
        });
          const res1 = await axios.get(`http://localhost/BilisimTekno/GetInfoRandevu.php?date=${selectedDate}`)
          setStats(res.data.data)
          console.log("Statistiques : ",res.data)  //pour le debugging
          setRandevu(res1.data.data)
          console.log("Randevu Infolar",res1.data)
        } catch (error) {
          console.error('Stats yükleme hatası:', error);
        }
        finally{
          setLoading(false);
        }
      }
      fecthDatat()
    },[selectedDate,startDate,endDate,viewMode])


    const chartData = useMemo(() => {
        if (viewMode === 'day') {
           return stats?.graphiquegun || [];
        } else {
            return stats?.graphiquePeriode || [];
        }
    }, [stats, viewMode]);
    // La clé de l'axe X change aussi : 'gun' pour le mois, 'label' pour la période
    const xAxisKey = viewMode === 'day' ? 'gun' : 'label';
    const displayedAppointments = showAll? randevu?.beklemede ?? []: randevu?.beklemede?.slice(0, 1) ?? [];
    const displayedAppointments1 = showAll1? randevu?.onaylandi ?? []: randevu?.onaylandi?.slice(0, 1) ?? [];
    const displayedAppointments2 = showAll2? randevu?.current ?? []: randevu?.current?.slice(0, 1) ?? [];
    const dateObj = new Date(selectedDate);
    // Pour obtenir le nom du mois
    const monthName = new Intl.DateTimeFormat('tr-TR', { month: 'long' }).format(dateObj);
    return (
        <div className={style.statsContainer}>
            <NavbarAmin/>
            {/* 1. BARRE DE CONTRÔLE GÉNÉRALE */}
            <header className={style.header}>
                <div className={style.titleBox}>
                    <h1>Analitik Gösterge Paneli</h1>
                    <p>Hastane sisteminin genel istatistikleri</p>
                </div>

                <div className={style.filterArea}>
                    {/* Switcher de Mode */}
                    <div className={style.modeToggle}>
                        <button 
                            className={viewMode === 'day' ? style.activeMode : ''} 
                            onClick={() => setViewMode('day')}
                        >
                            Günlük
                        </button>
                        <button 
                            className={viewMode === 'range' ? style.activeMode : ''} 
                            onClick={() => setViewMode('range')}
                        >
                            Aralık
                        </button>
                    </div>

                    {/* Affichage conditionnel des inputs */}
                    <div className={style.inputsWrapper}>
                        {viewMode === 'day' ? (
                            <div className={style.filterBox}>
                                <label>Gün Seçin:</label>
                                <input 
                                    type="date" 
                                    value={selectedDate} 
                                    onChange={(e) => setSelectedDate(e.target.value)} 
                                    className={style.dateInput}
                                />
                            </div>
                        ) : (
                            <div className={style.rangeBox}>
                                <div className={style.filterBox}>
                                    <label>Başlangıç:</label>
                                    <input 
                                        type="date" 
                                        value={startDate} 
                                        onChange={(e) => setStartDate(e.target.value)} 
                                        className={style.dateInput}
                                    />
                                </div>
                                <div className={style.filterBox}>
                                    <label>Bitiş:</label>
                                    <input 
                                        type="date" 
                                        value={endDate} 
                                        onChange={(e) => setEndDate(e.target.value)} 
                                        className={style.dateInput}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* 2. SECTION FLUX PATIENT*/}
            <section className={style.patientFlow}>
                {/* CARDE 1: PRÉCÉDENT / TOTAL */}
                <div className={style.waitingListContainer}>
                    {/* On vérifie s'il y a des rendez-vous en attente */}
                    {!isToday ?(
                        <div className={`${style.flowCard} ${style.previous}`}>
                            {/* En-tête fixe du bloc */}
                            <span>Genel Bakış</span>
                            <div className={style.patientsList}>
                                <div className={style.patientInfo}>
                                    <h3>Toplam Randevu</h3>
                                    <small>
                                        {stats?.total || 0} Randevu
                                    </small>
                                </div>
                            </div>
                        </div>
                    ):(randevu?.onaylandi && randevu?.onaylandi.length> 0 ? 
                        (
                            <div className={`${style.flowCard} ${style.previous}`}>
                                {/* En-tête fixe du bloc */}
                                <span>Önceki Hasta</span>
                                <div className={style.patientsList}>
                                    {displayedAppointments1.map((item) => (
                                        <div key={item.id} className={style.patientItem}>
                                            <div className={style.patientInfo}>
                                                <h3>{`${item.Hastaname} ${item.Hastasurname}`}</h3>
                                                <small>
                                                    {`Saat ${item.bitis_saat}-${item.status} olarak Tamamlandı.`}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Optionnel : un badge avec le total en bas du bloc */}
                                <div className={style.totalBadge}>
                                    {randevu?.onaylandi.length > 1 && isToday && (
                                    <button 
                                        className={style.viewAllBtn}
                                        onClick={() => setShowAll1(!showAll1)}
                                    >
                                        <i className={`fa-solid ${showAll1 ? 'fa-compress' : 'fa-list'}`}></i> 
                                        {showAll1 ? 'Daha Az Görüntüle' : `Tüm Listeyi Görüntüle (${randevu?.onaylandi.length})`}
                                    </button>
                                )}
                                </div>
                                
                            </div>
                        ) : (
                            <div className={style.emptyState}>
                                <p>Bugün için Onaylaniyor randevu bulunmuyor.</p>
                            </div>
                        )
                    )}
                </div> 
                {/* CARDE 2: EN COURS / EFFECTUÉS */}
                <div className={style.waitingListContainer}>
                    {/* On vérifie s'il y a des rendez-vous en attente */}
                    {!isToday ?(
                        <div className={`${style.flowCard} ${style.previous}`}>
                            {/* En-tête fixe du bloc */}
                            <span>Performans</span>
                            <div className={style.patientsList}>
                                <div className={style.patientInfo}>
                                    <h3>Onaylanmıs Randevu</h3>
                                    <small>
                                        {stats?.onayla || 0} Randevu
                                    </small>
                                </div>
                            </div>
                        </div>
                    ):(randevu.current && randevu.current.length > 0 ? 
                        (
                            <div className={`${style.flowCard} ${style.current}`}>
                                {isToday && <div className={style.livePulse}></div>}
                                {/* En-tête fixe du bloc */}
                                <span>Randevu Devam Ediiyor</span>
                                <div className={style.patientsList}>
                                    {displayedAppointments2.map((item) => (
                                        <div key={item.id} className={style.patientItem}>
                                            <div className={style.patientInfo}>
                                                <h3>{`${item.Hastaname} ${item.Hastasurname}`}</h3>
                                                <small>
                                                    {`Saat ${item.baslangic_saat}'te başladı.`}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Optionnel : un badge avec le total en bas du bloc */}
                                <div className={style.totalBadge}>
                                    {randevu?.current.length > 1 && isToday && (
                                    <button 
                                        className={style.viewAllBtn}
                                        onClick={() => setShowAll2(!showAll2)}
                                    >
                                        <i className={`fa-solid ${showAll2 ? 'fa-compress' : 'fa-list'}`}></i> 
                                        {showAll2 ? 'Daha Az Görüntüle' : `Tüm Listeyi Görüntüle (${randevu?.current.length})`}
                                    </button>
                                )}
                                </div>
                                
                            </div>
                        ) : (
                            <div className={style.emptyState}>
                                <p>Bugün için Onaylaniyor randevu bulunmuyor.</p>
                            </div>
                        )
                    )}
                </div> 
                {/* CARDE 3: SUIVANT / noneffectuer */}
                <div className={style.waitingListContainer}>
                    {/* On vérifie s'il y a des rendez-vous en attente */}
                    {!isToday ?(
                        <div className={`${style.flowCard} ${style.previous}`}>
                            {/* En-tête fixe du bloc */}
                            <span>Gerçekleştirme</span>
                            <div className={style.patientsList}>
                                <div className={style.patientInfo}>
                                    <h3>Onaylamamıs Randevu</h3>
                                    <small>
                                        {stats?.onayma || 0} Randevu
                                    </small>
                                </div>
                            </div>
                        </div>
                    ):(randevu.beklemede && randevu.beklemede.length > 0 ? (
                        <div className={`${style.flowCard} ${style.next}`}>
                            {/* En-tête fixe du bloc */}
                            <span>Bekleyen Hastalar</span>
                            
                            <div className={style.patientsList}>
                                {displayedAppointments.map((item) => (
                                    <div key={item.id} className={style.patientItem}>
                                        <div className={style.patientInfo}>
                                            <h3>{`${item.Hastaname} ${item.Hastasurname}`}</h3>
                                            <small>
                                                {`Saat ${item.baslangic_saat}'te planlandı.`}
                                            </small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Optionnel : un badge avec le total en bas du bloc */}
                            <div className={style.totalBadge}>
                                {randevu?.beklemede.length > 1 && isToday &&(
                                <button 
                                    className={style.viewAllBtn}
                                    onClick={() => setShowAll(!showAll)}
                                >
                                    <i className={`fa-solid ${showAll ? 'fa-compress' : 'fa-list'}`}></i> 
                                    {showAll ? 'Daha Az Görüntüle' : `Tüm Listeyi Görüntüle (${randevu.beklemede.length})`}
                                </button>
                            )}
                            </div>
                            
                        </div>
                    ) : (
                        <div className={style.emptyState}>
                            <p>Bugün için bekleyen randevu bulunmuyor.</p>
                        </div>
                    )
                    )}
                </div> 
                {/* CARDE 4: ATTENTE / RATIO */}
                <div className={style.waitingListContainer}>
                    <div className={`${style.flowCard} ${style.waiting}`}>
                        {isToday ? (
                        /* --- MODE TEMPS RÉEL : SALLE D'ATTENTE --- */
                        <>
                            <span>Bekleme odasında</span>
                            <div className={style.waitingCount}>
                                {stats?.bekleme || 0}
                            </div>
                            <small>Bekleyen hastalar</small>
                        </>
                        ) : (
                        /* --- MODE HISTORIQUE : ANNULATIONS --- */
                        <>
                            <span>İptaller</span>
                            <h3>İptal Edilen</h3>
                            <small>
                            {stats?.iptal || 0} Randevu
                            </small>
                        </>
                        )}
                    </div>
                </div>
            </section>

            {/* 3. GRILLE DE KPI (Indicateurs Clés) pour les patients */}
            <section className={style.kpiGrid}>
                <div className={style.statCard}>
                    <i className="fa-solid fa-users"></i>
                    <div><h4>Sistemdeki  Hasta Sayısı</h4><h2>{stats?.totalhasta}</h2></div>
                    <span className={style.growth}>
                          +{stats.totalhasta > 0 
                          ? Math.round((stats.YeniHasta / stats.totalhasta) * 100) 
                          : 0}%
                    </span>
                </div>
                <div className={style.statCard}>
                    <i className="fa-solid fa-user-plus"></i>
                    <div><h4>Bu ay kayıt olan yeni Hastalar</h4><h2>{stats.YeniHasta}</h2></div>
                </div>
                <div className={style.statCard}>
                    <i className="fa-solid fa-calendar-check"></i>
                    <div><h4>Bu Aydaki Randevu</h4><h2>{stats.buAyRandevu}</h2></div>
                </div>
                <div className={style.statCard}>
                    <i className="fa-solid fa-stethoscope"></i>
                    <div><h4>Bu Ay Onaylandı Randevu </h4><h2>{stats.BuAyOnaylandıRDV}</h2></div>
                </div>
            </section>

            {/* 3. GRILLE DE KPI (Indicateurs Clés) pour les docteurs */}
            <section className={style.kpiGrid}>
                <div className={style.statCard}>
                    <i className="fa-solid fa-hospital-user"></i>
                    <div><h4>Sistemdeki  Doktor Sayısı</h4><h2>{stats?.doktortotal}</h2></div>
                    <span className={style.growth}>
                          +{stats.doktortotal > 0 
                          ? Math.round((stats.YeniDoktor / stats.doktortotal) * 100) 
                          : 0}%
                    </span>
                </div>
                <div className={style.statCard}>
                    <i className="fa-solid fa-user-doctor"></i>
                    <div><h4>Bu ay kayıt olan yeni Doktorlar</h4><h2>{stats.YeniDoktor}</h2></div>
                </div>
                <div className={style.statCard}>
                    <i className="fa-solid fa-calendar-check"></i>
                    <div><h4>Bu Aydaki Randevu</h4><h2>{stats.buAyRandevu}</h2></div>
                </div>
                <div className={style.statCard}>
                    <i className="fa-solid fa-stethoscope"></i>
                    <div><h4>Bu Ay Onaylandı Randevu </h4><h2>{stats.BuAyOnaylandıRDV}</h2></div>
                </div>
            </section>

            {/* 3. GRILLE DE KPI (Indicateurs Clés) pour les cliniques du systemes et les specialites */}
            <section className={style.kpiGrid}>
                <div className={style.statCard}>
                    <i className="fa-solid fa-house-medical"></i>
                    <div><h4>Sistemdeki  Klinik Sayısı</h4><h2>{stats?.cliniktotal}</h2></div>
                    <span className={style.growth}>
                          +{stats.cliniktotal > 0 
                          ? Math.round((stats.Yeniclinik / stats.cliniktotal) * 100) 
                          : 0}%
                    </span>
                </div>
                <div className={style.statCard}>
                    <i className="fa-solid fa-house-medical-circle-check"></i>
                    <div><h4>Bu ay kayıt olan yeni Klinik</h4><h2>{stats.Yeniclinik}</h2></div>
                </div>
                  <div className={style.statCard}>
                    <i className="fa-solid fa-kit-medical"></i>
                    <div><h4>Sistemdeki  Uzmanlik Sayısı</h4><h2>{stats?.uzmanliktotal}</h2></div>
                    <span className={style.growth}>
                          +{stats.uzmanliktotal > 0 
                          ? Math.round((stats.Yeniuzmanlik / stats.uzmanliktotal) * 100) 
                          : 0}%
                    </span>
                </div>
                <div className={style.statCard}>
                    <i className="fa-solid fa-user-doctor"></i>
                    <div><h4>Bu ay kayıt olan yeni Uzmanlik</h4><h2>{stats.Yeniuzmanlik}</h2></div>
                </div>
            </section>

            {/* 4. VISUALISATION GRAPHIQUE INTERACTIVE */}
            <section className={style.chartsSection}>
                <div className={style.chartBox}>
                    <h3>
                        {viewMode === 'day' 
                            ? `${monthName} Ay içindeki randevularda değişiklikler`
                            : `${startDate} / ${endDate} arasındaki değişimler`}
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey={xAxisKey}/>
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="totalIptal" stroke="#f90404" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="totalOyna" stroke="#07934d" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className={style.consultationList}>
                    <h3>Devam Eden RandeVu</h3>
                    <div className={style.listWrapper}>
                        {isToday ?(
                            randevu.current && randevu.current.length > 0 ?(
                                displayedAppointments2.map((item) => (
                                    <div key={item.id} className={style.consultItem}>
                                        {/* Avatar dynamique basé sur le nom */}
                                        <img 
                                            src={`https://ui-avatars.com/api/?name=${item.DoktorName}+${item.DoktorSurname}&background=random`} 
                                            alt="doctor" 
                                        />
                                        <div>
                                            <strong>Dr. {item.DoktorName} {item.DoktorSurname}</strong>
                                            <p>{item.clinik_name} <strong>{item.speciality_name}</strong></p>
                                        </div>
                                        <span className={style.timeTag}>{item.baslangic_saat}</span>
                                    </div>
                                ))
                            ):
                            (
                               <div className={style.emptyConsult}>
                                    <p>{isToday ? "Şu an devam eden randevu yok." : "Geçmiş performans verileri yukarıdadır."}</p>
                                </div>
                            )
                            
                        ):(
                            <p>Merci pour tout</p>
                        )}
                        <div className={style.totalBadge}>
                            {randevu?.current.length > 4 && isToday && (
                            <button 
                                className={style.viewAllBtn}
                                onClick={() => setShowAll2(!showAll2)}
                            >
                                <i className={`fa-solid ${showAll2 ? 'fa-compress' : 'fa-list'}`}></i> 
                                {showAll2 ? 'Daha Az Görüntüle' : `Tüm Listeyi Görüntüle (${randevu?.current.length})`}
                            </button>
                        )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminHomePage;