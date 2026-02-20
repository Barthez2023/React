import { useAudioContext } from "../../context/audioContext"
import style from "./audioList.module.css"

const tracks=[
    {
        id:1,
        title:"Amir On dirait",
        src:"/audio/Amir_-_On_dirait_(Clip_officiel)(128k).mp3",
        imgSrc:"/images/covers/img1.jfif"
    },
    {
        id:2,
        title:"Amir On verra bien",
        src:"/audio/Amir_-_On_verra_bien_(Clip_officiel)(128k).mp3",
        imgSrc:"/images/covers/img2.jfif"
    },
    {
        id:3,
        title:"Amir Rétine",
        src:"/audio/Amir_-_Rétine_(Clip_officiel)(128k).mp3",
        imgSrc:"/images/covers/img3.jfif"
    },
    {
        id:4,
        title:"GIMS YOLO",
        src:"/audio/GIMS_-_YOLO_(Clip_Officiel)(128k).mp3",
        imgSrc:"/images/covers/img4.jfif"
    },
    {
        id:5,
        title:"The Shin Sekaï Aime moi demain",
        src:"/audio/The_Shin_Sekaï_-_Aime-moi_demain_(Clip_officiel)_ft._Gradur(128k).mp3",
        imgSrc:"/images/covers/img5.jfif"
    }
]
const AudioList=()=>{
    const{play,pause,isPalying,currentTrack,setCurrentTrack}=useAudioContext()
    return(
        <div className={style.container}>
            {tracks.map((track)=>(
                <div key={track.id} className={`${style.song} ${
                        currentTrack===track.src ? style.songIsPlaying:""
                    }`}>
                    <img src={track.imgSrc} alt="image" width={30} height={30} style={{borderRadius:6}} />
                    {currentTrack===track.src ? (
                            <button className={style.buttonPrimary} onClick={isPalying? pause:play}>
                                {isPalying?<i className="fa-solid fa-pause" style={{color:"blue"}}></i>:<i className="fa-solid fa-play" style={{color:"blue"}}></i>}
                            </button>
                        ):(
                            <button className={style.buttonPrimary}
                            onClick={()=>setCurrentTrack(track.src)}
                            ><i className="fa-solid fa-play" style={{color:"blue"}}></i></button>
                        )
                    }
                    
                    <div className={`${style.trackTitle} ${
                        currentTrack===track.src ? style.titleIsPlaying:""
                    }`} onClick={()=>setCurrentTrack(track.src)}>
                        {track.title}
                    </div>
                </div>
            ))}
        </div>
    )
   

}

export default AudioList