export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    name: process.env.DB_DATABASE ?? 'task_management',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'your-super-secret-key',
    expiresIn: process.env.JWT_EXPIRATION ?? '1d',
  },
  salt: parseInt(process.env.SALT_ROUNDS ?? '10', 10),
  
});
