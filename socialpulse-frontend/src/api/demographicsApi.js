import axiosClient from './axiosClient'

// Get aggregated audience statistics
export async function getAudienceStats(platform = null, topic = null) {
  const params = {}
  if (platform) params.platform = platform
  if (topic)    params.topic    = topic
  const response = await axiosClient.get('/api/v1/demographics/audience', { params })
  return response.data
}

// Get demographic distribution by metric
export async function getDistribution(metric = 'age', platform = null) {
  // metric: "age", "gender", "location", "interest"
  const params = { metric }
  if (platform) params.platform = platform
  const response = await axiosClient.get('/api/v1/demographics/distribution', { params })
  return response.data
}
