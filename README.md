MERN Stack app for uploading video and converting to m3u8 file and load file into react-player

Run project
API Call at: http://localhost:8080/api/file-upload
File Uploaded to `public/videos`
URL created like this `http://localhost:8080/videos/hls/your_file.m3u8`

Right now, in react app attach file manullay in `react-video-hls/src/App.jsx`
assign url manually to `videoUrl` variable.

and check network tab. it auto loads video chunk files and make a complete video using `react-player` package.
