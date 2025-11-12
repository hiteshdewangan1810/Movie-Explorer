import React from 'react'
import { Link } from 'react-router-dom'
import './Favorites.css'

const Favorites = ({ favorites, onRemoveFavorite }) => {
  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>Your Favorites</h2>
        <p>You haven't added any movies to your favorites yet.</p>
        <Link to="/" className="back-link">← Search for Movies</Link>
      </div>
    )
  }

  return (
    <div className="favorites">
      <div className="favorites-header">
        <h2>Your Favorite Movies ({favorites.length})</h2>
        <Link to="/" className="back-link">← Back to Search</Link>
      </div>
      
      <div className="movies-grid">
        {favorites.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <Link to={`/movie/${movie.imdbID}`} className="movie-link">
              <div className="movie-poster">
                {movie.Poster && movie.Poster !== 'N/A' ? (
                  <img src={movie.Poster} alt={movie.Title} />
                ) : (
                  <div className="no-poster">No Image</div>
                )}
              </div>
              <div className="movie-info">
                <h3 className="movie-title">{movie.Title}</h3>
                <p className="movie-year">{movie.Year}</p>
                <p className="movie-genre">{movie.Genre}</p>
              </div>
            </Link>
            <button
              className="favorite-button favorited"
              onClick={() => onRemoveFavorite(movie.imdbID)}
            >
              ★
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Favorites