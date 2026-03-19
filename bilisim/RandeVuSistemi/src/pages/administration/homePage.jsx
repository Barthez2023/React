import React from 'react';
import style from './homePage.module.css'
import NavbarAmin from './navBarAdmin';

function AdminHomePage() {
  return (
    <div className={style.dashboard}>
        <NavbarAmin/>
        <p>bienvenue</p>
        <p>
            ici on vas mettre un inventaire et les statistique en rapport avec le systeme
        </p>
    </div>
  );
}

export default AdminHomePage;