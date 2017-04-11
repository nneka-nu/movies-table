import { createSelector } from 'reselect';

const getMovies = (state) => state.movies;
const getFilterOptions = (state) => state.filtering;

export const getFilteredMovies = createSelector(
    [getMovies, getFilterOptions],
    (movies, filter) => {
        const { text, option } = filter;
        const validOptions = ['title', 'genres', 'releaseYear', 'rating'];
        let filteredMovies = '';

        if (text && option && validOptions.indexOf(option) > -1) {
            let lowerText = text.toLowerCase();
            filteredMovies = movies.filter((movie, i) => {
                if (option === 'rating') {
                    return movie[option] === parseInt(text, 10);
                }

                if (option === 'genres' && movie[option] instanceof Array) {
                    return movie[option].join(',').toLowerCase().indexOf(lowerText) > -1;
                }

                return String(movie[option]).toLowerCase().indexOf(lowerText) > -1;
            });
        }

        return filteredMovies || movies;
    }
);

