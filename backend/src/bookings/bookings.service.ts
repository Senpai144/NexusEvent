import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { Event } from '../entities/event.entity';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Réservation avec l'id ${id} non trouvée`);
    }
    return booking;
  }

  async create(
    createBookingDto: CreateBookingDto,
    userId: string | null,
  ): Promise<Booking> {
    const event = await this.eventsRepository.findOne({
      where: { id: createBookingDto.eventId },
    });
    if (!event) {
      throw new NotFoundException('Événement non trouvé');
    }

    if (event.status === 'cancelled') {
      throw new BadRequestException('Cet événement est annulé');
    }

    if (event.participants + createBookingDto.numberOfSeats > event.maxParticipants) {
      throw new BadRequestException('Plus de places disponibles');
    }

    const totalAmount = Number(event.price) * createBookingDto.numberOfSeats;

    const booking = this.bookingsRepository.create({
      ...createBookingDto,
      userId: userId ?? undefined,
      totalAmount,
      status: BookingStatus.PENDING,
      eventId: createBookingDto.eventId,
    });

    const savedBooking = await this.bookingsRepository.save(booking);

    event.participants += createBookingDto.numberOfSeats;
    await this.eventsRepository.save(event);

    return savedBooking as Booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
    userId: string,
    userRole: string,
  ): Promise<Booking> {
    const booking = await this.findOne(id);
    if (booking.userId !== userId && userRole !== 'admin') {
      throw new ForbiddenException("Vous n'avez pas les droits pour modifier cette réservation");
    }
    Object.assign(booking, updateBookingDto);
    return this.bookingsRepository.save(booking);
  }

  async remove(id: string, userId: string, userRole: string): Promise<{ message: string }> {
    const booking = await this.findOne(id);
    if (booking.userId !== userId && userRole !== 'admin') {
      throw new ForbiddenException("Vous n'avez pas les droits pour supprimer cette réservation");
    }
    await this.bookingsRepository.remove(booking);
    return { message: 'Réservation supprimée avec succès' };
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserOrEmail(userId: string, email: string): Promise<Booking[]> {
    const qb = this.bookingsRepository.createQueryBuilder('booking');
    if (userId && email) {
      qb.where('booking.userId = :userId OR booking.email = :email', { userId, email });
    } else if (userId) {
      qb.where('booking.userId = :userId', { userId });
    } else if (email) {
      qb.where('booking.email = :email', { email });
    }
    qb.orderBy('booking.createdAt', 'DESC');
    return qb.getMany();
  }

  async findByEvent(eventId: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { eventId },
      order: { createdAt: 'DESC' },
    });
  }
}
