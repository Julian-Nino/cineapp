import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import MediaPage from '../modules/media/MediaPage';
import GenerosPage from '../modules/generos/GenerosPage';
import DirectoresPage from '../modules/directores/DirectoresPage';
import ProductorasPage from '../modules/productoras/ProductorasPage';
import TiposPage from '../modules/tipos/TiposPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/media" replace />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="generos" element={<GenerosPage />} />
          <Route path="directores" element={<DirectoresPage />} />
          <Route path="productoras" element={<ProductorasPage />} />
          <Route path="tipos" element={<TiposPage />} />
          <Route path="*" element={<Navigate to="/media" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

