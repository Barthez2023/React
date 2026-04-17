import axios from 'axios';
import style from './homePage.module.css'
import NavbarAmin from './navBarAdmin';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
const AdminHomePage = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading]     = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState('all');
    //Définition de l'état (format YYYY-MM-DD pour l'input date)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    // Données fictives pour la visualisation (à remplacer par tes appels API)
    const appointmentData = [
        { name: 'Jan', value: 400 }, { name: 'Fév', value: 300 },
        { name: 'Mar', value: 600 }, { name: 'Avr', value: 800 },
    ];
    const[rdv,setRdv]=useState([]);
    const[rdvIptal,setRdvIptal]=useState([]);

    useEffect(()=>{
      const fecthDatat=async()=>{
        setLoading(true); // On met le loader au début du changement de date
        try {
          const res=await axios.get(`http://localhost/BilisimTekno/globalStats.php?date=${selectedDate}`)
          setStats(res.data.data)
          console.log(res.data)  //pour le debugging
          setRdv(res.data.data.graphiquegun || [])
          // setRdvIptal(res.data.data.graphiquegunIptal || [])
        } catch (error) {
          console.error('Stats yükleme hatası:', error);
        }
        finally{
          setLoading(false);
        }
      }
      fecthDatat()
    },[selectedDate])
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
                <div className={`${style.flowCard} ${style.previous}`}>
                    <span>{!isToday ? "Genel Bakış" : "Önceki Hasta"}</span>
                    <h3>{!isToday ? "Toplam Randevu" : "Salma Benkirane"}</h3>
                    <small>
                        {!isToday ? `${stats?.total || 0} Randevu` : "14:30 - Tamamlandı"}
                    </small>
                </div>
                {/* CARDE 2: EN COURS / EFFECTUÉS */}
                <div className={`${style.flowCard} ${style.current}`}>
                    {isToday && <div className={style.livePulse}></div>}
                    <span>{!isToday ? "Performans" : "Randevu DevanEdiiyor"}</span>
                    <h3>{!isToday ? "Onaylanmıs Randevu" : "Jean Dupont"}</h3>
                    <small>
                        {!isToday ? `${stats?.onayla || 0} Randevu` : "12 dakika önce başladı"}
                    </small>
                </div>

                {/* CARDE 3: SUIVANT / noneffectuer */}
                <div className={`${style.flowCard} ${style.next}`}>
                    <span>{!isToday ? "Gerçekleştirme" : "Sonraki Hasta"}</span>
                    <h3>{!isToday ? "Onaylamamıs" : "Amine Alami"}</h3>
                    <small>
                        {!isToday ? `${stats?.onayma || 0} Randevu` : "Saat 15:45'te planlandı."}
                    </small>
                </div>
                {/* CARDE 4: ATTENTE / RATIO */}
                <div className={`${style.flowCard} ${isToday ? style.waiting : style.next}`}>
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