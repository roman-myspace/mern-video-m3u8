import './App.css'
import ReactPlayer from "react-player";

function App() {
  
  const videoUrl = "http://localhost:8080/videos/hls/YOUR_FILE_URL_HERE.m3u8";

  return (
    <>
      <div>
        <ReactPlayer
          url={videoUrl}
          controls={true}
          width="100%"
          height="100%"
        />
      </div>
    </>
  )
}

export default App
