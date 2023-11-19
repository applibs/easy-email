import { Collapse, Grid } from '@arco-design/web-react';
import { Stack } from '@demo/components/Stack';
import { useFocusIdx } from 'easy-email-editor';
import {
  AttributesPanelWrapper, Border,
  ColorPickerField,
  NumberField,
  TextField,
} from 'easy-email-extensions';
import React from 'react';
import {ProductItems} from "@demo/pages/Editor/components/attributes/ProductItem";
import { useField } from 'react-final-form';

export function Panel() {
  const { focusIdx } = useFocusIdx();

  const { input: { value } } = useField(`${focusIdx}.data.value.quantity`);

  return (
    <AttributesPanelWrapper style={{ padding: 0 }}>
      <Collapse defaultActiveKey={['0', '1']} >
        <Collapse.Item
            name='0'
            header={t('Attributes')}
        >
          <Stack vertical>
            <NumberField
                label={t('Quantity')}
                inline
                max={6}
                name={`${focusIdx}.data.value.quantity`}
            />
            <TextField
                label={t('Title')}
                name={`${focusIdx}.data.value.title`}
                inline
            />
            <TextField
                label={t('Button text')}
                name={`${focusIdx}.data.value.buttonText`}
                inline
            />
            <ColorPickerField
                label={t('Background color')}
                name={`${focusIdx}.attributes.background-color`}
                inline
            />
            <ColorPickerField
                label={t('Title color')}
                name={`${focusIdx}.attributes.title-color`}
                inline
            />
            <ColorPickerField
                label={t('Product name color')}
                name={`${focusIdx}.attributes.product-name-color`}
                inline
            />
            <ColorPickerField
                label={t('Product price color')}
                name={`${focusIdx}.attributes.product-price-color`}
                inline
            />
            <ColorPickerField
                label={t('Button color')}
                name={`${focusIdx}.attributes.button-color`}
                inline
            />
            <ColorPickerField
                label={t('Button text color')}
                name={`${focusIdx}.attributes.button-text-color`}
                inline
            />

          </Stack>
        </Collapse.Item>
        <Collapse.Item
          name='1'
          header={t('Border')}
        >
          <Border />
        </Collapse.Item>
        <Collapse.Item
            name='2'
            header={t('Items')}
        >
          <Grid.Col span={24}>
            <ProductItems max={value}/>
          </Grid.Col>
        </Collapse.Item>
      </Collapse>
    </AttributesPanelWrapper>
  );
}
