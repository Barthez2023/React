//1-creation du context

import { createContext } from "react";

export const NameContext=createContext({
    patientName:"",
    setPatientName:()=>{},
})