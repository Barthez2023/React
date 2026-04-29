import { BrowserRouter as Router, Routes, Route, Link ,useNavigate,useLocation} from 'react-router-dom';
import { useState} from 'react'
import style from './navbar.module.css'


function NavbarDoktor() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const navigate=useNavigate()
  const handleLogout = () => {
    // Ta logique de déconnexion ici (ex: localStorage.clear())
    navigate('/logindoktor');
  };
    const name = localStorage.getItem('doktorName');
    const Surname = localStorage.getItem('doktorSurName');
    const idDoc=localStorage.getItem('doktorId')
  return (
    <div style={{marginBottom:'60px'}}>
      <nav className={style.navbar}>
        
        {/* Logo / Home */}
        <div className={style.left}>
          <Link to="/doktor/welcome" className={style.logo}>
            <i className={`${style.badge} fa-solid fa-house-medical`}></i>
            <span style={{marginLeft: '10px', color: '#1e293b', fontWeight: 'bold',fontSize:'25px',textTransform:'uppercase'}}>Kliniği bağlayın</span>
          </Link>
        </div>

        {/* Menu Principal */}
        <div className={style.right}>
          <Link to="/doktor/welcome" className={`${style.link} ${isActive('/doktor/welcome') ? style.linkActive : ''}`}>
            Home
          </Link>
          <Link to="/doktor/bugunkurandevular" className={`${style.link} ${isActive('/doktor/bugunkurandevular') ? style.linkActive : ''}`}>
            Bugünkü randevular
          </Link>
          <Link to="/doktor/gecmisrandevular" className={`${style.link} ${isActive('/doktor/gecmisrandevular') ? style.linkActive : ''}`}>
            Geçmiş randevular
          </Link>
          <Link to="/admin/doktor/Analyse" className={`${style.link} ${isActive('/admin/doktor/Analyse') ? style.linkActive : ''}`}>
            Analiz Paneli
          </Link>
         {/* <Link 
              to={`/admin/doktor/DoktorStats/${localStorage.getItem('doktorId')}`} 
              className={`${style.link} ${isActive(`/admin/doktor/DoktorStats/${localStorage.getItem('doktorId')}`) ? style.linkActive : ''}`}
            >
                Günlük Analizi
          </Link> */}
          <div style={{width: '1px', height: '24px', background: '#e2e8f0', margin: '0 10px'}}></div>

          <Link to="/profile" className={`${style.link} ${isActive('/profile') ? style.linkActive : ''}`}>
            <i className="fa-regular fa-user" style={{marginRight: '6px'}}></i>{name} {Surname}
          </Link>
          
          <button onClick={handleLogout} className={`${style.link} ${style.logoutBtn}`}
            data-hover="Oturumu kapat">
            <i className="fa-solid fa-power-off"></i>
          </button>
        </div>
      </nav>
    </div>
  );
}
export default NavbarDoktor;


