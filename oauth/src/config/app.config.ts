export default () => ({
    environment: process.env.NODE_ENV || 'development',
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      password: process.env.DATABASE_PASS || 'pass123',
      username: process.env.DATABASE_USER || 'postgres',
      database_name: process.env.DATABASE_NAME || 'postgres'
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'secret_key',
      expire_time: process.env.JWT_EXPIRE_TIME || '60s'
    }
});