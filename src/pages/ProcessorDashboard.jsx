import React, { useState } from 'react'
import { Package, Plus, CheckCircle, Clock, AlertTriangle, Thermometer, Droplets, Scale } from 'lucide-react'
import { useBlockchain } from '../context/BlockchainContext'

const ProcessorDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending')
  const [showAddProcess, setShowAddProcess] = useState(false)
  const [processForm, setProcessForm] = useState({
    herbId: '',
    processType: '',
    temperature: '',
    humidity: '',
    duration: '',
    notes: ''
  })
  const { herbs, addProcessingEvent } = useBlockchain()

  const processingSteps = [
    'Cleaning & Sorting',
    'Drying',
    'Grinding',
    'Sieving',
    'Packaging',
    'Quality Check',
    'Storage'
  ]

  const pendingBatches = herbs.filter(h => h.status === 'In Processing')
  const completedBatches = herbs.filter(h => h.status === 'Ready for Sale')

  const handleAddProcess = (e) => {
    e.preventDefault()
    
    const processingData = {
      herbId: processForm.herbId,
      processType: processForm.processType,
      temperature: processForm.temperature,
      humidity: processForm.humidity,
      duration: processForm.duration,
      notes: processForm.notes,
      operator: 'Current Processor' // In real app, from auth
    }

    addProcessingEvent(processingData)
    setShowAddProcess(false)
    setProcessForm({
      herbId: '',
      processType: '',
      temperature: '',
      humidity: '',
      duration: '',
      notes: ''
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'In Processing':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'Ready for Sale':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Processor Dashboard</h1>
            <p className="text-gray-600">Manage herb processing and quality control</p>
          </div>
          <button
            onClick={() => setShowAddProcess(true)}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Process Step</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Batches</p>
                <p className="text-2xl font-bold text-gray-900">{pendingBatches.length}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedBatches.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Processed</p>
                <p className="text-2xl font-bold text-gray-900">847</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Quality Rate</p>
                <p className="text-2xl font-bold text-gray-900">98.5%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Scale className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending Batches ({pendingBatches.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'completed'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Completed ({completedBatches.length})
              </button>
              <button
                onClick={() => setActiveTab('quality')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'quality'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Quality Control
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pendingBatches.map((batch) => (
                  <div key={batch.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(batch.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{batch.name}</h3>
                          <p className="text-sm text-gray-600">Batch ID: {batch.batchId}</p>
                          <p className="text-sm text-gray-500">Collected: {new Date(batch.collectionDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {batch.status}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">From: {batch.location.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="space-y-4">
                {completedBatches.map((batch) => (
                  <div key={batch.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(batch.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{batch.name}</h3>
                          <p className="text-sm text-gray-600">Batch ID: {batch.batchId}</p>
                          <p className="text-sm text-gray-500">Quality: {batch.quality}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {batch.status}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">QR: {batch.qrCode}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'quality' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quality Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Moisture Content</span>
                      <span className="font-medium">8.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Purity Level</span>
                      <span className="font-medium">99.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pesticide Residue</span>
                      <span className="font-medium text-green-600">Below Limit</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Heavy Metals</span>
                      <span className="font-medium text-green-600">Within Range</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Processing Conditions</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Thermometer className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="font-medium">45°C - 50°C</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Humidity</p>
                        <p className="font-medium">35% - 40%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="text-sm text-gray-600">Drying Time</p>
                        <p className="font-medium">24 - 48 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Process Modal */}
        {showAddProcess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Processing Step</h3>
              
              <form onSubmit={handleAddProcess} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Batch
                  </label>
                  <select
                    value={processForm.herbId}
                    onChange={(e) => setProcessForm(prev => ({ ...prev, herbId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a batch</option>
                    {herbs.map((herb) => (
                      <option key={herb.id} value={herb.id}>
                        {herb.name} - {herb.batchId}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Process Type
                  </label>
                  <select
                    value={processForm.processType}
                    onChange={(e) => setProcessForm(prev => ({ ...prev, processType: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select process</option>
                    {processingSteps.map((step) => (
                      <option key={step} value={step}>{step}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      value={processForm.temperature}
                      onChange={(e) => setProcessForm(prev => ({ ...prev, temperature: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Humidity (%)
                    </label>
                    <input
                      type="number"
                      value={processForm.humidity}
                      onChange={(e) => setProcessForm(prev => ({ ...prev, humidity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={processForm.duration}
                    onChange={(e) => setProcessForm(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 24 hours"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={processForm.notes}
                    onChange={(e) => setProcessForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Add Step
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddProcess(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProcessorDashboard
