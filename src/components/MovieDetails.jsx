// src/components/MovieDetails.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './MovieDetails.css'

const MovieDetails = ({ favorites, onAddFavorite, onRemoveFavorite }) => {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  
  const API_KEY = 'b88a4318' 
 

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
        )
        const data = await response.json()

        if (data.Response === 'True') {
          setMovie(data)
        } else {
          setError(data.Error || 'Movie not found')
        }
      } catch (err) {
        setError('Failed to fetch movie details. Please try again.')
        console.error('Error fetching movie details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id])

  const isFavorite = () => {
    return favorites.some(fav => fav.imdbID === id)
  }

  const toggleFavorite = () => {
    if (movie) {
      if (isFavorite()) {
        onRemoveFavorite(id)
      } else {
        onAddFavorite(movie)
      }
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Loading movie details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Movie</h3>
        <p>{error}</p>
        <Link to="/" className="back-button">
          ← Back to Search
        </Link>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="error-container">
        <div className="error-icon">🎬</div>
        <h3>Movie Not Found</h3>
        <p>The movie you're looking for doesn't exist.</p>
        <Link to="/" className="back-button">
          ← Back to Search
        </Link>
      </div>
    )
  }

  return (
    <div className="movie-details">
      {/* Header with Back Button and Favorite */}
      <div className="movie-details-header">
        <Link to="/" className="back-button">
          ← Back to Search
        </Link>
        <button
          className={`favorite-toggle ${isFavorite() ? 'favorited' : ''}`}
          onClick={toggleFavorite}
        >
          <span className="favorite-icon">
            {isFavorite() ? '★' : '☆'}
          </span>
          <span className="favorite-text">
            {isFavorite() ? 'Remove from Favorites' : 'Add to Favorites'}
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="movie-details-content">
        {/* Poster Section */}
        <div className="poster-section">
          <div className="movie-poster-large">
            {movie.Poster && movie.Poster !== 'N/A' ? (
              <img src={movie.Poster} alt={movie.Title} />
            ) : (
              <div className="no-poster-large">
                <span>No Image Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="info-section">
          {/* Title and Basic Info */}
          <div className="movie-header">
            <h1 className="movie-title">{movie.Title}</h1>
            <div className="movie-meta">
              <span className="year">{movie.Year}</span>
              <span className="rated">{movie.Rated}</span>
              <span className="runtime">{movie.Runtime}</span>
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <span className="rating">
                  ⭐ {movie.imdbRating}/10
                </span>
              )}
            </div>
          </div>

          {/* Plot Section */}
          <div className="plot-section">
            <h2>Plot</h2>
            <p className="movie-plot">
              {movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : 'No plot summary available.'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="details-grid">
            <div className="detail-group">
              <div className="detail-item">
                <span className="detail-label">Genre:</span>
                <span className="detail-value">{movie.Genre || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Director:</span>
                <span className="detail-value">{movie.Director || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Actors:</span>
                <span className="detail-value">{movie.Actors || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-group">
              <div className="detail-item">
                <span className="detail-label">Writer:</span>
                <span className="detail-value">{movie.Writer || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Language:</span>
                <span className="detail-value">{movie.Language || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Country:</span>
                <span className="detail-value">{movie.Country || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-group">
              <div className="detail-item">
                <span className="detail-label">Released:</span>
                <span className="detail-value">{movie.Released || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Box Office:</span>
                <span className="detail-value">{movie.BoxOffice || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Awards:</span>
                <span className="detail-value">{movie.Awards || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {(movie.Production || movie.Website) && (
            <div className="additional-info">
              <h3>Additional Information</h3>
              <div className="detail-item">
                <span className="detail-label">Production:</span>
                <span className="detail-value">{movie.Production || 'N/A'}</span>
              </div>
              {movie.Website && movie.Website !== 'N/A' && (
                <div className="detail-item">
                  <span className="detail-label">Website:</span>
                  <a href={movie.Website} target="_blank" rel="noopener noreferrer" className="website-link">
                    Visit Official Website
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieDetails