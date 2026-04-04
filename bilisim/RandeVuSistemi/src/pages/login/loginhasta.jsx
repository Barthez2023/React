import style from './loginhasta.module.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginHasta() {
  const navigate = useNavigate();

  // 1. État pour stocker l'email et le mot de passe
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // 2. État pour afficher une erreur si la connexion échoue
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async(e) => {
    e.preventDefault();
    setError(""); // On réinitialise l'erreur
    // SIMULATION : Vérification simplifiée et dirige l'utilisateur vers la page des cliniques du pays

    try {
      const response =await axios.post('http://localhost/BilisimTekno/loginHasta.php',credentials)
        if (response.data.success){
          console.log(response.data)               //for debugging
          // 1. On stocke les infos dans le localStorage pour s'en souvenir
          localStorage.setItem('hastaId', response.data.user?.id);
          localStorage.setItem('hastaname', response.data.user?.name);
          localStorage.setItem('hastasurname', response.data.user?.surname);
           // 2. On redirige vers la page de bienvenue (Dashboard)
          navigate('/doktor/hasta')
        }
        else {
          console.log('pas de donnees')
          console.log(response.data) 
          // setError("Email ou mot de passe incorrect. Veuillez réessayer.");
          setError(response.data.message);

        }
    } catch (error) {
      console.error(error);
      setError("Erreur serveur. Veuillez réessayer plus tard.");
    }
  };

  //permet de gerer le password avec le  checkbox
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={style.login_container}>
      <div className={style.login_card}>
        <div className={style.login_header}>
          <div className={style.logo_badge}><i className="fa-solid fa-hospital" style={{fontSize:'40px'}}></i></div>
          <h2>Bağlantı Devam Ediyor</h2>
          <p>Randevularınızı yönetmek için giriş bilgilerinizi girin.</p>
        </div>

        {/* Affichage de l'erreur si elle existe */}
        {error && <div className={style.error_banner}>{error}</div>}

        <form className={style.login_form} onSubmit={handleLogin}>
          <div className={style.input_field}>
            <label htmlFor="email">E-posta adresi</label>
            <input 
              type="email" 
              id="email"
              name="email" 
              placeholder="exemple@mail.com"
              value={credentials.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={style.input_field}>
            <label htmlFor="password">Şifre</label>
            <input 
              type={showPassword ? "text" : "password"} 
              id="password"
              name="password" 
              placeholder="••••••••"
              value={credentials.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={style.login_options}>
            <label><input type="checkbox" onChange={() => setShowPassword(!showPassword)}/> Şifre Goster</label>
            <span>Şifrenizi mi unuttunuz?</span>
          </div>

          <button type="submit" className={style.submit_btn}>
            Giriş Yap
          </button>
        </form>

        <p className={style.login_redirect}>
          Yeni misiniz? <span onClick={() => navigate('/signinhasta')}>Bir hesap Oluşturun</span>
        </p>
      </div>
    </div>
  );
}

export default LoginHasta;