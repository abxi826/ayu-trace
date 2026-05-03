import React, { useEffect, useRef, useState } from 'react'
import { X, Camera } from 'lucide-react'

const QRScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null)
  const [error, setError] = useState('')
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.')
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
    }
  }

  const handleManualInput = () => {
    const qrCode = prompt('Enter QR Code manually:')
    if (qrCode) {
      onScan(qrCode)
    }
  }

  // Simulate QR scan for demo
  const simulateScan = () => {
    const sampleQRs = ['QR001', 'QR002']
    const randomQR = sampleQRs[Math.floor(Math.random() * sampleQRs.length)]
    onScan(randomQR)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error ? (
          <div className="text-center py-8">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleManualInput}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Enter Manually
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 bg-gray-900 rounded-lg object-cover"
              />
              <div className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none">
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-primary-500"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-primary-500"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-primary-500"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-primary-500"></div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">Position the QR code within the frame</p>
              <div className="flex space-x-2">
                <button
                  onClick={simulateScan}
                  className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Demo Scan
                </button>
                <button
                  onClick={handleManualInput}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Manual Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QRScanner
