import React, { PropTypes } from 'react';

const propTypes = {
    movieId: PropTypes.number,
    placement: PropTypes.oneOf(['inline', 'modal']).isRequired,
    value: PropTypes.number.isRequired,
    clearRating: PropTypes.bool,
    onSetRatingState: PropTypes.func.isRequired,
    onValidateRating: PropTypes.func.isRequired
};

const defaultProps = {
    movieId: 0,
    value: 0,
    clearRating: false
}

class Rating extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            modalActiveStars: Array(5).fill(''),
            inlineActiveStars: Array.from({length: 5}, (v, i) => {
                return i < props.value ? ' active' : ''
            }),
            rating: parseInt(props.value, 10) || ''
        }

        this.handleStarClickOrMouseEnter = this.handleStarClickOrMouseEnter.bind(this);
        this.handleStarMouseLeave = this.handleStarMouseLeave.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.clearRating) {
            this.setState({
                modalActiveStars: Array(5).fill(''),
                rating: ''
            });
        }
    }

    handleStarClickOrMouseEnter(event) {
        const { placement, movieId, onSetRatingState } = this.props;
        let activeStars = this.state[placement + 'ActiveStars'].slice();

        const type = event.type;
        let id = event.target.id.slice(-1);

        if (id < 0 || id > 4) {
            id = 0;
        }

        let rating = parseInt(id, 10) + 1;
        
        if (type === 'click') {
            this.setState({rating})
            onSetRatingState(rating, movieId);
        }

        for (let i = 0; i < 5; i++) {
            if (i <= id) {
                if (type === 'mouseenter' && activeStars[i] !== ' active' && activeStars[i].indexOf('hover') === -1) {
                    activeStars[i] += ' hover';
                } else if (type === 'click' && activeStars[i].indexOf('active') === -1) {
                    activeStars[i] += ' active';
                }
            } else {
                if (type === 'click') {
                    activeStars[i] = '';
                }
            }
        }
        
        this.setState({[placement + 'ActiveStars']: activeStars})
    }

    handleStarMouseLeave(event) {
        const { placement, movieId, onValidateRating } = this.props;
        let activeStars = this.state[placement + 'ActiveStars'].slice();

        for (let i = 0; i < 5; i++) {
            let index = activeStars[i].indexOf(' hover');

            if (index >= 0) {
                activeStars[i] = activeStars[i].slice(0, index) + activeStars[i].slice(index + 6);
            }
        }
        
        this.setState({[placement + 'ActiveStars']: activeStars});
        onValidateRating(this.state.rating, movieId);
    }

    render() {
        const { placement } = this.props;

        return (
            <p className={'stars ' + placement + '-stars'}>
                {Array(5).fill(undefined).map((v, i) => {
                    return (
                        <span key={'star-' + i} >
                            <i
                                id={'star-' + i}
                                className={'material-icons star-icon' + (this.state[placement + 'ActiveStars'][i] || '')}
                                onClick={this.handleStarClickOrMouseEnter}
                                onMouseEnter={this.handleStarClickOrMouseEnter}
                                onMouseLeave={this.handleStarMouseLeave}
                            >
                                &#xE838;
                            </i>
                        </span>
                    )
                })}
            </p>
        )
    }
}

Rating.propTypes = propTypes;
Rating.defaultProps = defaultProps;
export default Rating;