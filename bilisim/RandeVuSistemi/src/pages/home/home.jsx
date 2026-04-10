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
        <h1>RANDEVU SISTEMI'ye hoş geldiniz</h1>
        <p>Ulusal Klinik Yönetim Sistemi</p>
        <div className={style.underline}></div>
      </header>

      <div className={style.role_grid}>
        {/* Carte 1 : Patient */}
        <div className={`${style.role_card } ${style.patient}`} onClick={() => handleRoleChoice('patient')}>
          <div className={style.role_icon}>👤</div>
          <h2>Hasta Alanı</h2>
          <p>Randevularınızı planlayın ve tıbbi geçmişinizi gözden geçirin.</p>
          <button className={style.role_btn}>Hastaysanız buraya tıklayın.</button>
        </div>

        {/* Carte 2 : Docteur */}
        <div className={`${style.role_card } ${style.doctor}`} onClick={() => handleRoleChoice('doctor')}>
          <div className={style.role_icon}>🩺</div>
          <h2>Doktor Alanı</h2>
          <p>Müsaitlik durumunuzu yönetin ve günlük görüşmelerinizi takip edin.</p>
          <button className={style.role_btn}>Doktorsanız buraya tıklayın.</button>
        </div>

        {/* Carte 3 : Administrateur */}
        <div className={`${style.role_card } ${style.admin}`}onClick={() => handleRoleChoice('admin')}>
          <div className={style.role_icon}>⚙️</div>
          <h2>Yönetim</h2>
          <p>GKlinikleri, hesapları ve ulusal istatistikleri inceleyin.</p>
          <button className={style.role_btn}>Yöneticiyseniz buraya tıklayın.</button>
        </div>
      </div>

      <footer className={style.role_footer}>
        Sağlığınızı korumamıza yardımcı olun. Lütfen kendinizi doğru şekilde tanıtın.
      </footer>
    </div>
  );
}

export default Home;