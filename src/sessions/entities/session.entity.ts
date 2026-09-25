import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
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
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}