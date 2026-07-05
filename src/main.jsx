import ReactDOM from 'react-dom/client'
import { MotionProvider } from './lib/motion.jsx'
import App from './App.jsx'
import './index.css'

// NOTE: StrictMode is intentionally off — its dev double-mount breaks
// @react-three/fiber v8 suspense resolution (textures load, scene never paints).
ReactDOM.createRoot(document.getElementById('root')).render(
  <MotionProvider>
    <App />
  </MotionProvider>
)
