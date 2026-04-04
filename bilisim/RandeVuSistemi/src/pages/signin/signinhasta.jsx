import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './signinhasta.module.css'
import Select from "react-select";
import SuccessPopup from './popup';
import axios from 'axios';
function SignInPatient() {
  const navigate = useNavigate();

  // 1. İstenen tüm özelliklerle durumu başlatma
  const [formData, setFormData] = useState({
    Name: '',
    SurName: '',
    Birth: '',
    email: '',
    city: '',
    Il: '',
    Ilce: '',
    Durum: 'Genç', //default value
    Cinsiyet: '',
    telephone: '',
    password: '',
    confirmPassword: ''
  });

  // 2. A single function to manage all input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // We use the "spread operator" (...) to copy the old state
    // and we only overwrite the field that has changed [name]
    setFormData({
      ...formData,
      [name]: value
    });
  };

  //for fecth and get city infirmation using API
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [neighbourhoods, setNeighbourhoods] = useState([]);

  const [sehir, setSehir] = useState("");
  const [il, setIl] = useState("");

  useEffect(() => {
    fetch("https://beterali.com/api/v1/cities")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setCities(data.data.cities); 
      })
      .catch(err => console.log(err));
  }, []);

  // Loguer cities APRÈS sa mise à jour
  useEffect(() => {
    console.log('Type de cities:', typeof cities);
    console.log('cities est un tableau?', Array.isArray(cities));
    console.log('Valeur de cities:', cities);
    console.log('Nombre de villes:', cities.length);
  }, [cities]); // ← Se déclenche quand cities change

  const handleSehirChange = (e) => {
    const cityCode = e.target.value;
    setSehir(cityCode);
    setFormData({
      ...formData,
      city: cityCode
    });
    fetch(`https://beterali.com/api/v1/districts?city_code=${cityCode}`)
      .then(res => res.json())
      .then(data => {
        setDistricts(data.data.districts);
        setNeighbourhoods([]);
      });
  };

  const handleIlChange = (e) => {
    const districtCode = e.target.value;
    setIl(districtCode);
    setFormData({
      ...formData,
      Il: districtCode
    });

    fetch(`https://beterali.com/api/v1/neighbourhoods?districts_code=${districtCode}`)
      .then(res => res.json())
      .then(data => {
        setNeighbourhoods(data.data.neighbourhoods);
      });
  };

  //handler function for neighbourhood
  const handleIlceChange = (e) => {
    const neighbourhoodCode = e.target.value;
    setFormData({
      ...formData,
      Ilce: neighbourhoodCode
    });
  };


  //for include popup
  const [showPopup, setShowPopup] = useState(false);
  //use to send the data 
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple validation: password verification
    if (formData.password !== formData.confirmPassword) {
      alert("Girdiginiz sifre ayni almasi lazim ");
      return;
    }
    console.log("Données prêtes pour le PHP :", formData);
    setShowPopup(true);
      // Redirection après 3 secondes
      setTimeout(() => {
        navigate('/loginhasta');
    }, 3000);

    //permet la gestion de la base de donnees
    const response =await axios.post('http://localhost/BilisimTekno/signHasta.php',formData)
    console.log(response.data)               //for debugging

    
  };


 

  return (
    <div className={style.signinContainer}>
      <form className={style.signinForm} onSubmit={handleSubmit}>
        <h2 className={style.signinTitle}>Hasta Kaydı - Systemi</h2>
        
        {/* Utilisation d'une grille pour organiser les 12 champs */}
        <div className={style.formGrid}>
          
          <div className={style.inputGroup}>
            <label>Adi</label>
            <input type="text" name="Name" value={formData.Name} onChange={handleChange} required />
          </div>

          <div className={style.inputGroup}>
            <label>SoyAdi</label>
            <input type="text" name="SurName" value={formData.SurName} onChange={handleChange} required />
          </div>

          <div className={style.inputGroup}>
            <label>Doğum tarihi</label>
            <input type="date" name="Birth" value={formData.Birth} onChange={handleChange} required />
          </div>

          <div className={style.inputGroup}>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          {/* we use this to select the sehir */}
          <div className={style.inputGroup}>
            <label>Şehir</label>
            <select className={style.select_container}
              onChange={handleSehirChange} 
              value={sehir} 
              isSearchable={true} required
              name='city'
            > 
              <option  value="">Şehir Seçin</option>
              {cities.map((city)=>(
                <option key={city.city_code} value={city.city_code}>
                  {city.city_name}
                </option>
              ))}
            </select>
            {/* <input type="text" name="city" value={formData.city} onChange={handleChange} required /> */}
          </div>

          {/* we use this to select the il */}
          <div className={style.inputGroup}>
            <label>Il</label>
            {/* <input type="text" name="Il" value={formData.Il} onChange={handleChange} required /> */}
            <select value={il} 
              className={style.select_container}
              onChange={handleIlChange} 
              disabled={!sehir} 
              isSearchable={true} required
              name='Il'
            >
              <option value="">Il Seçin</option>
              {districts.map((district)=>(
                <option key={district.district_code} value={district.district_code}>
                  {district.district_name}
                </option>
              ))}
              
            </select>
          </div>

          {/* we use this to select the ilce */}

          <div className={style.inputGroup}>
            <label>Ilçe</label>
           <select  
              onChange={handleIlceChange} 
              className={style.select_container}
              disabled={!il} 
              isSearchable={true} 
              required
              name='Ilce'
            >
              <option value="">Ilçe Seçin</option>
              {neighbourhoods.map((neighbourhood) => (
                <option key={neighbourhood.neighbourhood_code} value={neighbourhood.neighbourhood_code}>
                  {neighbourhood.neighbourhood_name}
                </option>
              ))}
          </select>
            {/* <input type="text" name="Ilce" value={formData.Ilce} onChange={handleChange} required /> */}
          </div>

          <div className={style.inputGroup}>
            <label>Durum</label>
            <select name="Durum" value={formData.Durum} onChange={handleChange}>
              <option value="">Durunuz Seçin</option>
              <option value="yasli">Yaşlı</option>
              <option value="genc">Genç</option>
              <option value="cocuk">Çocuk</option>
              <option value="hamile">Hamile Kadın</option>
              <option value="engelli">Engelli</option>
            </select>
          </div>

          <div className={style.inputGroup}>
            <label>Çinsiyet</label>
            <select name="Cinsiyet" value={formData.Cinsiyet} onChange={handleChange}>
              <option value="">Cinsiyet Seçin</option>
              <option value="Erkek">Erkek</option>
              <option value="Kadin">Kadın</option>
            </select>
          </div>

          <div className={style.inputGroup}>
            <label>Telefon</label>
            <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required />
          </div>

          <div className={style.inputGroup}>
            <label>Şifre</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className={style.inputGroup}>
            <label>Şifre Tekralama</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

        </div>

        <button type="submit" className={style.signin_btn}>Hesabımı oluştur</button>
        <SuccessPopup 
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          message="Kaydınız onaylandı! "
          userName={formData.Name}
        />
        
        <p className={style.signinFooter}>
          Zaten kayıtlı mısınız? <span onClick={() => navigate('/loginhasta')}>Giriş yapmak</span>
        </p>
      </form>
    </div>
  );
}

export default SignInPatient;