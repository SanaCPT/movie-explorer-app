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
let currentSearch = "";

/* Search Button */
searchBtn.addEventListener("click", () => {
    currentSearch = searchInput.value.trim();
    if (!currentSearch) return;

    currentPage = 1;
    fetchMovies();
});

/* Enter Key Search */
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

/* Fetch Movies */
async function fetchMovies() {
    loading.style.display = "block";
    errorDiv.textContent = "";
    movieContainer.innerHTML = "";

    try {
        const res = await fetch(
            `https://www.omdbapi.com/?s=${currentSearch}&page=${currentPage}&apikey=${API_KEY}`
        );
        const data = await res.json();

        if (data.Response === "True") {
            displayMovies(data.Search);
            pagination.style.display = "block";
            pageNumber.textContent = currentPage;
        } else {
            errorDiv.textContent = "Movie not found!";
            pagination.style.display = "none";
        }

    } catch (error) {
        errorDiv.textContent = "Something went wrong!";
    }

    loading.style.display = "none";
}

/* Display Movies */
function displayMovies(movies) {
    movieContainer.innerHTML = "";

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        `;

        card.addEventListener("click", () => {
            fetchMovieDetails(movie.imdbID);
        });

        movieContainer.appendChild(card);
    });
}

/* Fetch Movie Details */
async function fetchMovieDetails(id) {
    try {
        const res = await fetch(
            `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`
        );
        const data = await res.json();

        modalDetails.innerHTML = `
            <h2>${data.Title}</h2>
            <p><strong>⭐ Rating:</strong> ${data.imdbRating}</p>
            <p><strong>Genre:</strong> ${data.Genre}</p>
            <p><strong>Plot:</strong> ${data.Plot}</p>
        `;

        modal.style.display = "flex";

    } catch {
        modalDetails.innerHTML = "Error loading details.";
        modal.style.display = "flex";
    }
}

/* Close Modal */
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

/* Pagination */
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchMovies();
    }
});

nextBtn.addEventListener("click", () => {
    currentPage++;
    fetchMovies();
});