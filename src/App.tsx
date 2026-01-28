import { Routes, Route, Navigate } from 'react-router';
import './App.css';
import Layout from './components/Layout';
import DPPage from './pages/DPPage';
import MatrixPage from './pages/MatrixPage';
import FormulaPage from './pages/FormulaPage';
import { DEFAULT_PATH } from './routes/config';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={DEFAULT_PATH} replace />} />
        <Route path="dp" element={<DPPage />} />
        <Route path="matrix" element={<MatrixPage />} />
        <Route path="formula" element={<FormulaPage />} />
        <Route path="*" element={<Navigate to={DEFAULT_PATH} replace />} />
      </Route>
    </Routes>
  );
}

export default App;
