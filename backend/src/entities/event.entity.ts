import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';
import { Review } from './review.entity';

export enum EventCategory {
  TECHNOLOGIE = 'Technologie',
  SPORT = 'Sport',
  ATELIER = 'Atelier',
  BUSINESS = 'Business',
  MUSIQUE = 'Musique',
  ART = 'Art',
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  PAST = 'past',
  CANCELLED = 'cancelled',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  time: string;

  @Column({ nullable: true })
  duration: string;

  @Column()
  location: string;

  @Column({ type: 'text', default: EventCategory.TECHNOLOGIE })
  category: EventCategory;

  @Column({ type: 'text', default: EventStatus.UPCOMING })
  status: EventStatus;

  @Column({ type: 'decimal', default: 0 })
  price: number;

  @Column({ default: 0 })
  participants: number;

  @Column({ default: 100 })
  maxParticipants: number;

  @Column({ nullable: true })
  cover: string;

  @ManyToOne(() => User, (user) => user.organizedEvents, { eager: true })
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column()
  organizerId: string;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.event)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
