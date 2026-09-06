/*
  Layout.jsx
  ----------
  The main shell that wraps every page.
  Contains the Sidebar on the left and TopBar on top.
  Page content goes in the middle (via <Outlet />).
*/

import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import TopBar  from './TopBar.jsx'

function Layout() {
  return (
    // Full-screen dark background
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      
      {/* LEFT: Navigation sidebar (fixed width) */}
      <Sidebar />
      
      {/* RIGHT: Everything else (topbar + page content) */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* TOP: Header bar */}
        <TopBar />
        
        {/* MAIN: Page content — scrollable */}
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
