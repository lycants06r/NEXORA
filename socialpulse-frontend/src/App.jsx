/*
  App.jsx
  -------
  Sets up all page routes.
  Each URL path maps to a page component.
*/

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout    from './components/layout/Layout.jsx'
import Dashboard      from './pages/Dashboard.jsx'
import IngestionPage  from './pages/IngestionPage.jsx'
import SentimentPage  from './pages/SentimentPage.jsx'
import DemographicsPage from './pages/DemographicsPage.jsx'
import TrendsPage     from './pages/TrendsPage.jsx'
import NetworkPage    from './pages/NetworkPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All pages are wrapped in Layout (sidebar + topbar) */}
        <Route path="/" element={<Layout />}>
          
          {/* Default route → Dashboard */}
          <Route index element={<Dashboard />} />
          
          {/* Each analytics section */}
          <Route path="ingestion"    element={<IngestionPage />} />
          <Route path="sentiment"    element={<SentimentPage />} />
          <Route path="demographics" element={<DemographicsPage />} />
          <Route path="trends"       element={<TrendsPage />} />
          <Route path="network"      element={<NetworkPage />} />
          
          {/* Catch unknown routes → redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
