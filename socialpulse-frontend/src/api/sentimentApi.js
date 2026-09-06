/*
  api/sentimentApi.js
  -------------------
  All API calls for sentiment analysis.
*/

import axiosClient from './axiosClient'

// Analyze sentiment of a single text
export async function analyzeText(text, platform = 'twitter') {
  const response = await axiosClient.post('/api/v1/sentiment/analyze', {
    text,
    platform,
  })
  return response.data
}

// Analyze sentiment of multiple posts at once
export async function analyzeBatch(posts) {
  const response = await axiosClient.post('/api/v1/sentiment/analyze-batch', {
    posts,
  })
  return response.data
}

// Get sentiment over time (for timeline chart)
export async function getSentimentTimeline(params = {}) {
  // params: { topic, platform, start, end, granularity }
  const response = await axiosClient.get('/api/v1/sentiment/timeline', { params })
  return response.data
}

// Get emotion distribution for a topic
export async function getEmotionDistribution(topic, platform = null) {
  const params = { topic }
  if (platform) params.platform = platform
  const response = await axiosClient.get('/api/v1/sentiment/emotions', { params })
  return response.data
}

// Get sentiment summary (counts of pos/neg/neutral)
export async function getSentimentSummary(platform = null) {
  const params = {}
  if (platform) params.platform = platform
  const response = await axiosClient.get('/api/v1/sentiment/summary', { params })
  return response.data
}
