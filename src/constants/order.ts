export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const OrderBy = {
  createdAt: { createdAt: Order.ASC },
  updatedAt: { updatedAt: Order.ASC },
  order: { order: Order.ASC },
};
