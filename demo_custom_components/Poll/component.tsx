import { omit } from 'lodash';
import React from 'react';
import { components, MjmlBlockProps, RecursivePartial } from 'easy-email-core';
import { IPoll } from '@demo/pages/Editor/components/CustomBlocks/Poll/index';
import { CustomBlocksType } from '@demo/pages/Editor/components/CustomBlocks/constants';
//import MjmlBlock, { MjmlBlockProps } from 'easy-email-core';
//import { MjmlBlockProps } from 'easy-email-core/components/MjmlBlock';

/*
import { BasicType } from '@core/constants';
import { RecursivePartial } from '@core/typings';
import { IPoll } from '@core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@core/components/MjmlBlock';
*/
export type PollProps = RecursivePartial<IPoll['data']> &
  RecursivePartial<IPoll['attributes']> & {
  children?: MjmlBlockProps<IPoll>['children'];
};

export function Poll(props: PollProps) {
  return (
    <components.MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={CustomBlocksType.POLL}
    >
      {props.children}
    </components.MjmlBlock>
  );
}