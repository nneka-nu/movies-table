import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { deleteMovie, cancelMovieEdit, saveMovie } from '../actions/actions';
import MovieRowData from './MovieRowData';
import MovieRowForm from './MovieRowForm';

import isEqual from 'lodash/isEqual';

const propTypes = {
    movies: PropTypes.arrayOf(PropTypes.object).isRequired,
    moviesByPage: PropTypes.arrayOf(PropTypes.object).isRequired
};

export class MoviesTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            movies: [],
            errors: [],
            deleting: false
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleEnterKey = this.handleEnterKey.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.validateRating = this.validateRating.bind(this);
        this.setRatingState = this.setRatingState.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let hasSameState = isEqual(this.state, nextState);

        let hasSameEditStatusAndMovie = this.props.moviesByPage.every((movie, i) => {
            const nextMovie = nextProps.moviesByPage.find(m => m.id === movie.id) || {};

            return movie.isEditing === nextMovie.isEditing && movie.id === nextMovie.id;
        })

        if (this.props.moviesByPage.length === nextProps.moviesByPage.length && hasSameState && hasSameEditStatusAndMovie) {
            return false;
        }

        return true;
    }

    componentWillReceiveProps(nextProps) {
        const { deleting } = this.state;
        const prevLen = this.props.movies.length;
        const nextLen = nextProps.movies.length;

        if (!deleting && prevLen !== nextLen) {
            const movies = nextProps.movies.map(movie => {
                return {
                    id: movie.id,
                    title: movie.title,
                    genres: movie.genres.join(', '),
                    releaseYear: movie.releaseYear,
                    rating: movie.rating
                }
            });

            this.setState({movies});
            
        }

        if (deleting  && prevLen > nextLen) {
            this.setState({
                movies: this.state.movies.filter(movie => movie.id !== deleting),
                deleting: false
            });
        }

    }

    handleInputChange(movieId, event) {
        const name = event.target.name;
        const value = event.target.value;

        const movies = this.state.movies.map(movie => {
            if (movie.id === movieId) {
                return Object.assign({}, movie, {[name]: value});
            }

            return movie;
        });

        this.setState(prevState => ({
            movies,
            errors: prevState.errors.map(error => {
                if (error.id === movieId) {
                    return Object.assign({}, error, {[name]: ''});
                }

                return error;
            })
        }));
    }

    handleEnterKey(movieId, event) {
        if (event.key === 'Enter') {
            this.handleSave(movieId, event);
        }
    }

    handleSave(movieId, event) {
        event.preventDefault();

        const { movies, errors } = this.state;

        let movie = movies.find(movie => movie.id === movieId);
        const error = errors.find(error => error.id === movieId);

        if (!movie.id || !movie.title || !movie.genres || !movie.releaseYear || !movie.rating) {
            return;
        }

        if (error && (error.title || error.genres || error.releaseYear || error.rating)) {
            return;
        }

        if (typeof movie.genres === 'string') {
            movie.genres = movie.genres.split(',')
                        .map(genre => genre.trim().toLowerCase());
        }

        // Check if movie was modified before saving.
        const propsMovie = this.props.movies.find(movie => movie.id === movieId);
        delete propsMovie.isEditing;

        if (!isEqual(propsMovie, movie)) {
            this.props.dispatch(saveMovie(movie));
        } else {
            this.props.dispatch(cancelMovieEdit(movie.id))
        }
    }

    handleCancel(movieId, event) {
        event.preventDefault();
        const { movies, dispatch } = this.props;
        
        dispatch(cancelMovieEdit(movieId));
        this.clearErrors(movieId);

        this.setState(prevState => {
            return {
                movies: prevState.movies.map(movie => {
                    if (movie.id === movieId) {
                        return movies.find(movie => movie.id === movieId);
                    }

                    return movie;
                })
            };
        })
    }

    handleDelete(movieId, event) {
        event.preventDefault();
        const { dispatch } = this.props;

        this.setState({deleting: movieId});
        dispatch(deleteMovie(movieId));
        this.clearErrors(movieId);
    }

    clearErrors(movieId) {
        this.setState(prevState => {
            return {
                errors: prevState.errors.filter(error => error.id !== movieId)
            }
        });
    }

    validateForm(movie, event) {
        const name = event.target.name;
        const value = event.target.value;
        const error = this.state.errors.find(error => error.id === movie.id);

        if (!value) {
            this.setState(prevState => ({
                errors: !error
                    ? prevState.errors.concat({id: movie.id, [name]: 'This field is required.'})
                    : prevState.errors.map(error => {
                        if (error.id === movie.id) {
                            return Object.assign({}, error, {[name]: 'This field is required.'});
                        }

                        return error;
                    })
            }));

            return;
        }

        if (name === 'genres' && (movie.genres.trim().indexOf(',') === 0 || !(/^[a-zA-Z ,]+$/).test(value))) {
            this.setState(prevState => ({
                errors: !error
                    ? prevState.errors.concat({id: movie.id, [name]: 'Please enter valid genres.'})
                    : prevState.errors.map(error => {
                    if (error.id === movie.id) {
                        return Object.assign({}, error, {[name]: 'Please enter valid genres.'});
                    }

                    return error;
                })
            }));
        }

        if (name === 'releaseYear' && parseFloat(value) % 1 !== 0) {
            this.setState(prevState => ({
                errors: !error
                    ? prevState.errors.concat({id: movie.id, [name]: 'Please enter a valid year.'})
                    : prevState.errors.map(error => {
                    if (error.id === movie.id) {
                        return Object.assign({}, error, {[name]: 'Please enter a valid year.'});
                    }

                    return error;
                })
            }));
        }
    }

    validateRating(rating, movieId) {
        const error = this.state.errors.find(error => error.id === movieId);

        if (!rating || rating < 1 || rating > 5) {
            this.setState(prevState => ({
                errors: !error
                    ? prevState.errors.concat({id: movieId, rating:  'Please select a rating.'})
                    : prevState.errors.map(error => {
                        if (error.id === movieId) {
                            return Object.assign({}, error, {rating});
                        }

                        return error;
                    })
            }));
            
            return false;
        }

        if (error) {
            this.setState(prevState => ({
                errors: prevState.errors.map(error => {
                    if (error.id === movieId) {
                        return Object.assign({}, error, {rating: ''});
                    }

                    return error;
                })
            }));
        }

        return true;
    }

    setRatingState(rating, movieId) {
        this.setState(prevState => {
            return {
                movies: prevState.movies.map(movie => {
                    if (movie.id === movieId) {
                        return Object.assign({}, movie, {rating});
                    }

                    return movie;
                })
            }
        });
    }

    render() {
        const { moviesByPage } = this.props;
        const { movies, errors } = this.state;

        return (
            <table className="movies">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Genres</th>
                        <th>Year</th>
                        <th>Ratings</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                {moviesByPage.map(movie => {
                    return (
                        !movie.isEditing
                            ? <MovieRowData
                                key={movie.id}
                                movie={movie}
                                onDelete={this.handleDelete}
                              />
                            : <MovieRowForm
                                key={movie.id}
                                movieId={movie.id}
                                movies={movies}
                                errors={errors}
                                onInputChange={this.handleInputChange}
                                onKeyDown={this.handleEnterKey}
                                onSave={this.handleSave}
                                onCancel={this.handleCancel}
                                onSetRatingState={this.setRatingState}
                                onValidateRating={this.validateRating}
                                onValidateForm={this.validateForm}
                              />
                    )
                })}
                </tbody>
            </table>
        )
    }
}

MoviesTable.propTypes = propTypes;

export default connect()(MoviesTable);