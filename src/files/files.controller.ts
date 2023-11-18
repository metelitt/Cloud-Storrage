import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { FilesService } from './files.service';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';

@Controller('files')
@ApiTags('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('file',5,{
      storage: fileStorage,
    }),
  )
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }
}