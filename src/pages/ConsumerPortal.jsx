import React, { useState } from 'react'
import { Search, Scan, MapPin, Award, Shield, Leaf, Star, Calendar, User, CheckCircle } from 'lucide-react'
import { useBlockchain } from '../context/BlockchainContext'
import QRScanner from '../components/QRScanner'

const ConsumerPortal = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { herbs, getHerbTrace } = useBlockchain()

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    
    const herb = herbs.find(h => 
      h.qrCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    if (herb) {
      const trace = getHerbTrace(herb.id)
      setSelectedProduct(trace)
    } else {
      alert('Product not found. Please check your search query.')
    }
  }

  const handleQRScan = (result) => {
    setSearchQuery(result)
    setShowScanner(false)
    
    setTimeout(() => {
      const herb = herbs.find(h => h.qrCode === result)
      if (herb) {
        const trace = getHerbTrace(herb.id)
        setSelectedProduct(trace)
      }
    }, 100)
  }

  const trustScore = selectedProduct ? 95 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="gradient-bg text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Verify Your Ayurvedic Products</h1>
          <p className="text-xl mb-8 opacity-90">
            Scan or search to discover the complete journey of your herbs from farm to pharmacy
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-xl p-2 flex items-center space-x-2 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Enter QR code, product ID, or herb name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 text-gray-900 bg-transparent focus:outline-none"
            />
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
              <Scan className="h-5 w-5" />
              <span>Scan</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* QR Scanner Modal */}
        {showScanner && (
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setShowScanner(false)}
          />
        )}

        {selectedProduct ? (
          /* Product Details */
          <div className="space-y-8">
            {/* Product Header */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <div className="bg-primary-100 p-4 rounded-xl">
                    <Leaf className="h-12 w-12 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedProduct.herb.name}</h2>
                    <p className="text-gray-600 italic text-lg">{selectedProduct.herb.scientificName}</p>
                    <p className="text-gray-500">Batch: {selectedProduct.herb.batchId}</p>
                  </div>
                </div>
                
                {/* Trust Score */}
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mb-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{trustScore}</div>
                      <div className="text-xs text-green-600">Trust Score</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Origin</p>
                    <p className="font-semibold">{selectedProduct.herb.location.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Harvested</p>
                    <p className="font-semibold">{new Date(selectedProduct.herb.collectionDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Quality</p>
                    <p className="font-semibold">{selectedProduct.herb.quality}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Certification</p>
                    <p className="font-semibold">{selectedProduct.herb.sustainability}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Journey</h3>
              
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-8">
                  {/* Collection */}
                  {selectedProduct.collections.map((collection, index) => (
                    <div key={index} className="relative flex items-start space-x-6">
                      <div className="bg-green-100 p-3 rounded-full">
                        <Leaf className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-green-50 rounded-lg p-6">
                          <h4 className="font-bold text-green-900 mb-2">Harvested from Nature</h4>
                          <p className="text-green-800 mb-3">
                            Carefully collected by {collection.collector} from sustainable sources
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-green-600 font-medium">Location:</span>
                              <p className="text-green-800">{selectedProduct.herb.location.name}</p>
                            </div>
                            <div>
                              <span className="text-green-600 font-medium">Quantity:</span>
                              <p className="text-green-800">{collection.quantity}</p>
                            </div>
                            <div>
                              <span className="text-green-600 font-medium">Weather:</span>
                              <p className="text-green-800">{collection.weather}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Processing */}
                  <div className="relative flex items-start space-x-6">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-bold text-blue-900 mb-2">Expert Processing</h4>
                        <p className="text-blue-800 mb-3">
                          Processed using traditional Ayurvedic methods with modern quality controls
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-800">Temperature Controlled</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-800">Hygiene Standards</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-800">Quality Tested</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quality Testing */}
                  <div className="relative flex items-start space-x-6">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-purple-50 rounded-lg p-6">
                        <h4 className="font-bold text-purple-900 mb-2">Laboratory Verified</h4>
                        <p className="text-purple-800 mb-3">
                          Rigorous testing ensures purity, potency, and safety standards
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">✓</div>
                            <p className="text-purple-800">Purity Test</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">✓</div>
                            <p className="text-purple-800">Pesticide Free</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">✓</div>
                            <p className="text-purple-800">Heavy Metals</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">✓</div>
                            <p className="text-purple-800">Microbial</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final Product */}
                  <div className="relative flex items-start space-x-6">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-yellow-50 rounded-lg p-6">
                        <h4 className="font-bold text-yellow-900 mb-2">Ready for You</h4>
                        <p className="text-yellow-800">
                          Your authentic Ayurvedic herb, traced from source to shelf with complete transparency
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Farmer/Collector Profile */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Meet Your Farmer</h3>
              <div className="flex items-start space-x-6">
                <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedProduct.herb.collector}</h4>
                  <p className="text-gray-600 mb-4">
                    Experienced Ayurvedic herb collector with over 15 years of sustainable harvesting practices. 
                    Committed to preserving traditional knowledge while protecting biodiversity.
                  </p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <span className="ml-2 font-medium">{selectedProduct.herb.location.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Experience:</span>
                      <span className="ml-2 font-medium">15+ years</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Certification:</span>
                      <span className="ml-2 font-medium">Organic Certified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sustainability Impact */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Sustainability Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                  <p className="text-green-800 font-medium">Sustainable Sourcing</p>
                  <p className="text-sm text-green-600 mt-1">Wild collection following NMPB guidelines</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                  <p className="text-blue-800 font-medium">Chemical Pesticides</p>
                  <p className="text-sm text-blue-600 mt-1">Naturally grown without harmful chemicals</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
                  <p className="text-purple-800 font-medium">Families Supported</p>
                  <p className="text-sm text-purple-600 mt-1">Fair trade practices benefit local communities</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Sample Products */
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Try These Sample Products</h2>
              <p className="text-gray-600">Click on any product to see its complete traceability journey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {herbs.map((herb) => (
                <div
                  key={herb.id}
                  onClick={() => {
                    const trace = getHerbTrace(herb.id)
                    setSelectedProduct(trace)
                  }}
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer card-hover"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <Leaf className="h-8 w-8 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{herb.name}</h3>
                      <p className="text-sm text-gray-600 italic">{herb.scientificName}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quality:</span>
                      <span className="font-medium">{herb.quality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Origin:</span>
                      <span className="font-medium">{herb.location.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">QR Code:</span>
                      <span className="font-medium font-mono">{herb.qrCode}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      herb.status === 'Ready for Sale' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {herb.status}
                    </span>
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

export default ConsumerPortal
