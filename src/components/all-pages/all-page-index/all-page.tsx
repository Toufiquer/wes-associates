/*
|-----------------------------------------
| setting up AllPages for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { defaultDataPage1 } from '../page-1/data';
import { defaultDataPage101 } from '../page-101/data';
import { defaultDataPage2 } from '../page-2/data';
import { defaultDataPage3 } from '../page-3/data';
import { defaultDataPage4 } from '../page-4/data';
import { defaultDataPage5 } from '../page-5/data';
import { defaultDataPage6 } from '../page-6/data';
import { defaultDataPage7 } from '../page-7/data';

import MutationPage1 from '../page-1/Mutation';
import MutationPage101 from '../page-101/Mutation';
import MutationPage2 from '../page-2/Mutation';
import MutationPage3 from '../page-3/Mutation';
import MutationPage4 from '../page-4/Mutation';
import MutationPage5 from '../page-5/Mutation';
import MutationPage6 from '../page-6/Mutation';
import MutationPage7 from '../page-7/Mutation';

import QueryPage1 from '../page-1/Query';
import QueryPage101 from '../page-101/Query';
import QueryPage2 from '../page-2/Query';
import QueryPage3 from '../page-3/Query';
import QueryPage4 from '../page-4/Query';
import QueryPage5 from '../page-5/Query';
import QueryPage6 from '../page-5/Query';
import QueryPage7 from '../page-5/Query';

export const allPageCategory = ['Page', 'Details'];

export const AllPages = {
  'page-uid-1': { name: 'Home', category: allPageCategory[0], mutation: MutationPage1, query: QueryPage1, data: defaultDataPage1 },
  'page-uid-101': { name: 'DetailsPage', category: allPageCategory[1], mutation: MutationPage101, query: QueryPage101, data: defaultDataPage101 },
  'page-uid-2': { name: 'About', category: allPageCategory[0], mutation: MutationPage2, query: QueryPage2, data: defaultDataPage2 },
  'page-uid-3': { name: 'Contact', category: allPageCategory[0], mutation: MutationPage3, query: QueryPage3, data: defaultDataPage3 },
  'page-uid-4': { name: 'Privacy & Policy', category: allPageCategory[0], mutation: MutationPage4, query: QueryPage4, data: defaultDataPage4 },
  'page-uid-5': { name: 'Terms & Conditions', category: allPageCategory[0], mutation: MutationPage5, query: QueryPage5, data: defaultDataPage5 },
  'page-uid-6': { name: 'Delivery Policy', category: allPageCategory[0], mutation: MutationPage6, query: QueryPage6, data: defaultDataPage6 },
  'page-uid-7': { name: 'Refund Policy', category: allPageCategory[0], mutation: MutationPage7, query: QueryPage7, data: defaultDataPage7 },
};

export const AllPagesKeys = Object.keys(AllPages);
