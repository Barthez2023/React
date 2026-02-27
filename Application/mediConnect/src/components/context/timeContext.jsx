//1-creation du context

import { createContext } from "react";

export const TimeContext=createContext({
    rendevoustime:"",
    setRendeVousTime:()=>{},
})