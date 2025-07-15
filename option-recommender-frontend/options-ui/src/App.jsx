import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import OptionFetcher from './components/OptionFetcher';

function App() {
  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Options Screener</h1>
      <OptionFetcher />
    </div>
  );
}

export default App;

