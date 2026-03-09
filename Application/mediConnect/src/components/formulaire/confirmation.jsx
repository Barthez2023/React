import { useNavigate } from "react-router-dom";
import style from "./confirmation.module.css"
import { NameContext } from '../context/nameContext';
import { TimeContext } from '../context/timeContext';
import { useContext } from "react";

useContext
const Confirmation = ({
  selectedSpecialty,
  selectedDoctor,
}) => {
  const navigate = useNavigate();   
    if (!selectedDoctor) {                  //ici il y a une modification a faire si le pateint ne choisir pas de medecin on dois genere une erreur plus dynamique
        return (
            <div className={style.page}>
            <h2 style={{color: "white"}}>
                ⚠️ Aucun médecin sélectionné.
            </h2>
            <button onClick={() => navigate("/docteurs")}>
                Choisir un médecin
            </button>
            </div>
        );
  }
  const {patientName,setPatientName}=useContext(NameContext)
  const {rendevoustime}=useContext(TimeContext)
  return (
    <div className={style.page}>
      <div className={style.card}>
        <div className={style.icon}>✓</div>

        <h1 className={style.title}>Rendez-vous confirmé</h1>

        <p className={style.text}>
          Bonjour <strong>{patientName}</strong>,
        </p>

        <p className={style.text}>
          Votre rendez-vous en <strong>{selectedSpecialty}</strong> avec{" "}
          <strong>{selectedDoctor.name}</strong> a été confirmé avec succès.
        </p>

        <p className={style.date}>
          📅 Date du rendez-vous : <strong>{!rendevoustime ? "8h30" : rendevoustime}</strong>
        </p>

        <p className={style.footerText}>
          Merci d’avoir choisi <strong>MediConnect</strong> pour votre santé.
        </p>

        <button
          className={style.button}
          onClick={() => navigate("/rendezvous")}
        >
         Voir Mes Rendez-Vous
        </button>
      </div>
    </div>
  );
};

export default Confirmation;