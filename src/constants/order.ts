export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type OrderKey = keyof typeof Order;
