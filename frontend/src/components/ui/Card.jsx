import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const Card = ({ children, className = '', title, subtitle, action }) => (
  <div className={`card fade-in ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between mb-4">
        <div>
          {title && <h3 className="font-bold text-gray-800 text-base">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )}
    {children}
  </div>
)

export const StatCard = ({ icon: Icon, label, value, trend, trendUp, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-100 text-primary-700',
    info:    'bg-blue-100 text-blue-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger:  'bg-red-100 text-red-700',
    accent:  'bg-amber-100 text-amber-700',
  }

  // Lucide icons are forwardRef objects — render with createElement to be safe
  const renderIcon = () => {
    if (!Icon) return null
    if (typeof Icon === 'string') return <span className="text-xl">{Icon}</span>
    // Lucide / any React component (function or forwardRef object)
    return React.createElement(Icon, { size: 22, strokeWidth: 1.8 })
  }

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color] || colors.primary}`}>
          {renderIcon()}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default Card
