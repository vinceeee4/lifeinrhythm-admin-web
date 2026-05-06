import { NextResponse } from 'next/server'
import getMongoClientPromise, { getMongoDbName } from '@/lib/mongodb'

const COLLECTION_NAME = 'scores'

export async function POST() {
  try {
    const client = await getMongoClientPromise()
    const db = client.db(getMongoDbName())

    const existingCollections = await db
      .listCollections({ name: COLLECTION_NAME }, { nameOnly: true })
      .toArray()

    if (existingCollections.length === 0) {
      await db.createCollection(COLLECTION_NAME)
    }

    await db.collection(COLLECTION_NAME).createIndex({ score: -1, datePlayed: -1 })

    return NextResponse.json(
      {
        message: 'Setup complete.',
        database: db.databaseName,
        collection: COLLECTION_NAME,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Setup failed.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
