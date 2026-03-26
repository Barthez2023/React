import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './home.module.css'

function Home() {
  const navigate = useNavigate();

  // Fonction pour diriger vers le bon circuit
  // Note pour tes camarades : On passe le "role" en paramètre pour plus de flexibilité
  const handleRoleChoice = (role) => {
    console.log("Rôle choisi :", role);
    
    if (role === 'admin') {
      navigate('/loginadmin'); // Zone spécifique Admin
    } else if (role === 'doctor') {
      navigate('/doctor'); // Zone spécifique Docteur
    } else {
      navigate('/hasta'); // Zone Patient (la page qu'on a créée au début)
    }
  };

  return (
    <div className={style.role_container}>
      <header className={style.role_header}>
        <h1>Bienvenue sur RENDEVU SISTEMI</h1>
        <p>Système National de Gestion des Cliniques</p>
        <div className={style.underline}></div>
      </header>

      <div className={style.role_grid}>
        {/* Carte 1 : Patient */}
        <div className={`${style.role_card } ${style.patient}`} onClick={() => handleRoleChoice('patient')}>
          <div className={style.role_icon}>👤</div>
          <h2>Espace Patient</h2>
          <p>Prenez vos rendez-vous et consultez votre historique médical.</p>
          <button className={style.role_btn}>Cliquez ici si vous êtes un malade</button>
        </div>

        {/* Carte 2 : Docteur */}
        <div className={`${style.role_card } ${style.doctor}`} onClick={() => handleRoleChoice('doctor')}>
          <div className={style.role_icon}>🩺</div>
          <h2>Espace Médecin</h2>
          <p>Gérez vos disponibilités et suivez vos consultations quotidiennes.</p>
          <button className={style.role_btn}>Cliquez ici si vous êtes un docteur</button>
        </div>

        {/* Carte 3 : Administrateur */}
        <div className={`${style.role_card } ${style.admin}`}onClick={() => handleRoleChoice('admin')}>
          <div className={style.role_icon}>⚙️</div>
          <h2>Administration</h2>
          <p>Gérez les cliniques, les comptes et les statistiques nationales.</p>
          <button className={style.role_btn}>Cliquez ici si vous êtes l'administrateur</button>
        </div>
      </div>

      <footer className={style.role_footer}>
        Aidez-nous à protéger votre santé. Identifiez-vous correctement.
      </footer>
    </div>
  );
}

export default Home;