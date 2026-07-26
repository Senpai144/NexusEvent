import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Booking } from './booking.entity';
import { Review } from './review.entity';
import { Event } from './event.entity';

export enum UserRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'text', default: UserRole.USER })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Event, (event) => event.organizer)
  organizedEvents: Event[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
