import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('health_data')
@Index(['userId', 'date'], { unique: true })
export class HealthData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('int')
  steps: number;

  @Column('int')
  calories: number;

  @Column('int')
  heartRate: number;

  @Column('decimal', { precision: 5, scale: 2 })
  weight: number;

  @Column('date')
  date: string;

  @Column({ nullable: true })
  deviceId: string;

  @Column({ default: 'apple_health' })
  source: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  lastSync: Date;
}
