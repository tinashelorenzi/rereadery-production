import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import BrowsePage from "./pages/BrowsePage"
import BookDetailPage from "./pages/BookDetailPage"
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { AuthProvider } from './services/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/book/:id" element={<BookDetailPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
