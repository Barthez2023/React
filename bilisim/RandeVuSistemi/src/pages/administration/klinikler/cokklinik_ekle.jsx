import { useRef, useState } from 'react';
import style from './cokklinik_ekle.module.css';
import React from 'react';
import axios from 'axios';

const INITIAL_FORM = {
  latMin: '',
  latMax: '',
  lonMin: '',
  lonMax: '',
  city: '',
  description: '',
  zaman:'Mon-Fri 08h-18h'

};

function KliniklerAddPopup({ onClose, onSave }) {
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
    if (!form.latMin)      errs.latMin      = 'Zorunlu';
    if (!form.latMax)      errs.latMax      = 'Zorunlu';
    if (!form.lonMin)      errs.lonMin      = 'Zorunlu';
    if (!form.lonMax)      errs.lonMax      = 'Zorunlu';
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
        const bbox = `${form.latMin},${form.lonMin},${form.latMax},${form.lonMax}`;


        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const url = `https://overpass-api.de/api/interpreter?data=[out:json];node['amenity'='hospital'](${bbox});out 10;`;
            const response = await axios.get(url);
            console.log(response.data.elements);
            const hospitals = response.data.elements;
                console.log(`${hospitals.length} Le nombre d'hopitaux trouvés:`, hospitals);
                // 3. ENVOI DES DEUX DATAS AU PHP
                const payload = {
                    formData: form,          // Les infos du formulaire (ville, desc, horaires)
                    klinikler: hospitals     // La liste des cliniques trouvées par l'API
                };
                const result = await axios.post("http://localhost/BilisimTekno/cokklinik_ekle.php",payload)  // ← Envoyer les données récupérées, pas l'état vide;
                console.log("Réponse du serveur:", result.data);
                alert(`${hospitals.length} cliniques ajoutées avec succès !`);
                onClose();
        } catch (error) {
            console.error("Erreur API :", error);
            alert("Une erreur est survenue.");
        }
        finally {
            setIsSubmitting(false);
        }
        onClose();
    };
    fetchHospitals()
    onClose();
  };
  return (
    <div className={style.overlay} onClick={onClose}>
        <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <button className={style.closeBtn} onClick={onClose}>✕</button>
            {/* En-tête */}
            <h2 className={style.title}>Bölge Plajı Ekle</h2>
            <p className={style.description}>
                Burada belirli bir bölgeye karşılık gelen birden fazla klinik ekleyeceğiz.
                Lütfen klinikler eklemek icin  aşağıdaki formu doldurun.
            </p>

            <div className={style.divider} />
            {/* Coordonnées */}
            <div className={style.field}>
                <label className={style.label}>Coğrafi plaj koordinatları</label>
                <div className={style.coordsGrid}>
                    {[
                    { key: 'latMin', placeholder: '39.65', sublabel: 'lat min' },
                    { key: 'latMax', placeholder: '39.60', sublabel: 'lat max' },
                    { key: 'lonMin', placeholder: '41.05', sublabel: 'lon min' },
                    { key: 'lonMax', placeholder: '39.85', sublabel: 'lon max' },
                    ].map(({ key, placeholder, sublabel }) => (
                    <div key={key}>
                        <input
                        type="number"
                        step="0.01"
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className={`${style.input} ${style.coordInput} ${errors[key] ? style.inputError : ''}`}
                        />
                        <p className={style.coordLabel}>{sublabel}</p>
                        </div>
                    ))}
                </div>
                <p className={style.hint}>Örnek: (39.65, 39.60, 41.05, 39.85)</p>
            </div>

            {/* city */}
            <div className={style.field}>
                <label className={style.label}>Şehir adı</label>
                <input
                    type="text"
                    placeholder="Trabzon"
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
                        <option className="" value="sec">Sec</option>
                        <option className="Mon-Fri 08h-18h" value={form.zaman}>Mon-Fri 08h-18h</option>
                        <option className="Mon-Fri 08h-18h30" value={form.zaman}>Mon-Fri 08h-18h30</option>
                        <option className="Mon-Fri 24h/24" value={form.zaman}>Mon-Fri 24h/24</option>
                        <option className="Mon-Sum 08h-18h" value={form.zaman}>Mon-Sum 08h-18h</option>
                        <option className="Mon-Sum 08h-18h30" value={form.zaman}>Mon-Sum 08h-18h30</option>
                    </select>
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
export default KliniklerAddPopup;