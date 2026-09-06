/*
  api/axiosClient.js
  ------------------
  Base Axios instance used by all API files.
  All API calls go through this client.
  Handles errors in one central place.
*/

import axios from 'axios'

// Create an Axios instance with default settings
const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 30000,  // 30 seconds (ML models can be slow)
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
})

// ── REQUEST INTERCEPTOR ───────────────────────────────────────
// Runs before every request is sent
axiosClient.interceptors.request.use(
  (config) => {
    // Log every outgoing request (helpful for debugging)
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// ── RESPONSE INTERCEPTOR ──────────────────────────────────────
// Runs after every response is received
axiosClient.interceptors.response.use(
  (response) => {
    // Successful response — just return it
    return response
  },
  (error) => {
    // Handle common errors in one place
    if (error.response) {
      // Server responded with an error status code
      const status  = error.response.status
      const message = error.response.data?.detail || 
                      error.response.data?.message ||
                      'An error occurred'

      if (status === 404) {
        console.warn(`⚠️ Not Found: ${error.config.url}`)
      } else if (status === 500) {
        console.error(`🔴 Server Error: ${message}`)
      } else if (status === 422) {
        console.error(`📋 Validation Error: ${message}`)
      }

    } else if (error.code === 'ECONNREFUSED' || 
               error.code === 'ERR_NETWORK') {
      // Backend is not running
      console.error(
        '🔴 Cannot connect to backend. ' +
        'Make sure the API is running: python run.py'
      )
    }

    return Promise.reject(error)
  }
)

export default axiosClient
