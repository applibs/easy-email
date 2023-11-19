import { BlockManager } from 'easy-email-core';
import { BlockAttributeConfigurationManager } from 'easy-email-extensions';
import { CustomBlocksType } from './constants';
//import { Panel as ProductRecommendationPanel, ProductRecommendation } from './ProductRecommendation';
import { Panel as ProductsPanel, Products} from "./Products";

BlockManager.registerBlocks({
  //[CustomBlocksType.PRODUCT_RECOMMENDATION]: ProductRecommendation,
  [CustomBlocksType.PRODUCTS]: Products,
});

BlockAttributeConfigurationManager.add({
  //[CustomBlocksType.PRODUCT_RECOMMENDATION]: ProductRecommendationPanel,
  [CustomBlocksType.PRODUCTS]: ProductsPanel,
});
