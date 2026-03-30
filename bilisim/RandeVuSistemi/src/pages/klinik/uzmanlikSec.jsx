import style from './uzmanlikSec.module.css'
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DoctorPopup from './DoctorPopup';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState(null);
  // 1. Fonction pour simplement sélectionner et ouvrir le petit popup des docteurs
  const handleSpecClick = (spec) => {
    setSelected(spec); // On marque la carte comme active
    if (spec.doctors?.length > 0) {
      setSelectedSpec(spec);
      setIsModalOpen(true); // On ouvre le popup des docteurs
    }
  };
  // 2. Fonction pour le bouton "Devam et" (Continue)
  const handleFinalConfirm = () => {
    if (!selected) return;
    // Ici tu peux faire ton navigate ou autre action finale
    console.log("Passage à l'étape suivante avec :", selected.nom);
    onClose(); // On ne ferme le popup principal que maintenant
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
                  className={`${style.card} ${selected?.id === s.id ? style.cardActive : ''} ${s.doctors?.length === 0 ? style.cardDisabled : ''}`}
                  // 2. Le bouton est désactivé si la liste des docteurs est vide (0)
                  disabled={s.doctors?.length === 0}
                  onClick={() => handleSpecClick(s)}
                >
                <span className={style.icon}>{s.icon}</span>
                <span className={style.cardLabel}>{s.nom}</span>
                {/* Optionnel : Afficher le nombre de docteurs pour aider l'utilisateur */}
                  <span className={style.doctorBadge}>
                      {s.doctors?.length || 0}
                  </span>
                </button>
            ))}
            </div>

            <div className={style.footer}>
            <button className={style.cancelBtn} onClick={onClose}>İptal</button>
            <button
                className={style.confirmBtn}
                onClick={handleFinalConfirm}
                disabled={!selected}
            >
                Devam et →
            </button>
            </div>
      </div>
      <DoctorPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctors={selectedSpec?.doctors}
        specialtyName={selectedSpec?.nom}
      />
    </div>
  );
}

export default UzmanlikPopup;