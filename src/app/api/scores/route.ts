import { NextRequest, NextResponse } from 'next/server'
import getMongoClientPromise, { getMongoDbName } from '@/lib/mongodb'

const COLLECTION_NAME = 'scores'

type ScoreGrade = 'A' | 'B' | 'C' | 'D' | 'F'

interface ScoreInput {
  playerName: string
  score: number
  grade: ScoreGrade
  datePlayed: string
}

const allowedGrades: ScoreGrade[] = ['A', 'B', 'C', 'D', 'F']

function validateScoreInput(body: unknown): { valid: boolean; message?: string; data?: ScoreInput } {
  if (!body || typeof body !== 'object') {
    return { valid: false, message: 'Invalid request body.' }
  }

  const { playerName, score, grade, datePlayed } = body as Partial<ScoreInput>

  if (!playerName || typeof playerName !== 'string' || playerName.trim().length < 2) {
    return { valid: false, message: 'playerName is required (at least 2 characters).' }
  }

  if (typeof score !== 'number' || Number.isNaN(score) || score < 0 || score > 100) {
    return { valid: false, message: 'score must be a number from 0 to 100.' }
  }

  if (!grade || !allowedGrades.includes(grade)) {
    return { valid: false, message: 'grade must be one of A, B, C, D, F.' }
  }

  if (!datePlayed || Number.isNaN(Date.parse(datePlayed))) {
    return { valid: false, message: 'datePlayed must be a valid date string.' }
  }

  return {
    valid: true,
    data: {
      playerName: playerName.trim(),
      score,
      grade,
      datePlayed,
    },
  }
}

export async function GET() {
  try {
    const client = await getMongoClientPromise()
    const db = client.db(getMongoDbName())

    const scores = await db
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ score: -1, datePlayed: -1 })
      .limit(100)
      .toArray()

    return NextResponse.json(scores, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch scores.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = validateScoreInput(body)

    if (!validation.valid || !validation.data) {
      return NextResponse.json({ error: validation.message }, { status: 400 })
    }

    const client = await getMongoClientPromise()
    const db = client.db(getMongoDbName())

    const now = new Date()
    const result = await db.collection(COLLECTION_NAME).insertOne({
      ...validation.data,
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json(
      {
        message: 'Score saved successfully.',
        id: result.insertedId,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save score.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
