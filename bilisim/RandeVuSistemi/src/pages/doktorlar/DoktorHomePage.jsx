import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarDoktor from './navbar';

function WelcomeDoktor() {
    const navigate = useNavigate();
    // On récupère le nom stocké lors du login
    const name = localStorage.getItem('doktorName');
    const Surname = localStorage.getItem('doktorSurName');

    return (
        <div style={{ textAlign: 'center', fontFamily: 'Arial'}}>
            <NavbarDoktor/>
            {/* <h1>👋 Hoş geldiniz, Dr. {name} {Surname} !</h1>
            <p>Système de gestion hospitalière est prêt pour vous.</p>
            
            <div style={{ marginTop: '30px' }}>
                <button onClick={() => navigate('/doktor/appointments')}>
                    Voir mes rendez-vous
                </button>
                <button onClick={() => {
                    localStorage.clear(); // Déconnexion
                    navigate('/logindoktor');
                }} style={{ marginLeft: '10px', color: 'red' }}>
                    Se déconnecter
                </button>
            </div> */}
        </div>
    );
}

export default WelcomeDoktor;