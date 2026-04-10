import React, { useState,useEffect,useRef } from 'react';
import ClinicCard from './ClinicCard';
import  style from './klinik.module.css'
import axios from 'axios';
import NavbarHasta from '../navbar/navBarHasta';
import UzmanlikPopup from './uzmanlikSec';

function KlinikList() {
  // const [clinics,setClinics] = useState([
  //   {
  //     id: 1,
  //     name: "Hôpital Central d'Istanbul",
  //     city: "Istanbul",
  //     description: "Centre hospitalier de référence offrant des soins spécialisés dans toutes les branches médicales avec équipements de dernière génération.",
  //     horaire: "Lun-Sam 08h-18h30",
  //     branches: '00',
  //     doctors: '00',
  //     rating: "0.0"
  //   },
  //   {
  //     id: 2,
  //     name: "Clinique Santé Ankara",
  //     city: "Ankara",
  //     description: "Établissement moderne spécialisé en pédiatrie et cardiologie, reconnu pour son excellence médicale et son approche personnalisée.",
  //     horaire: "Lun-Dim 24h/24",
  //     branches: '00',
  //     doctors: '00',
  //     rating: "0.0"
  //   },
  //   {
  //     id: 3,
  //     name: "Hôpital Médical Izmir",
  //     city: "Izmir",
  //     description: "Plus de 20 ans d'expertise en chirurgie générale et soins intensifs, avec une équipe médicale hautement qualifiée.",
  //     horaire: "Lun-Sam 08h-18h30",
  //     branches: '00',
  //     doctors: '00',
  //     rating: "0.0"
  //   },
  //   {
  //     id: 4,
  //     name: "Hôpital Médical Konya",
  //     city: "Konya",
  //     description: "Plus de 20 ans d'expertise en chirurgie générale et soins intensifs, avec une équipe médicale hautement qualifiée.",
  //     horaire: "Lun-Sam 08h-18h30",
  //     branches: '00',
  //     doctors: '00',
  //     rating: "0.0"
  //   }
  // ]);
  const [klinikler,setKlinikler]=useState({})
  const hasFetched = useRef(false); // Flag pour éviter double appel de useEffectţ conditionner par le strict mode
  //ce useEfect est utiliser pour mettre des elements(des cliniques dans notre base de donnees)
  /*useEffect(() => {
    // Si le useEffect s'est déjà exécuté une fois , on arrête
      if (hasFetched.current) 
        return;
      hasFetched.current = true;
    const fetchHospitals = async () => {

      try {

        await new Promise(resolve => setTimeout(resolve, 2000));
        const url = "https://overpass-api.de/api/interpreter?data=[out:json];node['amenity'='hospital'](37.8300,32.4000,38.0500,32.7000);out 10;";
        const response = await axios.get(url);
        console.log(response.data.elements);
        const hospitals = response.data.elements;
          console.log(`${hospitals.length} Le nombre d'hopitaux trouvés:`, hospitals);
          //ÉTAPE 2 : Mettre à jour l'état React
          setKlinikler('');
        const result = await axios.post("http://localhost/BilisimTekno/clinic.php", {
          klinikler: hospitals  // ← Envoyer les données récupérées, pas l'état vide
        });
      } catch (error) {
        console.error("Erreur API :", error);
      }
    };
    

    fetchHospitals();

  }, []);*/



  //permet de recuperer les donnes dans la data base et l'utiliser dans mon programme
  const[klinikDB,setKlinikDB]=useState([])    //stocke les donnes recuperer dans la database
  useEffect(() => {
    const fetchKlinikler = async () => {
      try {
        const response = await axios.get("http://localhost/BilisimTekno/getklinik.php");
        // Supposons que la réponse soit de la forme { success: true, data: [...] }
        if (response.data.success) {
          setKlinikDB(response.data.data); // mettre toutes les cliniques dans l'état
          console.log("klinikler Db ",response.data.data)
        } else {
          console.error("Erreur serveur :", response.data.message);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      }
    };

    fetchKlinikler();
  }, []); // [] signifie que ça s'exécute une seule fois au montage

  // useEffect 2 : S'exécute CHAQUE FOIS que klinikDB change permet de suivre l'evolution de klinikDB
  useEffect(()=>{
    console.log("klinik database ",klinikDB)
  },[klinikDB])

  const [search, setSearch] = useState(""); // On on garde l'element que l'on veut recherche
  // S'exécute à CHAQUE FOIS que 'search' change
  useEffect(() => {
        if (search !== "") {
            console.log(`🔍 Log de monitoring : Recherche en cours pour "${search}"`);
        }
    }, [search]); // On "observe" la variable search


  const filteredKlinik = klinikDB.filter((klinik) =>
    klinik.name.toLowerCase().includes(search.toLowerCase())
  );


  //permet de selectionner la clinique  afin d'afficher le popup au bon endroit
  const [selectedKlinik, setSelectedKlinik] = useState(null);

  return (
    <div className={style.clinic_explorer}>
      <header className={style.explorer_header}>
        <div className={style.header_content}>
          {/* <span className={style.header_subtitle}>Système de santé premium</span> */}
          <div className={style.logo_badge}><i className="fa-solid fa-hospital" style={{fontSize:'40px'}}></i></div>
          <h1 className={style.header_title}>Sağlık Kliniklerimiz</h1>
          <p className={style.header_description}>
            En son teknolojiyle donatılmış ve nitelikli sağlık uzmanları 
            tarafından hizmet verilen tıp merkezlerimizi keşfedin.
          </p>
        </div>
        
        <div className={style.header_search}>
          <svg viewBox="0 0 24 24" fill="currentColor" className={style.search_icon}>
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input 
            type="text" 
            placeholder="Klinik, şehir veya uzmanlık alanı olarak arayın..."
            onChange={(e) => setSearch(e.target.value)}
            className={style.search_input}
          />
        </div>
      </header>

      <div className={style.clinic_grid}>
        {filteredKlinik.length > 0 ? (
            filteredKlinik.map((item) => (
              <ClinicCard key={item.id} clinic={item}
                onOpenPopup={() => setSelectedKlinik(item)}
              />
            ))
          ) : (
            <p className={style.yok_klinik}>Bu isimde bir klinik yok.</p>
          )}

          {selectedKlinik && (
              <UzmanlikPopup 
                klinik={selectedKlinik} 
                onClose={() => setSelectedKlinik(null)} 
              />
          )}
      </div>
    </div>
  );
}
export default KlinikList