import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import style from './nav.module.css'
function NavbarHasta() {
  const isActive = (path) => location.pathname === path;
  return (
    <nav className={style.navbar}>
      
      {/* Partie gauche */}
      <div className={style.left}>
        <Link to="/"  className={`${style.logo} ${isActive('/') ? style.linkActive : ''}`}><i className={`${style.badge} fa-solid fa-house `}></i></Link>
      </div>

      {/* Partie droite */}
      <div className={style.right}>
        <Link to="/klinikList" className={`${style.link} ${isActive('/klinikList') ? style.linkActive : ''}`}>Klinikler</Link>
        <Link to="/klinik" className={`${style.link} ${isActive('/randevularim') ? style.linkActive : ''}`}>Randevularım</Link>
        <Link to="/klinik" className={`${style.link} ${isActive('/gecmis-randevularim') ? style.linkActive : ''}`}>Geçmiş Randevularım </Link>
      </div>

    </nav>
  );
}
export default NavbarHasta;