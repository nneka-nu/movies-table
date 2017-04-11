import React, { PropTypes } from 'react';

const propTypes = {
    currentPage: PropTypes.number.isRequired,
    numOfPages: PropTypes.number.isRequired,
    onSetCurrentPage: PropTypes.func
};

class Pagination extends React.Component {
    constructor(props) {
        super(props);

        this.handlePageClick = this.handlePageClick.bind(this);
    }

    handlePageClick(event) {
        event.preventDefault();
        const id = event.target.id;
        const pageNum = parseInt(id.slice(id.indexOf('-') + 1), 10);
        this.props.onSetCurrentPage(pageNum);
    }

    render() {
        const { numOfPages, currentPage } = this.props;
        const prevPage = currentPage - 1;
        const nextPage = currentPage + 1;

        return (
            <ul className="pagination">
                {numOfPages > 1 &&
                    currentPage > 1 &&
                    <li>
                        <a
                            href="#"
                            id={'page-' + prevPage}
                            onClick={this.handlePageClick}
                        >
                            &laquo;
                        </a>
                    </li>
                }
                {Array.from({length: numOfPages}, (v, i) => {
                    ++i;
                    return (
                        <li
                         key={'page-' + i}
                         className={'page' + (parseFloat(currentPage) === i ? ' active' : '')}
                        >
                            <a
                                href="#"
                                id={'page-' + i}
                                onClick={this.handlePageClick}
                            >
                                {i}
                            </a>
                        </li>
                    );
                })}
                {numOfPages > 1 &&
                    currentPage < numOfPages &&
                    <li>
                        <a
                            href="#"
                            id={'page-' + nextPage}
                            onClick={this.handlePageClick}
                        >
                            &raquo;
                        </a>
                    </li>
                }
            </ul>
        )
    }
}

Pagination.propTypes = propTypes;

export default Pagination;