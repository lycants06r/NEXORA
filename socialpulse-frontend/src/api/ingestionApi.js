/*
  api/ingestionApi.js
  -------------------
  All API calls related to data collection / ingestion.
*/

import axiosClient from './axiosClient'

// Trigger a new data collection task
export async function triggerCollection(platform, query, maxResults = 50) {
  const response = await axiosClient.post('/api/v1/ingestion/collect', {
    platform,
    query,
    max_results: maxResults,
  })
  return response.data
}

// Check status of a running collection task
export async function getTaskStatus(taskId) {
  const response = await axiosClient.get(`/api/v1/ingestion/status/${taskId}`)
  return response.data
}

// Get recently collected posts (from memory cache)
export async function getRecentPosts(platform = null, limit = 50) {
  const params = { limit }
  if (platform) params.platform = platform
  const response = await axiosClient.get('/api/v1/ingestion/recent', { params })
  return response.data
}

// Get overall collection statistics
export async function getCollectionStats() {
  const response = await axiosClient.get('/api/v1/ingestion/stats')
  return response.data
}

// Trigger collection for all platforms at once
export async function collectAllPlatforms() {
  const response = await axiosClient.post('/api/v1/ingestion/collect/all')
  return response.data
}

// Check if backend is running
export async function checkHealth() {
  const response = await axiosClient.get('/health')
  return response.data
}
