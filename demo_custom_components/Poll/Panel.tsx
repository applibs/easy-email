import React, { useMemo } from 'react';
import { useBlock, useEditorProps, useFocusIdx } from 'easy-email-editor';
import { IconLink } from '@arco-design/web-react/icon';
import { Collapse, Grid, Space } from '@arco-design/web-react';
//import { IPoll } from 'easy-email-core';
import {
  Align,
  AttributesPanelWrapper, ClassName,
  CollapseWrapper, Color, ContainerBackgroundColor, EditGridTabField,
  FontFamily,
  FontSize, FontStyle, FontWeight, ImageUploaderField, InputWithUnitField, LineHeight, Padding,
  RadioGroupField, TextDecoration, TextField,
} from 'easy-email-extensions';
import { IPoll } from '@demo/pages/Editor/components/CustomBlocks/Poll/index';


const options = [
  {
    value: 'vertical',
    get label() {
      return t('vertical');
    },
  },
  {
    value: 'horizontal',
    get label() {
      return t('horizontal');
    },
  },
];

const optionsShowText = [
  {
    value: 'yes',
    get label() {
      return t('Yes');
    },
  },
  {
    value: 'no',
    get label() {
      return t('No');
    },
  },
];

export function PollPanel() {
  const { focusIdx } = useFocusIdx();
  const { focusBlock } = useBlock();
  const value = focusBlock?.data.value as IPoll['data']['value'];

  const showText = focusBlock?.attributes.showText as IPoll['attributes']['showText'];

  if (!value) return null;

  return (
    <AttributesPanelWrapper style={{ padding: 0 }}>
      <CollapseWrapper defaultActiveKey={['0', '1', '2', '3']}>
        <Collapse.Item
          name='1'
          header={t('Setting')}
        >
          <Space direction='vertical'>
            <RadioGroupField
              label={t('Mode')}
              name={`${focusIdx}.attributes.mode`}
              options={options}
            />

            <Align />
            <RadioGroupField
              label={t('Show labels')}
              name={`${focusIdx}.attributes.showText`}
              options={optionsShowText}
            />
          </Space>
        </Collapse.Item>

        {
          showText === 'yes' && (
            <Collapse.Item
              name='3'
              header={t('Typography')}
            >
              <Space direction='vertical'>
                <Grid.Row>
                  <Grid.Col span={11}>
                    <FontFamily />
                  </Grid.Col>
                  <Grid.Col
                    offset={1}
                    span={11}
                  >
                    <FontSize />
                  </Grid.Col>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Col span={11}>
                    <FontWeight />
                  </Grid.Col>
                  <Grid.Col
                    offset={1}
                    span={11}
                  >
                    <LineHeight />
                  </Grid.Col>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Col span={11}>
                    <Color />
                  </Grid.Col>
                  <Grid.Col
                    offset={1}
                    span={11}
                  >
                    <ContainerBackgroundColor title={t('Background color')} />
                  </Grid.Col>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Col span={11}>
                    <TextDecoration />
                  </Grid.Col>
                  <Grid.Col
                    offset={1}
                    span={11}
                  >
                    <FontStyle />
                  </Grid.Col>
                </Grid.Row>
              </Space>
            </Collapse.Item>
          )
        }

        <Collapse.Item
          name='2'
          header={t('Poll item')}
          contentStyle={{ padding: 10 }}
        >
          <EditGridTabField
            tabPosition='top'
            name={`${focusIdx}.data.value.elements`}
            label=''
            labelHidden
            renderItem={(item, index) => (
              <PollElement
                item={item}
                index={index}
              />
            )}
          />
        </Collapse.Item>

        <Collapse.Item
          name='0'
          header={t('Dimension')}
        >
          <Space
            direction='vertical'
            size='large'
          >
            <Grid.Row>
              <Grid.Col span={11}>
                <InputWithUnitField
                  label={t('Icon width')}
                  name={`${focusIdx}.attributes.icon-size`}
                />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <TextField
                  label={t('Border radius')}
                  name={`${focusIdx}.attributes.border-radius`}
                />
              </Grid.Col>
            </Grid.Row>

            <Padding />
            <Padding
              attributeName='inner-padding'
              title={t('Icon padding')}
            />
            <Padding
              attributeName='text-padding'
              title={t('Text padding')}
            />
          </Space>
        </Collapse.Item>
        <Collapse.Item
          name='4'
          header={t('Extra')}
        >
          <Grid.Col span={24}>
            <ClassName />
          </Grid.Col>
        </Collapse.Item>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}

function PollElement({
                       index,
                     }: {
  item: IPoll['data']['value']['elements'][0];
  index: number;
}) {
  const { focusIdx } = useFocusIdx();
  const { onUploadImage, pollIcons } = useEditorProps();

  const autoCompleteOptions = useMemo(() => {
    if (!pollIcons) return undefined;
    return pollIcons.map(icon => {
      return {
        label: icon.content,
        value: icon.image,
      };
    });
  }, [pollIcons]);

  return (
    <Space direction='vertical'>
      <ImageUploaderField
        label={t('Image')}
        autoCompleteOptions={autoCompleteOptions}
        labelHidden
        name={`${focusIdx}.data.value.elements.[${index}].src`}
        //helpText={t('The image suffix should be .jpg, jpeg, png, gif, etc. Otherwise, the picture may not be displayed normally.')}
        uploadHandler={onUploadImage}
      />

      <Grid.Row>
        <Grid.Col span={11}>
          <TextField
            label={t('Content')}
            name={`${focusIdx}.data.value.elements.[${index}].content`}
            quickchange
          />
        </Grid.Col>
        <Grid.Col
          offset={1}
          span={11}
        >
          <TextField
            prefix={<IconLink />}
            label={t('Link')}
            name={`${focusIdx}.data.value.elements.[${index}].href`}
          />
        </Grid.Col>
      </Grid.Row>
    </Space>
  );
}
