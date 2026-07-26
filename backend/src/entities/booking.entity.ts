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

export enum PaymentMethod {
  WAVE = 'wave',
  ORANGE_MONEY = 'orange_money',
  CARTE = 'carte',
  ESPECES = 'especes',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ default: 1 })
  numberOfSeats: number;

  @Column({ type: 'text', default: PaymentMethod.WAVE })
  paymentMethod: PaymentMethod;

  @Column({ nullable: true })
  comment: string;

  @Column({ type: 'text', default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'decimal', default: 0 })
  totalAmount: number;

  @ManyToOne(() => User, (user) => user.bookings, { eager: true, nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => Event, (event) => event.bookings, { eager: true })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column()
  eventId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
