import style from "./clinique.module.css"
import { useState } from "react";
const Clinique=()=>{
    // 2. Déclaration du State
    // 'count' est la valeur actuelle (ex: 0)
    // 'setCount' est la fonction pour modifier cette valeur
  const [count, setCount] = useState(0); 
  const ajouterPatient = () => {
    // 3. On utilise la fonction de modification
    setCount(count + 1);
  };
  const retirerPatient = () => {
    // 3. On utilise la fonction de modification
    if (count>0) {
        setCount(count - 1);
    }
  };


  const viderSalle = () => {
    setCount(0);
  };
    
    return(
        <div className={style.container}>
            <h1>MediConnect - Gestion de la Salle d'Attente</h1>
            <div className={style.patient}>
                Patients en attente : <strong>{count}</strong>
            </div>
            {/* 4. On lie les clics aux fonctions */}
            <button onClick={ajouterPatient} className={style.btnStyle}>
                Arrivée d'un patient
            </button>
             <button onClick={retirerPatient} className={style.btnStyle} style={{backgroundColor:'orange'}}>
                Depart d'un patient
            </button>
            <button onClick={viderSalle} className={style.btnStyle} style={{backgroundColor:'#e74c3c'}}>
                Vider la salle
            </button>
        </div>
    )
}

export default Clinique;