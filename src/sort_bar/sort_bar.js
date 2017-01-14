import React, { Component } from 'react';
import './sort_bar.css';

class SortBar extends Component {
    renderOptions() {
        return this.props.types.map(category => {
            // Using the long chained statement to change capitalized, underscored words to human readable words
            // Could easily be replaceable by also making constants for human readable words
            return [
                <option key={category + "_option_descending"} value={this.props.values[category].DESCENDING}>
                    {category.split('_').map(word => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)).join(' ') + " Desc"}
                </option>,
                <option key={category + "_option_ascending"} value={this.props.values[category].ASCENDING}>
                    {category.split('_').map(word => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)).join(' ') + " Asc"}
                </option>
            ];
        });
    }
    render() {
        return (
            <div className="SortBar">
                <p>Sort By:</p>
                <select className="SortBar-select" onChange={this.props.onSelect}>
                    <option value="NONE">(Select)</option>
                    {this.renderOptions()}
                </select>
            </div>
        );
    }
}

SortBar.propTypes = {
    onSelect: React.PropTypes.func.isRequired,
    types: React.PropTypes.array.isRequired,
    values: React.PropTypes.object.isRequired
};

export default SortBar;