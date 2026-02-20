import { useEffect, useRef, useState } from "react"

export function useAudioPlayer() {
    
    const [isPalying,setisPalying]=useState(false)
    const [currentTime,setcurrentTime]=useState(0)
    const [duration,setduration]=useState(0)
    const [currentTrack,setCurrentTrack]=useState(null)

    const audioRef=useRef(new Audio())
    useEffect(()=>{
        const audio=audioRef.current
        console.log(audioRef)
        const updateCurrentTime=()=>setcurrentTime(audio.currentTime)  //permet de mettre a jour current time
        const updateDuration=()=>setduration(audio.duration)
        audio.addEventListener("timeupdate",updateCurrentTime)     //ajoute les ecouteurs d'evenements
        audio.addEventListener("loadedmetadata",updateDuration)
        return()=>{
            audio.removeEventListener("timeupdate",updateCurrentTime)    //demonte les ecouteurs d'evenements
            audio.removeEventListener("loadedmetadata",updateDuration)
        }
    },[])

    useEffect(()=>{
        if (currentTrack) {
            audioRef.current.src=currentTrack
            play()
        }
    },[currentTrack])

    const play=()=>{
        audioRef.current.play()
        setisPalying(true)
    }
    const pause=()=>{
        audioRef.current.pause()
        setisPalying(false)
    }
    const formatTime=(secondes)=>{
        const minute=Math.floor(secondes/60)
        const seconde=Math.floor(secondes%60)
        return `${minute}:${seconde <10 ? "0" : ""}${seconde}`
    }
    return{
        //des infos sur le lecteur audio et des outils pour piloter la lecture
        isPalying,
        currentTime,
        curentFormatedTime:formatTime(currentTime),
        duration,
        durationFormatedTime:formatTime(duration),
        play,
        pause,
        currentTrack,
        setCurrentTrack
    }

}