// src/components/MovieSearch.jsx - Clean Design
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './MovieSearch.css'

const MovieSearch = ({ favorites, onAddFavorite, onRemoveFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)


   
  const API_KEY = 'b88a4318'
 
    

  const searchMovies = async (searchPage = 1, append = false) => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&page=${searchPage}`
      )
      const data = await response.json()

      if (data.Response === 'True') {
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie) => {
            try {
              const detailsResponse = await fetch(
                `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
              )
              const details = await detailsResponse.json()
              return details.Response === 'True' ? details : movie
            } catch (err) {
              return movie
            }
          })
        )

        if (append) {
          setMovies(prev => [...prev, ...detailedMovies])
        } else {
          setMovies(detailedMovies)
        }
        setTotalResults(parseInt(data.totalResults))
        setHasSearched(true)
      } else {
        setError(data.Error || 'No movies found')
        if (!append) {
          setMovies([])
          setHasSearched(true)
        }
      }
    } catch (err) {
      setError('Failed to fetch movies. Please check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    searchMovies(1, false)
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    searchMovies(nextPage, true)
  }

  const isFavorite = (imdbID) => {
    return favorites.some(movie => movie.imdbID === imdbID)
  }

  const toggleFavorite = (movie) => {
    if (isFavorite(movie.imdbID)) {
      onRemoveFavorite(movie.imdbID)
    } else {
      onAddFavorite(movie)
    }
  }

  return (
    <div className="movie-search">
      {/* Clean Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Explore Your Movie</h1>
          
          <div className="hero-search-container">
            <form onSubmit={handleSearch} className="hero-search-form">
              <div className="hero-search-input-group">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for movies, actors, or directors..."
                  className="hero-search-input"
                />
                <button 
                  type="submit" 
                  className="hero-search-button" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="button-loading">
                      <span className="loading-spinner"></span>
                      Searching...
                    </div>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Searching movies...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <div className="error-text">
            <strong>{error}</strong>
          </div>
        </div>
      )}

      {!error && movies.length > 0 && (
        <>
          <div className="results-header">
            <h2>Search Results ({totalResults} found)</h2>
          </div>
          <div className="movies-grid">
            {movies.map((movie) => (
              <div key={movie.imdbID} className="movie-card">
                <Link to={`/movie/${movie.imdbID}`} className="movie-link">
                  <div className="movie-poster">
                    {movie.Poster && movie.Poster !== 'N/A' ? (
                      <img src={movie.Poster} alt={movie.Title} />
                    ) : (
                      <div className="no-poster">
                        <span>No Image</span>
                      </div>
                    )}
                    <div className="poster-overlay"></div>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.Title}</h3>
                    <div className="movie-details">
                      <span className="movie-year">{movie.Year}</span>
                      {movie.Genre && movie.Genre !== 'N/A' && (
                        <span className="movie-genre">
                          {movie.Genre.split(',')[0]}
                          {movie.Genre.split(',').length > 1 && `, ${movie.Genre.split(',')[1]}`}
                          {movie.Genre.split(',').length > 2 && `, ...`}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                <button
                  className={`favorite-button ${isFavorite(movie.imdbID) ? 'favorited' : ''}`}
                  onClick={() => toggleFavorite(movie)}
                  title={isFavorite(movie.imdbID) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorite(movie.imdbID) ? '★' : '☆'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {hasSearched && !loading && !error && movies.length === 0 && (
        <div className="no-results">
          <p>No movies found for "{searchTerm}"</p>
          <p>Try a different search term</p>
        </div>
      )}

      {movies.length > 0 && movies.length < totalResults && (
        <div className="load-more">
          <button onClick={handleLoadMore} disabled={loading} className="load-more-button">
            {loading ? 'Loading...' : 'Load More Movies'}
          </button>
        </div>
      )}
    </div>
  )
}

export default MovieSearch