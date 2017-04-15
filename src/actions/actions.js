import * as types from './types';
import moviesApi from '../api/mockMoviesApi';

export function fetchMoviesSuccess(movies) {
    return {
        type: types.FETCH_MOVIES_SUCCESS,
        movies
    }
}

export function isEditingMovieSuccess(movie) {
    return {
        type: types.IS_EDITING_MOVIE,
        movie
    }
}

export function cancelMovieEdit(movieId) {
    return {
        type: types.CANCEL_MOVIE_EDIT,
        movieId
    }
}

export function addMovieSuccess(movie) {
    return {
        type: types.ADD_MOVIE_SUCCESS,
        movie
    }
}

export function editMovieSuccess(movie) {
    return {
        type: types.EDIT_MOVIE_SUCCESS,
        movie
    }
}

export function deleteMovieSuccess(movieId) {
    return {
        type: types.DELETE_MOVIE_SUCCESS,
        movieId
    }
}

export function filtering(text, option) {
    return {
        type: types.FILTERING,
        text,
        option
    }
}

export function fetchMovies() {
    return function(dispatch, getState) {
        return moviesApi.getMovies().then(movies => {
            dispatch(fetchMoviesSuccess(movies));
        }).catch(error => console.log(error));
    };
}

export function isEditingMovie(movie) {
    return function(dispatch, getState) {
        dispatch(isEditingMovieSuccess(movie));
    };
}

export function saveMovie(movie) {
    let type = '';

    if (!movie.id) {
        type = 'add';
    }

    return (dispatch, getState) => {
        return moviesApi.saveMovie(movie).then(theMovie => {
            if (type !== 'add') {
                dispatch(editMovieSuccess(theMovie));
            } else {
                dispatch(addMovieSuccess(theMovie));
            }
        }).catch(error => console.log(error));
    };
}

export function deleteMovie(movieId) {
    return (dispatch, getState) => {
        return moviesApi.deleteMovie(movieId).then(id => {
            dispatch(deleteMovieSuccess(id));
        }).catch(error => console.log(error));
    };
}