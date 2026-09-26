import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Subscription } from '../../subscriptions/entities/subscription.entity.js';

@Entity('user_subscriptions')
export class UserSubscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Subscription, { onDelete: 'CASCADE' })
    subscription: Subscription;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({ default: 'active' })
    status: string;

    @Column({ default: 0 })
    usedRequests: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}