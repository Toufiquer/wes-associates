/*
|-----------------------------------------
| setting up AllAssets for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { defaultDataAsset1 } from '../asset-1/data';
import { defaultDataAsset2 } from '../asset-2/data';
import { defaultDataAsset3 } from '../asset-3/data';
import MutationAsset1 from '../asset-1/Mutation';
import MutationAsset2 from '../asset-2/Mutation';
import MutationAsset3 from '../asset-3/Mutation';

import QueryAsset1 from '../asset-1/Query';
import QueryAsset2 from '../asset-2/Query';
import QueryAsset3 from '../asset-3/Query';

export const allAssetCagegory = ['Asset'];

export const AllAssets = {
  'asset-uid-1': { name: 'All Template', category: allAssetCagegory[0], mutation: MutationAsset1, query: QueryAsset1, data: defaultDataAsset1 },
  'asset-uid-2': { name: 'Slide Item', category: allAssetCagegory[0], mutation: MutationAsset2, query: QueryAsset2, data: defaultDataAsset2 },
  'asset-uid-3': { name: 'All Categories', category: allAssetCagegory[0], mutation: MutationAsset3, query: QueryAsset3, data: defaultDataAsset3 },
};

export const AllAssetsKeys = Object.keys(AllAssets);
