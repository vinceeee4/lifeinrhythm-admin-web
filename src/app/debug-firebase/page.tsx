'use client'

import { useState, useEffect } from 'react'

export default function DebugFirebase() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testFirebase = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/firebase-scores')
        
        console.log('Response status:', response.status)
        console.log('Response headers:', response.headers)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          setError(`HTTP ${response.status}: ${errorText}`)
          return
        }

        const jsonData = await response.json()
        console.log('Firebase data:', jsonData)
        setData(jsonData)
        setError(null)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    testFirebase()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Firebase Debug</h1>
        
        {loading && <p>Loading...</p>}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {data && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Firebase Response:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-6 bg-blue-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Environment Variables Check:</h3>
          <ul className="list-disc list-inside text-sm">
            <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}</li>
            <li>NEXT_PUBLIC_FIREBASE_API_KEY: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
