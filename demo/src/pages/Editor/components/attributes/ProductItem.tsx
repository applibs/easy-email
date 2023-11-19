import { useBlock, useFocusIdx } from 'easy-email-editor';
import { Grid, Button, List, AutoComplete } from '@arco-design/web-react';
import React, { useCallback, useEffect, useState } from 'react';
import { cloneDeep, get } from 'lodash';
import { IconDelete, IconPlus } from '@arco-design/web-react/icon';
import {
  Product,
  ProductBlock,
  TProductList,
} from '@demo/pages/Editor/components/CustomBlocks/Products/generateProductBlock';
import Mock from 'mockjs';
import axios from 'axios';

interface IProductItemsProps {
  max: number;
}

export function ProductItems(props: IProductItemsProps) {
  const { focusIdx } = useFocusIdx();
  const { focusBlock, change, values } = useBlock();

  const products = focusBlock?.data.value?.products as
    | undefined
    | ProductBlock['data']['value']['products'];

  const onAddProduct = useCallback((path: string) => {
    const groups = get(values, path) || [] as TProductList;
    if (groups) {
      groups.push({
        id: 0,
        title: '',
        price: 0,
        currency: 'USD',
        image: '',
        url: '',
      });
      change(path, [...groups]);
    }
  }, [change, values]);

  const onDelete = useCallback((path: string, gIndex: number) => {
    if (!products) return;
    const groups = cloneDeep(get(values, path)) as any[];

    // remove empty array
    groups.splice(gIndex, 1);
    change(path, [...groups]);

  }, [change, products, values]);

  const onSelected = useCallback((path: string, gIndex: number, product: Product) => {
    //if (!products) return;
    const groups = cloneDeep(get(values, path)) as any[];

    if (product.id > 0) {
      if (groups.length > 0) {
        groups[gIndex] = product;
      } else {
        groups.push(product);
      }

      change(path, [...groups]);
    }

  }, [change, products, values]);

  const isEmpty = !products?.length;

  return (
    <List
      header={(
        <Grid.Row justify='space-between'>
          {(isEmpty || (products?.length < props.max)) &&
            <Button
              onClick={() => onAddProduct(`${focusIdx}.data.value.products`)}
              size='small'
              icon={<IconPlus />}
            />
          }

        </Grid.Row>
      )}
      dataSource={products?.slice(0, props.max)}
      render={
        (product, gIndex) => {
          return (
            <List.Item key={gIndex}>
              <div>
                <Grid.Row justify='space-between'>
                  <Grid.Col span={24}>
                    {
                      <ProductItem
                        onDelete={onDelete}
                        path={`${focusIdx}.data.value.products`}
                        gIndex={gIndex}
                        key={gIndex}
                        onSelected={onSelected}
                        product={product}
                      />
                    }
                  </Grid.Col>
                </Grid.Row>
              </div>
            </List.Item>
          );
        }
      }
    />
  );
}

export function ProductItem({ path, onDelete, gIndex, onSelected, product }: {
  path: string;
  gIndex: number;
  onDelete: (path: string, gIndex: number) => void;
  onSelected: (path: string, gIndex: number, product: Product) => void;
  product: Product | null
}) {
  const [init, setInit] = useState(true);

  const [value, setValue] = useState<string>(product?.title ?? '');
  const [suggestions, setSuggestions] = useState<TProductList | []>([]);

  useEffect(() => {
    if (init) {
      setInit(false);
      return;
    }

    if (value) {
      if (process.env.NODE_ENV === 'development') {
        const data = Mock.mock({
          'data|4-6': [
            {
              'id|+1': 1,
              'title|+1': [
                'aaa',
                'abc',
                'bbb',
                'bcd',
                'ccc',
                'cde',
              ],
              'code|+1': [
                '111',
                '222',
                '333',
                '444',
                '555',
                '666',
              ],
              image: '',
              price: 1000,
              currency: 'CZK',
              url: '',
            },
          ],
        });

        setSuggestions(data.data);

      } else {
        if(value.length >= 2) {
          axios.get<TProductList>('/api/products/search',
            {
              params: {
                searchText: value,
                limit: 20
              }
            }).then(
            (response) => {
              setSuggestions(response.data);
            }
          ).catch(error => {
            // handle error
            console.log(error);
          });
        }

      }
    }

  }, [value]);

  useEffect(() => {
    if(product?.title || !init) {
      setValue(product?.title || '');
    }
  }, [product]);

  function getItem(id: number) {
    return suggestions.filter(product => product.id === id)[0];
  }

  function filterOption(inputValue, option) {
    return option.props.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 || option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
  }

  return (
    <Grid.Row align='end'>
      <Grid.Col span={21}>
        <AutoComplete
          strict={false}
          value={value}
          onChange={(value, option) => setValue(value)}
          onSelect={(value, option) => {
            onSelected(path, gIndex, getItem(option.extra.id));
          }}
          filterOption={filterOption}
          data={suggestions && suggestions.map(
            (item) =>
              ({
                id: item.id,
                value: item.code,
                name: item.title,
              }),
          )}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <Button onClick={() => onDelete(path, gIndex)} icon={<IconDelete />} />
      </Grid.Col>

    </Grid.Row>
  );
}