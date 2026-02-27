import React, { useContext, useReducer } from 'react';
import { appointmentReducer } from '../../reducers/appointmentReducer';
import style from './mesRendezVous.module.css'
import { NameContext } from '../context/nameContext';
import { TimeContext } from '../context/timeContext';


function AppointmentManager({selectedSpecialty,selectedDoctor}) {
  // state : la liste des RDV
  // dispatch : la fonction pour envoyer des ordres
  const [appointments, dispatch] = useReducer(appointmentReducer, []);
  const {patientName}=useContext(NameContext)
  const {rendevoustime}=useContext(TimeContext)

  const handleAdd = () => {
    const newAppointment = { id: Date.now(), patient:{patientName},time:{rendevoustime} ,doctor:{selectedDoctor},Spécialité:{selectedSpecialty} };
    // On envoie l'ordre au reducer
    dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
  };

  return (
    <div className={style.container}>
      <h2 className={style.title}>
        📅 Mes Rendez-vous ({appointments.length})
      </h2>

      {/* //juste pour la verification */}
      <button
                className={style.cancelBtn}
                onClick={handleAdd}
              >
                prendre
        </button>

      {appointments.length === 0 ? (
        <p className={style.empty}>
          Vous n'avez aucun rendez-vous pour le moment.
        </p>
      ) : (
        <ul className={style.list}>
          {appointments.map((appt) => (
            <li key={appt.id} className={style.card}>
              
              <div className={style.info}>
                <p><strong>Patient :</strong> {appt.patient}</p>
                <p><strong>Médecin :</strong> {appt.doctor}</p>
                <p><strong>Spécialité :</strong> {appt.specialty}</p>
                <p><strong>Heure :</strong> {appt.time}</p>
              </div>
              <div className={style.boutton}>
                <span className={style.badge}>En Attente</span>
                  <button
                    className={style.cancelBtn}
                    onClick={() =>
                      dispatch({
                        type: "DELETE_APPOINTMENT",
                        payload: appt.id,
                      })
                    }
                  >
                    Annuler
                  </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AppointmentManager

