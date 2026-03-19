import { useState, useMemo,useEffect } from 'react';
import style from './uzmanlikelement.module.css';
import axios from 'axios';

// ─────creation du cardre qui va contenir des uzmanlik
function SpecialiteCard({ spec }) {
    const [clinics,setClinics]=useState(['Medicana Rize', 'Kuzey Sağlık']);
    const [doctors,setDoctors]=useState(['Dr. Tarık Doğan', 'Dr. Sibel Aydın', 'Dr. Cem Başar']);
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
          {clinics.map((c) => (
            <li key={c} className={style.clinicItem}>
              <span className={style.clinicDot} />
              {c}
            </li>
          ))}
        </ul>

        {/* Médecins */}
        <p className={style.sectionLabel}>Doktorlar</p>
        <div className={style.doctorPills}>
          {doctors.map((d) => (
            <span key={d} className={style.pill}>{d}</span>
          ))}
        </div>
      </div>

      {/* Footer — statistiques */}
      <div className={style.cardFooter}>
        <div className={style.stat}>
          <span className={style.statNum}>{clinics.length}</span>
          <span className={style.statLabel}>klinik</span>
        </div>
        <div className={style.stat}>
          <span className={style.statNum}>{doctors.length}</span>
          <span className={style.statLabel}>doktor</span>
        </div>
      </div>
    </div>
  );
}

function UzmanlikElement() {
    const [specialites, setSpecialites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost/BilisimTekno/uzmanliklist.php');
            setSpecialites(response.data.data);
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
      specialites.filter((s) =>
        s.nom.toLowerCase().includes(query.toLowerCase())
      ),
    [query,specialites]
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
          {filtered.map((s) => (
            <SpecialiteCard key={s.id} spec={s} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UzmanlikElement;