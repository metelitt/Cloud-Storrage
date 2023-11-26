import { FileType } from './entities/file.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private repository: Repository<FileEntity>,
  ) {}

  findAll(userId: number, fileType: FileType) {
    const qb = this.repository.createQueryBuilder('file');

    qb.where('file.userId = :userId', { userId });

    if (fileType == FileType.PHOTOS) {
      qb.andWhere('file.mimetype ILIKE :type', { type: '%image%' });
    }

    if (fileType == FileType.TRASH) {
      qb.withDeleted().andWhere('file.deletedAt IS NOT NULL');
    }
    return qb.getMany();
  }
  create(file: Express.Multer.File, userId: number) {
    console.log('Creating file:', file);
    console.log('User ID:', userId);

    return this.repository.save({
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        user: { id: Number(userId) },
    });
}
  async remove(userId: number, ids: string) {
    const idsArray = ids.split(',');
    const qb = this.repository.createQueryBuilder('file');
  
    qb.where('id IN (:...ids) AND userId = :userId', {
      ids: idsArray,
      userId,
    });
  
    return qb.softDelete().execute();
  }
}
