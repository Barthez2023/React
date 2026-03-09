import { useNavigate } from "react-router-dom";
import style from "./docteurList.module.css"
import { useState,useEffect, useContext } from "react";
import { TimeContext } from "../context/timeContext";

function DoctorList({handleSelectDoctor}) {
  const [doctor, setDoctors] = useState([]); // Liste vide au début search
  const [loading, setLoading] = useState(true); // On commence en mode chargement
  const [search, setSearch] = useState(""); // On on garde l'element que l'on veut recherche


  useEffect(() => {
    // 1. On simule un appel API avec setTimeout
    console.log("Appel au serveur en cours...");
    const fetchDoctors = () => {
      setTimeout(() => {
        // 1. Simulation de données reçues (souvent d'une API ou d'une DB PHP)
        const doctors = [
            { id: 1, name: "Dr. Elena Rossi", specialty: "Cardiologie", available: true },
            { id: 2, name: "Dr. Marc Lefebvre", specialty: "Dentisterie", available: false },
            { id: 3, name: "Dr. Sarah Cohen", specialty: "Pédiatrie", available: true },
            { id: 4, name: "Dr. Thomas Muller", specialty: "Généraliste", available: true },
            { id: 5, name: "Dr. John Don", specialty: "Généraliste", available: false },
            { id: 6, name: "Dr. Jean Paul", specialty: "Ophtamalogie", available: false }
        ];

        setDoctors(doctors); // On range les données reçues
        setLoading(false); // On arrête le mode chargement
      }, 1500); // 1.5 secondes de délai
    };

    fetchDoctors();
  }, []); // 2. [] signifie : "Fais ça une seule fois au démarrage"

    // --- EFFECT 2 : Surveillance de la recherche (LOG) ---
    // S'exécute à CHAQUE FOIS que 'search' change
    useEffect(() => {
        if (search !== "") {
            console.log(`🔍 Log de monitoring : Recherche en cours pour "${search}"`);
        }
    }, [search]); // On "observe" la variable search
    
    // --- LOGIQUE DE FILTRAGE 
    // On filtre la liste des docteurs en fonction de ce qui est tapé
    const filteredDoctors = doctor.filter(doc => 
        // doc.specialty.toLowerCase().includes(search.toLowerCase()) && selectedSpecialty === "" ? true : doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())   //permet d'utiliser la recherche te le select de form
        // selectedSpecialty === "" ? true : doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())   //permet d'utiliser la recherche te le select de form

        {
            const matchSearch =
            search === "" ||
            doc.specialty.toLowerCase().includes(search.toLowerCase());

            // const matchSpecialty =
            // selectedSpecialty === "" ||
            // doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
            // return matchSearch && matchSpecialty;

            return matchSearch

        }
        

    );
    // 3. Affichage conditionnel pendant l'attente
    if (loading) {
        return <div style={loaderStyle}>⌛ Chargement des médecins en cours...</div>;
    }
    const {setRendeVousTime,rendevoustime}=useContext(TimeContext)   //utilisation des context

    //fonction qui recupere le temps du rendez-vous
     //fonction pour recupere la valeur du la specialite du docteur
    const handlerendevousTime = (e) => {
        setRendeVousTime(e.target.value);
    };
  return (
    <div className={style.containerStyle}>
      <div className={style.titre}>
            <h2>Médecins de la clinique</h2>
            <input type="text" value={search} 
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Recherche"/>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {/* 2. On utilise .map() pour transformer chaque docteur en <li> */}
        {filteredDoctors.length>0 ?(
            filteredDoctors.map((doc) => (
          <li key={doc.id} className={style.cardStyle}>
            <div>
                <strong>{doc.name}</strong> - {doc.specialty}
            </div>
            {/* 3. Affichage conditionnel de la disponibilité */}
            {/* <span style={{ color: doc.available ? 'green' : 'red' }}>
                        {doc.available ? "● Disponible" : "○ Occupé"}
            </span> */}
            <div>
                {doc.available ? (
                    <div>
                        <button className={style.btnStyle} onClick={()=>handleSelectDoctor(doc)}>Prend rendez-vous</button>
                        <select name="" id="" className={style.selectStyle} onChange={handlerendevousTime} value={rendevoustime}>
                            <option value="08h30">08h30</option>
                            <option value="10h30">10h30</option>
                            <option value="12h30">12h30</option>
                            <option value="14h30">14h30</option>
                            <option value="16h30">16h30</option>
                            <option value="18h30">18h30</option>
                            <option value="20h30">20h30</option>
                        </select>
                    </div>
                ):(
                    <div>
                        <button className={style.btnStyle} style={{backgroundColor:'red' ,cursor:'not-allowed'}} onClick={()=>handleSelectDoctor(doc)} disabled>Indisponible</button>
                        <select name="" id="" className={style.selectStyle} disabled style={{cursor:'not-allowed'}}>
                            <option value="08h30">08h30</option>
                            <option value="10h30">10h30</option>
                            <option value="12h30">12h30</option>
                            <option value="14h30">14h30</option>
                            <option value="16h30">16h30</option>
                            <option value="18h30">18h30</option>
                            <option value="20h30">20h30</option>
                        </select>
                    </div>
                )}
            </div>
          </li>
            ))

            ):(
                <li>Aucun médecin trouvé pour cette spécialité.</li>
            )
        }
        
      </ul>
    </div>
  );
}

const loaderStyle = { fontStyle: 'italic', color: '#3498db', padding: '20px' };
export default DoctorList;