import type { CustomerType } from '@/types/customer';

export const getCustomerType = (id: string): CustomerType => {
  let score = 0;
  for (let i = 0; i < id.length; i++) {
    score += id.charCodeAt(i);
  }
  const types: CustomerType[] = ['CORPORATE', 'INDIVIDUAL', 'PARTNER'];
  return types[score % 3];
};
