import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import TraceProduct from './pages/TraceProduct'
import CollectorApp from './pages/CollectorApp'
import ProcessorDashboard from './pages/ProcessorDashboard'
import ConsumerPortal from './pages/ConsumerPortal'
import { BlockchainProvider } from './context/BlockchainContext'

function App() {
  return (
    <BlockchainProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trace" element={<TraceProduct />} />
            <Route path="/collector" element={<CollectorApp />} />
            <Route path="/processor" element={<ProcessorDashboard />} />
            <Route path="/consumer" element={<ConsumerPortal />} />
          </Routes>
        </div>
      </Router>
    </BlockchainProvider>
  )
}

export default App
