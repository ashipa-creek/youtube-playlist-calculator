const API_KEY = "AIzaSyD8DiPGitId3LM-lAkSYGMxVx247z9uGWo";

function getPlaylistId(url) {
  let params = new URL(url).searchParams;
  return params.get("list");
}

async function calculate() {
  let url = document.getElementById("playlistUrl").value;
  let playlistId = getPlaylistId(url);

  if (!playlistId) {
    alert("Invalid playlist URL");
    return;
  }

  let playlistRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`
  );
  let playlistData = await playlistRes.json();

  let videoIds = playlistData.items.map(
    item => item.contentDetails.videoId
  );

  document.getElementById("videos").innerText = videoIds.length;

  let videoRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(",")}&key=${API_KEY}`
  );
  let videoData = await videoRes.json();

  let totalSeconds = 0;

  videoData.items.forEach(v => {
    totalSeconds += convertToSeconds(v.contentDetails.duration);
  });

  document.getElementById("time").innerText = formatTime(totalSeconds);
  let speed = parseFloat(document.getElementById("speed").value);
  let adjustedSeconds = Math.floor(totalSeconds / speed);

  document.getElementById("time").innerText = formatTime(totalSeconds);
  document.getElementById("speedTime").innerText = formatTime(adjustedSeconds);

  let dailyHours = parseFloat(document.getElementById("dailyHours").value);
  let dailySeconds = dailyHours * 3600;

  let daysRequired = Math.ceil(adjustedSeconds / dailySeconds);
  document.getElementById("days").innerText = daysRequired + " days";
}
function convertToSeconds(duration) {
  let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  let h = parseInt(match[1]) || 0;
  let m = parseInt(match[2]) || 0;
  let s = parseInt(match[3]) || 0;

  return h * 3600 + m * 60 + s;
}

function formatTime(sec) {
  let h = Math.floor(sec / 3600);
  let m = Math.floor((sec % 3600) / 60);
  return `${h} hours ${m} minutes`;
}
