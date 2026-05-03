import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, Package, Users, Shield, MapPin, Award } from 'lucide-react'
import { useBlockchain } from '../context/BlockchainContext'

const Dashboard = () => {
  const { herbs, collections, blocks } = useBlockchain()

  const monthlyData = [
    { month: 'Jan', collections: 120, processing: 100, quality: 95 },
    { month: 'Feb', collections: 150, processing: 130, quality: 125 },
    { month: 'Mar', collections: 180, processing: 160, quality: 155 },
    { month: 'Apr', collections: 200, processing: 180, quality: 175 },
    { month: 'May', collections: 220, processing: 200, quality: 190 },
    { month: 'Jun', collections: 250, processing: 230, quality: 220 }
  ]

  const herbDistribution = [
    { name: 'Ashwagandha', value: 35, color: '#22c55e' },
    { name: 'Turmeric', value: 25, color: '#eab308' },
    { name: 'Brahmi', value: 20, color: '#3b82f6' },
    { name: 'Neem', value: 12, color: '#f59e0b' },
    { name: 'Others', value: 8, color: '#6b7280' }
  ]

  const qualityMetrics = [
    { month: 'Jan', grade_a: 85, grade_b: 12, grade_c: 3 },
    { month: 'Feb', grade_a: 88, grade_b: 10, grade_c: 2 },
    { month: 'Mar', grade_a: 90, grade_b: 8, grade_c: 2 },
    { month: 'Apr', grade_a: 92, grade_b: 7, grade_c: 1 },
    { month: 'May', grade_a: 94, grade_b: 5, grade_c: 1 },
    { month: 'Jun', grade_a: 96, grade_b: 4, grade_c: 0 }
  ]

  const stats = [
    {
      title: 'Total Collections',
      value: '2,847',
      change: '+12.5%',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Farmers',
      value: '524',
      change: '+8.2%',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Quality Tests',
      value: '1,923',
      change: '+15.3%',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Blockchain Blocks',
      value: blocks.length.toString(),
      change: '+5.7%',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Supply Chain Dashboard</h1>
          <p className="text-gray-600">Monitor your Ayurvedic herb traceability network in real-time</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="collections" fill="#22c55e" name="Collections" />
                <Bar dataKey="processing" fill="#3b82f6" name="Processing" />
                <Bar dataKey="quality" fill="#f59e0b" name="Quality Tests" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Herb Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Herb Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={herbDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {herbDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Grade Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={qualityMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="grade_a" stroke="#22c55e" strokeWidth={3} name="Grade A %" />
              <Line type="monotone" dataKey="grade_b" stroke="#f59e0b" strokeWidth={2} name="Grade B %" />
              <Line type="monotone" dataKey="grade_c" stroke="#ef4444" strokeWidth={2} name="Grade C %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Blockchain Activity</h3>
          <div className="space-y-4">
            {blocks.slice(-5).reverse().map((block, index) => (
              <div key={block.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Block #{block.id} - {block.type}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(block.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-sm text-gray-500 font-mono">
                  {block.hash.substring(0, 12)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
