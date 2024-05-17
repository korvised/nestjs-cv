import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  hashPassword() {
    console.log("Hashing password ", this.password);
  }

  @BeforeUpdate()
  beforeUpdate() {
    console.log("Before update ", this.password);
  }
}
