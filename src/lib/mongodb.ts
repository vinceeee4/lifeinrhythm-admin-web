import dns from 'node:dns'
import { MongoClient } from 'mongodb'

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>
}

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI

  if (!uri) {
    throw new Error('Missing MongoDB URI. Set MONGODB_URI or MONGO_URI.')
  }

  return uri
}

export function getMongoDbName(): string {
  if (process.env.MONGODB_DB_NAME) return process.env.MONGODB_DB_NAME
  if (process.env.MONGO_DB_NAME) return process.env.MONGO_DB_NAME

  const uri = getMongoUri()

  try {
    const url = new URL(uri)
    const dbFromPath = url.pathname.replace('/', '').trim()
    if (dbFromPath) return dbFromPath
  } catch {
    // Fall back to default DB name when URI parsing fails.
  }

  return 'LifeInRhythm'
}

export default function getMongoClientPromise(): Promise<MongoClient> {
  const uri = getMongoUri()

  if (uri.startsWith('mongodb+srv://')) {
    const configuredServers = process.env.ATLAS_DNS_SERVERS
      ? process.env.ATLAS_DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean)
      : ['8.8.8.8', '1.1.1.1']

    if (configuredServers.length > 0) {
      dns.setServers(configuredServers)
    }
  }

  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(uri)
    globalForMongo.mongoClientPromise = client.connect()
  }

  return globalForMongo.mongoClientPromise
}
