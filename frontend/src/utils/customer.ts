import type { CustomerType } from '@/types/customer';

export const getCustomerType = (id: string): CustomerType | 'VIP' => {
  let score = 0;
  for (let i = 0; i < id.length; i++) {
    score += id.charCodeAt(i);
  }
  const types: (CustomerType | 'VIP')[] = ['CORPORATE', 'INDIVIDUAL', 'PARTNER', 'VIP'];
  return types[score % 4];
};
