import { DataSource } from 'typeorm';

// Create and export the data source for CLI usage
export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_DATABASE || 'task_management',
  entities: ['src/**/**/*.entity.{ts,js}', 'src/**/**/**/*.entity.{ts,js}'],
  migrations: ['src/migrations/*.{ts,js}'],
  migrationsTableName: 'migrations',
  synchronize: false,
  migrationsRun: true,
  logging: true,
});
