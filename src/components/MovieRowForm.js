import React, { PropTypes } from 'react';
import TextInput from './TextInput';
import Rating from './Rating';

const propTypes = {
    movieId: PropTypes.number.isRequired,
    movies: PropTypes.arrayOf(PropTypes.object).isRequired,
    errors: PropTypes.arrayOf(PropTypes.object).isRequired,
    onInputChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSetRatingState: PropTypes.func.isRequired,
    onValidateRating: PropTypes.func.isRequired,
    onValidateForm: PropTypes.func.isRequired
}

class MovieRowForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleOnSave = this.handleOnSave.bind(this);
        this.handleOnCancel = this.handleOnCancel.bind(this);
    }

    handleOnSave(event) {
        const { movieId, onSave } = this.props;

        onSave(movieId, event);
    }

    handleOnCancel(event) {
        const { movieId, onCancel } = this.props;

        onCancel(movieId, event);
    }

    render() {
        const { movieId, movies, errors, onInputChange, onKeyDown, onValidateForm, onValidateRating, onSetRatingState } = this.props;
        const movie = movies.find(movie => movie.id === movieId); //state movie
        let error = '';
        
        if (errors) {
            error = errors.find(error => error.id === movieId);
        }

        return (
            <tr id={"movie-" + movie.id}>
                <td className="editing">
                    <TextInput
                        type="text"
                        name="title"
                        movie={movie}
                        movieId={movie.id}
                        value={movie.title}
                        onChange={onInputChange}
                        onKeyDown={onKeyDown}
                        onBlur={onValidateForm}
                    />
                    {error && error.title &&
                        <p className="error">{error.title}</p>
                    }
                </td>
                <td className="editing">
                    <TextInput
                        type="text"
                        name="genres"
                        movie={movie}
                        movieId={movie.id}
                        value={movie.genres}
                        onChange={onInputChange}
                        onKeyDown={onKeyDown}
                        onBlur={onValidateForm}
                    />
                    {error && error.genres &&
                        <p className="error">{error.genres}</p>
                    }
                </td>
                <td className="editing">
                    <TextInput
                        type="text"
                        name="releaseYear"
                        movie={movie}
                        movieId={movie.id}
                        value={movie.releaseYear}
                        onChange={onInputChange}
                        onKeyDown={onKeyDown}
                        onBlur={onValidateForm}
                    />
                    {error && error.releaseYear &&
                        <p className="error">{error.releaseYear}</p>
                    }
                </td>
                <td className="editing">
                    <Rating
                        movieId={movie.id}
                        placement="inline"
                        value={movie.rating}
                        onSetRatingState={onSetRatingState}
                        onValidateRating={onValidateRating}
                    />
                    {error && error.rating &&
                        <p className="error">{error.rating}</p>
                    }
                </td>
                <td>
                    <a
                        href="#"
                        className="save"
                        onClick={this.handleOnSave}
                    >
                        Save
                    </a>
                    <a
                        href="#"
                        className="cancel"
                        onClick={this.handleOnCancel}
                    >
                        Cancel
                    </a>
                </td>
            </tr>
        )
    }
}

MovieRowForm.propTypes = propTypes;

export default MovieRowForm;