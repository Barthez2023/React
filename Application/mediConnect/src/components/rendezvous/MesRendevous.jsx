import React, { useContext, useReducer } from 'react';
import style from './mesRendezVous.module.css'


function AppointmentManager({dispatch,appointments}) {
  return (
    <div className={style.container}>
      <h2 className={style.title}>
        📅 Mes Rendez-vous - {appointments.length}
      </h2>
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
                <p><strong>Spécialité :</strong> {appt.Spécialité}</p>
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

      <button
          className={style.clearBtn}
          onClick={() =>
            dispatch({
              type: "CLEAR_ALL"
            })
          }
        >
          🗑️ Nettoyer Mes RDV
        </button>
    </div>

  );
}

export default AppointmentManager

