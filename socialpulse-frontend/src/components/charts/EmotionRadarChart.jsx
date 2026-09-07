/*
  EmotionRadarChart.jsx
  ---------------------
  Spider/radar chart showing the balance of different emotions with NEXORA cyberpunk lavender accents.
*/

import React from 'react'
import {
  RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from 'recharts'

function EmotionRadarChart({ emotions = {} }) {
  const data = Object.entries(emotions).map(([key, val]) => ({
    emotion: key.charAt(0).toUpperCase() + key.slice(1),
    score:   Math.round(val * 100),
  }))

  return (
    <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden group">
      <div className="glass-edge-top" />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ddb7ff] shadow-[0_0_8px_#ddb7ff] animate-pulse" />
          🎭 Emotion Taxonomy Breakdown
        </h3>
        <span className="text-[11px] font-mono text-[#ddb7ff] px-2.5 py-1 rounded-xl liquid-glass-soft border border-purple-500/30 font-bold">
          NLP VECTOR
        </span>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-14 text-[#8ea0b5] font-mono text-xs bg-black/20 rounded-xl border border-white/5 my-2">
          No emotion telemetry data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(76, 215, 246, 0.12)" />
            <PolarAngleAxis
              dataKey="emotion"
              tick={{ fill: '#dae2fd', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#8ea0b5', fontSize: 9, fontFamily: 'JetBrains Mono' }}
            />
            <Radar
              name="Emotion Score"
              dataKey="score"
              stroke="#ddb7ff"
              fill="#ddb7ff"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#060e20',
                border:          '1px solid rgba(221, 183, 255, 0.4)',
                borderRadius:    '12px',
                color:           '#ffffff',
                fontFamily:      'JetBrains Mono',
                fontSize:        '11px',
                boxShadow:       '0 8px 25px rgba(0,0,0,0.8)',
              }}
              itemStyle={{ color: '#ddb7ff' }}
              formatter={(val) => [`${val}%`, 'Confidence']}
            />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default EmotionRadarChart
