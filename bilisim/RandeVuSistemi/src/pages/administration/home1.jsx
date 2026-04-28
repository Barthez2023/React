import { useState, useEffect, useRef,useMemo } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import style from './home1.module.css';

// ── Composants utilitaires ─────────────────────────────────────────────────

function MetricCard({ value, label, color }) {
  const colors = {
    blue:  style.iconBlue,
    green: style.iconGreen,
    amber: style.iconAmber,
    red:   style.iconRed,
  };
  return (
    <div className={style.metric}>
      <div className={`${style.metricIcon} ${colors[color]}`} />
      <div>
        <p className={style.metricVal}>{value}</p>
        <p className={style.metricLbl}>{label}</p>
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

const DoktorStats = () => {
  const {id} = useParams(); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // On initialise avec la date du jour si besoin
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [elapsed, setElapsed] = useState(0);

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












  const formatTimer = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
//   const { consultation, patients, rdv, attente, doctors_rdv, alertes, statuts } = data;
  // Remplace ta ligne de destructuring par celle-ci :
const { 
  consultation = {}, 
  patients = { total: 0, nouveaux_mois: 0, consultes_auj: 0 }, 
  rdv = { aujourd_hui: 0, ce_mois: 0, cette_annee: 0 }, 
  attente = { nombre: 0, liste: [] }, 
  doctors_rdv = [], 
  alertes = [], 
  statuts = {} 
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


    if (loading) return <div className={style.loader}>Tableau de bord en chargement...</div>;
    if (!data)   return <div className={style.loader}>Données indisponibles.</div>;
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


























      {/* ── Consultation en cours / suivant / précédent ── */}
      <div className={`${style.row} ${style.r3}`}>
        <div className={`${style.card} ${style.borderGreen}`}>
          <p className={style.ct}>Consultation en cours</p>
          <p className={style.consultName}>
            <span className={`${style.dot} ${style.dotGreen}`} />
            {consultation?.en_cours ?? '—'}
          </p>
          <p className={style.consultSub}>{consultation?.specialite} · Débutée à {consultation?.heure_debut}</p>
          <p className={style.timer}>{formatTimer(elapsed)}</p>
        </div>
        <div className={`${style.card} ${style.borderBlue}`}>
          <p className={style.ct}>Patient suivant</p>
          <p className={style.consultName}>
            <span className={`${style.dot} ${style.dotAmber}`} />
            {consultation?.suivant ?? 'Aucun'}
          </p>
          <p className={style.consultSub}>RDV à {consultation?.heure_suivant} · Salle d'attente</p>
          <p className={style.consultSub}>Attente : {consultation?.attente_min ?? 0} min</p>
        </div>
        <div className={`${style.card} ${style.borderGray}`}>
          <p className={style.ct}>Patient précédent</p>
          <p className={style.consultName}>
            <span className={`${style.dot} ${style.dotGray}`} />
            {consultation?.precedent ?? '—'}
          </p>
          <p className={style.consultSub}>Terminée à {consultation?.heure_precedent}</p>
          <StatusBadge status="consulte" />
        </div>
      </div>

      {/* ── Métriques ligne 1 ── */}
      <div className={`${style.row} ${style.r4}`}>
        <MetricCard value={patients.total}        label="Total patients"      color="blue"  />
        <MetricCard value={patients.nouveaux_mois} label="Nouveaux ce mois"   color="green" />
        <MetricCard value={rdv.aujourd_hui}        label="RDV aujourd'hui"    color="amber" />
        <MetricCard value={attente.nombre}         label="En attente"         color="red"   />
      </div>

      {/* ── Métriques ligne 2 ── */}
      <div className={`${style.row} ${style.r4}`}>
        <MetricCard value={patients.consultes_auj} label="Consultés auj."    color="green" />
        <MetricCard value={rdv.ce_mois}            label="RDV ce mois"       color="blue"  />
        <MetricCard value={rdv.cette_annee}        label="RDV cette année"   color="amber" />
        <MetricCard value={data.cliniques_actives} label="Cliniques actives" color="green" />
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
          <p className={style.ct}>Rendez-vous par médecin (ce mois)</p>
          <BarChart doctors={doctors_rdv ?? []} />
        </div>
        <div className={style.card}>
          <p className={style.ct}>Répartition des statuts</p>
          <div className={style.donutWrap}>
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="35" fill="none" stroke="#f1f5f9" strokeWidth="14"/>
              <circle cx="45" cy="45" r="35" fill="none" stroke="#1D9E75" strokeWidth="14"
                strokeDasharray={`${Math.round(statuts?.consulte_pct ?? 60) * 2.2} 220`} strokeDashoffset="0" strokeLinecap="round"/>
              <circle cx="45" cy="45" r="35" fill="none" stroke="#378ADD" strokeWidth="14"
                strokeDasharray={`${Math.round(statuts?.bekliyor_pct ?? 28) * 2.2} 220`}
                strokeDashoffset={`-${Math.round(statuts?.consulte_pct ?? 60) * 2.2}`} strokeLinecap="round"/>
              <circle cx="45" cy="45" r="35" fill="none" stroke="#E24B4A" strokeWidth="14"
                strokeDasharray={`${Math.round(statuts?.iptal_pct ?? 12) * 2.2} 220`}
                strokeDashoffset={`-${Math.round((statuts?.consulte_pct ?? 60) + (statuts?.bekliyor_pct ?? 28)) * 2.2}`} strokeLinecap="round"/>
            </svg>
            <div className={style.donutLegend}>
              {[
                { color: '#1D9E75', label: 'Consulté',  pct: statuts?.consulte_pct ?? 60 },
                { color: '#378ADD', label: 'Bekliyor',  pct: statuts?.bekliyor_pct ?? 28 },
                { color: '#E24B4A', label: 'İptal',     pct: statuts?.iptal_pct    ?? 12 },
              ].map((s, i) => (
                <div key={i} className={style.legendItem}>
                  <div className={style.legendDot} style={{ background: s.color }} />
                  <span className={style.legendLabel}>{s.label}</span>
                  <span className={style.legendVal}>{Math.round(s.pct)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className={style.divider} />
          <p className={style.ct} style={{ marginBottom: 6 }}>Taux de complétion</p>
          <div className={style.progressTrack}>
            <div className={style.progressFill} style={{ width: `${Math.round(statuts?.consulte_pct ?? 60)}%` }} />
          </div>
          <p className={style.progressLbl}>
            {Math.round(statuts?.consulte_pct ?? 60)}% des rendez-vous menés à terme
          </p>
        </div>
      </div>
    </div>
  );
}

export default DoktorStats