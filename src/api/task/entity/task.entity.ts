import { User } from "../../user/entity/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Status{
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

@Entity('tasks')
export class Task{
  @PrimaryGeneratedColumn('increment', {type: 'bigint'})
  id: number

  @Column({name: 'user_id', nullable: false})
  userId: number

  @Column({type: 'varchar', nullable: false})
  title: string

  @Column({type: 'text', nullable: true})
  description: string

  @Column({type:'enum', enum: Status, default: Status.PENDING})
  status: Status

  @Column({name: 'is_active', type: 'boolean', default: true})
  isActive: boolean

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date

  @DeleteDateColumn({name: 'deleted_at'})
  deletedAt?: Date

  // Foreign Key
  // Many tasks can be created by one user
  @ManyToOne(()=> User, user => user.tasks)
  @JoinColumn({name: 'user_id'})
  user: User
}