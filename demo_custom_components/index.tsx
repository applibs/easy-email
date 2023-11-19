import { BlockManager } from 'easy-email-core';
import { BlockAttributeConfigurationManager } from 'easy-email-extensions';
import { CustomBlocksType } from './constants';
//import { Panel as ProductRecommendationPanel, ProductRecommendation } from './ProductRecommendation';
import { Panel as ProductsPanel, Products } from './Products';
import { Poll } from '@demo/pages/Editor/components/CustomBlocks/Poll';
import { PollPanel } from '@demo/pages/Editor/components/CustomBlocks/Poll/Panel';

BlockManager.registerBlocks({
  //[CustomBlocksType.PRODUCT_RECOMMENDATION]: ProductRecommendation,
  [CustomBlocksType.PRODUCTS]: Products,
  [CustomBlocksType.POLL]: Poll
});

BlockAttributeConfigurationManager.add({
  //[CustomBlocksType.PRODUCT_RECOMMENDATION]: ProductRecommendationPanel,
  [CustomBlocksType.PRODUCTS]: ProductsPanel,
  [CustomBlocksType.POLL]: PollPanel
});
