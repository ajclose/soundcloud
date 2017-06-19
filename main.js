const form = document.querySelector('form')
const input = document.querySelector('.search-bar')
const sort = document.querySelector('.filter')
let artistName = ''
let songs = []

function fetchArtists(search) {
  document.querySelector('.results').textContent = ""
  document.querySelector('.filter').value = "sort-by"
  sort.style.visibility = "hidden"
  fetch(`http://api.soundcloud.com/users/?client_id=095fe1dcd09eb3d0e1d3d89c76f5618f&q=${search}`)
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      console.log("data", json)
      for (var i = 0; i < json.length; i++) {
        const image = json[i].avatar_url
        console.log(image);
        const name = json[i].username
        const id = json[i].id
        const html = `
       <div class="artist" id="${id}">
       <div class="image">
    <img src="${image}">
    </div>
    <div class="name">
    ${name}
    </div>
    </div>
    `
        document.querySelector(".results").insertAdjacentHTML('beforeend', html)

      }
    })
    .then(function() {
      const artists = document.querySelectorAll('.artist')
      for (var j = 0; j < artists.length; j++) {
        const artist = artists[j]
        artist.addEventListener('click', function() {
          document.querySelector('.results').textContent = ''
          artistName = artist.querySelector('.name').textContent
          console.log("artist:", artistName);
          let artistID = artist.id
          fetchTracks(artistID)
        })
      }
    })
}


function fetchTracks(artistid) {
  fetch(`http://api.soundcloud.com/users/${artistid}/tracks/?client_id=095fe1dcd09eb3d0e1d3d89c76f5618f&limit=200`)
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      songs = json
      displayTracks(songs)
    })

}

function displayTracks(json) {
  console.log(json);
  sort.style.visibility = "visible"
  if (json.length > 0) {

    for (var k = 0; k < json.length; k++) {
      const artwork = json[k].artwork_url
      const title = json[k].title
      const songSource = json[k].stream_url
      const artist = json[k].user.username
      const releaseDate = getReleaseDate(json[k])
      const playbackCount = json[k].playback_count
      const html = `
      <div class="song" id="${songSource}">
        <div class="artwork">
          <img src="${artwork}">
        </div>
        <div class="title">
          ${title}
        </div>
      </div>
      `
      document.querySelector(".results").insertAdjacentHTML('beforeend', html)
    }
  } else {
    document.querySelector('.results').textContent = 'Uh oh!  This artist doesn\'t have any songs available for free.'
  }

  const songs = document.querySelectorAll('.song')
  const audio = document.querySelector('.music-player')
  const album = document.querySelector('.album')
  for (var s = 0; s < songs.length; s++) {
    const song = songs[s]
    song.addEventListener('click', function() {
      const displayInfo = document.querySelector('.display-info')
      displayInfo.style.backgroundColor = "#bdc3c7"
      document.querySelector('.artist-name').textContent = artistName
      album.src = song.querySelector('img').src
      album.style.visibility = "visible"
      document.querySelector(".song-title").textContent = song.querySelector('.title').textContent
      audio.src = song.id + "?client_id=095fe1dcd09eb3d0e1d3d89c76f5618f";
      audio.autoplay = true
    })
  }
}


function getReleaseDate(song) {
  let date = String(song.release_year)
  if (song.release_month < 10) {
    date += "0" + String(song.release_month)
  } else {
    date += String(song.release_month)
  }
  if (song.release_day < 10) {
    date += "0" + String(song.release_day)
  } else {
    date += String(song.release_day)
  }
  return date
}


form.addEventListener('submit', function(event) {
  event.preventDefault()
  let search = input.value
  fetchArtists(search)
})


sort.addEventListener('change', function() {
  console.log("clicked!");
  let option = sort.value
  document.querySelector('.results').textContent = ''
  console.log(songs);
  songs.sort(function(a, b) {
    if (option === "title") {
      var songA = a.title;
      var songB = b.title;
      if (songA < songB) {
        return -1;
      }
      if (songA > songB) {
        return 1;
      }
      return 0;
    } else if (option === "popularity") {
      var songA = a.playback_count
      var songB = b.playback_count
      return parseInt(songB) - parseInt(songA)
    } else if (option === "releaseDateOld") {
      var songA = getReleaseDate(a)
      var songB = getReleaseDate(b)
      return parseInt(songA) - parseInt(songB)
    } else if (option === "releaseDateNew") {
      var songA = getReleaseDate(a)
      var songB = getReleaseDate(b)
      return parseInt(songB) - parseInt(songA)
    }
  })
  displayTracks(songs)
})
