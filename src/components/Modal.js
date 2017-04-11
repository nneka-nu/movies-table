import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { saveMovie } from '../actions/actions';
import Rating from './Rating';

const propTypes = {
    display: PropTypes.bool.isRequired,
    clearRating: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSetCurrentPage: PropTypes.func.isRequired
}

export class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {
                title: '',
                genres: '',
                releaseYear: '',
                rating: ''
            },
            errors: {
                title: '',
                genres: '',
                releaseYear: '',
                rating: '',
                all: ''
            },
            clearRating: props.clearRating
        }

        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.validateRating = this.validateRating.bind(this);
        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.setRatingState = this.setRatingState.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.clearRating !== this.state.clearRating) {
            this.setState({clearRating: nextProps.clearRating});
        }
    }

    handleFormChange(event) {
        const value = event.target.value;
        const name = event.target.name;
    
        this.setState(prevState => ({
            form: Object.assign({}, prevState.form, {[name]: value})
        }));

        this.setState(prevState => ({
            errors: Object.assign({}, prevState.errors, {
                [name]: '',
                all: ''
            })
        }));
    }

    handleSubmit(event) {
        event.preventDefault();
        const { form, errors } = this.state;
        const { title, genres, releaseYear, rating } = form;
        const { onSetCurrentPage, dispatch } = this.props;

        if (!this.validateRating(rating)) {
            return;   
        }

        if (errors.title || errors.genres || errors.releaseYear || errors.rating) {
            return;
        }

        if (!title || !genres || !releaseYear || !rating) {
            this.setState(prevState => {
                return {
                    errors: Object.assign({}, prevState.errors, {
                        all: 'All fields are required.'
                    })
                };
            })
            return;
        }

        const movie = Object.assign({}, form, {
            genres: genres.split(',')
                    .map(genre => genre.trim().toLowerCase()),
            releaseYear: parseInt(releaseYear, 10)
        })

        dispatch(saveMovie(movie));
        onSetCurrentPage(1);

        this.setState({
            form: {
                title: '',
                genres: '',
                releaseYear: '',
                rating: ''
            }
        });

        this.setState({clearRating: true});
        this.handleCloseClick('close');
    }

    validateForm(event) {
        const name = event.target.name;
        const value = event.target.value;

        if (!this.state.form[name]) {
            this.setState(prevState => ({
                errors: Object.assign({}, prevState.errors, {
                    [name]: 'This field is required.'
                })
            }));

            return;
        }

        if (name === 'genres' && (this.state.form[name].trim().indexOf(',') === 0 || !(/^[a-zA-Z, ]+$/).test(value))) {
            this.setState(prevState => ({
                errors: Object.assign({}, prevState.errors, {
                    [name]: 'Please enter valid genres.'
                })
            }));
        }

        if (name === 'releaseYear' && parseFloat(value) % 1 !== 0) {
            this.setState(prevState => ({
                errors: Object.assign({}, prevState.errors, {
                    [name]: 'Please enter a valid year.'
                })
            }));
        }
    }
    
    handleCloseClick(event) {
        if (event === 'close' || event.target.className === 'close' || event.target.className === 'modal') {
            this.props.onClose();
        }
    }

    validateRating(rating) {
        if (!rating || rating < 1 || rating > 5) {
            this.setState(prevState => ({
                errors: Object.assign({}, prevState.errors, {
                    rating: 'Please select a rating.'
                })
            }));
            
            return false;
        }

        this.setState(prevState => ({
            errors: Object.assign({}, prevState.errors, {
                rating: ''
            })
        }));

        return true;     
    }

    setRatingState(rating) {
        this.setState(prevState => {
            return {
                form: Object.assign({}, prevState.form, {rating}),
                errors: Object.assign({}, prevState.errors, {
                    rating: ''
                })
            }
        });
    }

    render() {
        const { title, genres, releaseYear } = this.state.form;
        const { errors, clearRating } = this.state;
        const { display } = this.props;
        let style = {display: 'none'}

        if (display) {
            style = {display: 'block'}
        }

        return (
            <div className="modal" style={style} onClick={this.handleCloseClick}>
                <div className="modal-content">
                    <span className="close">&times;</span>
                    <form onSubmit={this.handleSubmit}>
                        {errors.all && <p>{errors.all}</p>}
                        <div>
                            <label htmlFor="title">Title:</label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                value={title}
                                onChange={this.handleFormChange}
                                onBlur={this.validateForm}
                            />
                            {errors.title &&
                                <p className="error">{errors.title}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="genres">Genres:</label>
                            <input
                                id="genres"
                                type="text"
                                name="genres"
                                value={genres}
                                onChange={this.handleFormChange}
                                onBlur={this.validateForm}
                            />
                            {errors.genres &&
                                <p className="error">{errors.genres}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="releaseYear">Release Year:</label>
                            <input
                                id="releaseYear"
                                type="text"
                                name="releaseYear"
                                value={releaseYear}
                                onChange={this.handleFormChange}
                                onBlur={this.validateForm}
                            />
                            {errors.releaseYear &&
                                <p className="error">{errors.releaseYear}</p>
                            }
                        </div>
                        <div>
                            <label>Rating:</label>
                            <Rating
                                placement='modal'
                                clearRating={clearRating}
                                onSetRatingState={this.setRatingState}
                                onValidateRating={this.validateRating}
                            />
                            {errors.rating &&
                                <p className="error">{errors.rating}</p>
                            }
                        </div>
                        <div className="submit">
                            <input type="submit" value="Submit" />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

Modal.propTypes = propTypes;

export default connect()(Modal);