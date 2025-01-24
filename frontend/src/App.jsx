import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './components/homepage.jsx';
import Header from './components/header.jsx';
import Login from './components/login.jsx';
import Settings from './components/settings.jsx';
import Admin from './components/admin.jsx';
import Qr from './components/qr.jsx';
import NotFound from './components/404.jsx';

const AppContent = () => {
    const location = useLocation();
    const showHeader = location.pathname !== "/";

    return (
        <>
            {showHeader && <Header />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/add-user" element={<Admin />} />
                <Route path="/qr-generation" element={<Qr />} />
                {/* Catch-all route for undefined paths */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
