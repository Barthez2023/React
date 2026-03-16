import style from './AuthHome.module.css'  // CSS'yi içe aktarma
import React from 'react';
import { useNavigate } from 'react-router-dom';

function AuthHomeHasta() {
    const navigate=useNavigate()
    const handlesign = (e) => {
        navigate('/signinhasta');
    };
    const handlelogin = (e) => {
        navigate('/loginhasta');
    };

  return (
    <div className={style.auth_container}>
      {/*Sisteme genel bakış bölümü*/}
      <header className={style.auth_hero}>
        <div className={style.logo_badge}><i className="fa-solid fa-hospital" style={{fontSize:'40px'}}></i></div>
        <h1 className={style.system_title}>HASTENE RENDEVU SISTEMI</h1>
        <p className={style.system_description}>
          Ülke genelindeki tüm klinikleri bir araya getiren, herhangi bir tesiste randevu almayı kolaylaştıran merkezi bir ulusal portal. 
          Ülkenin neresinde olursanız olun, en iyi bakıma hızlıca erişin.
        </p>
      </header>

      {/* İşlemler bölümü (Düğmeler)*/}
      <section className={style.auth_actions}>
        <div className={style.action_card}>
          <h2>Zaten Kayıtlı?</h2>
          <p>Randevularınızı yönetmek için kişisel hesabınıza giriş yapın.</p>
          <button className={`${style.btn} ${style.btn_login}`} onClick={handlelogin}>Giriş yapmak(Login)</button>
        </div>

        <div className={style.action_card}>
          <h2>Burada yeni misin?</h2>
          <p>Ülke  kliniklere erişmek için hesabınızı oluşturun.</p>
          <button className={`${style.btn} ${style.btn_signup}`} onClick={handlesign}>Kayıt olmak(Sign Up)</button>
        </div>
      </section>

      <footer className={style.auth_footer}>
        &copy; 2026 Sağlık Bakanlığı - Klinik Yönetim Sistemi
      </footer>
    </div>
  );
}

export default AuthHomeHasta;