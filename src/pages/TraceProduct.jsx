import React, { useState } from 'react'
import { Search, MapPin, Calendar, User, Award, Shield, Package, Leaf } from 'lucide-react'
import { useBlockchain } from '../context/BlockchainContext'
import QRScanner from '../components/QRScanner'
import TraceabilityMap from '../components/TraceabilityMap'

const TraceProduct = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [traceData, setTraceData] = useState(null)
  const [showScanner, setShowScanner] = useState(false)
  const { getHerbTrace, herbs } = useBlockchain()

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    
    // Find herb by ID or QR code
    const herb = herbs.find(h => 
      h.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.qrCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    if (herb) {
      const trace = getHerbTrace(herb.id)
      setTraceData(trace)
    } else {
      setTraceData(null)
      alert('Product not found. Please check your search query.')
    }
  }

  const handleQRScan = (result) => {
    setSearchQuery(result)
    setShowScanner(false)
    // Auto-search after QR scan
    setTimeout(() => {
      const herb = herbs.find(h => h.qrCode === result)
      if (herb) {
        const trace = getHerbTrace(herb.id)
        setTraceData(trace)
      }
    }, 100)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready for Sale': return 'bg-green-100 text-green-800'
      case 'In Processing': return 'bg-yellow-100 text-yellow-800'
      case 'Quality Testing': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trace Your Product</h1>
          <p className="text-gray-600">Enter product ID, QR code, or scan to view complete traceability</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter Product ID, QR Code, or Herb Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
            <button
              onClick={() => setShowScanner(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Package className="h-5 w-5" />
              <span>Scan QR</span>
            </button>
          </div>
        </div>

        {/* QR Scanner Modal */}
        {showScanner && (
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setShowScanner(false)}
          />
        )}

        {/* Trace Results */}
        {traceData && traceData.herb && (
          <div className="space-y-8">
            {/* Product Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Leaf className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{traceData.herb.name}</h2>
                    <p className="text-gray-600 italic">{traceData.herb.scientificName}</p>
                    <p className="text-sm text-gray-500">Batch ID: {traceData.herb.batchId}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(traceData.herb.status)}`}>
                  {traceData.herb.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Origin</p>
                    <p className="font-medium">{traceData.herb.location.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Collection Date</p>
                    <p className="font-medium">{new Date(traceData.herb.collectionDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Quality Grade</p>
                    <p className="font-medium">{traceData.herb.quality}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Location</h3>
              <div className="h-64 rounded-lg overflow-hidden">
                <TraceabilityMap 
                  locations={[traceData.herb.location]}
                  center={[traceData.herb.location.lat, traceData.herb.location.lng]}
                />
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Traceability Journey</h3>
              
              <div className="space-y-6">
                {/* Collection Event */}
                {traceData.collections.map((collection, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Collection Event</h4>
                      <p className="text-gray-600 mb-2">
                        Collected by {collection.collector} on {new Date(collection.timestamp).toLocaleDateString()}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <span className="ml-2 font-medium">{collection.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Weather:</span>
                          <span className="ml-2 font-medium">{collection.weather}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Soil:</span>
                          <span className="ml-2 font-medium">{collection.soilCondition}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Processing Events */}
                {traceData.processing.map((process, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Processing Step</h4>
                      <p className="text-gray-600">
                        {process.step} - {new Date(process.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Quality Tests */}
                {traceData.qualityTests.map((test, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Quality Test</h4>
                      <p className="text-gray-600">
                        {test.testType} - {new Date(test.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-green-600 font-medium">Result: {test.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications & Compliance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Organic Certified</p>
                    <p className="text-sm text-green-700">NPOP Certified Organic</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Quality Assured</p>
                    <p className="text-sm text-blue-700">AYUSH Ministry Standards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sample Products for Demo */}
        {!traceData && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Try These Sample Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {herbs.map((herb) => (
                <div
                  key={herb.id}
                  onClick={() => {
                    setSearchQuery(herb.id)
                    const trace = getHerbTrace(herb.id)
                    setTraceData(trace)
                  }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Leaf className="h-8 w-8 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900">{herb.name}</p>
                      <p className="text-sm text-gray-600">ID: {herb.id}</p>
                      <p className="text-sm text-gray-500">QR: {herb.qrCode}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TraceProduct
