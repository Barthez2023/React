import { useRef, useState } from 'react';
import style from './ekleuzmanlik.module.css';
import React from 'react';
import axios from 'axios';

const INITIAL_FORM = {
  name: '',
  icon: '',
};

function UzmanlikEkle({ onClose, onSave }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())      errs.name      = 'Zorunlu';
    if (!form.icon.trim()) errs.icon      = 'Zorunlu';
    return errs;
  };

    const handleSubmit = () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
        }
        setIsSubmitting(true);
        const fetchUzmanlik = async () => {
        // 2. Récupération des cliniques via Overpass API avec les coordonnées du formulaire
        try {
            const result = await axios.post("http://localhost/BilisimTekno/uzmanlik_ekle.php",{formData: form})  // ← Envoyer les données récupérées, pas l'état vide;
            console.log("Réponse du serveur:", result.data);
            console.log(form)
            alert(`${form.name}  uzmanlik başarıyla eklendi !`);
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
    fetchUzmanlik()
    onClose();
  }
  return (
    <div className={style.overlay} onClick={onClose}>
        <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <button className={style.closeBtn} onClick={onClose}>✕</button>
            {/* En-tête */}
            <h2 className={style.title}>Yeni bir Uzmanlik kaydı</h2>
            <p className={style.description}>
                Burada sistemimize yeni bir uzmanlık ekleyeceğiz.
                Lütfen klinik eklemek icin  aşağıdaki formu doldurun.
            </p>

            <div className={style.divider} />
             {/* name */}
            <div className={style.field}>
                <label className={style.label}>Uzmanlik Adı</label>
                <input
                    type="text"
                    placeholder="uzmanlik isim girin"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`${style.input} ${errors.name ? style.inputError : ''}`}
                />
                {errors.name && <p className={style.errorMsg}>{errors.name}</p>}
            </div>
            {/* city */}
            <div className={style.field}>
                <label className={style.label}>Uzmanlik Icon</label>
                <input
                    type="text"
                    placeholder="uzmanlik isim icon."
                    value={form.icon}
                    onChange={(e) => handleChange('icon', e.target.value)}
                    className={`${style.input} ${errors.icon ? style.inputError : ''}`}
                />
                {errors.icon && <p className={style.errorMsg}>{errors.icon}</p>}
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
export default UzmanlikEkle;