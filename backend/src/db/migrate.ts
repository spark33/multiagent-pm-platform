import { createTables } from './schema'

// Run migrations
console.log('🔄 Running database migrations...')
createTables()
console.log('✅ Migrations complete')
