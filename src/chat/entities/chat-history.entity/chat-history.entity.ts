import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import type { Relation } from 'typeorm';
import { User } from '../../../users/entities/user.entity.js';

@Entity('chat_history')
export class ChatHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  conversationId: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  role: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  providerName: string;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: Relation<User>;

  @CreateDateColumn()
  createdAt: Date;
}