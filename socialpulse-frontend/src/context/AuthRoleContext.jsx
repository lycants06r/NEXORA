/*
  AuthRoleContext.jsx
  -------------------
  SIH26152 Role-Based Access Control (RBAC) System for NEXORA.
  Supports three primary operational roles:
  - ADMIN: Full operational clearance, connectors reconfiguration, ingestion triggers, data export.
  - ANALYST: Deep analytics, trends calibration, sentiment drill-down, network graph queries, export.
  - VIEWER: Read-only situational telemetry dashboards and summary intelligence reports.
*/

import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthRoleContext = createContext()

export const ROLES = {
  ADMIN: {
    id: 'ADMIN',
    name: 'Chief Intelligence Officer',
    badge: 'ADMIN',
    color: 'border-cyan-500/50 bg-cyan-500/20 text-[#4cd7f6]',
    canTriggerIngestion: true,
    canConfigureConnectors: true,
    canExportReports: true,
    canDrilldown: true,
    canResolveAlerts: true,
    description: 'Full root access to ingestion triggers, connector APIs, threat overrides, and intelligence briefings.',
  },
  ANALYST: {
    id: 'ANALYST',
    name: 'Threat Signal Analyst',
    badge: 'ANALYST',
    color: 'border-purple-500/50 bg-purple-500/20 text-[#ddb7ff]',
    canTriggerIngestion: true,
    canConfigureConnectors: false,
    canExportReports: true,
    canDrilldown: true,
    canResolveAlerts: true,
    description: 'Analytical clearance across all 5 intelligence vectors, custom queries, and report generation.',
  },
  VIEWER: {
    id: 'VIEWER',
    name: 'Situational Observer',
    badge: 'VIEWER',
    color: 'border-emerald-500/50 bg-emerald-500/20 text-[#4edea3]',
    canTriggerIngestion: false,
    canConfigureConnectors: false,
    canExportReports: true,
    canDrilldown: false,
    canResolveAlerts: false,
    description: 'Read-only situational telemetry access to live overview charts and high-level summaries.',
  }
}

export function AuthRoleProvider({ children }) {
  // Read initial role from localStorage or default to ADMIN for hackathon evaluation
  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem('nexora_user_role')
    return ROLES[saved] || ROLES.ADMIN
  })

  const setRole = (roleKey) => {
    if (ROLES[roleKey]) {
      setCurrentRole(ROLES[roleKey])
      localStorage.setItem('nexora_user_role', roleKey)
    }
  }

  return (
    <AuthRoleContext.Provider value={{ role: currentRole, setRole, ROLES }}>
      {children}
    </AuthRoleContext.Provider>
  )
}

export function useAuthRole() {
  const context = useContext(AuthRoleContext)
  if (!context) {
    throw new Error('useAuthRole must be used within an AuthRoleProvider')
  }
  return context
}
