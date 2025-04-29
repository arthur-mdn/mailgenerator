import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminUploadPage from "./AdminUploadPage.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/:model" element={<App />} />
              <Route path="/:model/admin" element={<AdminUploadPage />} />
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)