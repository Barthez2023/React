import React from 'react';
import style from './navbar.module.css';

const NavbarDoktor = ({ onLogout }) => {
  return (
    <nav className={style.navbar}>
      <div className={style.navbar_container}>
        {/* Logo / Nom de l'application */}
        <div className={style.navbar_logo}>
          <a href="/">Hastane<span>Panel</span></a>
        </div>

        {/* Liens de navigation principaux */}
        <ul className={style.navbar_menu}>
          <li>
            <a href="/home" className={style.nav_link}>Home</a>
          </li>
          <li>
            <a href="/today" className={style.nav_link}>Rendez-vous d'aujourd'hui</a>
          </li>
          <li>
            <a href="/history" className={style.nav_link}>Rendez-vous passés</a>
          </li>
        </ul>

        {/* Zone utilisateur (Profil & Déconnexion) */}
        <div className={style.navbar_user_actions}>
          <a href="/profile" className={style.profile_btn}>Mon Profil</a>
          <button onClick={onLogout} className={style.logout_btn}>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDoktor;