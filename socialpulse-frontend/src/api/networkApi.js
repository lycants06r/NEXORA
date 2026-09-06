import axiosClient from './axiosClient'

// Get top influencer users
export async function getInfluencers(topN = 10, platform = null) {
  const params = { top_n: topN }
  if (platform) params.platform = platform
  const response = await axiosClient.get('/api/v1/network/influencers', { params })
  return response.data
}

// Get detected communities / clusters
export async function getCommunities(platform = null) {
  const params = {}
  if (platform) params.platform = platform
  const response = await axiosClient.get('/api/v1/network/communities', { params })
  return response.data
}

// Get graph data for visualization (nodes + edges)
export async function getGraphData(platform = null, maxNodes = 100) {
  const params = { max_nodes: maxNodes }
  if (platform) params.platform = platform
  const response = await axiosClient.get('/api/v1/network/graph', { params })
  return response.data
}

// Get influence propagation result
export async function getPropagation(seedUserId, probability = 0.1) {
  const response = await axiosClient.get('/api/v1/network/propagation', {
    params: { seed_user_id: seedUserId, probability }
  })
  return response.data
}
