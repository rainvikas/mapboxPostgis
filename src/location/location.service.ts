import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LineString, Polygon } from 'geojson';
import { format } from 'path';
import { Observable, from } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import {  Location, Parcel } from './entities/location.entity';
import { location_location } from './location.interface';

@Injectable()
export class LocationService {
  
  constructor(
    @InjectRepository(Location) private readonly Location: Repository<Location>,
    @InjectRepository(Parcel) private readonly Parcel: Repository<Parcel>,
   // @InjectRepository(line) private readonly line: Repository<line>
  ) {}

  create(createLocationDto: location_location): Observable<location_location> {
    //console.log(createLocationDto);

    return from(this.Location.save(createLocationDto));
  }

  findAll() {
    return from(this.Location.find());
  }

  async createParcelPoint(createParcelPointDto: Parcel): Promise<Parcel> {
    const { position } = createParcelPointDto;
    const polygon: Polygon = {
      type: 'Polygon',
      coordinates: [position],
    };
    const parcel = this.Parcel.create({
      polygon,
    });
    await this.Parcel.save(parcel);
    return parcel;
  }

  // async createParcelLine(createParcelLineDto: line): Promise<line> {
  //  // const {  } = createParcelLineDto;
  //   // const lineString: LineString = {
  //   //   type: 'LineString',
  //   //  // coordinates: [],
  //   // };
  //   const line = this.line.create({
  //     lineString,
  //   });
  //   await this.line.save(line);
  //   return line;
  // }
}
