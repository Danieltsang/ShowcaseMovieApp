import React, { Component } from 'react';
import './reviews.css';
import Constants from '../constants.js';
import axios from 'axios';

class Reviews extends Component {
    constructor() {
        super();

        this.state = {
            reviews: [],
            showReviews: false
        };

        this.loadReviews = this.loadReviews.bind(this);
        this.hideReviews = this.hideReviews.bind(this);
    }

    loadReviews(e) {
        if (this.state.reviews.length) {
            this.setState({
                showReviews: true
            });
            return;
        }

        // Did not implement pagination for reviews
        axios.get(`https://api.themoviedb.org/3/movie/${this.props.movieId}/reviews`, {
            params: {
                api_key: Constants.API_KEY,
                language: Constants.LANGUAGE
            }
        }).then(res => {
            this.setState({
                showReviews: true,
                reviews: res.data.results
            });
        });
    }

    hideReviews(e) {
        this.setState({showReviews: false});
    }

    renderReviews() {
        if (!this.state.showReviews) {
            return <p className="textButton" onClick={this.loadReviews}>Load Reviews</p>;
        }
        let content;
        if (this.state.reviews.length !== 0) {
            content = this.state.reviews.map(review => {
                return (
                    <div key={review.id} className="Reviews-review-information">
                        <b>Author: {review.author}</b>
                        <p>{review.content.length > 200 ? review.content.substr(0, 200).trim() + '...' : review.content}</p>
                        <a href={review.url}>Full review</a>
                    </div>
                );
            });
        } else {
            content = <p>No reviews at this time.</p>;
        }
        return (
            <div className="Reviews-review">
                <b>Reviews</b>
                <p className="textButton" onClick={this.hideReviews}>Hide</p>
                {content}
            </div>
        );
    }

    render () {
        return (
            <div className="Reviews">
                {this.renderReviews()}
            </div>
        );
    }
}

Reviews.propTypes = {
    movieId: React.PropTypes.number.isRequired
};

export default Reviews;