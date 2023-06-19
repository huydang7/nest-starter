import { OrderKey } from 'src/constants';

interface IPageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

export class PageOptionsDto {
  order: Record<any, OrderKey>;

  page = 1;
  size = 10;
  q?: string;

  constructor(options?: Partial<PageOptionsDto>) {
    if (!options?.order) {
      this.order = {
        createdAt: 'DESC',
      };
    }

    Object.assign(this, options);
  }

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

export class PageMetaDto {
  readonly page: number;
  readonly size: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: IPageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.size = pageOptionsDto.size;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.size);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

export class PageDto<T> {
  readonly data: T[];
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}

export class PageDtoV1<T> {
  rows: T[];
  count: number;

  public static fromFindAndCount(data: [any[], number]) {
    const pageDto = new PageDtoV1(data[0], data[1]);
    return pageDto;
  }

  constructor(data: T[], total: number) {
    this.rows = data;
    this.count = total;
  }
}
