import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { registrarVisita, registrarTempo } from './services/analyticsService'

function Root() {
  useEffect(() => {
    registrarVisita()
    const inicio = Date.now()

    return () => {
      const tempo = Math.floor((Date.now() - inicio) / 1000)
      registrarTempo(tempo)
    }
  }, [])

  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)