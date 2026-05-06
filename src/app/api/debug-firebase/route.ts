import { NextRequest, NextResponse } from 'next/server'

function getFirebaseConfig() {
  const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

  if (!PROJECT_ID || !API_KEY) {
    throw new Error('Missing Firebase configuration. Please check your environment variables.')
  }

  return { PROJECT_ID, API_KEY }
}

export async function GET(request: NextRequest) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    steps: [] as string[],
    rawData: null as any,
    transformedData: null as any,
    errors: [] as string[],
    success: false
  }

  try {
    debugInfo.steps.push('Starting Firebase debug...')
    
    // Check environment variables
    const { PROJECT_ID, API_KEY } = getFirebaseConfig()
    debugInfo.steps.push(`✅ Environment variables loaded: PROJECT_ID=${PROJECT_ID}`)

    // Test 1: Simple document list
    debugInfo.steps.push('Testing simple document list...')
    const simpleUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/scores?key=${API_KEY}`
    
    const simpleResponse = await fetch(simpleUrl)
    debugInfo.steps.push(`Simple list response status: ${simpleResponse.status}`)
    
    if (!simpleResponse.ok) {
      const errorText = await simpleResponse.text()
      debugInfo.errors.push(`Simple list failed: ${simpleResponse.status} - ${errorText}`)
    } else {
      const simpleData = await simpleResponse.json()
      debugInfo.rawData = simpleData
      debugInfo.steps.push(`✅ Simple list successful, found ${simpleData.documents?.length || 0} documents`)
      
      // Transform the data
      if (simpleData.documents && simpleData.documents.length > 0) {
        const transformed = simpleData.documents.map((doc: any) => {
          const fields = doc.fields || {}
          return {
            playerName: fields.playerName?.stringValue || 'Unknown',
            empathyScore: parseInt(fields.empathyScore?.integerValue || '0'),
            totalTime: parseInt(fields.totalTime?.integerValue || '0'),
            leaderboardScore: parseInt(fields.leaderboardScore?.integerValue || '0'),
            grade: fields.grade?.stringValue || 'N/A',
            timeFormatted: fields.timeFormatted?.stringValue || 'N/A',
            timeRating: fields.timeRating?.stringValue || 'N/A',
            datePlayed: fields.datePlayed?.stringValue || 'N/A',
            deviceModel: fields.deviceModel?.stringValue || 'N/A',
          }
        })
        debugInfo.transformedData = transformed
        debugInfo.steps.push(`✅ Data transformation successful`)
        debugInfo.success = true
      }
    }

    // Test 2: Structured query (original approach)
    debugInfo.steps.push('Testing structured query...')
    const queryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery?key=${API_KEY}`
    
    const queryResponse = await fetch(queryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'scores' }],
          orderBy: [{
            field: { fieldPath: 'leaderboardScore' },
            direction: 'DESCENDING'
          }],
          limit: 10
        }
      })
    })
    
    debugInfo.steps.push(`Structured query response status: ${queryResponse.status}`)
    
    if (!queryResponse.ok) {
      const errorText = await queryResponse.text()
      debugInfo.errors.push(`Structured query failed: ${queryResponse.status} - ${errorText}`)
    } else {
      const queryData = await queryResponse.json()
      debugInfo.steps.push(`✅ Structured query successful, found ${queryData.length || 0} documents`)
    }

  } catch (error) {
    debugInfo.errors.push(`Exception: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return NextResponse.json(debugInfo, { status: 200 })
}
