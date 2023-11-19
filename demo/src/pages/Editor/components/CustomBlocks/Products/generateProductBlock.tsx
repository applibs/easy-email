import { merge } from 'lodash';
import React from 'react';
import {
  BasicType,
  createCustomBlock,
  IBlock,
  IBlockData,
  IPage,
  standardBlocks,
  TemplateEngineManager,
} from 'easy-email-core';

export function generateProductBlock<T extends ProductBlock>(option: {
  type: string;
  baseType: BasicType;
  getContent: (params: {
    index: number;
    data: T;
    idx: string | null | undefined;
    mode: 'testing' | 'production';
    context?: IPage;
    dataSource?: { [key: string]: any };
  }) => ReturnType<NonNullable<IBlock['render']>>;
  validParentType: string[];
}) {
  const baseBlock = Object.values(standardBlocks).find(
    b => b.type === (option.baseType as any as keyof typeof standardBlocks),
  );
  if (!baseBlock) {
    throw new Error(`Can not find ${option.baseType}`);
  }

  return createCustomBlock<T>({
    get name() {
      return baseBlock!.name;
    },
    type: option.type,
    validParentType: option.validParentType,
    create: payload => {
      const defaultData = {
        ...baseBlock.create(),
        type: option.type,
      } as any;
      return merge(defaultData, payload);
    },
    render: params => {
      const { data, idx, mode, context, dataSource } = params;
      const { iteration, products } = data.data.value;

      const getBaseContent = (bIdx: string | null | undefined, index: number) =>
        option.getContent({
          index,
          data,
          idx: bIdx,
          mode,
          context,
          dataSource,
        }) as any;

      let children = getBaseContent(idx, 0);

      if (mode === 'testing') {
        return (
          <>
            <React.Fragment key='children'>{children}</React.Fragment>

            {new Array((iteration?.mockQuantity || 1) - 1).fill(true).map((_, index) => (
              <React.Fragment key={index}>
                {getBaseContent(idx, index + 1)}
              </React.Fragment>
            ))}
          </>
        );
      }

      if (products && products.enabled) {
        children = TemplateEngineManager.generateTagTemplate('iteration')(
          products,
          children,
        );
      }

      if (iteration && iteration.enabled) {
        children = TemplateEngineManager.generateTagTemplate('iteration')(
          iteration,
          children,
        );
      }

      return children;
    },
  });
}

// {% for product in collection.products %}
//   {{ product.title }}
// {% endfor %}

export interface ProductBlock extends IBlockData {
  data: {
    value: {
      products?: TProductList;
      iteration?: {
        enabled: boolean;
        dataSource: string; // -> collection.products
        itemName: string; // -> product
        limit: number;
        mockQuantity: number;
      };
    };
  };
}

export interface Product {
  id: number;
  title: string;
  price: number;
  currency: string;
  image: string;
  url: string;
  code: string;
}


export type TProductList = Product[]
