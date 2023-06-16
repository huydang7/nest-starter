export class AbstractDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  private dtoClass?: AbstractDto;

  constructor(dto: Partial<AbstractDto>) {
    Object.assign(this, dto);
  }
}
