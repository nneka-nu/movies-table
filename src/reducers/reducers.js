import * as types from '../actions/types';

export function movies(state = [], action) {
    switch (action.type) {
        case types.FETCH_MOVIES_SUCCESS:
            return action.movies;
        case types.IS_EDITING_MOVIE:
            return state.map((movie, i) => {
                if (action.movie.id === movie.id) {
                    return Object.assign({}, movie, {isEditing: true});
                }

                return movie;
            });
        case types.CANCEL_MOVIE_EDIT:
            return state.map((movie, i) => {
                if (movie.id === action.movieId) {
                    return Object.assign({}, movie, {isEditing: false});
                }
                
                return movie;
            });
        case types.EDIT_MOVIE_SUCCESS:
            return state.map((movie, i) => {
                if (action.movie.id === movie.id) {
                    return Object.assign({}, action.movie, {isEditing: false});
                }
                
                return movie;
            });
        case types.ADD_MOVIE_SUCCESS:
            return [
                Object.assign({}, action.movie),
                ...state
            ];
        case types.DELETE_MOVIE_SUCCESS:
            return state.filter(movie => movie.id !== action.movieId);
        default:
            return state;
    }
}

export function filtering(state = {}, action) {
    switch (action.type) {
        case types.FILTERING:
            return {
                text: action.text,
                option: action.option
            }
        default:
            return state;
    }
}

export default function rootReducer(state = {}, action) {
    return {
        movies: movies(state.movies, action),
        filtering: filtering(state.filtering, action)
    }
}