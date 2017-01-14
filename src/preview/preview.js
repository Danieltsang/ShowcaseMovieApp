import React, { Component } from 'react';
import './preview.css';

import Reviews from '../reviews/reviews';

class Preview extends Component {
    getPreviewValue(property) {
        const propertiesWithPrefix = ['budget', 'revenue'];
        let value = this.props.previewDetails[property];
        if (!value) {
            value = "Not yet available"
        } else if (propertiesWithPrefix.indexOf(property) !== -1) {
            value = '$' + value;
        } else if (property === 'homepage') {
            let sitePath = value;
            value = value.length > 30 ? value.substr(0, 30) + "..." : value;
            value = <a onClick={e => e.stopPropagation()} href={sitePath}>{value}</a>;
        }
        return value;
    }

    renderDetails() {
        const usefulData = ['title', 'release_date', 'budget', 'overview', 'homepage', 'revenue', 'tagline'];
        return usefulData.map(property => {
            let userFriendlyProperty = property.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            return (
                <div key={property} className="Preview-detail">
                    <b>{userFriendlyProperty}</b>
                    <p>{this.getPreviewValue(property)}</p>
                </div>
            );
        });
    }

    renderPoster() {
        if (!this.props.posterImagePath && !this.props.posterSize) {
            return;
        }
        var imagePath = this.props.posterImagePath + this.props.posterSize + this.props.previewDetails.poster_path;
        var styling = {
            width: this.props.posterSize.substring(1) + "px",
            height: "auto",
            border: "2px solid #fff"
        };
        return (
            <img
                alt="movie_poster"
                src={imagePath}
                style={styling}
            />
        );
    }

    render() {
        if (!this.props.previewId) {
            return <p>Choose a movie to see the details!</p>;
        }
        if (this.props.isLoading) {
            return <p className="loading">Loading</p>;
        }
        return (
            <div onClick={this.props.onClick} className="Preview">
                {this.renderDetails()}
                <Reviews movieId={this.props.previewId}/>
            </div>
        );
    }
}

Preview.propTypes = {
    isLoading: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    posterImagePath: React.PropTypes.string,
    posterSize: React.PropTypes.string,
    previewId: React.PropTypes.number.isRequired,
    previewDetails: React.PropTypes.object.isRequired
};

Preview.defaultProps = {
    isLoading: false
};

export default Preview;