export const initialisation={
    nombreRendevous:0
}
// Le Reducer : Le cerveau qui décide comment l'état change
export const appointmentReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_APPOINTMENT':
      // On retourne un nouveau tableau avec le nouveau RDV à la fin
      return (
            [...state, action.payload]
      )
      
    case 'DELETE_APPOINTMENT':
      // On filtre pour garder tous les RDV sauf celui dont l'ID est fourni
      return (
        state.filter(appt => appt.id !== action.payload)
    )

    case 'CLEAR_ALL':
      // On supprime  tout les RDV
      return ([])
      
    default:
      return state;
  }
};

/**case 'TOGGLE_STATUS':
      // On parcourt la liste avec .map()
      return state.map(appt => 
        // Si l'ID correspond, on crée une COPIE de l'objet avec le status inversé
        appt.id === action.payload 
          ? { ...appt, status: appt.status === 'pending' ? 'completed' : 'pending' } 
          : appt // Sinon, on garde l'objet tel quel
      ); */