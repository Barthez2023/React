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
      
    default:
      return state;
  }
};