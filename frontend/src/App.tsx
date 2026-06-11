import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import FetchesPage from './pages/FetchesPage/FetchesPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/fetches" element={<FetchesPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
