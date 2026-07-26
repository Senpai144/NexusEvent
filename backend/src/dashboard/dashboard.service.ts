import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { Booking } from '../entities/booking.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getStats() {
    const totalEvents = await this.eventsRepository.count();
    const activeEvents = await this.eventsRepository.count({
      where: { status: 'upcoming' as any },
    });
    const totalBookings = await this.bookingsRepository.count();
    const totalUsers = await this.usersRepository.count();

    const bookings = await this.bookingsRepository.find();
    const totalRevenue = bookings.reduce(
      (sum, b) => sum + Number(b.totalAmount),
      0,
    );

    return {
      stats: [
        { label: 'Événements actifs', value: String(activeEvents), change: `+${Math.min(activeEvents, 3)}`, positive: true },
        { label: 'Réservations', value: String(totalBookings), change: '+12', positive: true },
        { label: 'Revenus', value: `${totalRevenue.toLocaleString()} FCFA`, change: '+18%', positive: true },
        { label: 'Utilisateurs', value: String(totalUsers), change: '+8', positive: true },
      ],
    };
  }

  async getOrganizerStats(organizerId: string) {
    const myEvents = await this.eventsRepository.find({
      where: { organizerId },
    });

    const eventIds = myEvents.map((e) => e.id);
    const totalParticipants = myEvents.reduce((sum, e) => sum + e.participants, 0);
    const totalRevenue = myEvents.reduce((sum, e) => sum + Number(e.price) * e.participants, 0);

    return {
      stats: [
        { label: 'Mes événements', value: String(myEvents.length), change: `+${Math.min(myEvents.length, 2)}`, positive: true },
        { label: 'Participants', value: String(totalParticipants), change: '+45', positive: true },
        { label: 'Revenus', value: `${totalRevenue.toLocaleString()} FCFA`, change: '+22%', positive: true },
        { label: 'Taux de remplissage', value: myEvents.length > 0 ? `${Math.round((totalParticipants / (myEvents.reduce((sum, e) => sum + e.maxParticipants, 0))) * 100)}%` : '0%', change: '+5%', positive: true },
      ],
    };
  }

  async getTopEvents() {
    const events = await this.eventsRepository.find({
      order: { participants: 'DESC' },
      take: 5,
    });
    return events.map((e) => ({
      id: e.id,
      title: e.title,
      participants: e.participants,
      revenue: `${(Number(e.price) * e.participants).toLocaleString()} FCFA`,
      category: e.category,
    }));
  }

  async getRecentBookings(limit = 5) {
    return this.bookingsRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
