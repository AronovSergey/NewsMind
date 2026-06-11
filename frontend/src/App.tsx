import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>

        <footer className="py-5 text-center text-xs text-gray-400">
          Powered by live news · Updated hourly
        </footer>
      </div>
    </BrowserRouter>
  );
}
