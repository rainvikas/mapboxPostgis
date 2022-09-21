import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { LocationService } from './location.service';

import { readFileSync } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { parse } from 'papaparse';
import { Parcel } from './entities/location.entity';




@Controller('gisdata')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // @Post()
  // create(
  //   @Body() createLocation: CreateLocationDto,
  // ): Observable<location_location> {
  //   //console.log(createLocation)
  //   return this.locationService.create(createLocation);
  // }

  @Get('/allData')
  findAll() {
    return this.locationService.findAll();
  }

  @Post('file')
    @UseInterceptors(
    FileInterceptor('file_asset', {
      storage: diskStorage({
        destination: './files',
      })
    })
  )
  async uploadFile() {
    const csvFile = readFileSync('files/1.csv')
    const csvData = csvFile.toString()
    const parsedCsv = await parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.toLowerCase().replace('#', '').trim(),
      complete: (results: { data: any; }) => results.data,
    });
    //console.log(parsedCsv.data)
  
    var newData = {}
    for (let a of parsedCsv.data) {
      console.log(a,"data")
      var point = { type: 'Point', coordinates: [a.lat, a.long]};
      newData = {
        lat: a.lat,
        long: a.long,
        name: a.name,
        City_Name: a.city_name,  
        geom: point,
      };
      console.log(newData)
      console.log(this.locationService.create(newData))
    }
    //return this.locationService.create(newData)
    //console.log(parsedCsv)
  }

  @Post('/create')
  async createParcelPoint(
      @Body()
      createParcelPointDto:Parcel
  ): Promise<Parcel> {
      return this.locationService.createParcelPoint(createParcelPointDto)
  }
  
  // @Post('/created')
  // async createParcelLine(
  //     @Body()
  //     createParcelLLineDto:line
  // ): Promise<line> {
  //     return this.locationService.createParcelLine(createParcelLLineDto)
  // }

  }

