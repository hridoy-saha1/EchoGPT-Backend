import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity('web_searches')
export class WebSearch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  query: string;

  @Column({ type: 'text', nullable: true })
  results: string | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}