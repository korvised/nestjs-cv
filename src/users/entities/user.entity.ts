import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Report } from "../../reports/entities/report.entity";
import { hashPassword } from "../../common/services/auth.service";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, report => report.user)
  reports: Report[];

  @BeforeInsert()
  async beforeInsert() {
    this.password = await hashPassword(this.password);
  }

  @BeforeUpdate()
  beforeUpdate() {
    console.log("Before update ", this.password);
  }
}
