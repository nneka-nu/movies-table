let moviesList = require('./initialData');

function getStorageData() {
    if (localStorage.moviesList) {
        try {
            moviesList = JSON.parse(localStorage.moviesList);
        } catch(e) {
            return null;
        }
    }

    return moviesList;
}

function generateId() {
    const movieIds = moviesList.map((movie) => {
      return movie.id;
    });
    const id = Math.max(...movieIds) + 1;

    return id;
}

class MoviesApi {
    static getMovies() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(getStorageData() || moviesList);
            }, 800);
        });
    }

    static saveMovie(movie) {
        movie = Object.assign({}, movie);
        delete movie.isEditing;

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (movie.id) {
                    const movieIndex = moviesList.findIndex(value => value.id === movie.id)
                    moviesList[movieIndex] = movie;
                } else {
                    movie.id = generateId();
                    moviesList = [
                        movie,
                        ...moviesList
                    ];
                }

                localStorage.moviesList = JSON.stringify(moviesList);
                resolve(movie);
            }, 800);
        });
    }

    static deleteMovie(movieId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                moviesList = moviesList.filter(movie => movie.id !== movieId);
                localStorage.moviesList = JSON.stringify(moviesList);
                resolve(movieId);
            }, 800);
        });
    }
}

export default MoviesApi;