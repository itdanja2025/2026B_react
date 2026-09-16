
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Yoo from './pages/Yoo';
import Kang from './pages/Kang';
import Shin from './pages/Shin';
import Seo from './pages/Seo';
import NotFound from '../day04/NotFound';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="yoo" element={<Yoo />} />
          <Route path="kang" element={<Kang />} />
          <Route path="shin" element={<Shin />} />
          <Route path="seo" element={<Seo />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
  );
}

export default App;