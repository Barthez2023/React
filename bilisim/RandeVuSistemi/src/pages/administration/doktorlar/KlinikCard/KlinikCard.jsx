import { useState, useMemo } from 'react';
import style from './klinikCard.module.css';

function KlinikCardPopup({ cliniques, onConfirm, onClose }) {
  const [selected, setSelected] = useState(null);
  const [query, setQuery]       = useState('');

  const filtered = useMemo(
    () =>
      cliniques.filter((c) =>
        c && c.toString().toLowerCase().includes(query.toLowerCase())
      ),
    [query, cliniques]
  );

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);   // retourne l'objet clinique complet
    onClose();
  };

  return (
    <div className={style.overlay} onClick={onClose}>
      <div className={style.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={style.header}>
          <h3 className={style.title}>Klinik seçin</h3>
          <p className={style.subtitle}>Doktoru atamak istediğiniz kliniği seçin.</p>
        </div>

        {/* Recherche */}
        <div className={style.searchWrapper}>
          <input
            type="text"
            className={style.search}
            placeholder="Klinik ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Grille des cliniques */}
        <div className={style.grid}>
          {filtered.length === 0 ? (
            <p className={style.empty}>Sonuç bulunamadı.</p>
          ) : (
            filtered.map((clinicName,index) => {
                // On compare directement la chaîne 'clinicName' avec l'état 'selected'
                const isSelected = selected === clinicName;
              return (
                <div
                  key={`clinic-${index}`}
                  className={`${style.card} ${isSelected ? style.cardSelected : ''}`}
                  onClick={() => setSelected(clinicName)}
                >
                  <div className={`${style.radio} ${isSelected ? style.radioSelected : ''}`}>
                    {isSelected && <span className={style.radioDot} />}
                  </div>
                  <div>
                    <p className={style.clinicName}>{clinicName}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className={style.footer}>
          <button className={style.cancelBtn} onClick={onClose}>İptal</button>
          <button
            className={style.confirmBtn}
            onClick={handleConfirm}
            disabled={!selected}
          >
            Onayla
          </button>
        </div>

      </div>
    </div>
  );
}

export default KlinikCardPopup;