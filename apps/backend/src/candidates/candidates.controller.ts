import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto, UpdateCandidateDto } from '@rcruit-flow/dto';

/**
 * Controller for managing candidate resources.
 * Handles CRUD operations for candidates including email updates.
 */
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  /**
   * Create a new candidate.
   * @param createCandidateDto - The candidate data to create
   * @returns The created candidate
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCandidate(@Body() createCandidateDto: CreateCandidateDto) {
    return this.candidatesService.create(createCandidateDto);
  }

  /**
   * Retrieve all candidates.
   * @returns List of all candidates
   */
  @Get()
  async findAllCandidates() {
    return this.candidatesService.findAll();
  }

  /**
   * Retrieve a specific candidate by ID.
   * @param id - The candidate ID
   * @returns The candidate with the specified ID
   */
  @Get(':id')
  async findOneCandidate(@Param('id') id: string) {
    return this.candidatesService.findOne(id);
  }

  /**
   * Update a candidate by ID.
   * Supports partial updates including email field updates.
   * @param id - The candidate ID to update
   * @param updateCandidateDto - The fields to update (including email)
   * @returns The updated candidate
   */
  @Patch(':id')
  async updateCandidate(
    @Param('id') id: string,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ) {
    return this.candidatesService.update(id, updateCandidateDto);
  }

  /**
   * Delete a candidate by ID.
   * @param id - The candidate ID to delete
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeCandidate(@Param('id') id: string) {
    return this.candidatesService.remove(id);
  }
}
