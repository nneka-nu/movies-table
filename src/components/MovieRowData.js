import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { isEditingMovie } from '../actions/actions';

const propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        genres: PropTypes.array.isRequired,
        releaseYear: PropTypes.number.isRequired,
        rating: PropTypes.number.isRequired,
        isEditing: PropTypes.bool
    }).isRequired,
    onDelete: PropTypes.func.isRequired
}

export class MovieRowData extends React.Component {
    constructor(props) {
        super(props);

        this.handleEditing = this.handleEditing.bind(this);
        this.handleOnDelete = this.handleOnDelete.bind(this);
    }

    handleEditing(event) {
        event.preventDefault();
        const { movie, dispatch } = this.props;

        dispatch(isEditingMovie(movie));
    }

    handleOnDelete(event) {
        const { movie, onDelete } = this.props;

        onDelete(movie.id, event);
    }

    render() {
        const { movie } = this.props;

        return (
            <tr id={"movie-" + movie.id}>
                <td>{movie.title}</td>
                <td>{movie.genres.join(', ')}</td>
                <td>{movie.releaseYear}</td>
                <td>
                    <p className={'stars table-stars'}>
                        {Array(5).fill(undefined).map((v, i) => {
                            return (
                                <span key={'star-' + i} >
                                    <i
                                        id={'star-' + i}
                                        className={'material-icons star-icon' + (i < movie.rating ? ' active' : '')}
                                    >
                                        &#xE838;
                                    </i>
                                </span>
                            );
                        })}
                    </p>
                </td>
                <td>
                    <a 
                        href="#"
                        className="edit"
                        onClick={this.handleEditing}
                    >
                        Edit
                    </a>
                    <a 
                        href="#"
                        className="delete"
                        onClick={this.handleOnDelete}
                    >
                        Delete
                    </a>
                </td>
            </tr>
        )
    }
}

MovieRowData.propTypes = propTypes;

export default connect()(MovieRowData);