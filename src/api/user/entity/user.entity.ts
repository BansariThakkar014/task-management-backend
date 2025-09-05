import { Task } from "../../task/entity/task.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string

  @Column({ type: 'varchar'})
  // @Index()
  email: string

  @Column({ type: 'varchar' })
  password: string

  @Column({ type: 'varchar' })
  salt: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date

  // Relationship
  //One user can create many tasks
  @OneToMany(()=> Task, task => task.user)
  tasks: Task[]

}