import { OrderKey } from 'src/constants';
import { ToInt } from 'src/decorators';

export class PageOptionsDto {
  constructor(options?: Partial<PageOptionsDto>) {
    Object.assign(this, options);
  }

  order: Record<string, OrderKey> = {
    createdAt: 'DESC',
  };

  @ToInt()
  page = 1;

  @ToInt()
  size = 10;

  q?: string;

  get skip(): number {
    return (this.page - 1) * this.size;
  }

  get query() {
    return {
      skip: this.skip,
      take: this.size,
      order: this.order,
    };
  }
}
