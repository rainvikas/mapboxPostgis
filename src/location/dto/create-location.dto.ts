import { Column, Index, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import {Point} from "geojson"
export class CreateLocationDto {
   
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    lat: number;
    @Column()
    long: number;
    @Column()
    name: string;
    @Column()
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
