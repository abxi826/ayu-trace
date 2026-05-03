import React, { useState } from 'react'
import { MapPin, Camera, Upload, CheckCircle, AlertCircle, Leaf, Calendar, Thermometer } from 'lucide-react'
import { useBlockchain } from '../context/BlockchainContext'

const CollectorApp = () => {
  const [formData, setFormData] = useState({
    herbName: '',
    scientificName: '',
    quantity: '',
    location: '',
    coordinates: { lat: '', lng: '' },
    weather: '',
    soilCondition: '',
    harvestMethod: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { addCollectionEvent } = useBlockchain()

  const herbOptions = [
    { name: 'Ashwagandha', scientific: 'Withania somnifera' },
    { name: 'Turmeric', scientific: 'Curcuma longa' },
    { name: 'Brahmi', scientific: 'Bacopa monnieri' },
    { name: 'Neem', scientific: 'Azadirachta indica' },
    { name: 'Tulsi', scientific: 'Ocimum tenuiflorum' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleHerbSelect = (herb) => {
    setFormData(prev => ({
      ...prev,
      herbName: herb.name,
      scientificName: herb.scientific
    }))
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude.toFixed(6),
              lng: position.coords.longitude.toFixed(6)
            }
          }))
        },
        (error) => {
          alert('Unable to get location. Please enter coordinates manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const collectionData = {
      herbId: `${formData.herbName.substring(0, 3).toUpperCase()}${Date.now()}`,
      herbName: formData.herbName,
      scientificName: formData.scientificName,
      quantity: formData.quantity,
      location: {
        lat: parseFloat(formData.coordinates.lat),
        lng: parseFloat(formData.coordinates.lng),
        name: formData.location
      },
      collector: 'Current User', // In real app, this would come from auth
      weather: formData.weather,
      soilCondition: formData.soilCondition,
      harvestMethod: formData.harvestMethod,
      notes: formData.notes
    }

    addCollectionEvent(collectionData)
    setIsSubmitting(false)
    setSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        herbName: '',
        scientificName: '',
        quantity: '',
        location: '',
        coordinates: { lat: '', lng: '' },
        weather: '',
        soilCondition: '',
        harvestMethod: '',
        notes: ''
      })
    }, 3000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Collection Recorded!</h2>
          <p className="text-gray-600 mb-4">
            Your herb collection has been successfully recorded on the blockchain.
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Herb:</strong> {formData.herbName}<br />
            <strong>Quantity:</strong> {formData.quantity}<br />
            <strong>Location:</strong> {formData.location}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Collector App</h1>
          <p className="text-gray-600">Record your herb collection with geo-tagging and blockchain verification</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Herb Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Leaf className="h-5 w-5 text-primary-600 mr-2" />
              Herb Information
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {herbOptions.map((herb) => (
                <button
                  key={herb.name}
                  type="button"
                  onClick={() => handleHerbSelect(herb)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    formData.herbName === herb.name
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium">{herb.name}</p>
                  <p className="text-xs text-gray-500 italic">{herb.scientific}</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Herb Name *
                </label>
                <input
                  type="text"
                  name="herbName"
                  value={formData.herbName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scientific Name
                </label>
                <input
                  type="text"
                  name="scientificName"
                  value={formData.scientificName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Collection Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-primary-600 mr-2" />
              Collection Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 25 kg"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harvest Method
                </label>
                <select
                  name="harvestMethod"
                  value={formData.harvestMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select method</option>
                  <option value="Hand Picking">Hand Picking</option>
                  <option value="Cutting">Cutting</option>
                  <option value="Digging">Digging (Roots)</option>
                  <option value="Stripping">Stripping (Bark)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 text-primary-600 mr-2" />
              Location Information
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Name *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Rajasthan Farm Cooperative"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="any"
                  name="coordinates"
                  value={formData.coordinates.lat}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    coordinates: { ...prev.coordinates, lat: e.target.value }
                  }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="any"
                  name="coordinates"
                  value={formData.coordinates.lng}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    coordinates: { ...prev.coordinates, lng: e.target.value }
                  }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Get GPS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Thermometer className="h-5 w-5 text-primary-600 mr-2" />
              Environmental Conditions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weather Conditions
                </label>
                <input
                  type="text"
                  name="weather"
                  value={formData.weather}
                  onChange={handleInputChange}
                  placeholder="e.g., Sunny, 25°C, Light breeze"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soil Condition
                </label>
                <input
                  type="text"
                  name="soilCondition"
                  value={formData.soilCondition}
                  onChange={handleInputChange}
                  placeholder="e.g., Well-drained, pH 6.5, Sandy loam"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any additional observations or notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Camera className="h-5 w-5 text-primary-600 mr-2" />
              Photo Documentation
            </h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Take photos of the collected herbs</p>
              <p className="text-sm text-gray-500 mb-4">Recommended: Plant, collection site, and harvested material</p>
              <button
                type="button"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Photos</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-500 text-white py-4 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Recording on Blockchain...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Record Collection</span>
                </>
              )}
            </button>
            
            {!isSubmitting && (
              <p className="text-sm text-gray-500 text-center mt-2">
                This will create an immutable record on the blockchain
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default CollectorApp
