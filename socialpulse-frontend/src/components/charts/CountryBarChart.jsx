import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

function CountryBarChart({ countries = [] }) {
  return (
    <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]" />
          🌍 Geographic Affinity & Density
        </h3>
        <span className="text-[11px] font-mono text-[#4cd7f6]">
          TOP REGIONS
        </span>
      </div>

      {countries.length === 0 ? (
        <div className="text-center py-14 text-[#8ea0b5] font-mono text-xs bg-black/20 rounded-xl border border-white/5 my-2">
          No location telemetry data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={countries.slice(0, 8)}
            margin={{ top: 5, right: 10, left: 0, bottom: 35 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis
              dataKey="country"
              tick={{ fill: '#8ea0b5', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              angle={-35}
              textAnchor="end"
              axisLine={{ stroke: 'rgba(76, 215, 246, 0.2)' }}
            />
            <YAxis
              tick={{ fill: '#8ea0b5', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'rgba(76, 215, 246, 0.2)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#060e20',
                border:          '1px solid rgba(76, 215, 246, 0.3)',
                borderRadius:    '12px',
                color:           '#ffffff',
                fontFamily:      'JetBrains Mono',
                fontSize:        '11px',
                boxShadow:       '0 8px 25px rgba(0,0,0,0.8)',
              }}
              formatter={(val) => [`${val.toLocaleString()} signals`, 'Volume']}
            />
            <Bar
              dataKey="count"
              fill="#4cd7f6"
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default CountryBarChart
