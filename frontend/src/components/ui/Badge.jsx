import React from 'react'

const Badge = ({ type = 'default', children, className = '' }) => {
  const styles = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-green-100 text-green-800',
    info: 'bg-blue-100 text-blue-700',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-700',
    accent: 'bg-yellow-100 text-yellow-800',
    admin: 'bg-purple-100 text-purple-800',
    user: 'bg-primary-100 text-primary-800',
  }

  return (
    <span className={`badge ${styles[type] || styles.default} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
