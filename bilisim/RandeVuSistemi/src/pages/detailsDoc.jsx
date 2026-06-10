import React ,{useState} from 'react';
import style from './details.module.css';
import ExpandableText from './ExpandableText';

// Utilisation des props : isOpen (booléen), onClose (fonction), Detaylar (objet data)
const DetailsPopupDoc = ({ isOpen, onClose, Detaylar }) => {
    
    // Si le popup n'est pas ouvert ou si les données sont absentes, on ne rend rien
    if (!isOpen || !Detaylar) return null;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const handleDataAnalysis = (data) => {
        console.log("Texte à analyser :", data.text);
        console.log("Fichier joint :", data.file);
    }

    return (
        <div className={style.modalOverlay} onClick={onClose}>
            <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={style.modalHeader}>
                    <h2><i className="fa-solid fa-circle-info"></i> Randevu Detayları</h2>
                    <button className={style.closeBtn} onClick={onClose}>&times;</button>
                </div>
                
                <div className={style.modalBody}>
                    <div className={style.detailItem}>
                        <label>Hasta öyküsü (Anamnez)</label>
                        <div className={style.textContainer}>
                            <ExpandableText text={Detaylar.history} maxWords={20} />
                        </div>
                    </div>
                    <div className={style.detailItem}>
                        <label>Mevcut semptomlar</label>
                        <div className={style.textContainer}>
                            <ExpandableText text={Detaylar.symptoms} maxWords={20} />
                        </div>
                    </div>
                    <div className={style.detailItem}>
                        <label>Alınan ilaçlar ve dozları</label>
                        <div className={style.textContainer}>
                            <ExpandableText text={Detaylar.medications} maxWords={20} />
                        </div>
                    </div>
                    <div className={style.detailItem}>
                        <label>Notlar</label>
                        <p className={style.patientNote}>
                            Hasta tarafından girilen tüm  bilgiler.
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

export default DetailsPopupDoc;