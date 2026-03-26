import { useEffect, useRef, useState } from 'react';
import style from './birklinik_ekle.module.css';
import React from 'react';
import axios from 'axios';

const INITIAL_FORM = {
  name: '',
  city: '',
  uzmanlik_ids:[],
  description: '',
  zaman:'Mon-Fri 08h-18h'
};

function KlinikAddPopup({ onClose, onSave }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const hasFetched = useRef(false);
  const [klinikler,setKlinikler]=useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name)      errs.name      = 'Zorunlu';
    if (form.uzmanlik_ids.length===0)      errs.uzmanlik_ids      = 'Zorunlu';
    if (!form.city.trim()) errs.city      = 'Zorunlu';
    if (!form.description.trim()) errs.description = 'Zorunlu';
    return errs;
  };

    const handleSubmit = () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setIsSubmitting(true);
        const fetchHospitals = async () => {
        // 2. Récupération des cliniques via Overpass API avec les coordonnées du formulaire
        try {
            const result = await axios.post("http://localhost/BilisimTekno/birklinik_ekle.php",{formData: form})  // ← Envoyer les données récupérées, pas l'état vide;
            console.log("Réponse du serveur:", result.data);
            alert(`${form.name}  kliniği başarıyla eklendi !`);
            onClose();
        } catch (error) {
            console.error("Error API :", error);
            alert("Bir hata olmuştu.");
        }
        finally {
            setIsSubmitting(false);
        }
        onClose();
    };
    fetchHospitals()
    onClose();
  }
  const [uzmanlik,setUzmanlik]=useState([]);
    useEffect(()=>{
        const getuzmanlik=async ()=>{
            try {
                const response = await axios.get('http://localhost/BilisimTekno/getUzmanlik.php');
                setUzmanlik(response.data.data);
                console.log(response.data)
            } catch (error) {
                console.error("Get uzmanlik hatası:", error);
            }
            };
            getuzmanlik();
  },[])


  //permet de retirer ou d'ajouter un uzmanlik dans notre tableau
  const handleCheckboxChange = (id) => {
    // On récupère la liste actuelle des IDs depuis ton state (ex: formData.uzmanlik_ids)
        const currentIds = [...form.uzmanlik_ids];
        
        if (currentIds.includes(id)) {
            // Si l'ID est déjà là, on le retire (décocher)
            const newIds = currentIds.filter(item => item !== id);
            handleChange('uzmanlik_ids', newIds);
        } else {
            // Sinon, on l'ajoute (cocher)
            handleChange('uzmanlik_ids', [...currentIds, id]);
        }
    };
    const chek=()=>{
        console.log(form.uzmanlik_ids)
    }

  return (
    <div className={style.overlay} onClick={onClose}>
        <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <button className={style.closeBtn} onClick={onClose}>✕</button>
            {/* En-tête */}
            <h2 className={style.title}>Yeni bir kliniğin kaydı</h2>
            <p className={style.description}>
                Buraya girilecek verilerden birine karşılık gelen bir klinik ekleyeceğiz.
                Lütfen klinik eklemek icin  aşağıdaki formu doldurun.
            </p>

            <div className={style.divider} />
             {/* name */}
            <div className={style.field}>
                <label className={style.label}>Kliniğin Adı</label>
                <input
                    type="text"
                    placeholder="Bir isim girin"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`${style.input} ${errors.name ? style.inputError : ''}`}
                />
                {errors.name && <p className={style.errorMsg}>{errors.name}</p>}
            </div>
            {/* city */}
            <div className={style.field}>
                <label className={style.label}>Şehir adı</label>
                <input
                    type="text"
                    placeholder="Kliniğin bulunduğu şehri girin."
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className={`${style.input} ${errors.city ? style.inputError : ''}`}
                />
                {errors.city && <p className={style.errorMsg}>{errors.city}</p>}
            </div>

            {/* Description */}
            <div className={style.field}>
                <label className={style.label}>Hastane açıklaması</label>
                <textarea
                    rows={3}
                    placeholder="Bu bölgedeki hastaneler hakkında kısa bir açıklama yazın..."
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className={`${style.textarea} ${errors.description ? style.inputError : ''}`}
                />
                {errors.description && <p className={style.errorMsg}>{errors.description}</p>}
            </div>
            <div className={style.field}>
                <label className={style.label}>Çalışma saatleri ve Gunleri</label>
                <div className={style.timeRow}>
                    <select className={style.select} name="" id="" onChange={(e) => handleChange('zaman', e.target.value)}>
                        <option  value="sec">Sec</option>
                        <option  value="Mon-Fri 08h-18h">Mon-Fri 08h-18h</option>
                        <option  value="Mon-Fri 08h-18h30">Mon-Fri 08h-18h30</option>
                        <option  value="Mon-Fri 24h/24">Mon-Fri 24h/24</option>
                        <option  value="Mon-Sum 08h-18h">Mon-Sum 08h-18h</option>
                        <option  value="Mon-Sum 08h-18h30">Mon-Sum 08h-18h30</option>
                    </select>
                </div>
            </div>
            {/* <div className={style.field}>
                <label className={style.label}>Uzmanlik Secin</label>
                <div className={style.timeRow}>
                    <select className={style.select} name="" id="" onChange={(e) => handleChange('uzmanlik_ids', e.target.value)}>
                        <option  value="sec">Sec</option>
                        {uzmanlik?.map((uzman)=>(
                            <option key={uzman.id} value={uzman.nom}>
                                {uzman.nom}
                            </option>
                        ))}
                    </select>
                </div>
            </div> */}

            <div className={style.field}>
                <label className={style.label}>Uzmanlik Secin</label>
                <div className={style.uzmanlik}>
                    {uzmanlik?.map((uzman) => (
                        <label key={uzman.id} className={style.checkboxLabel}>
                        <input
                            type="checkbox"
                            value={uzman.id}
                            checked={form.uzmanlik_ids.includes(uzman.id)}
                            onChange={() => handleCheckboxChange(uzman.id)}
                        />
                        <span>{uzman.icon} {uzman.nom}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className={style.footer}>
            <button className={style.cancelBtn} onClick={onClose}>İptal</button>
            <button className={style.saveBtn} onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Yükleniyor..." : "Kaydet"}</button>
            </div>
        </div>
    </div>
  );
}
export default KlinikAddPopup;