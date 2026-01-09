//Secure API key.
const API_KEY = "AIzaSyD8DiPGitId3LM-lAkSYGMxVx247z9uGWo";

//Gets the 
function getPlaylistId(url) {
  let params = new URL(url).searchParams;
  return params.get("list");
}

async function calculate() {
  //getting URL from the input
  let url = document.getElementById("playlistUrl").value;
  //getting playlistID from the URL
  let playlistId = getPlaylistId(url);
  //Validation of Playlist URL
  //alerts the user if invalid Playlist Url is given
  if (!playlistId) {
    alert("Invalid playlist URL");
    return;
  }
  //gets response from by fetching data from youtube api.
  //used endpoint https://www.googleapis.com/youtube/v3/playlistItems
  let playlistRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`
  );
  //converts into JSON
  let playlistData = await playlistRes.json();
  //gets the array of videoIds returned from map()
  let videoIds = playlistData.items.map(
    //gets the list of videoIds
    item => item.contentDetails.videoId
  );
  //Number of videos(items) in the videoIds array
  document.getElementById("videos").innerText = videoIds.length;
  //Gets the durations from all the videos in the playlist.
  let videoRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(",")}&key=${API_KEY}`
  );
  //converting into JSON data
  let videoData = await videoRes.json();

  let totalSeconds = 0;
  //counting total number of seconds of the videos
  videoData.items.forEach(v => {
    totalSeconds += convertToSeconds(v.contentDetails.duration);
  });
  //Modifies Total Duration based on the total seconds
  document.getElementById("time").innerText = formatTime(totalSeconds);
  //gets the speed option select by the user and converting string into float
  let speed = parseFloat(document.getElementById("speed").value);
  //calculates the total time after getting the speed option selected from user.
  let adjustedSeconds = Math.floor(totalSeconds / speed);
  //updates the Total time
  document.getElementById("time").innerText = formatTime(totalSeconds);
  //updates the time based on speed selected
  document.getElementById("speedTime").innerText = formatTime(adjustedSeconds);
  //getting number of hours per day from user
  let dailyHours = parseFloat(document.getElementById("dailyHours").value);
  //converting hours/day to seconds
  let dailySeconds = dailyHours * 3600;
  //calculating number of days.
  let daysRequired = Math.ceil(adjustedSeconds / dailySeconds);
  //modifies days required element
  document.getElementById("days").innerText = daysRequired + " days";
}

function convertToSeconds(duration) {
  let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  let h = parseInt(match[1]) || 0;//if no value then it 0 is returned
  let m = parseInt(match[2]) || 0;//if no value then it 0 is returned
  let s = parseInt(match[3]) || 0;//if no value then it 0 is returned

  return h * 3600 + m * 60 + s;
}

function formatTime(sec) {
  let h = Math.floor(sec / 3600);
  let m = Math.floor((sec % 3600) / 60);
  return `${h} hour${h !== 1 ? "s" : ""} ${m} minute${m !== 1 ? "s" : ""}`;
}
