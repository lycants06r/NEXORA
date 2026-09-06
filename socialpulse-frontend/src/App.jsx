/*
  App.jsx
  -------
  SIH26152 Complete Intelligence Operations Routing.
  Wraps the application in AuthRoleProvider (RBAC).
  Maps all pages cleanly with standard layout.
*/

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthRoleProvider } from './context/AuthRoleContext.jsx'
import Layout           from './components/layout/Layout.jsx'
import Dashboard        from './pages/Dashboard.jsx'
import AnalyticsPage    from './pages/AnalyticsPage.jsx'
import IngestionPage    from './pages/IngestionPage.jsx'
import SentimentPage    from './pages/SentimentPage.jsx'
import DemographicsPage from './pages/DemographicsPage.jsx'
import TrendsPage       from './pages/TrendsPage.jsx'
import NetworkPage      from './pages/NetworkPage.jsx'
import AIInsightsPage   from './pages/AIInsightsPage.jsx'
import AlertsPage       from './pages/AlertsPage.jsx'

function App() {
  return (
    <AuthRoleProvider>
      <BrowserRouter>
        <Routes>
          {/* All pages are wrapped in Layout (sidebar + topbar) */}
          <Route path="/" element={<Layout />}>
            {/* 1. Command Center / Overview */}
            <Route index element={<Dashboard />} />

            {/* 2. Platform Analytics Workstation (6 Platforms) */}
            <Route path="analytics"    element={<AnalyticsPage />} />

            {/* 3. Data Ingestion & Stream Pipeline */}
            <Route path="ingestion"    element={<IngestionPage />} />

            {/* 4. Sentiment & Multi-Emotion Radar */}
            <Route path="sentiment"    element={<SentimentPage />} />

            {/* 5. Demographics & Anonymous Profiling */}
            <Route path="demographics" element={<DemographicsPage />} />

            {/* 6. Viral Trends & Forecasting */}
            <Route path="trends"       element={<TrendsPage />} />

            {/* 7. Network Topology & Graph Centrality */}
            <Route path="network"      element={<NetworkPage />} />

            {/* 8. AI 5-Vector Synthesis Engine */}
            <Route path="ai-insights"  element={<AIInsightsPage />} />

            {/* 9. Threat & Anomaly Alerts Matrix */}
            <Route path="alerts"       element={<AlertsPage />} />

            {/* Catch unknown routes → redirect to Command Center */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthRoleProvider>
  )
}

export default App
