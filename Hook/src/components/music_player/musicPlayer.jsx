import { useAudioContext } from "../../context/audioContext";
import style from "./musicPlayer.module.css"
export function MusicPlayer(){
    //ici on peut mettre la logique du composnat de music...
    //au lieu de faire ca on av utiliser un hook personaliser

    const {isPalying,currentTime,duration,curentFormatedTime,durationFormatedTime,play,pause,currentTrack}=useAudioContext();
    if (currentTrack) {
        return (
            <div className={style.container}>
                <button className={style.buttonPrimary} onClick={isPalying? pause:play}>
                    {isPalying?<i className="fa-solid fa-pause" style={{color:"blue"}}></i>:<i className="fa-solid fa-play" style={{color:"blue"}}></i>}
                </button>
                <div className={style.timer}>
                    <span>{curentFormatedTime}</span>/<span>{durationFormatedTime}</span>
                </div>
                <progress className={style.progressbar} value={currentTime} max={duration}/>

            </div>
        )
    }
    else{
        return null
    }
    
    
}