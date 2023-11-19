import React from 'react';
import { BasicType, createBlock, IBlock, IBlockData, mergeBlock, components } from 'easy-email-core';
import { getImg } from '@demo/pages/Editor/images';

export enum AdvancedTypeCountdown {
  COUNTDOWN = 'advanced_countdown',
}
export enum BasicTypeCountdown {
  COUNTDOWN = 'countdown',
}

export type ICountdown = IBlockData<
  {
    align?: string;
    color?: string;
    'container-background-color'?: string;
    'border-radius'?: string;
    'icon-height'?: string;
    'icon-size'?: string;
    mode?: 'vertical' | 'horizontal';
    showText?: 'yes' | 'no';
    'icon-padding': string;
    'text-padding': string;
    'text-decoration'?: string;
    padding?: string;
    'inner-padding'?: string;
    'font-family'?: string;
    'font-size'?: string;
    'font-style'?: string;
    'font-weight'?: string;
    'line-height'?: string;
  }
>;

export const Countdown: IBlock<ICountdown> = createBlock({
  get name() {
    return t('Countdown');
  },
  type: BasicTypeCountdown.COUNTDOWN,
  create: (payload) => {
    const defaultData: ICountdown = {
      type: BasicTypeCountdown.COUNTDOWN,
      data: {
        value: {
          elements: [
            {
              href: '',
              target: '_blank',
              src: getImg('SMILLE_01'),
              content: 'Nespokojen',
            },
          ],
        },
      },
      attributes: {
        align: 'center',
        color: '#333333',
        mode: 'horizontal',
        showText: 'no',
        'font-size': '13px',
        'font-weight': 'normal',
        'border-radius': '3px',
        padding: '10px 25px 10px 25px',
        'inner-padding': '4px 4px 4px 4px',
        'line-height': '22px',
        'text-padding': '4px 4px 4px 0px',
        'icon-padding': '0px',
        'icon-size': '50px',
      },
      children: [],
    };
    return mergeBlock(defaultData, payload);
  },
  validParentType: [BasicType.COLUMN],
  render(params) {
    const { data } = params;
    const elements = (data ).data.value.elements
      .map((element) => {
        const elementAttributeStr = Object.keys(element)
          .filter((key) => key !== 'content' && element[key as keyof typeof element] !== '') // filter att=""
          .map((key) => `${key}="${element[key as keyof typeof element]}"`)
          .join(' ');
        return `
          <mj-countdown-element ${elementAttributeStr}>${data.attributes.showText === 'yes'? element.content : ''}</mj-countdown-element>
          `;
      })
      .join('\n');
    return <components.BasicBlock params={params} tag="mj-countdown">{elements}</components.BasicBlock>;

  },
});

export { Panel } from './Panel';
