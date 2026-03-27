import { useState, useMemo,useEffect } from 'react';
import style from './uzmanlikelement.module.css';
import axios from 'axios';

// ─────creation du cardre qui va contenir des uzmanlik
function SpecialiteCard({ spec }) {
    // État pour gérer le "Voir plus"
    const [showAll, setShowAll] = useState(false);
    const [clinics,setClinics]=useState(['Medicana Rize', 'Kuzey Sağlık']);
    const doctorArray = spec.doktorlar && spec.doktorlar !== '—' 
    ? spec.doktorlar.split(', ') 
    : [];
    const klinikArray = spec.liste_cliniques && spec.liste_cliniques !== '—' 
    ? spec.liste_cliniques.split(', ') 
    : [];
    // On détermine quelles cliniques afficher
    const displayedClinics = showAll ? klinikArray : klinikArray.slice(0, 3)
  return (
    <div className={style.card}>
      {/* Header */}
      <div className={style.cardHeader}>
        <span className={style.icon}>{spec.icon}</span>
        <span className={style.specName}>{spec.nom}</span>
      </div>

      {/* Body */}
      <div className={style.cardBody}>
        {/* Cliniques */}
        <p className={style.sectionLabel}>Klinikler</p>
        <ul className={style.clinicList}>
          {displayedClinics.map((c) => (
            <li key={c} className={style.clinicItem}>
              <span className={style.clinicDot} />
              {c}
            </li>
          ))}
        </ul>
        {/* Bouton Voir Plus - Apparaît seulement s'il y a plus de 5 cliniques */}
        {klinikArray.length > 3 && (
          <button 
            className={style.viewMore} 
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? '▲ Daha az göster' : `▼ Tümünü gör (${klinikArray.length})`}
          </button>
        )}
        {/* Médecins */}
        <p className={style.sectionLabel}>Doktorlar</p>
        <div className={style.doctorPills}>
          {doctorArray.length > 0 ? (
            doctorArray.map((d) => (
              <span key={d} className={style.pill}>{d}</span>
            ))
          ) : (
            <span style={{fontSize: '12px', color: '#94a3b8'}}>Henüz doktor yok</span>
          )}
        </div>
      </div>

      {/* Footer — statistiques */}
      <div className={style.cardFooter}>
        <div className={style.stat}>
          <span className={style.statNum}>{spec.nombre_cliniques}</span>
          <span className={style.statLabel}>klinik</span>
        </div>
        <div className={style.stat}>
          <span className={style.statNum}>{doctorArray.length}</span>
          <span className={style.statLabel}>doktor</span>
        </div>
      </div>
    </div>
  );
}

function UzmanlikElement() {
    const [specialites, setSpecialites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost/BilisimTekno/uzmanliklist1.php');
            setData(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Yükleme hatası:", error);
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, []);
    const [query, setQuery] = useState('');
    const filtered = useMemo(
        () =>
        data.filter((s) =>
            s.nom?.toLowerCase().includes(query.toLowerCase())
        ),
        [query,data]
    );
    if (loading) return <div className={style.loader}>Uzmanlik yükleniyor......</div>;
  return (
    <div className={style.page}>
        <p className={style.presentation}>Randevu sistemimizde bulduğumuz farklı uzmanlık alanları</p>
      {/* Barre de recherche */}
      <input
        type="text"
        className={style.search}
        placeholder="Uzmanlık ara..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Grille de cartes */}
      {filtered.length === 0 ? (
        <p className={style.empty}>Sonuç bulunamadı.</p>
      ) : (
        <div className={style.grid}>
          {filtered.map((item,index) => (
            <SpecialiteCard key={index} spec={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UzmanlikElement;