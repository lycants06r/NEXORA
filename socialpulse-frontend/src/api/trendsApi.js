import axiosClient from './axiosClient'

// Get currently trending topics
export async function getCurrentTrends(platform = null, topN = 10) {
  const params = { top_n: topN }
  if (platform) params.platform = platform
  const response = await axiosClient.get('/api/v1/trends/current', { params })
  return response.data
}

// Get topic clusters from BERTopic
export async function getTopicClusters(platform = null) {
  const params = {}
  if (platform) params.platform = platform
  const response = await axiosClient.get('/api/v1/trends/topics', { params })
  return response.data
}

// Get detected anomalies / spikes
export async function getAnomalies(keyword = null) {
  const params = {}
  if (keyword) params.keyword = keyword
  const response = await axiosClient.get('/api/v1/trends/anomalies', { params })
  return response.data
}

// Get keyword velocity (how fast it's rising)
export async function getKeywordVelocity(keyword) {
  const response = await axiosClient.get('/api/v1/trends/keyword-velocity', {
    params: { keyword }
  })
  return response.data
}
