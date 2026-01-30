import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

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
   * Create a new candidate
   * @param createCandidateDto - Data for creating the candidate
   * @returns The created candidate
   */
  async create(createCandidateDto: CreateCandidateDto): Promise<Candidate> {
    const candidate = this.candidateRepository.create(createCandidateDto);
    return this.candidateRepository.save(candidate);
  }

  /**
   * Find all candidates
   * @returns Array of all candidates
   */
  async findAll(): Promise<Candidate[]> {
    return this.candidateRepository.find();
  }

  /**
   * Find a candidate by ID
   * @param id - The candidate ID
   * @returns The found candidate
   * @throws NotFoundException if candidate not found
   */
  async findOne(id: string): Promise<Candidate> {
    const candidate = await this.candidateRepository.findOne({ where: { id } });
    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }
    return candidate;
  }

  /**
   * Update a candidate by ID
   * @param id - The candidate ID
   * @param updateCandidateDto - Data for updating the candidate
   * @returns The updated candidate
   * @throws NotFoundException if candidate not found
   */
  async update(id: string, updateCandidateDto: UpdateCandidateDto): Promise<Candidate> {
    const candidate = await this.candidateRepository.findOne({ where: { id } });
    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }

    // Update email if provided
    if (updateCandidateDto.email !== undefined) {
      candidate.email = updateCandidateDto.email;
    }

    // Update firstName if provided
    if (updateCandidateDto.firstName !== undefined) {
      candidate.firstName = updateCandidateDto.firstName;
    }

    // Update lastName if provided
    if (updateCandidateDto.lastName !== undefined) {
      candidate.lastName = updateCandidateDto.lastName;
    }

    // Update phone if provided
    if (updateCandidateDto.phone !== undefined) {
      candidate.phone = updateCandidateDto.phone;
    }

    // Update status if provided
    if (updateCandidateDto.status !== undefined) {
      candidate.status = updateCandidateDto.status;
    }

    // Update notes if provided
    if (updateCandidateDto.notes !== undefined) {
      candidate.notes = updateCandidateDto.notes;
    }

    return this.candidateRepository.save(candidate);
  }

  /**
   * Remove a candidate by ID
   * @param id - The candidate ID
   * @throws NotFoundException if candidate not found
   */
  async remove(id: string): Promise<void> {
    const candidate = await this.findOne(id);
    await this.candidateRepository.remove(candidate);
  }
}
