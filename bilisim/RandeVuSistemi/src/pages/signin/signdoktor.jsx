import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './signinhasta.module.css'
import Select from "react-select";
import SuccessPopup from './popup';
import axios from 'axios';
function SignInDoktor() {
  const navigate = useNavigate();

  // 1. İstenen tüm özelliklerle durumu başlatma
  const [formData, setFormData] = useState({
    Name: '',
    SurName: '',
    Birth: '',
    email: '',
    city: '',
    workNumber:'',
    speciality:'',
    telephone: '',
    password: '',
    confirmPassword: '',
    id_uzmanlik:''
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
  const [sehir, setSehir] = useState("");

  useEffect(() => {
    fetch("https://beterali.com/api/v1/cities")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setCities(data.data.cities); 
      })
      .catch(err => console.log(err));
  }, []);

  const handleSehirChange = (e) => {
    const cityCode = e.target.value;
    setSehir(cityCode);
    setFormData({
      ...formData,
      city: cityCode
    });
  };

  //for include popup
  const [showPopup, setShowPopup] = useState(false);
  const[uzmanlikid,setUzmanlikid]=useState("");
  const[uzmanlikname,setUzmanlikname]=useState("");

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
        navigate('/logindoktor');
    }, 3000);
    //permet la gestion de la base de donnees
    const response =await axios.post('http://localhost/BilisimTekno/signDoktor.php',{
      ...formData,
      uzmanlik_id:uzmanlikid,
      uzmanlik_name:uzmanlikname
    })
    console.log(response.data)               //for debugging
  };


  const[uzmanlik,setUzmanlik]=useState([])
  useEffect(() => {
    const uzmanliksec=async(e)=>{
      const response =await axios.post('http://localhost/BilisimTekno/uzmanliklist.php')
      console.log('Les uzmanlik sont :',response.data)               //for debugging
      setUzmanlik(response.data.data)
    }
    uzmanliksec();
  }, []);

  return (
    <div className={style.signinContainer}>
      <form className={style.signinForm} onSubmit={handleSubmit}>
        <h2 className={style.signinTitle}>Doktor Kaydı - Systemi</h2>
        
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
          <div className={style.inputGroup}>
            <label>Work Number</label>
            <input type="text" name="workNumber" value={formData.workNumber} onChange={handleChange} required />
          </div>
         
          {/* <div className={style.inputGroup}>
            <label>Uzmanlık</label>
            <select name="speciality" value={formData.speciality} onChange={handleChange}>
              <option value="">uzmanlik Seçin</option>
              <option value="Kardiyoloji">Kardiyoloji</option>
              <option value="Nöroloji">Nöroloji</option>
              <option value="Ortopedi">Ortopedi</option>
              <option value="Dermatoloji">Dermatoloji</option>
              <option value="Göz">Göz Hastalıkları</option>
            </select>
          </div> */}

          <div className={style.inputGroup}>
            <label>Uzmanlık</label>
            <select name="speciality" value={formData.speciality} onChange={(e)=>{
              handleChange(e);
              // On trouve l'ID : si la value de l'option est l'ID, e.target.value sera l'ID
              const selectedId = e.target.value;
              // 1. On trouve l'objet complet dans la liste des spécialités
              const selectedSpecialty = uzmanlik.find(u => u.id == selectedId);
              // 2. On met à jour l'ID pour le formulaire
              handleChange(e);
              setUzmanlikid(selectedId);
              // 3. On stocke aussi le nom (dans un autre state ou dans formData)
              if (selectedSpecialty) {
                setUzmanlikname(selectedSpecialty.nom); 
              }
            }}>
              <option value="">uzmanlik Seçin</option>
              {
                uzmanlik.map((uzman)=>(
                  <option value={uzman.id} key={uzman.id}>{uzman.nom}</option>
                ))
              }
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
          Zaten kayıtlı mısınız? <span onClick={() => navigate('/logindoktor')}>Giriş yapmak</span>
        </p>
      </form>
    </div>
  );
}

export default SignInDoktor;