/*
  Here is a guide for the steps you could take:
*/

// 1. First select and store the elements you'll be working with


// 2. Create your `onSubmit` event for getting the user's search term


// 3. Create your `fetch` request that is called after a submission


// 4. Create a way to append the fetch results to your page


// 5. Create a way to listen for a click that will play the song in the audio play
const form = document.querySelector('form')
const input = document.querySelector('.search-bar')
const artistName = document.querySelector('.artist-name')

form.addEventListener('submit', function(event) {
  event.preventDefault()
  let search = input.value
  fetchArtists(search)
})

function getReleaseDate(song) {
  let date = String(song.release_year)
  if (song.release_month < 10) {
    date += "0"+String(song.release_month)
  } else {
    date += String(song.release_month)
  }
  if (song.release_day < 10) {
    date+= "0"+String(song.release_day)
  } else {
    date += String(song.release_day)
  }
  return date
}

function fetchArtists(search) {
  document.querySelector('.results').textContent = ""
  document.querySelector('.filter').value = "sort-by"
fetch(`http://api.soundcloud.com/users/?client_id=095fe1dcd09eb3d0e1d3d89c76f5618f&q=${search}`)
   .then( function(response){
     return response.json()
   })
   .then(function(json){
     console.log("data", json)
     for (var i = 0; i < json.length; i++) {
       const image = json[i].avatar_url
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

          fetch(`http://api.soundcloud.com/users/${artist.id}/tracks/?client_id=095fe1dcd09eb3d0e1d3d89c76f5618f&limit=200`)
          .then( function(response){
            return response.json()
          })
          .then(function(json){
            console.log(json);

            if (json.length > 0) {


            for (var k = 0; k < json.length; k++) {
              const artwork = json[k].artwork_url
              const title = json[k].title
              const songSource = json[k].stream_url
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
          const filter = document.querySelector('.filter')
          filter.addEventListener('change', function() {
            console.log("clicked!");
            document.querySelector('.results').textContent = ''
            const option = document.querySelector('.filter').value
            console.log(option);
            const sorted = json.sort(function(a, b) {
              if (option === "title") {
                var songA = a.title; // ignore upper and lowercase
                var songB = b.title; // ignore upper and lowercase
                if (songA < songB) {
                  return -1;
                }
                if (songA > songB) {
                  return 1;
                }

                // names must be equal
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
              console.log(sorted);

            });

            // const sorted = json.sort(function(a,b) {
            //   return a.title - b.title
            // })
            console.log(sorted);
            for (var k = 0; k < json.length; k++) {
              const artwork = json[k].artwork_url
              const title = json[k].title
              const songSource = json[k].stream_url
              const releaseDate = getReleaseDate(json[k])
              const playbackCount = json[k].playback_count
              const html = `
              <div class="song" id="${songSource}">
                <div class="artwork">
                  <img src="${artwork}">
                </div>
                <div class="title">
                  ${title}
                  Plays: ${playbackCount}
                  Release Date: ${releaseDate}
                </div>
              </div>
              `

              document.querySelector(".results").insertAdjacentHTML('beforeend', html)
            }
          })
        })
        .then(function() {
          const songs = document.querySelectorAll('.song')
          const audio = document.querySelector('.music-player')
          for (var s = 0; s < songs.length; s++) {
            const song = songs[s]
            song.addEventListener('click', function() {
              document.querySelector('.artist-name').textContent = artist.querySelector('.name').textContent
              document.querySelector('.album').src = song.querySelector('img').src
              document.querySelector(".song-title").textContent = song.querySelector('.title').textContent
              audio.src = song.id + "?client_id=095fe1dcd09eb3d0e1d3d89c76f5618f";
              audio.autoplay = true

              })
            }
          })
        })
      }
    })
  }
