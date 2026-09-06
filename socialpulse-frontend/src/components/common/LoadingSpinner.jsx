import React from 'react'

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      {/* Animated spinner */}
      <div className="
        w-12 h-12 border-4 border-dark-500
        border-t-brand-blue rounded-full
        animate-spin
      " />
      <p className="text-sm" style={{ color: '#6b7db3' }}>{message}</p>
    </div>
  )
}

export default LoadingSpinner
