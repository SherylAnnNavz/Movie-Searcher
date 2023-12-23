const omdbApiKey = '48aa722f';

const tmdbApiKey = '1bfdbff05c2698dc917dd28c08d41096';

const searchInput = document.getElementById('Input');

async function searchMovies(query) {
    const omdbUrl = `https://www.omdbapi.com/?s=${query}&page=1&apikey=${omdbApiKey}`;
    const omdbRes = await fetch(omdbUrl);
    const omdbData = await omdbRes.json();
    return omdbData.Search;
}


async function singleMovie() {
    var urlQueryParams = new URLSearchParams(window.location.search);
    var id = urlQueryParams.get('id')
    console.log(id);
    const url = `https://www.omdbapi.com/?i=${id}&apikey=${omdbApiKey}`     
    const res = await fetch(`${url}`);
    const data = await res.json();
    console.log(data);
    console.log(url);

    var output = `

    <div class="movie-poster">
        <img src=${data.Poster} alt="Movie Poster">
    </div>
    <div class="movie-details">
        <div class="details-header">
            <div class="dh-ls">
                <h2>${data.Title}</h2>
            </div>
            <div class="dh-rs">
                <i class="fa-solid fa-bookmark" onClick=addTofavorites('${id}') style="cursor: pointer;"></i>
            </div>
        </div>
        <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                    style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
        <ul class="details-ul">
            <li><strong>Actors: </strong>${data.Actors}</li>
            <li><strong>Director: </strong>${data.Director}</li>
            <li><strong>Writers: </strong>${data.Writer}</li>
        </ul>
        <ul class="details-ul">
            <li><strong>Genre: </strong>${data.Genre}</li>
            <li><strong>Release Date: </strong>${data.DVD}</li>
            <li><strong>Box Office: </strong>${data.BoxOffice}</li>
            <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
        </ul>
        <p style="font-size: 14px; margin-top:10px;">${data.Plot}</p>
        <p style="font-size: 15px; font-style: italic; color: #222; margin-top: 10px;">
            <i class="fa-solid fa-award"></i>
            &thinsp; ${data.Awards}
        </p>
    </div> 
    `

    document.querySelector('.movie-container').innerHTML = output

}


async function addTofavorites(id) {
    console.log("fav-item", id);
    localStorage.setItem(Math.random().toString(36).slice(2, 7), id); 
    alert('Movie Added to Watchlist!');
}

async function removeFromfavorites(id) {
    console.log(id);
    for (i in localStorage) {
        if (localStorage[i] == id) {
            localStorage.removeItem(i)
            break;
        }
    }
    alert('Movie Removed from Watchlist');
    window.location.replace('favorite.html');
}


async function getUpcomingMovies() {
    const tmdbUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${tmdbApiKey}&language=en-US&page=1`;
    const tmdbRes = await fetch(tmdbUrl);
    const tmdbData = await tmdbRes.json();
    return tmdbData.results;
}

async function displayUpcomingMovies() {
    try {
        const upcomingMovies = await getUpcomingMovies();

        var output = '';

        for (const movie of upcomingMovies) {
            var img = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'img/blank-poster.webp';

            output += `
                <div class="upcoming-item">
                    <div class="upcoming-poster">
                        <img src="${img}" alt="Upcoming Movie Poster">
                    </div>
                    <div class="upcoming-details">
                        <p class="upcoming-movie-name">${movie.title}</p>
                        <p class="upcoming-release-date">Release Date: ${movie.release_date}</p>
                    </div>
                </div>
            `;
        }

        document.querySelector('.upcoming-container').innerHTML = output;

    } catch (error) {
        console.error('Error fetching upcoming movies:', error);
    }
}

async function displayMovieList(movies) {
    var output = '';

    for (const movie of movies) {
        var img = movie.Poster !== 'N/A' ? movie.Poster : 'img/blank-poster.webp';
        var id = movie.imdbID;

        output += `
            <div class="fav-item">
                <div class="fav-poster">
                    <a href="movie.html?id=${id}"><img src="${img}" alt="Favourites Poster"></a>
                </div>
                <div class="fav-details">
                    <div class="fav-details-box">
                        <div>
                            <p class="fav-movie-name"><a href="movie.html?id=${id}">${movie.Title}</a></p>
                            <p class="fav-movie-rating"><a href="movie.html?id=${id}">${movie.Year}</a></p>
                        </div>
                        <div>
                            <i class="fa-solid fa-bookmark" style="cursor:pointer;" onClick="addTofavorites('${id}')"></i>
                        </div>
                    </div>
                </div>
            </div>
       `;
    }

    document.querySelector('.fav-container').innerHTML = output;
}

async function findMovies() {
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(searchInput.value)}&page=1&apikey=${omdbApiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Search) {
        displayMovieList(data.Search);
    }
}

async function favoritesMovieLoader() {
    var output = '';

    for (const key in localStorage) {
        const id = localStorage.getItem(key);

        if (id != null) {
            const omdbUrl = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${omdbApiKey}`;
            const omdbRes = await fetch(omdbUrl);
            const omdbData = await omdbRes.json();
            console.log(omdbData);

            var img = omdbData.Poster ? omdbData.Poster : omdbData.Title;
            var Id = omdbData.imdbID;

            output += `
                <div class="fav-item">
                    <div class="fav-poster">
                        <a href="movie.html?id=${id}"><img src="${img}" alt="Favourites Poster"></a>
                    </div>
                    <div class="fav-details">
                        <div class="fav-details-box">
                            <div>
                                <p class="fav-movie-name">${omdbData.Title}</p>
                                <p class="fav-movie-rating">${omdbData.Year} &middot; <span
                                    style="font-size: 15px; font-weight: 600;">${omdbData.imdbRating}</span>/10</p>
                            </div>
                            <div style="color: maroon">
                                <i class="fa-solid fa-trash" style="cursor:pointer;" onClick="removeFromfavorites('${Id}')"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    document.querySelector('.fav-container').innerHTML = output;
}

displayUpcomingMovies();

searchInput.addEventListener('input', findMovies);
