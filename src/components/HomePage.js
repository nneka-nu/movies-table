import React from 'react';
import { connect } from 'react-redux';
import { filtering } from '../actions/actions';
import { getFilteredMovies } from '../selectors/selectors';
import Modal from './Modal';
import Pagination from './Pagination';
import MoviesTable from './MoviesTable';

export class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            rowsPerPage: 4,
            displayModal: false,
            filterText: '',
            filterBy: '',
            isFiltering: false,
            clearRating: false
        }

        this.handleAddClick = this.handleAddClick.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleFiltering = this.handleFiltering.bind(this);
        this.setCurrentPage = this.setCurrentPage.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        const { isFiltering, filterText, filterBy, rowsPerPage, currentPage } = this.state;

        if (isFiltering && filterText && filterBy) {
            const lastPage = Math.ceil(this.props.movies.length / rowsPerPage);

            if (currentPage > lastPage) {
                this.setState({
                    currentPage: lastPage
                });
            }
        }
    }
    
    handleAddClick() {
        this.setState({
            displayModal: true,
            clearRating: false
        });
    }

    handleModalClose() {
         this.setState({displayModal: false});
    }

    handleFiltering(event) {
        let text = '';
        let option = '';
        const { filterText, filterBy } = this.state;
        const value = event.target.value;
        const validOptions = ['title', 'genres', 'releaseYear', 'rating'];

        if (event.target.tagName === 'INPUT') {
            text = value;
            option = filterBy;
            
        } else {
            text = filterText;
            option = value;
        }

        if ((text && option) || (!text && filterText && option)) {
            this.props.dispatch(filtering(text, option));
            this.setState({isFiltering: true});
        }

        if (!text || !option || validOptions.indexOf(option) === -1) {
            this.setState({isFiltering: false});
        }

        this.setState({
            filterText: text,
            filterBy: option
        });
    }

    setCurrentPage(currentPage) {
        this.setState({currentPage})
    }

    render() {
        let currentPage = this.state.currentPage || 1;
        const allMovies = this.props.movies;
        const moviesLen = allMovies.length;
        const { rowsPerPage, isFiltering, filterText, filterBy, displayModal, clearRating } = this.state;
        const numOfPages = Math.ceil(moviesLen / rowsPerPage);
        let start = rowsPerPage * (currentPage - 1)

        if (start < 0) {
            start = 0;
        }

        if (currentPage < 0) {
            currentPage = 0;
        }
        
        const moviesByPage = allMovies.slice(start, start + rowsPerPage);
        
        return (
            <div className="container">
                <div className="options">
                    <button 
                        id="add-new"
                        onClick={this.handleAddClick}
                    >
                        Add New Movie
                    </button>
                    {isFiltering &&
                        <span className="movies-status">
                            {moviesLen} {moviesLen > 1 ? 'movies' : 'movie'} found.
                        </span>
                    }
                    <div className="filter-movies">
                        <input
                            type="text"
                            value={filterText}
                            placeholder="Filter movies..."
                            onChange={this.handleFiltering}
                        />
                        <select value={filterBy} onChange={this.handleFiltering}>
                            <option>Filter by...</option>
                            <option value="title">Title</option>
                            <option value="genres">Genres</option>
                            <option value="releaseYear">Year</option>
                            <option value="rating">Rating</option>
                        </select>
                    </div>
                </div>
                <Modal
                    display={displayModal}
                    clearRating={clearRating}
                    onClose={this.handleModalClose}
                    onSetCurrentPage={this.setCurrentPage}
                />
                <MoviesTable
                    movies={allMovies}
                    moviesByPage={moviesByPage}
                />
                {numOfPages > 0 &&
                    <Pagination
                        currentPage={currentPage}
                        numOfPages={numOfPages}
                        onSetCurrentPage={this.setCurrentPage}
                    />
                }
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        movies: getFilteredMovies(state),
        filtering: state.filtering,
    }
}

export default connect(mapStateToProps)(HomePage);