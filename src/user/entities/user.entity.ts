import { Exclude } from 'class-transformer';
import { Task } from 'src/tasks/entity/tasks.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
  })
  @Exclude()
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
