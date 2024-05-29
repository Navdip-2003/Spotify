let api = "http://127.0.0.1:5501/Songs"
const audio_player = document.createElement("audio");
let seek = document.getElementById("seekbar_MU");
seek.setAttribute("value", "0");
seek.max = 50;
let testDiv = document.getElementById("action_btn");
let preDiv = document.getElementById("pre_btn");
let nextDiv = document.getElementById("nex_btn");
let indexSongOn = null;

async function getSong(){
    let ans = await fetch(api);
    let res = await ans.text();
    let div = document.createElement("div")
    div.innerHTML = res
    let as = div.getElementsByTagName("a")
    let listsong = [];
    for(let i =0 ; i < as.length ; i++){
        let element = as[i]
        if(element.href.endsWith("mp3")){
            listsong.push(element.href)
        }
    }
    return listsong
}
let songs = null;
async function main(){
    songs = await getSong();
    const songList = document.querySelector(".playlist").getElementsByTagName("ul")[0]

    songs.forEach((song, index) => {
      // Create a new list item element
      const listItem = document.createElement('li');

      // Set the text content of the list item to the song name
      let name =song.split("/Songs/")[1].replaceAll(".mp3" , "").replaceAll("%20" , " ");
      listItem.textContent = name;

      // Add a click event listener to each list item
      listItem.addEventListener('click', function() {
        if (audio_player.src === song && !audio_player.paused) {
          pauseAudio();
        } else {
          playAudio(song);
          
          indexSongOn = index;
          
        }
      });

      songList.appendChild(listItem);
    });
}
main()

function playAudio(audioSource) {
  if (audio_player.src !== audioSource) {
      audio_player.src = audioSource;
      seek.value = "0";

      // Set seek.max when a new audio source is loaded
      audio_player.addEventListener('loadedmetadata', () => {
          seek.max = audio_player.duration;
          console.log("Seek max val is : " ,seek.max);
          document.getElementById("endTm").innerHTML = formatTime(audio_player.duration);
      });
  }
  audio_player.play();
}

  function pauseAudio() {
    audio_player.pause();
  }


  testDiv.addEventListener("click", () => {
    if(audio_player.src !== ""){
      if (document.getElementById("btn_check").src != "http://127.0.0.1:5501/assets/play-logo/pause_btn.svg") {
        document.getElementById("btn_check").src = "http://127.0.0.1:5501/assets/play-logo/pause_btn.svg";
        audio_player.pause();
        console.log("Audio player stopped")
      } else {
        document.getElementById("btn_check").src = "http://127.0.0.1:5501/assets/play-logo/play_btn.svg";
        audio_player.play();
        console.log("Audio player playing");  

      }
    }
  });
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
audio_player.addEventListener('timeupdate', () => {
  const currentTime = audio_player.currentTime;
  // seek.value = (currentTime / audio_player.duration) * 100;
  document.getElementById("strtTm").innerHTML = formatTime(currentTime);
});
seek.addEventListener('input', (event) => {
  const seekTime = (seek.value / 100) * audio_player.duration;
   audio_player.currentTime = seek.value;
});

audio_player.addEventListener('loadedmetadata', () => {
  // seek.max = audio_player.duration;
  document.getElementById("endTm").innerHTML = formatTime(audio_player.duration);
});

function setTimeEnd(){
    audio_player.addEventListener("loadedmetadata", function() {
      var duration = audio_player.duration;
      // seek.max = audio_player.duration;
      var minutes = Math.floor(duration / 60);
      var seconds = Math.floor(duration % 60);
      timerDisplay = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
      document.getElementById("endTm").innerHTML = timerDisplay;
  });
}


preDiv.addEventListener("click", ()=>{
  preSong();
});
function preSong() {
  if(indexSongOn != 0){
    indexSongOn --;
    playAudio(songs[indexSongOn])
  }
}

nextDiv.addEventListener("click", ()=>{
  nextSong();
});
function nextSong() {
  if(indexSongOn != songs.length){
    indexSongOn ++;
    playAudio(songs[indexSongOn])
  }
}

audio_player.addEventListener("ended", function() {
  nextSong();
});













