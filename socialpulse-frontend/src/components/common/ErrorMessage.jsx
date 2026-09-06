import React from 'react'

function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="
      bg-red-500/10 border border-red-500/20
      rounded-2xl p-6 text-center
    ">
      <div className="text-4xl mb-3">⚠️</div>
      <h3 className="text-red-400 font-semibold mb-1">Error</h3>
      <p className="text-sm text-gray-400 mb-4">{message}</p>

      {/* Show retry button only if handler provided */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="
            px-4 py-2 bg-red-500/20 hover:bg-red-500/30
            text-red-400 rounded-xl text-sm font-medium
            transition-colors
          "
        >
          Try Again
        </button>
      )}

      <p className="text-xs mt-3" style={{ color: '#6b7db3' }}>
        Make sure the backend is running: <code>python run.py</code>
      </p>
    </div>
  )
}

export default ErrorMessage
