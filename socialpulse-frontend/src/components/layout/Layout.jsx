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
import Background3DMesh from '../3d/Background3DMesh.jsx'

function Layout() {
  return (
    // Full-screen dark background with 3D perspective container
    <div className="flex h-screen bg-[#020510] text-[#dae2fd] overflow-hidden relative perspective-1000">
      {/* Ambient background depth orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-500/[0.12] blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full bg-purple-500/[0.09] blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full bg-blue-500/[0.06] blur-[120px] pointer-events-none z-0" />

      {/* 60fps GPU 3D Neural Constellation & Depth Mesh */}
      <Background3DMesh />
      
      {/* LEFT: Navigation sidebar (fixed width) */}
      <Sidebar />
      
      {/* RIGHT: Everything else (topbar + page content) */}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        
        {/* TOP: Header bar */}
        <TopBar />
        
        {/* MAIN: Page content — scrollable with 3D room */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-7 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
