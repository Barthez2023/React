import { useState, useEffect, useRef,useMemo } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import style from './home1.module.css';
import DonutStats from './donutStat';

// ── Composants utilitaires ─────────────────────────────────────────────────

function MetricCard({ value, label, color,icon}) {
  const colors = {
    blue:  style.iconBlue,
    green: style.iconGreen,
    amber: style.iconAmber,
    red:   style.iconRed,
  };

  return (
    <div className={style.metricCard}>
      <div className={`${style.iconWrapper} ${colors[color]}`}><i className={`fa-solid ${icon}`}></i></div>
      <div className={style.metricContent}>
        <p className={style.metricLabel}>{label}</p>
        <p className={style.metricValue}>{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    consulte:   { label: 'Consulté',  cls: style.bsOk     },
    bekliyor:   { label: 'Bekliyor',  cls: style.bsWait   },
    iptal:      { label: 'İptal',     cls: style.bsCancel },
  };
  const s = map[status] ?? map.bekliyor;
  return <span className={`${style.badgeS} ${s.cls}`}>{s.label}</span>;
}
{/* <StatusBadge status="consulte" /> */}

function BarChart({ doctors }) {
  const max = Math.max(...doctors.map((d) => d.nb_rdv), 1);
  return (
    <div className={style.barWrap}>
      {doctors.map((d, i) => (
        <div key={i} className={style.barRow}>
          <span className={style.barLabel}>{d.nom.split(' ')[1] ?? d.nom}</span>
          <div className={style.barTrack}>
            <div
              className={style.barFill}
              style={{ width: `${Math.round((d.nb_rdv / max) * 100)}%` }}
            />
          </div>
          <span className={style.barVal}>{d.nb_rdv}</span>
        </div>
      ))}
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────────────────

const DoktorStats = ({idDoc}) => {
  const {iddocURL} = useParams(); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // On initialise avec la date du jour si besoin
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [elapsed, setElapsed] = useState(0);


  const id = idDoc || iddocURL;
  // Utiliser useCallback pour que la fonction soit stable
  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `http://localhost/BilisimTekno/admin_stats.php`, {
          params: {
            selectedDoc: id, // On utilise directement l'id du useParams
            selectedDate: selectedDate
          }
        }
      );
      setData(res.data.data); // Attention : souvent res.data.data avec ton PHP
      console.log(res.data)
      setElapsed(0);
    } catch (err) {
      console.error('Stats yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Premier appel
    if (id) {
        fetchStats();
    }

    // Mise en place du polling (rafraîchissement auto)
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);

    // Nettoyage : très important pour éviter les fuites de mémoire
    return () => clearInterval(interval);
    
  }, [id, selectedDate]); // Le useEffect réagit à l'ID ou à la Date





  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
//   const { consultation, patients, rdv, attente, doctors_rdv, alertes, statuts } = data;
  // Remplace ta ligne de destructuring par celle-ci :
const { 
  attente = { nombre: 0, liste: [] }, 
  alertes = [], 
} = data || {};


  //declaration des variable
    // 1. Récupérer l'année en cours (ex: 2026)
    const currentYear = new Date().getFullYear();
    // 2. Créer la chaîne pour le 1er janvier (Format YYYY-MM-DD)
    const firstDayOfYear = `${currentYear}-01-01`;
    const [startDate, setStartDate] = useState(firstDayOfYear); 
    const [endDate, setEndDate] = useState(today);
    const [viewMode, setViewMode] = useState('day'); // 'day' ou 'range'
    //Définition de l'état (format YYYY-MM-DD pour l'input date)
    const isToday = useMemo(
        () => selectedDate === new Date().toISOString().split('T')[0],
        [selectedDate]
    );
    const [showAll, setShowAll] = useState(false);
    const [showAll1, setShowAll1] = useState(false);
    const [showAll2, setShowAll2] = useState(false);

    // On ajoute le ? juste après 'data' pour éviter le crash si data est null
    const displayedAppointments = showAll ? data?.randevu?.beklemede ?? [] : data?.randevu?.beklemede?.slice(0, 1) ?? [];
    const displayedAppointments1 = showAll1 ? data?.randevu?.onaylandi ?? [] : data?.randevu?.onaylandi?.slice(0, 1) ?? [];
    const displayedAppointments2 = showAll2 ? data?.randevu?.current ?? [] : data?.randevu?.current?.slice(0, 1) ?? [];
    

    //conpletion ration pour le  jour  en cour
    // Calcul du pourcentage réel
    const totalRdv = data?.stats?.total || 0;
    const completedRdv = data?.stats?.onayla || 0;

    // Si total est 0, on met 0%, sinon on fait (confirmés / total) * 100
    const completionRate = totalRdv > 0 
        ? Math.round((completedRdv / totalRdv) * 100) 
        : 0;

     //conpletion ration pour le  jour  en cour
    // Calcul du pourcentage réel
    const totalRdvMonth = data?.statsMonth?.totalMonth || 0;
    const completedRdvMonth = data?.statsMonth?.onaylaMonth || 0;

    // Si total est 0, on met 0%, sinon on fait (confirmés / total) * 100
    const completionRateMonth = totalRdvMonth > 0 
        ? Math.round((completedRdvMonth / totalRdvMonth) * 100) 
        : 0;
            
        
    
    if (loading) return <div className={style.loader}>Kontrol paneli yükleniyor...</div>;
    if (!data)   return <div className={style.loader}>Veri kullanılamıyor.</div>;
  return (
    <div className={style.dash}>
      {/* ── Topbar ── */}
      <header className={style.header}>
        <div className={style.welcome}>
              <h1>Analitik Gösterge Paneli</h1>
              <p className={style.dateDisplay}>
                  <span className={style.locationDot}> </span>
                  {data.doktor.doktorName}  {data.doktor.doktorSurname}  {data.doktor.klinikName}
              </p>
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
                                {data.stats?.total || 0} Randevu
                            </small>
                        </div>
                    </div>
                </div>
            ):(data.randevu?.onaylandi && data.randevu?.onaylandi.length> 0 ? 
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
                            {data.randevu?.onaylandi.length > 1 && isToday && (
                            <button 
                                className={style.viewAllBtn}
                                onClick={() => setShowAll1(!showAll1)}
                            >
                                <i className={`fa-solid ${showAll1 ? 'fa-compress' : 'fa-list'}`}></i> 
                                {showAll1 ? 'Daha Az Görüntüle' : `Tüm Listeyi Görüntüle (${data.randevu?.onaylandi.length})`}
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
                                {data.stats?.onayla || 0} Randevu
                            </small>
                        </div>
                    </div>
                </div>
            ):(data.randevu.current && data.randevu.current.length > 0 ? 
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
                            {data.randevu?.current.length > 1 && isToday && (
                            <button 
                                className={style.viewAllBtn}
                                onClick={() => setShowAll2(!showAll2)}
                            >
                                <i className={`fa-solid ${showAll2 ? 'fa-compress' : 'fa-list'}`}></i> 
                                {showAll2 ? 'Daha Az Görüntüle' : `Tüm Listeyi Görüntüle (${data.randevu?.current.length})`}
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
                                {data.stats?.onayma || 0} Randevu
                            </small>
                        </div>
                    </div>
                </div>
            ):(data.randevu.beklemede && data.randevu.beklemede.length > 0 ? (
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
                        {data.randevu?.beklemede.length > 1 && isToday &&(
                        <button 
                            className={style.viewAllBtn}
                            onClick={() => setShowAll(!showAll)}
                        >
                            <i className={`fa-solid ${showAll ? 'fa-compress' : 'fa-list'}`}></i> 
                            {showAll ? 'Daha Az Görüntüle' : `Tüm Listeyi Görüntüle (${data.randevu.beklemede.length})`}
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
                        {data.stats?.bekleme || 0}
                    </div>
                    <small>Bekleyen hastalar</small>
                </>
                ) : (
                /* --- MODE HISTORIQUE : ANNULATIONS --- */
                <>
                    <span>İptaller</span>
                    <h3>İptal Edilen</h3>
                    <small>
                    {data.stats?.iptal || 0} Randevu
                    </small>
                </>
                )}
            </div>
        </div>
    </section>


      {/* ── Métriques ligne 1 ── Les infosṡar rapport au mois en cours  */}
      <div className={`${style.row} ${style.r4}`}>
        <MetricCard value={data.statsMonth.totalMonth}        label="Ayın Randevular"      color="blue"  icon="fa-book-medical"/>
        <MetricCard value={data.statsMonth.onaylaMonth} label="Ayın Onaylandı Randevular"   color="green" icon="fa-calendar-check" />
        <MetricCard value={data.statsMonth.onaymaMonth}        label="Ayın Onaylamamıs Randevular"    color="amber"  icon="fa-calendar-xmark"/>
        <MetricCard value={data.statsMonth.iptalMonth}         label="Ayın iptal Edilen Randevular"         color="red"    icon="fa-calendar-week"/>
      </div>

      {/* ── Métriques ligne 2 ── */}
      <div className={`${style.row} ${style.r4}`}>
        <MetricCard value={data.stats.total} label="Günlük Randevular"    color="green" icon="fa-book-medical"/>
        <MetricCard value={data.stats.onayla}            label="Günlük Onaylandı Randevular"       color="blue"  icon="fa-calendar-check"/>
        <MetricCard value={data.stats.onayma}        label="Günlük Onaylamamıs Randevular"   color="amber"  icon="fa-calendar-xmark"/>
        <MetricCard value={data.stats.iptal} label="Günlük iptal Edilen Randevular" color="red"  icon="fa-calendar-week"/>
      </div>

      {/* ── RDV du jour + File d'attente ── */}
      <div className={`${style.row} ${style.r2}`}>
        <div className={style.card}>
          <p className={style.ct}>Rendez-vous du jour</p>
          {(data.rdv_jour ?? []).map((r, i) => (
            <div key={i} className={style.rdvRow}>
              <div>
                <p className={style.rdvDoc}>Dr. {r.doc_nom} {r.doc_prenom}</p>
                <p className={style.rdvMeta}>{r.patient} · {r.specialite}</p>
              </div>
              <div className={style.rdvRight}>
                <span className={style.rdvTime}>{r.heure}</span>
                <StatusBadge status={r.status} />
              </div>
            </div>
          ))}
        </div>

        <div className={style.card}>
          <p className={style.ct}>File d'attente</p>
          <div className={style.waitList}>
            {(attente.liste ?? []).map((p, i) => (
              <div key={i} className={style.waitItem}>
                <div className={style.waitNum}>{i + 1}</div>
                <span className={style.waitName}>{p.nom}</span>
                <span className={style.waitTime}>+{p.attente_min} min</span>
              </div>
            ))}
          </div>
          <div className={style.divider} />
          <p className={style.ct} style={{ marginBottom: 8 }}>Alertes système</p>
          <div className={style.alertList}>
            {(alertes ?? []).map((a, i) => (
              <div key={i} className={style.alertItem}>
                <div
                  className={style.alertIcon}
                  style={{ background: a.type === 'success' ? '#1D9E75' : a.type === 'warning' ? '#BA7517' : '#378ADD' }}
                />
                <div>
                  <p className={style.alertMsg}>{a.message}</p>
                  <p className={style.alertAgo}>{a.ago}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Graphiques ── */}
      <div className={`${style.row} ${style.r2}`}>
        <div className={style.card}>
          <p className={style.ct}> Bugünkü Durumların Dağılımı</p>
          <div className={style.donutWrap}>
            <DonutStats statsler={data.stats} onayla={data.stats.onayla}
            onayma={data.stats.onayma}
            iptal={data.stats.iptal}
            />
          </div>
          <div className={style.divider} />
            <p className={style.ct} style={{ marginBottom: 6 }}>Günlük tamamlanma oranı</p>
            <div className={style.progressTrack}>
              <div className={style.progressFill} style={{ width: `${(completionRate ?? 60)}% ` }} />
            </div>
            <p className={style.progressLbl}>
              {completionRate ?? 60}% randevular bugün tamamlandı
            </p>
        </div>
        <div className={style.card}>
          <p className={style.ct}>Ayın Durumların Dağılımı</p>
          <div className={style.donutWrap}>
            <DonutStats statsler={data.statsMonth} onayla={data.statsMonth.onaylaMonth}
            onayma={data.statsMonth.onaymaMonth}
            iptal={data.statsMonth.iptalMonth}
            />
          </div>
          <div className={style.divider} />
            <p className={style.ct} style={{ marginBottom: 6 }}>Aylık tamamlanma oranı</p>
              <div className={style.progressTrack}>
              <div className={style.progressFill} style={{ width: `${(completionRateMonth ?? 60)}%` }} />
            </div>
            <p className={style.progressLbl}>
              {(completionRateMonth ?? 60)}% Bu ay tamamlanan randevular
            </p>
        </div>
      </div>
    </div>
  );
}

export default DoktorStats