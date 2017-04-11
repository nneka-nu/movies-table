import expect from 'expect';

import { getFilteredMovies } from '../src/selectors/selectors';

describe('Selector: getFilteredMovies', () => {
  const movies = [
    {
        id: 115,
        title: 'Taking Out the Trash: Not As Easy As It Looks',
        genres: ['documentary'],
        releaseYear: 1980,
        rating: 1
    },
    {
        id: 117,
        title: 'French Fries and Sugar, Heart Disease and Diabetes',
        genres: ['documentary', 'horror'],
        releaseYear: 1980,
        rating: 4
    },
    {
        id: 119,
        title: 'Old Lady Solves Murder Mystery',
        genres: ['adventure', 'mystery', 'crime'],
        releaseYear: 1982,
        rating: 3
    }
  ];

  it('should return filtered movies by title', () => {
    const state = {
      movies,
      filtering: {
        text: 'lady',
        option: 'title'
      }
    }

    const filteredMovies = getFilteredMovies(state);

    expect(filteredMovies.length).toBe(1);
    expect(filteredMovies[0]).toInclude({title: 'Old Lady Solves Murder Mystery'})
  });

  it('should return filtered movies by genre', () => {
    const state = {
      movies,
      filtering: {
        text: 'documentary',
        option: 'genres'
      }
    }

    const filteredMovies = getFilteredMovies(state);

    expect(filteredMovies.length).toBe(2);
    expect(filteredMovies).toInclude(movies[0]);
    expect(filteredMovies).toInclude(movies[1])
  });

});