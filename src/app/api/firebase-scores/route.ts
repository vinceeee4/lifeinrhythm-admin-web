import { NextRequest, NextResponse } from 'next/server'
import { Score, FirestoreResponse, FirestoreDocument } from '@/types/score'

function getFirebaseConfig() {
  const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

  if (!PROJECT_ID || !API_KEY) {
    throw new Error('Missing Firebase configuration. Please check your environment variables.')
  }

  return { PROJECT_ID, API_KEY }
}

function transformFirestoreDocument(doc: any) {
  const fields = doc.fields || {};
  
  return {
    playerName: fields.playerName?.stringValue || 'Anonymous',
    
    // Handle BOTH integer AND double for all number fields
    empathyScore: fields.empathyScore?.integerValue 
      ? parseInt(fields.empathyScore.integerValue)
      : (fields.empathyScore?.doubleValue 
          ? parseFloat(fields.empathyScore.doubleValue) 
          : 0),
    
    totalTime: fields.totalTime?.doubleValue 
      ? parseFloat(fields.totalTime.doubleValue)
      : (fields.totalTime?.integerValue 
          ? parseInt(fields.totalTime.integerValue) 
          : 0),
    
    leaderboardScore: fields.leaderboardScore?.doubleValue 
      ? parseFloat(fields.leaderboardScore.doubleValue)
      : (fields.leaderboardScore?.integerValue 
          ? parseInt(fields.leaderboardScore.integerValue) 
          : 0),
    
    grade: fields.grade?.stringValue || 'N/A',
    timeFormatted: fields.timeFormatted?.stringValue || 'N/A',
    timeRating: fields.timeRating?.stringValue || '',
    datePlayed: fields.datePlayed?.stringValue || '',
    deviceModel: fields.deviceModel?.stringValue || ''
  };
}

export async function GET(request: NextRequest) {
  try {
    const { PROJECT_ID, API_KEY } = getFirebaseConfig()
    
    // Use structured query approach for reliable fresh data (no pagination issues)
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery?key=${API_KEY}`
    
    console.log('Fetching from Firebase with structured query:', url)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'scores' }],
          orderBy: [{
            field: { fieldPath: 'leaderboardScore' },
            direction: 'DESCENDING'
          }],
          limit: 100
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Firebase API Error:', errorData)
      return NextResponse.json(
        { error: 'Failed to fetch scores from Firebase', details: errorData },
        { status: response.status }
      )
    }

    const rawData = await response.json()
    console.log('Firebase structured query raw response:', JSON.stringify(rawData, null, 2))
    console.log('Raw array length:', rawData.length)
    
    // runQuery returns array, filter out items without document property
    const documents = rawData
      .filter((item: any) => item && item.document) // Remove items without document
      .map((item: any) => item.document);   // Extract document from wrapper
    
    console.log('Valid documents found:', documents.length)
    
    // Debug: Log document IDs and key info
    documents.forEach((doc: any, index: number) => {
      console.log(`Document ${index}:`, {
        documentId: doc.name?.split('/').pop() || '',
        playerName: doc.fields?.playerName?.stringValue,
        empathyScore: doc.fields?.empathyScore?.integerValue || doc.fields?.empathyScore?.doubleValue,
        leaderboardScore: doc.fields?.leaderboardScore?.integerValue || doc.fields?.leaderboardScore?.doubleValue,
        grade: doc.fields?.grade?.stringValue
      })
    })
    
    if (documents.length === 0) {
      console.log('No documents found in Firebase')
      return NextResponse.json([], { status: 200 })
    }

    // Sort by leaderboardScore in descending order using the fixed transform function
    const transformedScores = documents
      .filter((doc: any) => doc && doc.fields) // Only filter for documents that have fields
      .map(transformFirestoreDocument) // Use the fixed transform function
      .sort((a: any, b: any) => b.leaderboardScore - a.leaderboardScore) // Sort by leaderboardScore
      .slice(0, 10) // Limit to top 10

    console.log('Transformed', transformedScores.length, 'scores:', transformedScores)

    return NextResponse.json(transformedScores, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Error fetching Firebase scores:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error while fetching scores',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
