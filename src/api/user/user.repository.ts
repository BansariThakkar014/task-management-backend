import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./entity/user.entity";

@Injectable()
export class UserRepository extends Repository<User>{
  constructor(private readonly dataSource: DataSource){
    super(User, dataSource.createEntityManager())
  }

  async createUser(userData: Partial<User>): Promise<User>{
    const user = await this.create(userData);
    return await this.save(user);
  }
}