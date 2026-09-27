import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ai_providers')
export class AIProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  providerName: string;

  @Column()
  modelName: string;

  @Column({ type: 'text', select: false })
  apiKeyEncrypted: string;

  @Column({ default: true })
  isEnabled: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}