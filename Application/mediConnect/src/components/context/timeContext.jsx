//1-creation du context

import { createContext } from "react";

export const TimeContext=createContext({
    rendevoustime:"08h30",
    setRendeVousTime:()=>{},
})