import React, { useState } from 'react';
import style from "./formulaire.module.css"
import { useNavigate } from 'react-router-dom';

const Formulaire=({handleSelectDoctor,selectedDoctor,selectedSpecialty,setSelectedSpecialty,rendevoustime,patientName,setPatientName})=>{
  // 2. Un State pour confirmer le rendez-vous
  const [isConfirmed, setIsConfirmed] = useState(false);
  //3. Recupere la specialite du medecin choisir
  // const [specialite, setSpecialite] = useState("");                   -*****************-

  // Fonction appelée à chaque lettre tapée
  const handleNameChange = (event) => {
    // On met à jour le state avec ce qui est écrit dans l'input
    setPatientName(event.target.value);
  };
  //fonction pour recupere la valeur du la specialite du docteur
    const handleSpecialiteChange = (e) => {
        setSelectedSpecialty(e.target.value);
    };

  const handleConfirm = () => {
    if (patientName.length > 2) {
      setIsConfirmed(true);
      navigate("/confirmation")
    } else {
      alert("Veuillez entrer un nom valide.");
    }
  };
  const navigate=useNavigate()
  // const handleclick=()=>{
  //   navigate("/confirmation")
  // }
  return (
    <div className={style.container}>
      <h1>MediConnect - Prise de Rendez-vous</h1>

      {!isConfirmed ? (
        // --- ZONE FORMULAIRE ---
        <div className={style.formBoxStyle}>
          <label>Nom du Patient : </label>
          <input 
            type="text" 
            placeholder="Ex: Jean Dupont"
            value={patientName} // L'input lit la valeur du State
            onChange={handleNameChange} // L'input appelle la fonction au changement
            className={style.inputStyle}
          />
           <select name="" id="" className={style.selectStyle}
           value={selectedSpecialty}
           onChange={handleSpecialiteChange}
           >
                <option value="Cardiologie">Cardiologie</option>
                <option value="Dentisterie">Dentisterie</option>
                <option value="Pédiatrie">Pédiatrie</option>
                <option value="Généraliste">Généraliste</option>
                <option value="Ophtamalogie">Ophtamalogie</option>
           </select>
          <p>Aperçu du badge : <strong>{patientName}</strong>  , {selectedDoctor?.name || "Aucun médecin sélectionné"}</p>
          <button onClick={handleConfirm} className={style.btnStyle}>
            Confirmer le rendez-vous
          </button>
          {/* <button onClick={handleclick} className={style.btnStyle}>
            autre page
          </button> */}
        </div>
      ) : (
        // --- ZONE CONFIRMATION ---
        // <div className={style.successBoxStyle}>
        //   <h2>✅ Rendez-vous confirmé !</h2>
        //   <p>Merci <strong>{patientName}</strong>, le <strong>{!selectedSpecialty?"Cardiologue":selectedSpecialty}</strong> <strong>{selectedDoctor.name}</strong> va vous recevoir a <strong>{rendevoustime}</strong>.</p>
        //   <button onClick={() => setIsConfirmed(false)} className={style.backBtn}>
        //     Modifier les informations
        //   </button>
        // </div>
        <p></p>
      )}
    </div>
  );
}

export default Formulaire;