export class AbstractDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(dto: Partial<AbstractDto>) {
    Object.assign(this, dto);
  }
}
