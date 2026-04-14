import { BrowserRouter as Router, Routes, Route, Link ,useNavigate,useLocation} from 'react-router-dom';
import { useState} from 'react'
import style from './nav.module.css'
import KliniklerAddPopup from './klinikler/cokklinik_ekle';
import KlinikAddPopup from './klinikler/birklinik_ekle';
import UzmanlikEkle from './uzmanlik/ekleuzmanlik';

function NavbarAmin() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [openMenu, setOpenMenu] = useState(null); // 'klinik', 'uzmanlik' ou null
  // 1. On crée un état dédié pour le POPUP (différent de celui du dropdown)
  const [isopen, setIsOpen] = useState(false);
  const [activePopup, setActivePopup] = useState(null); // 'cok_klinik', 'single_klinik', 'uzmanlik' ou null

  const navigate = useNavigate();
  // --- HANDLERS ---
  const handleMenuToggle = (menuName, targetPath) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
    navigate(targetPath);
  };
  const handleOpenPopup = (popupType) => {
    setActivePopup(popupType);
    setOpenMenu(null); // On ferme le menu quand on ouvre un popup
  };
  return (
    <div style={{marginBottom:'60px'}}>
      <nav className={style.navbar}>
        
        <div className={style.left}>
          <Link to="/"  className={`${style.logo} ${isActive('/') ? style.linkActive : ''}`}><i className={`${style.badge} fa-solid fa-house `}></i></Link>
        </div>

        {/* Partie droite */}
        <div className={style.right}>
          <Link to="/adminhomepage" className={`${style.link} ${isActive('/adminhomepage') ? style.linkActive : ''}`}>Home</Link>
          <div className={style.dropdown}>
              <div 
                className={`${style.link} ${isActive('/klinikadmin') ? style.linkActive : ''}`}
                onClick={()=>handleMenuToggle('klinik','/klinikadmin')} // Inverse l'état au clic
                style={{ cursor: 'pointer' }}
              >
                Klinikler ▾
            </div>
            {/* Rendu Conditionnel du menu */}
            {openMenu === 'klinik' && (
              <div className={style.dropdownMenu}>
                {/* <Link to="/klinik/ajouter" className={style.dropdownItem} onClick={() => setIsOpen(false)}>
                  ➕ Klinik Ekle
                </Link> */}
                <button className={style.dropdownItem} onClick={() => handleOpenPopup('cok_klinik')}>🏥 Fazla klinik Ekle</button>
                <button className={style.dropdownItem} onClick={() => handleOpenPopup('bir_klinik')}>➕ Klinik Ekle</button>
                <Link to="/klinik/supprimer" className={style.dropdownItem} onClick={() => setIsOpen(false)}>
                  🗑️Bir Kliniği Sil
                </Link>
              </div>
            )}
          </div>
          {/* <Link to="/uzmanliklist" className={`${style.link} ${isActive('/uzmanliklist') ? style.linkActive : ''}`}>Uzmanlik</Link> */}
          <div className={style.dropdown}>
              <div 
                className={`${style.link} ${isActive('/uzmanliklist') ? style.linkActive : ''}`}
                onClick={()=>handleMenuToggle('uzmanlik','/uzmanliklist')} // Inverse l'état au clic
                style={{ cursor: 'pointer' }}
              >
                Uzmanlik ▾
            </div>
            {/* Rendu Conditionnel du menu */}
            {openMenu === 'uzmanlik' && (
              <div className={style.dropdownMenu}>
                <button className={style.dropdownItem} onClick={() => handleOpenPopup('uzmanlik')}>➕ Uzmanlik Ekle</button>
                <Link to="/klinik/supprimer" className={style.dropdownItem} onClick={() => setIsOpen(false)}>
                  🗑️Uzmanlik Sil
                </Link>
              </div>
            )}
          </div>
          <Link to="/doktorlar" className={`${style.link} ${isActive('/doktorlar') ? style.linkActive : ''}`}>Doktorlar</Link>
          <Link to="/hastalar" className={`${style.link} ${isActive('/hastalar') ? style.linkActive : ''}`}>Hastalar</Link>
          <Link to="/klinik" className={`${style.link} ${isActive('/klinikList') ? style.linkActive : ''}`}>Randevular</Link>
        </div>

      </nav>
      {activePopup === 'cok_klinik' && (
        <KliniklerAddPopup onClose={() => setActivePopup(null)} onSave={(d) => console.log(d)} />
      )}
      {activePopup === 'bir_klinik' && (
        <KlinikAddPopup onClose={() => setActivePopup(null)} onSave={(d) => console.log(d)} />
      )}
      {activePopup === 'uzmanlik' && (
        <UzmanlikEkle onClose={() => setActivePopup(null)} onSave={(d) => console.log(d)} />
      )}
        
    </div>
  );
}
export default NavbarAmin;


