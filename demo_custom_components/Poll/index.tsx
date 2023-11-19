import React from 'react';
import { BasicType, createBlock, IBlock, mergeBlock, IBlockData, components } from 'easy-email-core';
import { getImg } from '@demo/pages/Editor/images';


export type IPoll = IBlockData<
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
  },
  {
    elements: Array<{
      content: string;
      src: string;
      align?: string;
      alt?: string;
      'background-color'?: string;
      'border-radius'?: string;
      color?: string;
      'font-family'?: string;
      'font-size'?: string;
      'font-style'?: string;
      'font-weight'?: string;
      href?: string;
      'icon-height'?: string;
      'icon-size'?: string;
      'line-height'?: string;
      name?: string;
      padding?: string;
      'icon-padding'?: string;
      'text-padding'?: string;
      target?: string;
      title?: string;
      'text-decoration'?: string;
      'vertical-align'?: string;
    }>;
  }
>;

export const Poll: IBlock<IPoll> = createBlock({
  get name() {
    return t('Poll');
  },
  type: BasicType.POLL,
  create: (payload) => {
    const defaultData: IPoll = {
      type: BasicType.POLL,
      data: {
        value: {
          elements: [
            {
              href: '',
              target: '_blank',
              src: getImg('SMILLE_01'),
              content: 'Nespokojen',
            },
            {
              href: '',
              target: '_blank',
              src: getImg('SMILLE_02'),
              content: 'Mírně nespokojen',
            },
            {
              href: '',
              target: '_blank',
              src: getImg('SMILLE_03'),
              content: 'Neutrální',
            },
            {
              href: '',
              target: '_blank',
              src: getImg('SMILLE_04'),
              content: 'Mírně spokojen',
            },
            {
              href: '',
              target: '_blank',
              src: getImg('SMILLE_05'),
              content: 'Spokojen',
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
          <mj-poll-element ${elementAttributeStr}>${data.attributes.showText === 'yes'? element.content : ''}</mj-poll-element>
          `;
      })
      .join('\n');
    return <components.BasicBlock params={params} tag="mj-poll">{elements}</components.BasicBlock>;

  },
});


