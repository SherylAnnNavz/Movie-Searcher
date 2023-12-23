const apiKey = '1bfdbff05c2698dc917dd28c08d41096';
const baseUrl = 'https://api.themoviedb.org/3';

document.addEventListener('DOMContentLoaded', () => {
    // Initial load of upcoming movies
    getUpcomingMovies();

    // Add event listener for search input (after DOM is loaded)
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim();
        if (query !== '') {
            searchMovie(query);
        } else {
            // If the search input is empty, reload upcoming movies
            getUpcomingMovies();
        }
    });

    // Check if the URL contains a movie ID (for direct linking to details page)
    const urlParams = new URLSearchParams(window.location.search);
    const movieIdFromUrl = urlParams.get('movieId');

    if (movieIdFromUrl) {
        showMovieDetails(movieIdFromUrl);
    }
});

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

    const image = document.createElement('img');
    image.src = `http://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    image.alt = movie.title;

    // Add event listener to the movie image
    image.addEventListener('click', () => goToDetailsPage(movie.id));

    const title = document.createElement('h2');
    title.textContent = movie.title;

    movieCard.appendChild(image);
    movieCard.appendChild(title);

    return movieCard;
}

// Function to navigate to the details page
function goToDetailsPage(movieId) {
    window.location.href = `details.html?movieId=${movieId}`;
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
        console.log('API Response:', response);

        if (response.ok) {
            const movieDetails = await response.json();
            console.log('Movie Details:', movieDetails);

            // Display movie details
            displayMovieDetails(movieDetails);

            // Fetch and display similar movies
            getSimilarMovies(movieId);
        } else {
            console.error('Error fetching movie details:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Function to display movie details
function displayMovieDetails(movieDetails) {
    console.log('Displaying Movie Details:', movieDetails);

    const movieDetailsContainer = document.getElementById('mainContentDetails');
    movieDetailsContainer.innerHTML = `
        <h1>${movieDetails.title}</h1>
        <p>${movieDetails.overview}</p>
        <img src="http://image.tmdb.org/t/p/w500/${movieDetails.poster_path}" alt="${movieDetails.title}">
    `;
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
    const similarMoviesList = document.getElementById('similarMoviesList');
    similarMoviesList.innerHTML = '<h2>Similar Movies</h2>';

    similarMovies.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="details.html?movieId=${movie.id}" onclick="showMovieDetails(${movie.id}); return false;">${movie.title}</a>`;
        similarMoviesList.appendChild(listItem);
    });
}

// Function to go back to the index page
function goBack() {
    window.location.href = 'index.html';
}
