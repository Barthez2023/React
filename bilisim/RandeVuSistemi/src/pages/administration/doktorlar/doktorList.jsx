import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './doktorList.module.css'; 
import KlinikCardPopup from './KlinikCard/KlinikCard';


function DoktorList() {
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [fetchedClinics, setFetchedClinics] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(" ");
  const handleClinicSelect = async (selectedClinic) => {
    try {
    // C'est ici qu'on appelle le PHP d'enregistrement
      const response = await axios.get(
        `http://localhost/BilisimTekno/setdoktorklinik.php?klinik_id=${selectedClinic.klinikid}&doctor_id=${selectedDoctorId}`
      );
      if (response.data.success) {
        // On met à jour l'affichage localement
        setPopupOpen(false);
        alert("Klinik başarıyla atandı!");
      }
    }
    catch (error) {
      console.error("Atama hatası:", error);
    }
  };
  const klinikver=(uzman_id,doctor_id)=>{
    const fetchData = async () => {
      setSelectedDoctorId(doctor_id); // 1. On mémorise quel docteur on traite
      console.log('Lid su medecin :',doctor_id)
      try {
          const response = await axios.get(`http://localhost/BilisimTekno/klinikverGetklinik.php?uzman=${uzman_id}&doctor_id=${doctor_id}`);
          setFetchedClinics(response.data.data);
          console.log('Les cliniques du medecins sont:',response.data)
          setPopupOpen(true); // ✅ On ouvre le modal une fois les données reçues
      } catch (error) {
          console.error("Yükleme hatası:", error);
      } finally {
          setLoading(false);
      }
      };
      fetchData();
  } 

  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get('http://localhost/BilisimTekno/doktorlist.php');
      setDoctors(res.data);
      console.log(res.data)
      console.log(doctors)
    };
    fetch();
  }, []);

  const deleteDoctor = async (id) => {
    if (window.confirm("Bu doktoru silmek istediğinize emin misiniz?")) {
      await axios.delete(`http://localhost/BilisimTekno/doktorlist.php?id=${id}`);
      setDoctors(doctors.filter(d => d.id !== id));
    }
  };

   //for fecth and get city infirmation using API
    const [cities, setCities] = useState([]);
    useEffect(() => {
      fetch("https://beterali.com/api/v1/cities")
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setCities(data.data.cities); 
        })
        .catch(err => console.log(err));
    }, []);

    const getCityNameByCode = (cities, code) => {
        if (!cities || cities.length === 0) return "Chargement...";
        const city = cities.find(c => String(c.city_code) === String(code));
        return city ? city.city_name : null;
  };

  // const klinikList = fetchedClinics && fetchedClinics !== '—' 
  //   ? fetchedClinics.split(', ') 
  //   : [];
  return (
    <div className={style.page}>
      {popupOpen && (
      <KlinikCardPopup
        cliniques={fetchedClinics}       // tableau { id, name, city }
        onConfirm={handleClinicSelect}    // reçoit l'objet clinique sélectionné
        onClose={() => setPopupOpen(false)}
      />
    )}
      <h2>Doktor Yönetimi</h2>
      <table className={style.adminTable}>
        <thead>
          <tr>
            <th>Is Numarasi</th>
            <th>Ad Soyad</th>
            <th>Uzmanlık</th>
            <th>Şehir</th>
            <th>Durum (Klinik)</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(doc => (
            <tr key={doc.id}>
              <td>{doc.worknumber}</td>
              <td>{doc.prenom} {doc.nom}</td>
              <td><strong>{doc.specialite}</strong></td>
              <td>{getCityNameByCode(cities,doc.city)}</td>
              <td>
                {/* Logique "En attente" demandée */}
                {doc.klinik ? (
                  <span className={style.statusOk}>🏥 {doc.klinik}</span>
                ) : (
                  <span className={style.statusWait}>⏳ Bekleme Durumu</span>
                )}
              </td>
              <td>
                <button className={style.btn} onClick={()=>{klinikver(doc.specialiteId,doc.id)}}>Klinik Ver</button>
                <button onClick={() => navigate(`/doktor/stats/${doc.id}`)}>📊 Stats</button>
                <button onClick={() => deleteDoctor(doc.id)} className={style.delBtn}>🗑️ Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default  DoktorList;
