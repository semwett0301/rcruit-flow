import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';

/**
 * Service for managing candidate operations
 */
@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  /**
   * Updates the email address of a candidate
   * @param id - The unique identifier of the candidate
   * @param email - The new email address to set
   * @returns The updated candidate entity
   * @throws NotFoundException if candidate with given ID is not found
   */
  async updateEmail(id: string, email: string): Promise<Candidate> {
    const candidate = await this.candidateRepository.findOne({ where: { id } });

    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }

    candidate.email = email;
    candidate.updatedAt = new Date();

    return this.candidateRepository.save(candidate);
  }
}
