import React from 'react'

function EmptyState({
  emoji   = '📭',
  title   = 'No data yet',
  message = 'Collect some data first using the Ingestion page.',
}) {
  return (
    <div className="
      flex flex-col items-center justify-center
      py-16 text-center
    ">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm max-w-sm" style={{ color: '#6b7db3' }}>
        {message}
      </p>
    </div>
  )
}

export default EmptyState
