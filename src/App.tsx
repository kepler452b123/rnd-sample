import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MasterDetail from './components/selectiontest'
import Acc from './components/accordion'
import 'devextreme/dist/css/dx.light.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <MasterDetail/>
      </div>
    </>
  )
}

export default App
