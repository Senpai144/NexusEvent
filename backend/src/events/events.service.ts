import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventCategory, EventStatus } from '../entities/event.entity';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async findAll(category?: EventCategory): Promise<Event[]> {
    const where: any = {};
    if (category) {
      where.category = category;
    }
    return this.eventsRepository.find({ where, order: { date: 'ASC' } });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Événement avec l'id ${id} non trouvé`);
    }
    return event;
  }

  async create(createEventDto: CreateEventDto, organizerId: string): Promise<Event> {
    const event = this.eventsRepository.create({
      ...createEventDto,
      organizerId,
      participants: 0,
    });
    return this.eventsRepository.save(event);
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    userId: string,
    userRole: string,
  ): Promise<Event> {
    const event = await this.findOne(id);

    if (event.organizerId !== userId && userRole !== 'admin') {
      throw new ForbiddenException("Vous n'avez pas les droits pour modifier cet événement");
    }

    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async remove(id: string, userId: string, userRole: string): Promise<{ message: string }> {
    const event = await this.findOne(id);

    if (event.organizerId !== userId && userRole !== 'admin') {
      throw new ForbiddenException("Vous n'avez pas les droits pour supprimer cet événement");
    }

    await this.eventsRepository.remove(event);
    return { message: 'Événement supprimé avec succès' };
  }

  async findByOrganizer(organizerId: string): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { organizerId },
      order: { date: 'DESC' },
    });
  }
}
