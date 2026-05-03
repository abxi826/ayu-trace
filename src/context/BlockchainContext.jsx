import React, { createContext, useContext, useState, useEffect } from 'react'

const BlockchainContext = createContext()

export const useBlockchain = () => {
  const context = useContext(BlockchainContext)
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider')
  }
  return context
}

export const BlockchainProvider = ({ children }) => {
  const [blocks, setBlocks] = useState([])
  const [herbs, setHerbs] = useState([])
  const [collections, setCollections] = useState([])
  const [processing, setProcessing] = useState([])
  const [qualityTests, setQualityTests] = useState([])

  // Mock blockchain data
  useEffect(() => {
    // Initialize with sample data
    const sampleHerbs = [
      {
        id: 'ASH001',
        name: 'Ashwagandha',
        scientificName: 'Withania somnifera',
        batchId: 'BATCH001',
        qrCode: 'QR001',
        status: 'Ready for Sale',
        collectionDate: '2024-01-15',
        location: { lat: 28.6139, lng: 77.2090, name: 'Rajasthan Farm Co-op' },
        collector: 'Ramesh Kumar',
        quality: 'Grade A',
        sustainability: 'Certified Organic'
      },
      {
        id: 'TUL002',
        name: 'Turmeric',
        scientificName: 'Curcuma longa',
        batchId: 'BATCH002',
        qrCode: 'QR002',
        status: 'In Processing',
        collectionDate: '2024-01-20',
        location: { lat: 11.1271, lng: 78.6569, name: 'Tamil Nadu Collective' },
        collector: 'Priya Devi',
        quality: 'Grade A+',
        sustainability: 'Fair Trade Certified'
      }
    ]

    const sampleCollections = [
      {
        id: 'COL001',
        herbId: 'ASH001',
        timestamp: '2024-01-15T08:30:00Z',
        location: { lat: 28.6139, lng: 77.2090 },
        collector: 'Ramesh Kumar',
        quantity: '50 kg',
        weather: 'Sunny, 25°C',
        soilCondition: 'Well-drained, pH 6.5'
      }
    ]

    setHerbs(sampleHerbs)
    setCollections(sampleCollections)
  }, [])

  const addCollectionEvent = (collectionData) => {
    const newCollection = {
      id: `COL${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...collectionData
    }
    setCollections(prev => [...prev, newCollection])
    
    // Add to blockchain
    const newBlock = {
      id: blocks.length + 1,
      timestamp: new Date().toISOString(),
      type: 'CollectionEvent',
      data: newCollection,
      hash: `hash_${Date.now()}`
    }
    setBlocks(prev => [...prev, newBlock])
  }

  const addProcessingEvent = (processingData) => {
    const newProcessing = {
      id: `PROC${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...processingData
    }
    setProcessing(prev => [...prev, newProcessing])
    
    // Add to blockchain
    const newBlock = {
      id: blocks.length + 1,
      timestamp: new Date().toISOString(),
      type: 'ProcessingEvent',
      data: newProcessing,
      hash: `hash_${Date.now()}`
    }
    setBlocks(prev => [...prev, newBlock])
  }

  const addQualityTest = (testData) => {
    const newTest = {
      id: `TEST${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...testData
    }
    setQualityTests(prev => [...prev, newTest])
    
    // Add to blockchain
    const newBlock = {
      id: blocks.length + 1,
      timestamp: new Date().toISOString(),
      type: 'QualityTest',
      data: newTest,
      hash: `hash_${Date.now()}`
    }
    setBlocks(prev => [...prev, newBlock])
  }

  const getHerbTrace = (herbId) => {
    const herb = herbs.find(h => h.id === herbId)
    const herbCollections = collections.filter(c => c.herbId === herbId)
    const herbProcessing = processing.filter(p => p.herbId === herbId)
    const herbTests = qualityTests.filter(t => t.herbId === herbId)
    
    return {
      herb,
      collections: herbCollections,
      processing: herbProcessing,
      qualityTests: herbTests
    }
  }

  const value = {
    blocks,
    herbs,
    collections,
    processing,
    qualityTests,
    addCollectionEvent,
    addProcessingEvent,
    addQualityTest,
    getHerbTrace
  }

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  )
}
