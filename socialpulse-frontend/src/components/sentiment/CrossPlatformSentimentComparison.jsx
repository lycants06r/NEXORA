/*
  CrossPlatformSentimentComparison.jsx
  -----------------------------------
  Cross-Platform Sentiment & Emotion Polarity Comparison Matrix.
  Compares sentiment distribution (Positive, Neutral, Negative) and dominant emotion
  across X/Twitter, Telegram, Instagram, Facebook, Reddit, and YouTube.
*/

import React, { useState } from 'react'
import PlatformLogo from '../common/PlatformLogo'

const PLATFORM_SENTIMENT_DATA = [
  {
    platform: 'twitter',
    name: 'X / Twitter',
    positive: 64.2,
    neutral: 16.5,
    negative: 19.3,
    sampleSize: 184201,
    dominantEmotion: 'Excitement',
    emotionColor: 'text-[#4cd7f6]',
    polarityShift: '+5.4%',
    sentimentScore: '+0.45',
  },
  {
    platform: 'telegram',
    name: 'Telegram',
    positive: 71.8,
    neutral: 14.2,
    negative: 14.0,
    sampleSize: 92110,
    dominantEmotion: 'Supportive',
    emotionColor: 'text-[#4edea3]',
    polarityShift: '+8.1%',
    sentimentScore: '+0.58',
  },
  {
    platform: 'instagram',
    name: 'Instagram',
    positive: 78.4,
    neutral: 12.1,
    negative: 9.5,
    sampleSize: 38820,
    dominantEmotion: 'Excitement',
    emotionColor: 'text-[#ddb7ff]',
    polarityShift: '+3.2%',
    sentimentScore: '+0.69',
  },
  {
    platform: 'facebook',
    name: 'Facebook',
    positive: 58.6,
    neutral: 22.4,
    negative: 19.0,
    sampleSize: 29310,
    dominantEmotion: 'Neutral',
    emotionColor: 'text-amber-300',
    polarityShift: '-1.8%',
    sentimentScore: '+0.39',
  },
  {
    platform: 'reddit',
    name: 'Reddit',
    positive: 52.1,
    neutral: 18.3,
    negative: 29.6,
    sampleSize: 65100,
    dominantEmotion: 'Opposition',
    emotionColor: 'text-rose-400',
    polarityShift: '-4.2%',
    sentimentScore: '+0.22',
  },
  {
    platform: 'youtube',
    name: 'YouTube',
    positive: 69.5,
    neutral: 15.0,
    negative: 15.5,
    sampleSize: 42050,
    dominantEmotion: 'Supportive',
    emotionColor: 'text-[#4edea3]',
    polarityShift: '+6.0%',
    sentimentScore: '+0.54',
  },
]

function CrossPlatformSentimentComparison() {
  const [selectedPlatform, setSelectedPlatform] = useState(null)

  const displayedData = selectedPlatform
    ? PLATFORM_SENTIMENT_DATA.filter((p) => p.platform === selectedPlatform)
    : PLATFORM_SENTIMENT_DATA

  return (
    <div className="liquid-glass rounded-2xl p-6 shadow-glass-card relative overflow-hidden group">
      <div className="glass-edge-top" />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4 relative z-10">
        <div>
          <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
            ⚔️ Cross-Platform Sentiment & Emotion Comparison Matrix
          </h3>
          <p className="text-xs text-[#8ea0b5] font-mono mt-0.5">
            Side-by-side sentiment polarity breakdown across all 6 connected social networks
          </p>
        </div>

        {/* Quick Filter */}
        <div className="flex items-center gap-1 font-mono text-xs flex-wrap">
          <button
            onClick={() => setSelectedPlatform(null)}
            className={`px-3 py-1 rounded-lg uppercase transition-all cursor-pointer ${
              selectedPlatform === null
                ? 'bg-[rgba(76,215,246,0.18)] text-[#4cd7f6] border border-[#4cd7f6]/40 font-bold shadow-glow-cyan'
                : 'glass-control text-[#8ea0b5] hover:text-white'
            }`}
          >
            All 6 Platforms
          </button>
          {PLATFORM_SENTIMENT_DATA.map((p) => (
            <button
              key={p.platform}
              onClick={() => setSelectedPlatform(p.platform)}
              className={`px-2.5 py-1 rounded-lg uppercase transition-all cursor-pointer flex items-center gap-1 ${
                selectedPlatform === p.platform
                  ? 'bg-[rgba(76,215,246,0.18)] text-[#4cd7f6] border border-[#4cd7f6]/40 font-bold shadow-glow-cyan'
                  : 'glass-control text-[#8ea0b5] hover:text-white'
              }`}
            >
              <PlatformLogo platform={p.platform} className="w-3 h-3" colored={true} />
              <span>{p.platform}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Platform Sentiment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {displayedData.map((item) => (
          <div
            key={item.platform}
            className="liquid-glass-soft border border-white/10 hover:border-[#4cd7f6]/40 rounded-xl p-4 transition-all duration-300 group/card"
          >
            {/* Platform Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg liquid-glass border border-white/10 flex items-center justify-center p-1">
                  <PlatformLogo platform={item.platform} className="w-4 h-4" colored={true} />
                </div>
                <div>
                  <span className="text-white font-bold text-sm block group-hover/card:text-[#4cd7f6] transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#8ea0b5]">
                    {item.sampleSize.toLocaleString()} posts sampled
                  </span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs font-bold text-white block">Score {item.sentimentScore}</span>
                <span className={`text-[10px] font-semibold ${item.polarityShift.startsWith('+') ? 'text-[#4edea3]' : 'text-rose-400'}`}>
                  {item.polarityShift} shift
                </span>
              </div>
            </div>

            {/* Stacked Polarity Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-[11px] font-mono mb-1.5 text-[#8ea0b5]">
                <span className="text-[#4edea3]">Pos: {item.positive}%</span>
                <span className="text-amber-300">Neu: {item.neutral}%</span>
                <span className="text-rose-400">Neg: {item.negative}%</span>
              </div>
              <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden flex border border-white/10">
                <div
                  className="bg-gradient-to-r from-[#4edea3] to-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${item.positive}%` }}
                />
                <div
                  className="bg-amber-400/80 h-full transition-all duration-500"
                  style={{ width: `${item.neutral}%` }}
                />
                <div
                  className="bg-gradient-to-r from-rose-500 to-red-600 h-full transition-all duration-500"
                  style={{ width: `${item.negative}%` }}
                />
              </div>
            </div>

            {/* Dominant Affective Vector & Insights */}
            <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-[#8ea0b5] text-[11px]">Dominant Emotion:</span>
              <span className={`font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 ${item.emotionColor}`}>
                {item.dominantEmotion.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Aggregate Cross-Platform Summary Bar */}
      <div className="mt-4 p-3.5 liquid-glass-soft border border-cyan-500/20 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs font-mono relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">💡 Synthesis Insight:</span>
          <span className="text-[#dae2fd]">
            Instagram & Telegram exhibit highest positive sentiment cohesion (78.4% & 71.8%), while Reddit has highest critical opposition density (29.6%).
          </span>
        </div>
        <span className="text-[10px] text-[#4cd7f6] px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 font-bold shrink-0">
          6-PLATFORM CROSS-CORRELATION
        </span>
      </div>
    </div>
  )
}

export default CrossPlatformSentimentComparison
