import { useNavigate } from "react-router-dom";
import style from "./docteurList.module.css"
import { useState,useEffect } from "react";

function DoctorListFiltre({handleSelectDoctor,selectedSpecialty,setRendeVousTime,rendevoustime}) {
  const [doctor, setDoctors] = useState([]); // Liste vide au début search

  const doctors = [
        { id: 1, name: "Dr. Elena Rossi", specialty: "Cardiologie", available: true },
        { id: 2, name: "Dr. Marc Lefebvre", specialty: "Dentisterie", available: false },
        { id: 3, name: "Dr. Sarah Cohen", specialty: "Pédiatrie", available: true },
        { id: 4, name: "Dr. Thomas Muller", specialty: "Généraliste", available: true },
        { id: 5, name: "Dr. John Don", specialty: "Généraliste", available: false },
        { id: 6, name: "Dr. Jean Paul", specialty: "Ophtamalogie", available: false }
    ];
    // --- LOGIQUE DE FILTRAGE 
    // On filtre la liste des docteurs en fonction de ce qui est tapé
    const filteredDoctors = doctors.filter(doc => 
        // doc.specialty.toLowerCase().includes(search.toLowerCase()) && selectedSpecialty === "" ? true : doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())   //permet d'utiliser la recherche te le select de form
        // selectedSpecialty === "" ? true : doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())   //permet d'utiliser la recherche te le select de form
        {
            const matchSpecialty =
            selectedSpecialty === "" ||
            doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());

            return matchSpecialty;

        }
    );
    
    //fonction qui recupere le temps du rendez-vous
     //fonction pour recupere la valeur du la specialite du docteur
    const handlerendevousTime = (e) => {
        setRendeVousTime(e.target.value);
    };
    if (!selectedSpecialty) {
        return null
    }
  return (
    <div className={style.containerStyle}>
      <div>
            <h2 style={{ margin: '10px 0', textAlign: 'center' }}>Médecins de la clinique</h2>
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
export default DoctorListFiltre;