import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { SendEmailDto } from './dto/send-email.dto';

/**
 * Service for managing candidate operations including CRUD and email functionality
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
   * Persists email changes when provided in the update DTO
   * @param id - The candidate ID
   * @param updateCandidateDto - Data for updating the candidate
   * @returns The updated candidate
   * @throws NotFoundException if candidate not found
   */
  async update(id: string, updateCandidateDto: UpdateCandidateDto): Promise<Candidate> {
    const candidate = await this.findOne(id);

    // Handle email update if provided
    if (updateCandidateDto.email) {
      candidate.email = updateCandidateDto.email;
    }

    // Merge other fields from the DTO
    Object.assign(candidate, updateCandidateDto);

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

  /**
   * Send a recruitment email to a candidate
   * Uses provided email from emailData or falls back to candidate's stored email
   * Updates candidate's email if a different one is provided
   * @param id - The candidate ID
   * @param emailData - Email data including optional candidateEmail override
   * @throws NotFoundException if candidate not found
   */
  async sendRecruitmentEmail(id: string, emailData: SendEmailDto): Promise<void> {
    const candidate = await this.findOne(id);

    // Determine recipient email - use provided email or fall back to stored email
    const recipientEmail = emailData.candidateEmail || candidate.email;

    // Update candidate email if a different one is provided
    if (emailData.candidateEmail && emailData.candidateEmail !== candidate.email) {
      candidate.email = emailData.candidateEmail;
      await this.candidateRepository.save(candidate);
    }

    // TODO: Implement actual email sending logic
    // This would typically involve an email service/provider
    console.log(`Sending recruitment email to ${recipientEmail} for candidate ${id}`);
    console.log(`Subject: ${emailData.subject}`);
    console.log(`Body: ${emailData.body}`);
  }
}
