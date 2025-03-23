import { useState } from 'react'
import './App.css'
import CsvUploadTable from '@/components/CsvUploadTable'
import { Button } from './components/ui/button'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [savedApiKey, setSavedApiKey] = useState('')

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">csv handler</h1>
      <div className="mb-4">
        <label htmlFor="apiKey" className="block text-lg font-medium mb-2">
          insert google api key
        </label>
        <input
          id="apiKey"
          type="password"
          className="border border-gray-300 rounded px-4 py-2 w-full mb-2"
          placeholder="set api key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Button
          onClick={() => {
            if(apiKey.trim()){
              setSavedApiKey(apiKey.trim())
              alert('api key saved')
            } else {
              alert('set api key')
            }
          }}
        >
          save api key
        </Button>
      </div>

      {savedApiKey && (
        <>
          <div className="mb-4 text-green-700">
            api key saved ✅
          </div>
          <CsvUploadTable apiKey={savedApiKey}/>
        </>
      )}
    </div>
  )
}

export default App
