//creation du context dans le containeur  AudioContext

import { createContext, useContext } from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

const AudioContext=createContext()  //creer le contexte

//exportattion de la fonction useAudioContext pour l'utiliser dans les components
export const useAudioContext=()=> useContext(AudioContext)  //permet de consommer le context

//creation du provider(le livreur) AudioProvider qui envellopera les conposants enfants avec le conposants AudioContext
//de maniere que tout les conposants enfants puissent recuperer les donnes stocke dans le context(conteneur) AudioContext

export const AudioProvider=({children})=>{
    const audioPlayer=useAudioPlayer()

    return(
        <AudioContext.Provider value={audioPlayer}>
            {children}
        </AudioContext.Provider>
    )

}
