import style from './uzmanlikSec.module.css'
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UzmanlikPopup({ klinik, onClose }) {

    const[uzmanlik,setUzmanlik]=useState([])
    useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // IMPORTANT : On envoie l'ID de la clinique cliquée au PHP
        const response = await axios.post('http://localhost/BilisimTekno/uzmanlik.php', {
          hastane_id: klinik.id 
        });
        setUzmanlik(response.data.data || []);
        console.log("uzmanlik: ",response.data)
      } catch (error) {
        console.error("Erreur PHP:", error);
      } finally {
        setLoading(false);
      }
    };

    if (klinik?.id) {
      fetchData();
    }
    
    // On réinitialise la sélection quand on change de clinique
    setSelected(null); 
    
  }, [klinik?.id]); // Le useEffect "écoute" maintenant le changement de clinique !
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // État de chargement
  const handleConfirm = () => {
    if (!selected) return;
    // Redirige vers la liste des médecins filtrée par spécialité
    //navigate(`/medecins`, { state: { specialite: selected, klinik } });
    navigate('/klinik')
    onClose();
  };
  return (
    <div className={style.overlay} onClick={onClose}>
      <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <button className={style.closeBtn} onClick={onClose}>✕</button>
            <div className={style.header}>
            <p className={style.klinikName}>{klinik?.name ?? 'klinik'}</p>
            <h2 className={style.title}>Bölümü seçin</h2>
            <p className={style.subtitle}>Randevunuzu almak istediğiniz bölümü seçin.</p>
            </div>

            <div className={style.grid}>
            {uzmanlik.map(s => (
                <button
                key={s.id}
                className={`${style.card} ${selected?.id === s.id ? style.cardActive : ''}`}
                onClick={() => setSelected(s)}
                >
                <span className={style.icon}>{s.icon}</span>
                <span className={style.cardLabel}>{s.nom}</span>
                </button>
            ))}
            </div>

            <div className={style.footer}>
            <button className={style.cancelBtn} onClick={onClose}>İptal</button>
            <button
                className={style.confirmBtn}
                onClick={handleConfirm}
                disabled={!selected}
            >
                Devam et →
            </button>
            </div>
      </div>
    </div>
  );
}

export default UzmanlikPopup;