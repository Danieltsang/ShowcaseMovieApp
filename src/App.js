import React, {Component} from 'react';
import './App.css';
import _ from 'underscore'; // Very useful functional helpers
import Constants from './constants';
import axios from 'axios'; // Chose this HTTP library because I just wanted something quick and simple
import Preview from './preview/preview';
import Pagination from './pagination/pagination';
import SortBar from './sort_bar/sort_bar';

class App extends Component {
    constructor() {
        super();

        this.state = {
            currentPreviewId: 0,
            currentPreviewDetails: {},
            filterDetails: {
                maxDate: "",
                minDate: ""
            },
            isPreviewLoading: false,
            areMoviesFetched: false,
            movies: [], // Debated to use object or array here but opted to use array for easy iteration
                        // Object would provide easier access if I made each key the id of the movie
            moviesAreSorted: false,
            sortBy: "",
            totalPages: 1
        };

        this.secureBaseImageUrl = null;
        this.posterSize = null;

        this.unsetPreview = this.unsetPreview.bind(this);
        this.setPreview = this.setPreview.bind(this);
        this.sortMovies = this.sortMovies.bind(this);
        this.retrieveMoviePage = this.retrieveMoviePage.bind(this);
    }

    componentWillMount() {
        // Ideally this call for image path and sizes should be cached
        axios.get(`https://api.themoviedb.org/3/configuration`, {
            params: {
                api_key: Constants.API_KEY
            }
        }).then(res => {
            this.secureBaseImageUrl = res.data.images.secure_base_url;
            this.posterSize = res.data.images.poster_sizes[1]; // Default to 2nd smallest size
        });
    }

    componentDidMount() {
        this.getNowPlaying();
    }

    getMovieData(movies) {
        return movies.map(movie => {
            return {
                id: movie.id,
                title: movie.title,
                posterPath: movie.poster_path ? movie.poster_path : null
            };
        });
    }

    /**
     * Use this to reset data to nowplaying query results
     */
    getNowPlaying() {
        this.setState({
            areMoviesFetched: false
        });
        axios.get(`https://api.themoviedb.org/3/movie/now_playing`, {
            params: {
                api_key: Constants.API_KEY,
                region: Constants.REGION,
                language: Constants.LANGUAGE
            }
        }).then(res => {
            // We store max and min date to reuse for the discover query later since now playing is just a
            // customized discover query
            this.setState({
                currentPreviewId: 0,
                currentPreviewDetails: {},
                filterDetails: _.extend(this.state.filterDetails, {
                    maxDate: res.data.dates.maximum,
                    minDate: res.data.dates.minimum
                }),
                isPreviewLoading: false,
                areMoviesFetched: true,
                movies: this.getMovieData(res.data.results),
                moviesAreSorted: false,
                sortBy: "",
                totalPages: res.data.total_pages
            });
        });
    }

    /**
     * Not necessarily sorting on the now playing dataset since we must make a discover query to sort movies
     * Currently assuming the query strings for discover query to match nowplaying query
     * This leads to inconsistent data since discover queries returns more data than the nowplaying query
     */
    sortMovies(e) {
        const sortValue = e.target.value;
        if (sortValue === "NONE") {
            this.getNowPlaying();
            return;
        }
        this.setState({areMoviesFetched: false});
        axios.get(`https://api.themoviedb.org/3/discover/movie`, {
            params: {
                api_key: Constants.API_KEY,
                region: Constants.REGION,
                language: Constants.LANGUAGE,
                sort_by: sortValue,
                'primary_release_date.gte': this.state.filterDetails.minDate,
                'primary_release_date.lte': this.state.filterDetails.maxDate
            }
        }).then(res => {
            this.setState({
                areMoviesFetched: true,
                currentPreviewId: 0,
                movies: this.getMovieData(res.data.results),
                moviesAreSorted: true,
                sortBy: sortValue,
                totalPages: res.data.total_pages
            });
        });
    }

    unsetPreview() {
        this.setState({currentPreviewId: 0});
    }

    setPreview(movieId) {
        if (movieId === this.state.currentPreviewId) {
            this.unsetPreview();
            return;
        }
        this.setState({
            currentPreviewId: movieId,
            isPreviewLoading: true
        });

        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: {
                api_key: Constants.API_KEY,
                language: Constants.LANGUAGE,
            }
        }).then(res => {
            this.setState({
                isPreviewLoading: false,
                currentPreviewDetails: res.data
            });
        });
    }

    /**
     * As per explanation above, once movies are sorted, we must get page numbers
     * from the discover query and NOT the nowplaying query as they return
     * different data
     * @param pageNumber
     */
    retrieveMoviePage(pageNumber) {
        let request;
        if (!this.state.moviesAreSorted) {
            request = axios.get(`https://api.themoviedb.org/3/movie/now_playing`, {
                params: {
                    api_key: Constants.API_KEY,
                    region: Constants.REGION,
                    language: Constants.LANGUAGE,
                    page: pageNumber
                }
            });
        } else {
            request = axios.get(`https://api.themoviedb.org/3/discover/movie`, {
                params: {
                    api_key: Constants.API_KEY,
                    region: Constants.REGION,
                    language: Constants.LANGUAGE,
                    sort_by: this.state.sortBy,
                    'primary_release_date.gte': this.state.filterDetails.minDate,
                    'primary_release_date.lte': this.state.filterDetails.maxDate,
                    page: pageNumber
                }
            })
        }
        request.then(res => {
            this.setState({
                currentPreviewId: 0,
                movies: this.getMovieData(res.data.results)
            });
        });
    }

    renderMovies() {
        const titles = this.state.movies.map(movie => {
            const styling = {
                width: this.posterSize.substring(1) + "px",
                height: "239px",
                backgroundColor: "#283D4D",
                margin: "3px"
            };
            if (movie.posterPath) {
                return (
                    <img
                        alt="movie_poster"
                        key={movie.id}
                        onClick={this.setPreview.bind(null, movie.id)}
                        src={this.secureBaseImageUrl + this.posterSize + movie.posterPath}
                        style={styling}
                    />
                );
            } else {
                return (
                    <div
                        style={styling}
                        key={movie.id}
                        onClick={this.setPreview.bind(null, movie.id)}>
                        <b>{movie.title}</b>
                    </div>
                );
            }
        });
        return titles;
    }

    renderPreview() {
        if (!this.state.currentPreviewId) {
            return;
        }
        return (
            <div className="App-preview">
                <Preview
                    isLoading={this.state.isPreviewLoading}
                    onClose={this.unsetPreview}
                    previewId={this.state.currentPreviewId}
                    previewDetails={this.state.currentPreviewDetails}
                />
            </div>
        );
    }

    render() {
        let content;
        if (!this.state.movies.length) {
            content = <p>No movies to show</p>;
        } else if (this.state.areMoviesFetched) {
            content = this.renderMovies();
        }  else {
            content = <p>Loading...</p>;
        }

        return (
            <div className="App">
                <div className="App-header">
                    <h2>NOW PLAYING!</h2>
                    <h2>By Daniel Tsang</h2>
                </div>
                <div className="App-body">
                    <SortBar
                        types={Constants.CATEGORIES}
                        onSelect={this.sortMovies}
                        values={Constants.SORT_TYPES}
                    />
                    <div className="App-movie-list">
                        {content}
                    </div>
                    {this.renderPreview()}
                    <Pagination
                        onClick={this.retrieveMoviePage}
                        totalPages={this.state.totalPages}
                    />
                </div>
            </div>
        );
    }
}

export default App;
