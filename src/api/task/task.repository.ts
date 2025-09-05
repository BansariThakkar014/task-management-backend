import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Task } from "./entity/task.entity";

@Injectable()
export class TaskRepository extends Repository<Task>{
  constructor(private readonly dataSource: DataSource){
    super(Task, dataSource.createEntityManager())
  }

  // Create tasks
  async createTask(taskData: Partial<Task>): Promise<Task>{
    const task = this.create(taskData)
    return this.save(task)
  }
}