import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color: 'gold' | 'navy' | 'green' | 'blue' | 'purple'
}

const colorClasses = {
  gold: 'from-brand-gold to-brand-gold-dark',
  navy: 'from-brand-navy to-brand-navy-light',
  green: 'from-green-500 to-green-700',
  blue: 'from-blue-500 to-blue-700',
  purple: 'from-purple-500 to-purple-700',
}

export default function StatsCard({ title, value, subtitle, icon, trend, color }: StatsCardProps) {
  return (
    <div className="card-premium p-6 hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <div className="text-4xl font-bold text-brand-navy mb-1">{value}</div>
        <div className="text-sm font-semibold text-neutral-600">{title}</div>
      </div>
      
      {subtitle && (
        <div className="text-xs text-neutral-500 font-medium">{subtitle}</div>
      )}
    </div>
  )
}
