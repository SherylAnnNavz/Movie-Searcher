const apiKey = '1bfdbff05c2698dc917dd28c08d41096';
const baseUrl = 'https://api.themoviedb.org/3';

// Function to fetch upcoming movies
async function getUpcomingMovies() {
    try {
        const response = await fetch(`${baseUrl}/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`);
        const data = await response.json();
        const movies = data.results;
        displayMovies(movies);
    } catch (error) {
        console.error('Error fetching upcoming movies:', error);
    }
}

// Function to display upcoming movies
function displayMovies(movies) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        mainContent.appendChild(movieCard);
    });
}

// Function to create a movie card
function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    movieCard.innerHTML = `
        <img src="http://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
        <h2>${movie.title}</h2>
    `;
    movieCard.addEventListener('dblclick', () => showMovieDetails(movie.id));
    return movieCard;
}

// Function to search for a movie based on name
async function searchMovie(query) {
    try {
        const response = await fetch(`${baseUrl}/search/movie?api_key=${apiKey}&query=${query}`);
        const data = await response.json();
        const movies = data.results;
        displayMovies(movies);
    } catch (error) {
        console.error('Error searching for a movie:', error);
    }
}

// Function to display comprehensive information about a movie
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=en-US`);
        const movieDetails = await response.json();
        displayMovieDetails(movieDetails);
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Function to display movie details
function displayMovieDetails(movieDetails) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '';

    const detailPage = document.createElement('div');
    detailPage.className = 'detail-page';
    detailPage.innerHTML = `
        <img src="http://image.tmdb.org/t/p/w500/${movieDetails.poster_path}" alt="${movieDetails.title}">
        <h1>${movieDetails.title}</h1>
        <p>${movieDetails.overview}</p>
        <!-- Add more details as needed -->

        <h2>Similar Movies</h2>
        <div id="similarMovies"></div>
    `;

    // Fetch and display similar movies
    getSimilarMovies(movieDetails.id);

    mainContent.appendChild(detailPage);
}

// Function to fetch and display similar movies
async function getSimilarMovies(movieId) {
    try {
        const response = await fetch(`${baseUrl}/movie/${movieId}/similar?api_key=${apiKey}&language=en-US&page=1`);
        const similarMovies = await response.json();
        displaySimilarMovies(similarMovies.results);
    } catch (error) {
        console.error('Error fetching similar movies:', error);
    }
}

// Function to display similar movies
function displaySimilarMovies(similarMovies) {
    const similarMoviesContainer = document.getElementById('similarMovies');
    similarMoviesContainer.innerHTML = '';

    similarMovies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        similarMoviesContainer.appendChild(movieCard);
    });
}

// Initial load of upcoming movies
getUpcomingMovies();
