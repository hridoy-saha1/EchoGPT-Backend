import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity('sessions')
export class Session {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    refreshTokenHash: string;

    @Column()
    expiresAt: Date;

    @ManyToOne(() => User, (user) => user.sessions, {
        onDelete: 'CASCADE',
    })
    user: Relation<User>;

    @CreateDateColumn()
    createdAt: Date;
}