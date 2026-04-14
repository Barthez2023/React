import { BrowserRouter as Router, Routes, Route, Link ,useNavigate,useLocation} from 'react-router-dom';
import { useState} from 'react'
import style from './navbar.module.css'


function NavbarHasta() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const navigate=useNavigate()
  const handleLogout = () => {
    // Ta logique de déconnexion ici (ex: localStorage.clear())
    navigate('/logindoktor');
  };
  const name = localStorage.getItem('hastaname');
  const Surname = localStorage.getItem('hastasurname');
  return (
    <div style={{marginBottom:'60px'}}>
      <nav className={style.navbar}>
        
        {/* Logo / Home */}
        <div className={style.left}>
          <Link to="/hasta/welcome" className={style.logo}>
            <i className={`${style.badge} fa-solid fa-house-medical`}></i>
            <span style={{marginLeft: '10px', color: '#1e293b', fontWeight: 'bold',fontSize:'25px',textTransform:'uppercase'}}>RandeVu Sistemi bağlayın</span>
          </Link>
        </div>

        {/* Menu Principal */}
        <div className={style.right}>
          <Link to="/hasta/welcome" className={`${style.link} ${isActive('/hasta/welcome') ? style.linkActive : ''}`}>
            Home
          </Link>
          <Link to="/hasta/klinik" className={`${style.link} ${isActive('/hasta/klinik') ? style.linkActive : ''}`}>
            Klinikler
          </Link>
          <Link to="/hasta/randevularim" className={`${style.link} ${isActive('/hasta/randevularim') ? style.linkActive : ''}`}>
            Randevularim
          </Link>
          <Link to="/hasta/gecmisrandevular" className={`${style.link} ${isActive('/hasta/gecmisrandevular') ? style.linkActive : ''}`}>
            Geçmiş randevularim
          </Link>
          
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
export default NavbarHasta;


