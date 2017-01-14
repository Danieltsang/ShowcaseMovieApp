import React, { Component } from 'react';
import './pagination.css';

class Pagination extends Component {
    constructor() {
        super();

        this.state = {
            pageNumberSelected: 1
        };
    }

    onClick(page) {
        this.setState({pageNumberSelected: page});
        this.props.onClick(page);
    }

    render() {
        const numbers = [];
        for (let i = 1; i < this.props.totalPages + 1; i++) {
            let number = (
                <b
                    className={"Pagination-page-number " + (this.state.pageNumberSelected === i ? "Selected" : "")}
                    onClick={this.onClick.bind(this, i)} key={"page" + i}>
                    {i}
                </b>
            );
            numbers.push(number);
        }
        return (
            <div className="Pagination">
                {numbers}
            </div>
        );
    }
}

Pagination.propTypes = {
    onClick: React.PropTypes.func,
    totalPages: React.PropTypes.number
};

Pagination.defaultProps = {
    totalPages: 0
};

export default Pagination;