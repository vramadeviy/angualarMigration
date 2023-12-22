import { SearchCriteria } from '../payment-lookup/search-criteria';

export const RadioOptions: SearchCriteria[] = [
    {
        description: 'APN & Tracer',
        id: 1
      },
      {
        description: 'Transaction Dates',
        id: 2
      },
      {
        description: 'Credit Dates',
        id: 3
      },  
      {
        description: 'Deposit Dates',
        id: 4
      }
];