import axios from 'axios';
import style from './homePage.module.css'
import NavbarAmin from './navBarAdmin';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
const AdminHomePage = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading]     = useState(true);
    //Définition de l'état (format YYYY-MM-DD pour l'input date)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    const[rdv,setRdv]=useState([]);
    const[randevu,setRandevu]=useState({ beklemede: [], Iptal: [], onaylandi: [] ,current:[]});
    const [showAll, setShowAll] = useState(false);
    const [showAll1, setShowAll1] = useState(false);
    const [showAll2, setShowAll2] = useState(false);
    // On définit les rendez-vous à afficher selon l'état showAll
    useEffect(()=>{
      const fecthDatat=async()=>{
        setLoading(true); // On met le loader au début du changement de date
        try {
          const res=await axios.get(`http://localhost/BilisimTekno/globalStats.php?date=${selectedDate}`)
          const res1=await axios.get("http://localhost/BilisimTekno/GetInfoRandevu.php")
          setStats(res.data.data)
          console.log(res.data)  //pour le debugging
          setRdv(res.data.data.graphiquegun || [])

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
    },[selectedDate])
    const displayedAppointments = showAll? randevu?.beklemede ?? []: randevu?.beklemede?.slice(0, 1) ?? [];
    const displayedAppointments1 = showAll1? randevu?.onaylandi ?? []: randevu?.onaylandi?.slice(0, 1) ?? [];
    const displayedAppointments2 = showAll2? randevu?.current ?? []: randevu?.current?.slice(0, 1) ?? [];

    return (
        <div className={style.statsContainer}>
            <NavbarAmin/>
            {/* 1. BARRE DE CONTRÔLE GÉNÉRALE */}
            <header className={style.header}>
                <div>
                    <h1>Analitik Gösterge Paneli</h1>
                    <p>Hastane sisteminin genel istatistikleri</p>
                </div>
                <div className={style.filterBox}>
                    <label htmlFor="date">Gün içindeki sistemin genel analizi:</label>
                    <input 
                        type="date" 
                        name="date" 
                        id="date" 
                        className={style.dateInput} // Ajoute une classe pour ton CSS
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)} 
                    />
                </div>
            </header>

            {/* 2. SECTION FLUX PATIENT (Inspirée de l'image) */}
            <section className={style.patientFlow}>
                {/* CARDE 1: PRÉCÉDENT / TOTAL */}
                <div className={style.waitingListContainer}>
                    {/* On vérifie s'il y a des rendez-vous en attente */}
                    {randevu.onaylandi && randevu.onaylandi.length > 0 ? (
                        <div className={`${style.flowCard} ${style.previous}`}>
                            {/* En-tête fixe du bloc */}
                            <span>{!isToday ? "Genel Bakış" : "Önceki Hasta"}</span>
                            <div className={style.patientsList}>
                                {displayedAppointments1.map((item) => (
                                    <div key={item.id} className={style.patientItem}>
                                        <div className={style.patientInfo}>
                                            <h3>{!isToday ? "Toplam Randevu" : `${item.Hastaname} ${item.Hastasurname}`}</h3>
                                            <small>
                                                {!isToday 
                                                    ? `${stats?.onayma || 0} Randevu` 
                                                    : `Saat ${item.bitis_saat}-${item.status} olarak Tamamlandı.`}
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
                    )}
                </div> 
                {/* CARDE 2: EN COURS / EFFECTUÉS */}
                <div className={style.waitingListContainer}>
                    {/* On vérifie s'il y a des rendez-vous en attente */}
                    {randevu.current && randevu.current.length > 0 ? (
                        <div className={`${style.flowCard} ${style.current}`}>
                            {isToday && <div className={style.livePulse}></div>}
                            {/* En-tête fixe du bloc */}
                            <span>{!isToday ? "Performans" : "Randevu Devam Ediiyor"}</span>
                            <div className={style.patientsList}>
                                {displayedAppointments2.map((item) => (
                                    <div key={item.id} className={style.patientItem}>
                                        <div className={style.patientInfo}>
                                            <h3>{!isToday ? "Onaylanmıs Randevu" : `${item.Hastaname} ${item.Hastasurname}`}</h3>
                                            <small>
                                                {!isToday 
                                                    ? `${stats?.onayma || 0} Randevu` 
                                                    : `Saat ${item.baslangic_saat}'te başladı.`}
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
                    )}
                </div>
                {/* CARDE 3: SUIVANT / noneffectuer */}
                <div className={style.waitingListContainer}>
                    {/* On vérifie s'il y a des rendez-vous en attente */}
                    {randevu.beklemede && randevu.beklemede.length > 0 ? (
                        <div className={`${style.flowCard} ${style.next}`}>
                            {/* En-tête fixe du bloc */}
                            <span>{!isToday ? "Gerçekleştirme" : "Bekleyen Hastalar"}</span>
                            
                            <div className={style.patientsList}>
                                {displayedAppointments.map((item) => (
                                    <div key={item.id} className={style.patientItem}>
                                        <div className={style.patientInfo}>
                                            <h3>{!isToday ? "Onaylamamıs" : `${item.Hastaname} ${item.Hastasurname}`}</h3>
                                            <small>
                                                {!isToday 
                                                    ? `${stats?.onayma || 0} Randevu` 
                                                    : `Saat ${item.baslangic_saat}'te planlandı.`}
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
                    <h3>Ay içindeki randevularda değişiklikler</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={rdv}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="gun" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="totalIptal" stroke="#f90404" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="totalOyna" stroke="#07934d" strokeWidth={2} dot={{ r: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className={style.consultationList}>
                    <h3>Dernières Consultations</h3>
                    <div className={style.listWrapper}>
                        {/* Exemple d'item */}
                        <div className={style.consultItem}>
                            <img src="https://ui-avatars.com/api/?name=Dr+Ahmed" alt="doc" />
                            <div>
                                <strong>Dr. Ahmed Rifi</strong>
                                <p>Patient: Rachid Bennani</p>
                            </div>
                            <span className={style.timeTag}>10:15</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminHomePage;