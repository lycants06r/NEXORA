/*
  SentimentPage.jsx
  -----------------
  Shows:
  - Manual text analyzer (type text, see sentiment instantly)
  - Polarity distribution chart
  - Emotion radar chart
  - Sentiment timeline chart
  With NEXORA glassmorphic intelligence operations theme.
*/

import React, { useState, useEffect } from 'react'
import PageHeader        from '../components/common/PageHeader.jsx'
import LoadingSpinner    from '../components/common/LoadingSpinner.jsx'
import SentimentLineChart from '../components/charts/SentimentLineChart.jsx'
import EmotionRadarChart from '../components/charts/EmotionRadarChart.jsx'
import PolarityBarChart  from '../components/charts/PolarityBarChart.jsx'
import Badge             from '../components/common/Badge.jsx'
import {
  analyzeText,
  getSentimentTimeline,
  getEmotionDistribution,
  getSentimentSummary,
} from '../api/sentimentApi'

function SentimentPage() {
  const [inputText,    setInputText]    = useState('')
  const [analysisResult, setResult]     = useState(null)
  const [analyzing,    setAnalyzing]    = useState(false)

  const [timeline,   setTimeline]   = useState([])
  const [emotions,   setEmotions]   = useState({})
  const [summary,    setSummary]    = useState({})
  const [chartsLoading, setChartsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setChartsLoading(true)
      try {
        const [timeRes, emoRes, sumRes] = await Promise.allSettled([
          getSentimentTimeline({ granularity: 'hour' }),
          getEmotionDistribution('all'),
          getSentimentSummary(),
        ])
        if (timeRes.status === 'fulfilled') setTimeline(timeRes.value?.data || [])
        if (emoRes.status  === 'fulfilled') setEmotions(emoRes.value?.data  || {})
        if (sumRes.status  === 'fulfilled') setSummary(sumRes.value?.data   || {})
      } finally {
        setChartsLoading(false)
      }
    }
    load()
  }, [])

  async function handleAnalyze() {
    if (!inputText.trim()) return
    setAnalyzing(true)
    setResult(null)
    try {
      const res = await analyzeText(inputText, 'twitter')
      setResult(res?.data)
    } catch (err) {
      alert('Analysis failed. Make sure the backend ML models are loaded.')
    } finally {
      setAnalyzing(false)
    }
  }

  const polarityColor = {
    positive: 'green',
    negative: 'red',
    neutral:  'yellow',
  }

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="💬"
        title="Sentiment & Polarity Radar"
        subtitle="AI-powered NLP emotion classification, stance scoring & sarcasm radar"
      />

      {/* ── Live Text Analyzer (NEXORA Style) ──────────────── */}
      <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-base tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
            🧪 NLP Linguistic Pattern & Threat Evaluator
          </h3>
          <span className="text-[11px] font-mono text-[#4cd7f6] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
            REAL-TIME CLASSIFIER
          </span>
        </div>
        <p className="text-xs text-[#8ea0b5] font-mono mb-4">
          INPUT RAW POST PAYLOAD TO PARSE EMOTION WEIGHTS, POLARITY SCORE, AND SARCASM CONFIDENCE:
        </p>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or type raw social signal text... e.g. 'Breaking: Crucial updates regarding the new policy show tremendous optimism across communities.'"
          className="
            w-full bg-black/50 border border-cyan-500/25
            text-white placeholder-gray-500 font-mono text-sm rounded-xl
            px-4 py-3 resize-none
            focus:outline-none focus:border-[#4cd7f6] focus:shadow-[0_0_15px_rgba(76,215,246,0.25)]
            transition-all
          "
          rows={3}
        />

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs font-mono text-[#8ea0b5]">
            BUFFER: {inputText.length} CHARS
          </span>
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !inputText.trim()}
            className={`
              px-6 py-2.5 rounded-xl font-bold text-xs font-mono uppercase tracking-wider
              transition-all duration-300
              ${analyzing || !inputText.trim()
                ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-r from-[#4cd7f6] to-[#06b6d4] hover:from-[#38bdf8] hover:to-[#0891b2] text-black font-black shadow-[0_0_18px_rgba(76,215,246,0.3)] cursor-pointer'
              }
            `}
          >
            {analyzing ? '⚡ Evaluating Payload...' : '🔍 Parse Linguistic Signal'}
          </button>
        </div>

        {/* Analysis Result */}
        {analysisResult && (
          <div className="
            mt-5 p-5 bg-black/50 rounded-xl
            border border-cyan-500/30 animate-slide-up shadow-inner
          ">
            <div className="flex flex-wrap gap-2.5 mb-4">
              <Badge
                label={`Polarity: ${analysisResult.polarity}`}
                color={polarityColor[analysisResult.polarity] || 'gray'}
                dot
              />
              <Badge
                label={`Emotion: ${analysisResult.primary_emotion}`}
                color="purple"
              />
              <Badge
                label={`Stance: ${analysisResult.stance}`}
                color="blue"
              />
              {analysisResult.is_sarcastic && (
                <Badge label="⚡ Sarcasm Heuristic Triggered" color="yellow" dot />
              )}
            </div>

            {/* Score Meters */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5 text-[#8ea0b5]">
                  <span>POLARITY COEFFICIENT (-1.0 to +1.0)</span>
                  <span className="text-white font-bold">
                    {Number(analysisResult.polarity_score).toFixed(2)}
                  </span>
                </div>
                {/* Score bar */}
                <div className="h-2.5 bg-black/80 rounded-full relative overflow-hidden border border-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      analysisResult.polarity_score > 0
                        ? 'bg-gradient-to-r from-[#4edea3] to-emerald-400 shadow-[0_0_10px_#4edea3]'
                        : 'bg-gradient-to-r from-[#f43f5e] to-rose-400 shadow-[0_0_10px_#f43f5e]'
                    }`}
                    style={{
                      width: `${Math.abs(analysisResult.polarity_score) * 50}%`,
                      marginLeft: analysisResult.polarity_score > 0
                        ? '50%' : `${50 - Math.abs(analysisResult.polarity_score) * 50}%`,
                    }}
                  />
                  <div className="absolute top-0 left-1/2 w-0.5 h-full bg-cyan-500/60" />
                </div>
              </div>

              {analysisResult.is_sarcastic && (
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5 text-[#8ea0b5]">
                    <span>SARCASM PROBABILITY WEIGHT</span>
                    <span className="text-[#f59e0b] font-bold">
                      {(analysisResult.sarcasm_confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-black/80 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full shadow-[0_0_8px_#f59e0b]"
                      style={{
                        width: `${analysisResult.sarcasm_confidence * 100}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Emotion breakdown */}
            {analysisResult.emotions &&
             Object.keys(analysisResult.emotions).length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs font-mono uppercase tracking-wider text-[#8ea0b5] mb-2.5">
                  Emotion Vector Density:
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(analysisResult.emotions)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([emotion, score]) => (
                      <span
                        key={emotion}
                        className="text-xs font-mono bg-purple-500/15 text-[#ddb7ff] border border-purple-500/30
                                   px-2.5 py-1 rounded-lg"
                      >
                        {emotion.toUpperCase()}: {(score * 100).toFixed(0)}%
                      </span>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Charts ─────────────────────────────────────────── */}
      {chartsLoading ? (
        <LoadingSpinner message="Recomputing NLP tensors & polarity curves..." />
      ) : (
        <>
          <SentimentLineChart data={timeline} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmotionRadarChart emotions={emotions} />
            <PolarityBarChart  summary={summary}   />
          </div>
        </>
      )}
    </div>
  )
}

export default SentimentPage
