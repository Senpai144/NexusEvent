import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'int', default: 5 })
  rating: number;

  @Column({ nullable: true })
  role: string;

  @ManyToOne(() => User, (user) => user.reviews, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Event, (event) => event.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column({ nullable: true })
  eventId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
