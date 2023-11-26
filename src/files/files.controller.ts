import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Get,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserId } from 'src/auth/decorators/user-id.decorator';
import { FileType } from './entities/file.entity';

@Controller('files')
@ApiTags('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  findAll(@UserId() userId: number, @Query('type') fileType: FileType) {
    return this.filesService.findAll(userId, fileType);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('file', 1, {
      storage: fileStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
      }),
    )
    file: Express.Multer.File,
    @UserId() userId: number,
  ) {
    try {
      return this.filesService.create(file, userId);
    } catch (error) {
      console.error('Error creating file:', error);
      throw new Error('Failed to create file');
    }
  }
  @Delete()
  remove(@UserId() userId: number, @Query('ids') ids: string) {
    return this.filesService.remove(userId, ids);
  }
}
