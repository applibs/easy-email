import {useBlock, useFocusIdx} from 'easy-email-editor';
import {Grid, Button, List, AutoComplete, AutoCompleteProps} from '@arco-design/web-react';
import React, {useCallback, useEffect, useState} from 'react';
import {cloneDeep, get} from 'lodash';
import {IconDelete, IconPlus} from '@arco-design/web-react/icon';
import {IProduct, ProductBlock} from "@demo/pages/Editor/components/CustomBlocks/Products/generateProductBlock";
import Mock from 'mockjs';
import axios from "axios";

export function ProductItems() {
    const {focusIdx} = useFocusIdx();
    const {focusBlock, change, values} = useBlock();

    const products = focusBlock?.data.value?.products as
        | undefined
        | ProductBlock['data']['value']['products'];

    /*
    const onConditionToggle = useCallback(
        (enabled: boolean) => {
            if (enabled) {
                if (!products) {
                    change(`${focusIdx}.data.value.products`, {
                        enabled: true,
                        symbol: OperatorSymbol.AND,
                        groups: [
                            {
                                symbol: OperatorSymbol.AND,
                                groups: [
                                    {
                                        left: '',
                                        operator: Operator.TRUTHY,
                                        right: ''
                                    }
                                ],
                            }
                        ] as unknown[],
                    } as ICondition);
                }
            }
            change(`${focusIdx}.data.value.products.enabled`, enabled);
        },
        [change, products, focusIdx]
    );
*/
    const onAddProduct = useCallback((path: string) => {
        const groups = get(values, path) || [] as IProduct[];
        if (groups) {
            groups.push({
                id: 0,
                title: '',
                price: 0,
                currency: '',
                image: '',
                url: ''
            });
            change(path, [...groups]);
        }
    }, [change, values]);
    /*
        const onAddSubCondition = useCallback((path: string) => {
            const groups = get(values, path) as IConditionGroup['groups'];

            groups.push({
                left: '',
                operator: Operator.TRUTHY,
                right: ''

            });
            change(path, [...groups]);
        }, [change, values]);
    */
    // content.children.[0].children.[0].data.value.condition.groups.1.groups
    const onDelete = useCallback((path: string, gIndex: number) => {
        if (!products) return;
        const groups = cloneDeep(get(values, path)) as any[];

        // remove empty array
        groups.splice(gIndex, 1);
        change(path, [...groups]);

    }, [change, products, values]);
    /*
      if (
        !focusBlock?.type ||
        !Object.values(AdvancedType).includes(focusBlock?.type as any)
      ) {
        return null;
      }*/

    //const isEmpty = !products?.length;

    return (
        <List
            header={(
                <Grid.Row justify='space-between'>
                    <Button onClick={() => onAddProduct(`${focusIdx}.data.value.products`)} size='small'
                            icon={<IconPlus/>}/>
                </Grid.Row>
            )}
            dataSource={products}
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

export function ProductItem({path, onDelete, gIndex}: {
    path: string;
    gIndex: number;
    onDelete: (path: string, gIndex: number) => void;
}) {

    //const name = `${path}.${gIndex}`;
    //const {input: {value}} = useField(name);
    /*
        const renderSuggestion = (suggestion: Suggestion) => {
            return `${suggestion.title}`;
        };
    */
    //todo:
    //https://hackernoon.com/autocomplete-search-component-with-react-and-typescript
    //https://github.com/ljaviertovar/autocomplete-search-react-ts?ref=hackernoon.com

    //const { renderSuggestion = (s: S) => s, onSelect, getSuggestions } = props;
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState<AutoCompleteProps["data"]>([{id:0,value:"",name:""}]);


    //https://arco.design/docs/en-US/pro/mock
    useEffect(() => {
        if(value) {
            if (process.env.NODE_ENV === 'development') {
                const data = Mock.mock({
                    'data|4-6': [
                        {
                            'id|+1': 1,
                            "value|+1": [
                                "aaa",
                                "bbb",
                                "ccc"
                            ],
                            "name|+1": [
                                "aaa",
                                "bbb",
                                "ccc"
                            ],
                            "title|+1": [
                                "aaa",
                                "bbb",
                                "ccc"
                            ],
                            image: '',
                            price: '100',
                            currency: 'CZK',
                            url: ''
                        },
                    ],
                });
                console.log(data.data);

                setSuggestions(data.data);
                /*setSuggestions([{
                    id: 0,
                    value: 'aaa',
                    name: 'aaa',
                    title: 'User 7352772',
                    image: '',
                    price: '100',
                    currency: 'CZK',
                    url: ''
                }]);*/

            } else {
                axios.post('https://foo.com/login', {}).then(
                    (response) => setSuggestions(response)
                );
            }
        }

    }, [value]);

    return (
        <Grid.Row align='end'>
            <Grid.Col span={21}>
                <AutoComplete
                    value={value}
                    onChange={(value, option) => setValue(value)}
                    onSelect={(value, option) => {console.log(`onSelect ${value}`);console.log(option)}}
                    data={suggestions}
                />
            </Grid.Col>
            <Grid.Col span={3}>
                <Button onClick={() => onDelete(path, gIndex)} icon={<IconDelete/>}/>
            </Grid.Col>

        </Grid.Row>
    );
}