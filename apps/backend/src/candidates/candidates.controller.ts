import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { UpdateCandidateEmailDto } from '@rcruit-flow/dto';
import { Candidate } from './entities/candidate.entity';

/**
 * Controller for managing candidate resources
 */
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  /**
   * Update a candidate's email address
   * @param id - The candidate's unique identifier
   * @param updateCandidateEmailDto - DTO containing the new email address
   * @returns The updated candidate
   */
  @Patch(':id/email')
  @HttpCode(HttpStatus.OK)
  async updateEmail(
    @Param('id') id: string,
    @Body() updateCandidateEmailDto: UpdateCandidateEmailDto,
  ): Promise<Candidate> {
    return this.candidatesService.updateEmail(id, updateCandidateEmailDto.email);
  }
}
