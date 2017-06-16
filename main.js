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

function fetchArtists(search) {
  document.querySelector('.results').textContent = ""
fetch('http://api.soundcloud.com/users/?client_id=095fe1dcd09eb3d0e1d3d89c76f5618f&q='+search+"'")
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
          document.querySelector('.artist-name').textContent = artist.querySelector('.name').textContent
          fetch('http://api.soundcloud.com/users/'+artist.id+'/tracks/?client_id=095fe1dcd09eb3d0e1d3d89c76f5618f')
          .then( function(response){
            return response.json()
          })
          .then(function(json){
            console.log(json);
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
        })
        .then(function() {
          const songs = document.querySelectorAll('.song')
          const audio = document.querySelector('.music-player')
          for (var s = 0; s < songs.length; s++) {
            const song = songs[s]
            song.addEventListener('click', function() {
              audio.src = song.id + "?client_id=095fe1dcd09eb3d0e1d3d89c76f5618f";
              audio.autoplay = true
            })
          }
        })
      })
    }
  })
}
