import React, { Component } from 'react';
import './pagination.css';

class Pagination extends Component {
    constructor() {
        super();

        this.state = {
            pageNumberSelected: 1
        };

        this.onClick = this.onClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.sortType !== nextProps.sortType) {
            this.setState({pageNumberSelected: 1});
        }
    }

    onClick(page) {
        this.setState({pageNumberSelected: page});
        this.props.onClick(page);
    }

    renderNumbers() {
        const numbers = [];
        for (let i = 1; i < this.props.totalPages + 1; i++) {
            const number = (
                <b
                    className={"Pagination-page-number " + (this.state.pageNumberSelected === i ? "Selected" : "")}
                    onClick={this.onClick.bind(null, i)} key={"page" + i}>
                    {i}
                </b>
            );
            numbers.push(number);
        }
        return numbers;
    }

    render() {
        return (
            <div className="Pagination">
                {this.renderNumbers()}
            </div>
        );
    }
}

Pagination.propTypes = {
    onClick: React.PropTypes.func,
    sortType: React.PropTypes.string,
    totalPages: React.PropTypes.number
};

Pagination.defaultProps = {
    totalPages: 0
};

export default Pagination;