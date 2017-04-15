import React, { PropTypes } from 'react';

const propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    movie: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        genres: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
        releaseYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        rating: PropTypes.number.isRequired,
        isEditing: PropTypes.bool
    }).isRequired,
    movieId: PropTypes.number.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired,
        PropTypes.array.isRequired
    ]),
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};

class TextInput extends React.Component {
    constructor(props) {
        super(props);

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
    }

    handleOnChange(event) {
        this.props.onChange(this.props.movie.id, event);
    }

    handleOnKeyDown(event) {
        this.props.onKeyDown(this.props.movie.id, event);
    }

    handleOnBlur(event) {
        this.props.onBlur(this.props.movie, event);
    }

    render() {
        const { name, value } = this.props;

        return (
            <input
                type="text"
                name={name}
                value={value}
                onChange={this.handleOnChange}
                onKeyDown={this.handleOnKeyDown}
                onBlur={this.handleOnBlur}
            />
        );
    }
}

TextInput.propTypes = propTypes;

export default TextInput;