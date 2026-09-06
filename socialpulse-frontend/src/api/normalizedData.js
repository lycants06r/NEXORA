/*
  normalizedData.js
  ------------------
  SIH26152 Normalized Data Architecture & In-Memory Intelligence Store.
  
  Conforms to the required common schema:
  - platform: 'twitter' | 'telegram' | 'instagram' | 'facebook' | 'reddit' | 'youtube'
  - post_id / message_id: string
  - author_id: string (SHA-256 hashed/anonymized)
  - timestamp: ISO-8601 string
  - text: string
  - language: string ('en', 'hi', 'es', 'fr', 'de', 'ta', 'bn')
  - reply_to: string | null
  - mentions: string[]
  - hashtags: string[]
  - engagement: { likes, retweets, replies, shares, views, rate }
  - topic: string
  - sentiment: 'positive' | 'negative' | 'neutral'
  - emotion: 'positive' | 'negative' | 'neutral' | 'sarcasm' | 'anxiety' | 'excitement' | 'supportive' | 'opposition'
  - confidence: number (0.0 to 1.0)
  - location_hint: { country, region, city }
  - demographic_segment: { age_bracket: '18-24' | '25-34' | '35-44' | '45+', professional_interest: string }
  - community_id: number
  - processing_status: 'PROCESSED' | 'INDEXED' | 'QUEUED' | 'FLAGGED'
*/

export const PLATFORMS_CONFIG = [
  { id: 'all',       label: 'All Platforms',  icon: '🌐', color: '#4cd7f6' },
  { id: 'twitter',   label: 'X / Twitter',    icon: '🐦', color: '#4cd7f6', isPriority: true },
  { id: 'telegram',  label: 'Telegram',       icon: '✈️', color: '#0088cc', isPriority: true },
  { id: 'instagram', label: 'Instagram',      icon: '📸', color: '#E1306C' },
  { id: 'facebook',  label: 'Facebook',       icon: '👥', color: '#1877F2' },
  { id: 'reddit',    label: 'Reddit',         icon: '🤖', color: '#FF4500' },
  { id: 'youtube',   label: 'YouTube',        icon: '📺', color: '#EF4444' },
]

export const EMOTIONS_CONFIG = [
  { id: 'supportive',  label: 'Supportive',  color: '#4edea3', badge: 'bg-emerald-500/15 text-[#4edea3] border-emerald-500/30' },
  { id: 'excitement',  label: 'Excitement',  color: '#4cd7f6', badge: 'bg-cyan-500/15 text-[#4cd7f6] border-cyan-500/30' },
  { id: 'positive',    label: 'Positive',    color: '#10b981', badge: 'bg-green-500/15 text-green-400 border-green-500/30' },
  { id: 'neutral',     label: 'Neutral',     color: '#94a3b8', badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
  { id: 'anxiety',     label: 'Anxiety',     color: '#a855f7', badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  { id: 'sarcasm',     label: 'Sarcasm',     color: '#f59e0b', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  { id: 'opposition',  label: 'Opposition',  color: '#f43f5e', badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
  { id: 'negative',    label: 'Negative',    color: '#ef4444', badge: 'bg-red-500/15 text-red-400 border-red-500/30' },
]

export const PROFESSIONAL_DOMAINS = [
  'Technology', 'Education', 'Finance', 'Healthcare',
  'Government', 'Business', 'Engineering', 'Media'
]

// Connector Health Statuses for Data Ingestion Monitor
export const CONNECTOR_HEALTH = [
  {
    platform: 'twitter',
    name: 'X (Twitter) v2 Streaming Connector',
    status: 'Connected',
    icon: '🐦',
    endpoint: 'https://api.twitter.com/2/tweets/sample/stream',
    lastSync: '22 seconds ago',
    recordsReceived: 184592,
    recordsProcessed: 184201,
    errorsCount: 3,
    latencyMs: 38,
    rateLimitRemaining: '89%',
    authMode: 'OAuth 2.0 Bearer Token (Env Secured)',
  },
  {
    platform: 'telegram',
    name: 'Telegram MTProto Broadcast Ingester',
    status: 'Connected',
    icon: '✈️',
    endpoint: 'MTProto TDLib Session :443',
    lastSync: '8 seconds ago',
    recordsReceived: 92340,
    recordsProcessed: 92110,
    errorsCount: 0,
    latencyMs: 14,
    rateLimitRemaining: '98%',
    authMode: 'API_ID / Hash Ingestion Session',
  },
  {
    platform: 'reddit',
    name: 'Reddit PRAW Subreddit Poller',
    status: 'Connected',
    icon: '🤖',
    endpoint: 'https://oauth.reddit.com/r/all/new',
    lastSync: '1 minute ago',
    recordsReceived: 65120,
    recordsProcessed: 65100,
    errorsCount: 1,
    latencyMs: 62,
    rateLimitRemaining: '82%',
    authMode: 'Script Client Credentials',
  },
  {
    platform: 'youtube',
    name: 'YouTube Data API v3 Telemetry Ingester',
    status: 'Connected',
    icon: '📺',
    endpoint: 'https://www.googleapis.com/youtube/v3/search',
    lastSync: '3 minutes ago',
    recordsReceived: 42100,
    recordsProcessed: 42050,
    errorsCount: 0,
    latencyMs: 84,
    rateLimitRemaining: '74%',
    authMode: 'GCP Service Account Key',
  },
  {
    platform: 'instagram',
    name: 'Instagram Graph API Webhook',
    status: 'Connected',
    icon: '📸',
    endpoint: 'https://graph.facebook.com/v19.0/ig_hashtag_search',
    lastSync: '4 minutes ago',
    recordsReceived: 38900,
    recordsProcessed: 38820,
    errorsCount: 2,
    latencyMs: 95,
    rateLimitRemaining: '68%',
    authMode: 'Meta Graph User Token',
  },
  {
    platform: 'facebook',
    name: 'Meta Public Pages Feed Ingester',
    status: 'Connected',
    icon: '👥',
    endpoint: 'https://graph.facebook.com/v19.0/feed',
    lastSync: '6 minutes ago',
    recordsReceived: 29400,
    recordsProcessed: 29310,
    errorsCount: 4,
    latencyMs: 110,
    rateLimitRemaining: '60%',
    authMode: 'Meta App Secret Token',
  },
]

// Normalized High-Fidelity Social Posts
export const NORMALIZED_RECORDS = [
  {
    post_id: 'x-post-9021',
    platform: 'twitter',
    author_id: 'usr_8a9f2c10b7',
    author_name: 'TechObserver_AI',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    text: 'BREAKING: Global consortium drafts mandatory safety auditing framework for multi-agent reasoning models. Broad support across research institutions.',
    language: 'en',
    reply_to: null,
    mentions: ['@OpenStandards', '@AISafetyCouncil'],
    hashtags: ['AIGovernance', 'TechPolicy', 'Innovation'],
    engagement: { likes: 3840, retweets: 1210, replies: 342, shares: 890, views: 185000, rate: 8.4 },
    topic: 'AI Governance & Safety Frameworks',
    sentiment: 'positive',
    emotion: 'supportive',
    confidence: 0.94,
    location_hint: { country: 'India', region: 'Karnataka', city: 'Bengaluru' },
    demographic_segment: { age_bracket: '25-34', professional_interest: 'Technology' },
    community_id: 1,
    processing_status: 'PROCESSED',
    thread_replies: [
      {
        post_id: 'x-rep-9021-1',
        author_id: 'usr_1c4b7e889a',
        author_name: 'PolicyLead_EU',
        timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        text: 'Crucial milestone. Transparency in weight audits and model telemetry will prevent systemic drift.',
        sentiment: 'positive',
        emotion: 'excitement',
        confidence: 0.91,
      },
      {
        post_id: 'x-rep-9021-2',
        author_id: 'usr_ff28e93012',
        author_name: 'DevSkeptical',
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        text: 'Oh great, another 300-page bureaucratic checklist that only big tech monopolies can afford to comply with. /s',
        sentiment: 'negative',
        emotion: 'sarcasm',
        confidence: 0.88,
      },
      {
        post_id: 'x-rep-9021-3',
        author_id: 'usr_3910abccde',
        author_name: 'GovIntel_Analyst',
        timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
        text: 'How will cross-border telemetry transfer work under local data sovereignty laws? This requires clarification.',
        sentiment: 'neutral',
        emotion: 'anxiety',
        confidence: 0.85,
      }
    ]
  },
  {
    post_id: 'tg-msg-4192',
    platform: 'telegram',
    author_id: 'usr_tg_channel_intel',
    author_name: 'CyberThreat_Direct',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    text: 'URGENT: Disinformation syndicate active across regional communication channels pushing fabricated power-grid failure rumors.',
    language: 'en',
    reply_to: null,
    mentions: ['@SecDesk'],
    hashtags: ['CyberSecurity', 'InfrastructureAlert', 'FactCheck'],
    engagement: { likes: 1420, retweets: 0, replies: 198, shares: 640, views: 98000, rate: 6.2 },
    topic: 'Critical Infrastructure Disinformation',
    sentiment: 'negative',
    emotion: 'anxiety',
    confidence: 0.96,
    location_hint: { country: 'India', region: 'Maharashtra', city: 'Mumbai' },
    demographic_segment: { age_bracket: '35-44', professional_interest: 'Government' },
    community_id: 3,
    processing_status: 'FLAGGED',
    thread_replies: [
      {
        post_id: 'tg-rep-4192-1',
        author_id: 'usr_tg_9921',
        author_name: 'PowerGrid_Official',
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        text: 'Official notice: All regional grid frequencies are nominal at 50.02 Hz. Do not forward unverified broadcast forwards.',
        sentiment: 'positive',
        emotion: 'supportive',
        confidence: 0.98,
      }
    ]
  },
  {
    post_id: 'yt-vid-8821',
    platform: 'youtube',
    author_id: 'usr_yt_neurocode',
    author_name: 'NeuralCraft Studio',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    text: 'Deep-dive demonstration: Benchmarking 100,000 concurrent LLM agents on low-latency Redis & Kafka pipelines.',
    language: 'en',
    reply_to: null,
    mentions: ['@PyData', '@HuggingFace'],
    hashtags: ['AutonomousAI', 'Engineering', 'HighPerformance'],
    engagement: { likes: 18200, retweets: 0, replies: 940, shares: 3200, views: 240000, rate: 12.8 },
    topic: 'Autonomous Multi-Agent Architecture',
    sentiment: 'positive',
    emotion: 'excitement',
    confidence: 0.95,
    location_hint: { country: 'India', region: 'Delhi', city: 'New Delhi' },
    demographic_segment: { age_bracket: '18-24', professional_interest: 'Engineering' },
    community_id: 1,
    processing_status: 'PROCESSED',
    thread_replies: [
      {
        post_id: 'yt-rep-8821-1',
        author_id: 'usr_yt_fan',
        author_name: 'CodeArchitect',
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        text: 'The memory footprint optimization shown at 14:20 is groundbreaking for real-world deployments.',
        sentiment: 'positive',
        emotion: 'excitement',
        confidence: 0.92,
      }
    ]
  },
  {
    post_id: 'rd-post-3319',
    platform: 'reddit',
    author_id: 'usr_rd_macrohawk',
    author_name: 'u/MacroEconomist',
    timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    text: 'Comprehensive analysis of Q3 consumer spending vs semiconductor supply elasticity. Why market sentiment is mispricing risk.',
    language: 'en',
    reply_to: null,
    mentions: [],
    hashtags: ['Economics', 'Finance', 'SupplyChain'],
    engagement: { likes: 4520, retweets: 0, replies: 780, shares: 1240, views: 110000, rate: 9.1 },
    topic: 'Semiconductor Supply & Macro Risk',
    sentiment: 'neutral',
    emotion: 'neutral',
    confidence: 0.89,
    location_hint: { country: 'India', region: 'Telangana', city: 'Hyderabad' },
    demographic_segment: { age_bracket: '35-44', professional_interest: 'Finance' },
    community_id: 2,
    processing_status: 'PROCESSED',
    thread_replies: []
  },
  {
    post_id: 'ig-post-7712',
    platform: 'instagram',
    author_id: 'usr_ig_ecowatch',
    author_name: 'EcoResilience_Global',
    timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    text: 'Satellite telemetry reveals historic 42% urban rooftop solar surge across tier-2 industrial clusters! ☀️🌱',
    language: 'en',
    reply_to: null,
    mentions: ['@CleanEnergyNow'],
    hashtags: ['CleanEnergy', 'Sustainability', 'GreenTech'],
    engagement: { likes: 31200, retweets: 0, replies: 1420, shares: 5400, views: 320000, rate: 11.5 },
    topic: 'Renewable Clean Energy Transition',
    sentiment: 'positive',
    emotion: 'supportive',
    confidence: 0.97,
    location_hint: { country: 'India', region: 'Tamil Nadu', city: 'Chennai' },
    demographic_segment: { age_bracket: '18-24', professional_interest: 'Education' },
    community_id: 4,
    processing_status: 'PROCESSED',
    thread_replies: []
  },
  {
    post_id: 'fb-post-6102',
    platform: 'facebook',
    author_id: 'usr_fb_civicforum',
    author_name: 'National Civic Dialogue',
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    text: 'Public consultation announced on public transportation route optimization and zero-emission electric bus transition.',
    language: 'en',
    reply_to: null,
    mentions: [],
    hashtags: ['CivicPlanning', 'TransitReform', 'SmartCities'],
    engagement: { likes: 5800, retweets: 0, replies: 890, shares: 1400, views: 140000, rate: 7.2 },
    topic: 'Smart City Public Infrastructure',
    sentiment: 'positive',
    emotion: 'supportive',
    confidence: 0.91,
    location_hint: { country: 'India', region: 'West Bengal', city: 'Kolkata' },
    demographic_segment: { age_bracket: '45+', professional_interest: 'Business' },
    community_id: 2,
    processing_status: 'PROCESSED',
    thread_replies: []
  },
  {
    post_id: 'x-post-9022',
    platform: 'twitter',
    author_id: 'usr_9022_crypto',
    author_name: 'FinTech_Radar',
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    text: 'Central bank launches pilot interoperability layer for sovereign digital currency. Early testing shows sub-second settlement.',
    language: 'en',
    reply_to: null,
    mentions: ['@FinRegIndia'],
    hashtags: ['CBDC', 'FinTech', 'DigitalCurrency'],
    engagement: { likes: 6200, retweets: 1890, replies: 410, shares: 950, views: 210000, rate: 10.2 },
    topic: 'Sovereign Digital Currency Interoperability',
    sentiment: 'positive',
    emotion: 'excitement',
    confidence: 0.93,
    location_hint: { country: 'India', region: 'Gujarat', city: 'Ahmedabad' },
    demographic_segment: { age_bracket: '25-34', professional_interest: 'Finance' },
    community_id: 2,
    processing_status: 'PROCESSED',
    thread_replies: []
  },
  {
    post_id: 'tg-msg-4193',
    platform: 'telegram',
    author_id: 'usr_tg_edutech',
    author_name: 'STEM_Innovations_India',
    timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    text: 'Open-access engineering repository crosses 1 million student downloads across 400 tier-2 and tier-3 colleges.',
    language: 'en',
    reply_to: null,
    mentions: [],
    hashtags: ['STEMEducation', 'DigitalIndia', 'OpenScience'],
    engagement: { likes: 3100, retweets: 0, replies: 320, shares: 1200, views: 84000, rate: 9.8 },
    topic: 'Open-Access STEM Higher Education',
    sentiment: 'positive',
    emotion: 'supportive',
    confidence: 0.95,
    location_hint: { country: 'India', region: 'Karnataka', city: 'Mysuru' },
    demographic_segment: { age_bracket: '18-24', professional_interest: 'Education' },
    community_id: 4,
    processing_status: 'PROCESSED',
    thread_replies: []
  },
  {
    post_id: 'x-post-9023',
    platform: 'twitter',
    author_id: 'usr_9023_skeptic',
    author_name: 'AuditWhistle',
    timestamp: new Date(Date.now() - 1000 * 60 * 175).toISOString(),
    text: 'Severe algorithmic bias detected in commercial credit approval scoring models against rural self-help applicants. Report released.',
    language: 'en',
    reply_to: null,
    mentions: ['@FairCreditOrg'],
    hashtags: ['AIEthics', 'FinancialInclusion', 'Accountability'],
    engagement: { likes: 9800, retweets: 3400, replies: 1120, shares: 2100, views: 390000, rate: 14.1 },
    topic: 'Algorithmic Credit Model Bias',
    sentiment: 'negative',
    emotion: 'opposition',
    confidence: 0.94,
    location_hint: { country: 'India', region: 'Kerala', city: 'Kochi' },
    demographic_segment: { age_bracket: '25-34', professional_interest: 'Healthcare' },
    community_id: 3,
    processing_status: 'FLAGGED',
    thread_replies: []
  }
]

// Information Cascade Propagation Graph (Tracing cross-platform topic spread over time)
export const INFORMATION_CASCADES = [
  {
    cascade_id: 'casc-ai-gov-2026',
    topic: 'AI Governance & Safety Frameworks',
    origin: {
      platform: 'twitter',
      node: 'NODE_usr_8a9f2c10b7 (@TechObserver_AI)',
      timestamp: '2026-09-06T19:30:00Z',
      reach: '185K',
    },
    status: 'Peaking',
    crossPlatformHops: [
      { step: 1, time: '+0m', platform: 'twitter', node: '@TechObserver_AI', action: 'Original Whitepaper Release', sentiment: 'positive', emotion: 'supportive' },
      { step: 2, time: '+18m', platform: 'telegram', node: 'CyberThreat_Direct Channel', action: 'Executive Summary Broadcast', sentiment: 'neutral', emotion: 'neutral' },
      { step: 3, time: '+42m', platform: 'reddit', node: 'r/MachineLearning', action: 'Technical Vulnerability Audit Thread', sentiment: 'neutral', emotion: 'sarcasm' },
      { step: 4, time: '+1h 15m', platform: 'youtube', node: 'NeuralCraft Studio 4K Stream', action: 'Live Simulation & Code Breakdown', sentiment: 'positive', emotion: 'excitement' },
      { step: 5, time: '+2h 30m', platform: 'facebook', node: 'Civic Dialogue Coalition', action: 'Citizen Consultation Discussion', sentiment: 'positive', emotion: 'supportive' },
    ],
    totalReach: '2.84M',
    viralVelocityRScore: 3.42, // Epidemic Reproduction rate
  },
  {
    cascade_id: 'casc-disinfo-grid',
    topic: 'Critical Infrastructure Disinformation Spike',
    origin: {
      platform: 'telegram',
      node: 'NODE_usr_tg_channel_intel (@CyberThreat_Direct)',
      timestamp: '2026-09-06T20:15:00Z',
      reach: '98K',
    },
    status: 'Declining',
    crossPlatformHops: [
      { step: 1, time: '+0m', platform: 'telegram', node: 'Anonymous Forward Chain', action: 'Fabricated Outage Alert Broadcast', sentiment: 'negative', emotion: 'anxiety' },
      { step: 2, time: '+8m', platform: 'twitter', node: 'Bot Swarm Swarm_03', action: 'Automated Hashtag Astroturfing', sentiment: 'negative', emotion: 'opposition' },
      { step: 3, time: '+22m', platform: 'facebook', node: 'Community Regional Groups', action: 'Panic Sharing & Inquiries', sentiment: 'negative', emotion: 'anxiety' },
      { step: 4, time: '+35m', platform: 'twitter', node: '@PowerGrid_Official', action: 'Official Fact-Check & Telemetry Debunk', sentiment: 'positive', emotion: 'supportive' },
    ],
    totalReach: '1.12M',
    viralVelocityRScore: 1.15,
  }
]

// System Alerts for SIH26152 Alerts System
export const SYSTEM_ALERTS = [
  {
    alert_id: 'alt-9901',
    severity: 'CRITICAL',
    category: 'SUDDEN_SENTIMENT_SHIFT',
    title: 'Severe Negative Sentiment Surge (-38% Polarity Shift)',
    description: 'Algorithmic Credit Model Bias topic experienced a rapid influx of negative opposition posts on X and Telegram within a 20-minute window.',
    platform: 'twitter',
    timestamp: '8 minutes ago',
    status: 'ACTIVE',
    affected_topic: 'Algorithmic Credit Model Bias',
    suggested_action: 'Dispatch counter-telemetry and inspect community #3 bridge nodes.',
  },
  {
    alert_id: 'alt-9902',
    severity: 'WARNING',
    category: 'VIRAL_CASCADE_VELOCITY',
    title: 'Cross-Platform Viral Propagation (R-Score 3.42)',
    description: 'AI Governance topic breached threshold velocity, migrating across Twitter → Telegram → Reddit in under 45 minutes.',
    platform: 'telegram',
    timestamp: '24 minutes ago',
    status: 'ACTIVE',
    affected_topic: 'AI Governance & Safety Frameworks',
    suggested_action: 'Monitor Key Opinion Leader amplification in cluster #1.',
  },
  {
    alert_id: 'alt-9903',
    severity: 'WARNING',
    category: 'ASTROTURFING_BOT_SWARM',
    title: 'Coordinated Inauthentic Behavior Detected',
    description: '14 accounts in community cluster #3 exhibited identical posting intervals (delta < 200ms) with high lexical repetition.',
    platform: 'reddit',
    timestamp: '42 minutes ago',
    status: 'INVESTIGATING',
    affected_topic: 'Critical Infrastructure Disinformation',
    suggested_action: 'Flag accounts for entropy review and isolate network edges.',
  },
  {
    alert_id: 'alt-9904',
    severity: 'INFO',
    category: 'CONNECTOR_SYNC_HEARTBEAT',
    title: 'X Stream Connector v2 Rate Limit Calibrated',
    description: 'Dynamic backoff buffer adjusted stream throughput to 120 req/sec with zero packet loss.',
    platform: 'twitter',
    timestamp: '1 hour ago',
    status: 'RESOLVED',
    affected_topic: 'Ingestion Pipeline',
    suggested_action: 'Nominal telemetry operating within expected tolerances.',
  },
  {
    alert_id: 'alt-9905',
    severity: 'INFO',
    category: 'DEMOGRAPHIC_DRIFT',
    title: 'Regional Demographic Influx in South Zone (+28%)',
    description: 'Significant uptick in engagement from Karnataka and Tamil Nadu engineering cohorts on YouTube and Instagram.',
    platform: 'youtube',
    timestamp: '2 hours ago',
    status: 'ACKNOWLEDGED',
    affected_topic: 'Autonomous Multi-Agent Architecture',
    suggested_action: 'Correlate with regional hackathon telemetry.',
  },
]
