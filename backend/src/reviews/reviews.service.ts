import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  async findAll(): Promise<Review[]> {
    return this.reviewsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Avis avec l'id ${id} non trouvé`);
    }
    return review;
  }

  async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
    const review = this.reviewsRepository.create({
      ...createReviewDto,
      userId,
    });
    return this.reviewsRepository.save(review);
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
    userId: string,
    userRole: string,
  ): Promise<Review> {
    const review = await this.findOne(id);
    if (review.userId !== userId && userRole !== 'admin') {
      throw new ForbiddenException("Vous n'avez pas les droits pour modifier cet avis");
    }
    Object.assign(review, updateReviewDto);
    return this.reviewsRepository.save(review);
  }

  async remove(id: number, userId: string, userRole: string): Promise<{ message: string }> {
    const review = await this.findOne(id);
    if (review.userId !== userId && userRole !== 'admin') {
      throw new ForbiddenException("Vous n'avez pas les droits pour supprimer cet avis");
    }
    await this.reviewsRepository.remove(review);
    return { message: 'Avis supprimé avec succès' };
  }
}
