/**
 * User Preference Entity
 *
 * Stores user-specific preferences including language settings.
 * Each user has exactly one preference record (one-to-one relationship).
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ default: 'en' })
  language: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
