import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Sidebar from './components/Sidebar/Sidebar';
import { ROUTES } from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <Routes>
              {ROUTES.map(route => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
            <Footer />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
