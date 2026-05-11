import { NextRequest, NextResponse } from 'next/server'
import type { FirestoreDocument } from '@/types/score'

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

type ListDocumentsPage = {
  documents?: FirestoreDocument[]
  nextPageToken?: string
}

/**
 * List every document in `scores` (paginated). Unlike runQuery + orderBy(leaderboardScore),
 * this includes documents that are missing `leaderboardScore` — those were invisible before.
 */
async function listAllScoreDocuments(
  PROJECT_ID: string,
  API_KEY: string
): Promise<FirestoreDocument[]> {
  const base = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/scores`
  const documents: FirestoreDocument[] = []
  let pageToken: string | undefined

  do {
    const params = new URLSearchParams({
      key: API_KEY,
      pageSize: '300',
    })
    if (pageToken) {
      params.set('pageToken', pageToken)
    }

    const listUrl = `${base}?${params.toString()}`
    const response = await fetch(listUrl, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(errorData || `List scores failed: ${response.status}`)
    }

    const page = (await response.json()) as ListDocumentsPage
    if (page.documents?.length) {
      documents.push(...page.documents)
    }
    pageToken = page.nextPageToken
  } while (pageToken)

  return documents
}

export async function GET(request: NextRequest) {
  try {
    const { PROJECT_ID, API_KEY } = getFirebaseConfig()

    const documents = await listAllScoreDocuments(PROJECT_ID, API_KEY)

    console.log('Scores documents listed (all pages):', documents.length)

    if (documents.length === 0) {
      console.log('No documents found in Firebase')
      return NextResponse.json([], { status: 200 })
    }

    // Sort by leaderboardScore in descending order using the fixed transform function
    const transformedScores = documents
      .filter((doc: any) => doc && doc.fields) // Only filter for documents that have fields
      .map(transformFirestoreDocument) // Use the fixed transform function
      .sort((a: any, b: any) => b.leaderboardScore - a.leaderboardScore) // Sort by leaderboardScore
      .slice(0, 100) // Top 100 by computed leaderboardScore across entire collection

    console.log('Transformed scores (top 100):', transformedScores.length)

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
