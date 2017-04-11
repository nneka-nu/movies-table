import expect from 'expect';

import { cancelMovieEdit } from '../src/actions/actions';
import { movies, filtering } from '../src/reducers/reducers';
import * as types from '../src/actions/types';

describe('Reducers', () => {
  describe('Initial State', () => {
    it('should have the correct initial state', () => {
      const state = {
        movies: movies(undefined, {}),
        filtering: filtering(undefined, {})
      };

      expect(state.movies.length).toBe(0);
      expect(state.filtering.length).toNotExist();
    });
  });

  describe('Action: cancelMovieEdit', () => {
    const state = [
      {
        id: 7,
        title: 'Frying Fish',
        releaseYear: 1980,
        rating: 5
      },
      {
        id: 8,
        title: 'Steel Cut Oats',
        releaseYear: 1980,
        rating: 5
      }
    ];

    it('should set movie.isEditing to false', () => {
      const newState = movies(state, {
        type: types.CANCEL_MOVIE_EDIT,
        movieId: 8
      });

      expect(newState.length).toBe(2);
      expect(newState.find(movie => movie.id === 8).isEditing).toBe(false);
    });

  });

  describe('Action: filtering', () => {
    const state = {
        text: 'action',
        option: 'genres'
      };

    it('should modify the text and option for filtering', () => {
      const newState = filtering(state, {
        type: types.FILTERING,
        text: 'captain',
        option: 'title'
      });

      expect(newState.text).toBe('captain');
      expect(newState.option).toBe('title');
    });
    
  })

})
