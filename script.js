const API_KEY = "3cd7e575";

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const movieContainer = document.getElementById("movieContainer");
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");

const pagination = document.getElementById("pagination");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNumber = document.getElementById("pageNumber");

const modal = document.getElementById("movieModal");
const closeModal = document.getElementById("closeModal");
const modalDetails = document.getElementById("modalDetails");

let currentPage = 1;
let currentQuery = "";

async function fetchMovies(query, page = 1) {
    try {
        loading.classList.remove("hidden");
        errorDiv.classList.add("hidden");
        movieContainer.innerHTML = "";

        const response = await fetch(
            `https://www.omdbapi.com/?s=${query}&page=${page}&apikey=${API_KEY}`
        );

        const data = await response.json();
        loading.classList.add("hidden");

        if (data.Response === "False") {
            showError("Movie not found!");
            pagination.classList.add("hidden");
            return;
        }

        displayMovies(data.Search);
        pagination.classList.remove("hidden");
        pageNumber.textContent = currentPage;

    } catch (error) {
        loading.classList.add("hidden");
        showError("Something went wrong!");
    }
}

function displayMovies(movies) {
    movieContainer.innerHTML = "";

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}">
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>Year: ${movie.Year}</p>
                <p>Type: ${movie.Type}</p>
            </div>
        `;

        card.addEventListener("click", () => fetchMovieDetails(movie.imdbID));
        movieContainer.appendChild(card);
    });
}

async function fetchMovieDetails(id) {
    const response = await fetch(
        `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`
    );
    const data = await response.json();

    modalDetails.innerHTML = `
        <h2>${data.Title}</h2>
        <p><strong>Rating:</strong> ${data.imdbRating}</p>
        <p><strong>Genre:</strong> ${data.Genre}</p>
        <p><strong>Plot:</strong> ${data.Plot}</p>
    `;

    modal.classList.remove("hidden");
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
}

searchBtn.addEventListener("click", () => {
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    if (currentQuery) fetchMovies(currentQuery, currentPage);
});

searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") searchBtn.click();
});

nextBtn.addEventListener("click", () => {
    currentPage++;
    fetchMovies(currentQuery, currentPage);
});

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchMovies(currentQuery, currentPage);
    }
});

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});