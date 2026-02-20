import AudioList from "./components/audioList/audioList"
import { MusicPlayer } from "./components/music_player/musicPlayer"
import { useState } from "react"
import {AudioProvider}  from "./context/audioContext"

function App() {
  const [count, setCount] = useState(0)

  return (
    <AudioProvider>
    <h1>🎵 MUSIC PLAYER</h1>
      <MusicPlayer/>
      <AudioList/>
    </AudioProvider>
  )
}

export default App
