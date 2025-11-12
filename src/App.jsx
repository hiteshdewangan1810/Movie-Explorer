import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import MovieSearch from './components/MovieSearch'
import MovieDetails from './components/MovieDetails'
import Favorites from './components/Favorites'
import './App.css'

function App() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const storedFavorites = localStorage.getItem('movieFavorites')
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  const addToFavorites = (movie) => {
    const updatedFavorites = [...favorites, movie]
    setFavorites(updatedFavorites)
    localStorage.setItem('movieFavorites', JSON.stringify(updatedFavorites))
  }

  const removeFromFavorites = (imdbID) => {
    const updatedFavorites = favorites.filter(movie => movie.imdbID !== imdbID)
    setFavorites(updatedFavorites)
    localStorage.setItem('movieFavorites', JSON.stringify(updatedFavorites))
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Movie Explorer</h1>
        <nav>
          <a href="/">Search</a>
          <a href="/favorites">Favorites ({favorites.length})</a>
        </nav>
      </header>

      
      
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <MovieSearch 
                favorites={favorites}
                onAddFavorite={addToFavorites}
                onRemoveFavorite={removeFromFavorites}
              />
            } 
          />
          <Route 
            path="/movie/:id" 
            element={
              <MovieDetails 
                favorites={favorites}
                onAddFavorite={addToFavorites}
                onRemoveFavorite={removeFromFavorites}
              />
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <Favorites 
                favorites={favorites}
                onRemoveFavorite={removeFromFavorites}
              />
            } 
          />
        </Routes>
      </main>
    </div>
  )
}

export default App