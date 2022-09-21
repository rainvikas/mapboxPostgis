import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { LineString, Point, Polygon } from 'geojson';
import { type } from 'os';
import { IsOptional } from '@nestjs/class-validator';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'decimal', nullable: true })
  lat: number;
  @Column({ type: 'decimal', nullable: true })
  long: number;
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  City_Name: string;
  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  geom: Point;
}

@Entity('PolygonTable')
export class Parcel {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Polygon',
    srid: 4326,
    nullable: true,
  })
  polygon: Polygon;
  @IsOptional()
  position?: number[][];
}

// @Entity('lineTable')
// export class line {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Index({ spatial: true })
//   @Column({
//     type: 'geography',
//     spatialFeatureType: 'LineString',
//     srid: 4326,
//     nullable: true,
//   })
//   lineString: LineString;
//   @IsOptional()
//   position?: number[][];
// }
