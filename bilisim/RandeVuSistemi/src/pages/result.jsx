import React from 'react';
import style from './result.module.css';
import ExpandableText from './ExpandableText';

// Utilisation des props : isOpen (booléen), onClose (fonction), Result (objet data)
const ResultPopup = ({ isOpen, onClose, Result }) => {
    // Si le popup n'est pas ouvert ou si les données sont absentes, on ne rend rien
    if (!isOpen || !Result) return null;

    return (
        <div className={style.modalOverlay} onClick={onClose}>
            <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={style.modalHeader}>
                    <h2><i className="fa-solid fa-circle-info"></i> Randevu Raporu</h2>
                    <button className={style.closeBtn} onClick={onClose}>&times;</button>
                </div>
                
                <div className={style.modalBody}>
                    <div className={style.detailItem}>
                        <label>RandeVu Genel Bakis</label>
                        <div className={style.textContainer}>
                            <ExpandableText text={Result.rapor} maxWords={20} />
                        </div>
                    </div>
                    <div className={style.detailItem}>
                        <label>Mevcut Teşhis</label>
                        <div className={style.textContainer}>
                            <ExpandableText text={Result.Diagnostic} maxWords={20} />
                        </div>
                    </div>
                    <div className={style.detailItem}>
                        <label>Tıbbi reçete</label>
                        <div className={style.textContainer}>
                            <ExpandableText text={Result.Recipe} maxWords={20} />
                        </div>
                    </div>
                    <div className={style.detailItem}>
                        <label>Notlar</label>
                        <p className={style.patientNote}>
                            Doktor tarafından girilen   bilgiler.
                        </p>
                    </div>
                </div>

                <div className={style.modalFooter}>
                    <button className={style.closeFooterBtn} onClick={onClose}>Kapat</button>
                </div>
            </div>
        </div>
    );
};

export default ResultPopup;