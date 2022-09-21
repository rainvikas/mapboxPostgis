import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  Location, Parcel } from './entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Parcel])],
  controllers: [LocationController],
  providers: [LocationService],
})
export class gismodule {}
