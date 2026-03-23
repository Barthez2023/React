import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './doktorList.module.css'; 

function DoktorList() {
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

  return (
    <div className={style.page}>
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
                <button className={style.btn}>Klinik Ver</button>
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
