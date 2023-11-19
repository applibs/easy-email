/* eslint-disable react/jsx-wrap-multilines */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@demo/hooks/useAppSelector';
import { useLoading } from '@demo/hooks/useLoading';
import { Button, Message, PageHeader } from '@arco-design/web-react';
import { useQuery } from '@demo/hooks/useQuery';
import { useHistory } from 'react-router-dom';
import { cloneDeep, merge, set } from 'lodash';
import { useEmailModal } from './components/useEmailModal';
import services from '@demo/services';
import { Liquid } from 'liquidjs';
import {
  BlockAvatarWrapper,
  EmailEditor,
  EmailEditorProvider,
  EmailEditorProviderProps,
  IEmailTemplate,
} from 'easy-email-editor';
import { Stack } from '@demo/components/Stack';
import { pushEvent } from '@demo/utils/pushEvent';
import { FormApi } from 'final-form';

import { useCollection } from './components/useCollection';
import { AdvancedType, BasicType, BlockManager, IBlockData, JsonToMjml } from 'easy-email-core';
import {
  BlockMarketManager,
  ExtensionProps,
  StandardLayout,
} from 'easy-email-extensions';

// Register external blocks
import './components/CustomBlocks';

import 'easy-email-editor/lib/style.css';
import 'easy-email-extensions/lib/style.css';
import blueTheme from '@arco-themes/react-easy-email-theme/css/arco.css?inline';
import { useMergeTagsModal } from './components/useMergeTagsModal';

import { useWindowSize } from 'react-use';
import { CustomBlocksType } from './components/CustomBlocks/constants';
import localesData from 'easy-email-localization/locales/locales.json';
import { t } from 'easy-email-core';

import { Base64 } from 'js-base64';

import { ConfigProvider } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';
import csCZ from '../../locale/cs-CZ';

import imgProducts from '../../images/products.png';

import { ImageManager } from 'easy-email-core';
import { customImagesMap } from './images';
import { b64EncodeUnicode } from '@demo/services/common';

ImageManager.add(customImagesMap, true);

const customInitValues = {
  button: {
    attributes: {
      'background-color': '#007647',
      'color': 'white',
      'border': '1px solid #007647',
      'border-radius': '20px',
      'line-height': '19px',
      'font-size': '14px',
      'font-weight': 'normal',
      'inner-padding': '8px 12px 8px 12px',
      'font-family': 'Roboto, sans-serif',
    },
  },
  hero: {
    title: 'Jedinečná nabídka přímo pro Vás',
    description: 'Připravili jsme pro vás případovou studii, která by vám mohla pomoci rozvíjet vaše podnikání pomocí jednoduchých nápadů v oblasti growth hackingu.<br>',
    buttonText: 'Zjistit více',
  },
  page: {
    content: {
      attributes: {
        'background-color': '#efeeea',
        'width': '600px',
      },
      data: {
        value: {
          'breakpoint': '480px',
          'headAttributes': '',
          'font-size': '14px',
          'font-weight': '400',
          'line-height': '1.7',
          'text-color': '#000000',
          'fonts': [
            {
              'name': 'Roboto',
              'href': 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap',
            },
          ],
          'extraHeadContent': '<!--AssetHead-->',
          'extraBodyContent': '<!--AssetBody-->',
        },
      },
    },
  },
  products: {
    payload: {
      attributes: {
        'background-color': 'white',
        'button-text-color': 'white',
        'button-color': '#007647',
        'product-name-color': '#007647',
        'product-price-color': '#007647',
        'title-color': '#222222',
        'border': '1px solid #007647',
        'border-radius': '20px',
      },
    },
  },
};

const customStyles =
  {
    blocks: [
      {
        type: AdvancedType.BUTTON,
        payload: {
          attributes: customInitValues.button.attributes,
          data: {
            value: {
              content: 'Navštívit',
            },
          },
        },
      },
      {
        type: AdvancedType.HERO,
        payload: {
          children: [
            {
              type: 'text',
              data: {
                value: {
                  content: customInitValues.hero.title,
                },
              },
            },
            {
              type: 'text',
              data: {
                value: {
                  content: customInitValues.hero.description,
                },
              },
            },
            {
              type: 'button',
              data: {
                value: {
                  content: customInitValues.hero.buttonText,
                },
              },
              attributes: customInitValues.button.attributes,
              children: [],
            },
          ],
        },
      },
    ],
  }
;

const defaultCategories: ExtensionProps['categories'] = [
  {
    get label() {
      return t('Content');
    },
    active: true,
    blocks: [
      {
        type: AdvancedType.TEXT,
      },
      {
        type: AdvancedType.IMAGE,
        payload: { attributes: { padding: '0px 0px 0px 0px' } },
      },
      {
        type: AdvancedType.BUTTON,
      },
      {
        type: AdvancedType.SOCIAL,
      },
      {
        type: AdvancedType.DIVIDER,
      },
      {
        type: AdvancedType.SPACER,
      },
      {
        type: AdvancedType.HERO,
      },
      {
        type: AdvancedType.WRAPPER,
      },
      {
        type: AdvancedType.NAVBAR,
      },
      {
        type: AdvancedType.COLUMN,
      },
      {
        type: AdvancedType.SECTION,
      },
      /*{
        type: AdvancedType.CAROUSEL,
      },
      {
        type: AdvancedType.ACCORDION,
      },*/
    ],
  },
  {
    get label() {
      return t('Layout');
    },
    active: true,
    displayType: 'column',
    blocks: [
      {
        get title() {
          return t('2 columns');
        },
        payload: [
          ['50%', '50%'],
          ['33%', '67%'],
          ['67%', '33%'],
          ['25%', '75%'],
          ['75%', '25%'],
        ],
      },
      {
        get title() {
          return t('3 columns');
        },
        payload: [
          ['33.33%', '33.33%', '33.33%'],
          ['25%', '25%', '50%'],
          ['50%', '25%', '25%'],
        ],
      },
      {
        get title() {
          return t('4 columns');
        },
        payload: [['25%', '25%', '25%', '25%']],
      },
    ],
  },
  {
    get label() {
      return t('Custom');
    },
    active: true,
    displayType: 'custom',
    blocks: [
      <BlockAvatarWrapper
        type={CustomBlocksType.PRODUCTS}
        payload={customInitValues.products.payload}
      >
        <div
          style={{
            position: 'relative',
            border: '1px solid #ccc',
            marginBottom: 20,
            width: '80%',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <img // nahradit za lokalni obrazek
            src={
              process.env.NODE_ENV === 'production' ?
                '/assets/libs/easy-email/images/products.png'
                : imgProducts
            }
            style={{
              maxWidth: '100%',
            }}
            alt='Products' />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 2,
            }}
          />
        </div>
      </BlockAvatarWrapper>,
    ],
  },
];

const imageCompression = import('browser-image-compression');

const fontList = [
  'Arial',
  'Tahoma',
  'Verdana',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Lato',
  'Montserrat',
].map(item => ({ value: item, label: item }));

function getLocale(locale) {
  switch (locale) {
    case 'cs':
      return csCZ;
    case 'en':
      return enUS;
  }
}

export default function Editor() {
  const [isDarkMode] = useState(false);
  const [theme, setTheme] = useState<'blue'>('blue');
  const dispatch = useDispatch();
  const history = useHistory();
  const templateData = useAppSelector('template');

  //pozdeji si od nekud nacist info z nejakeho configu nebo parametrem volani
  const [localization, setLocalization] = useState<string>(document.documentElement.lang as string | 'cs');
  const [locale, setLocale] = useState(getLocale(localization));

  const { collectionCategory } = useCollection();
  const { width } = useWindowSize();
  const smallScene = width < 1400;
  const enableHeader = true;
  const [placeholders, setPlaceholders] = useState({});
  const [styles, setStyles] = useState({});

  /*
      useEffect(() => {
          const placeholders = services.common.getPlaceholders();
          placeholders.then(res => {
              setPlaceholders(res);
          });

      }, [templateData]);
  */

  useEffect(() => {
    const placeholders = services.common.getPlaceholders();
    placeholders.then(res => {
      setPlaceholders(res);
    }).catch(error => {
      setPlaceholders({ 'test': 'test' });
    });
  }, []);

  useEffect(() => {
    const styles = services.common.getStyles();
    styles.then(res => {
      setStyles(res);
    });
  }, []);

  useEffect(() => {
    setMergeTags(placeholders);
  }, [placeholders]);

  const { openModal, modal } = useEmailModal();
  const { id, userId } = useQuery();
  //const loading = useLoading(template.loadings.fetchById);
  const {
    modal: mergeTagsModal,
    openModal: openMergeTagsModal,
    mergeTags,
    setMergeTags,
  } = useMergeTagsModal(placeholders || {});

  const isSubmitting = useLoading([
    //template.loadings.create,
    //template.loadings.updateById,
  ]);

  useEffect(() => {
    if (collectionCategory) {
      BlockMarketManager.addCategories([collectionCategory]);
      return () => {
        BlockMarketManager.removeCategories([collectionCategory]);
      };
    }
  }, [collectionCategory]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute('arco-theme', 'dark');
    } else {
      document.body.removeAttribute('arco-theme');
    }
  }, [isDarkMode]);

  // upload pres URL na backendu
  const onUploadImage = async (blob: Blob) => {
    const compressionFile = await (
      await imageCompression
    ).default(blob as File, {
      maxWidthOrHeight: initialValues ? initialValues.content.attributes.width.replace('px', '') : 1440,
    });

    return services.common.upload(compressionFile);
  };

  const onChangeMergeTag = useCallback((path: string, val: any) => {
    setMergeTags(old => {
      const newObj = cloneDeep(old);
      set(newObj, path, val);
      return newObj;
    });
  }, []);

  const initialValues: IEmailTemplate | null = useMemo(() => {

    if (!templateData) {
      let element = document.querySelector('#data_json');
      if (element && element.getAttribute('value')) {
        const data2 = JSON.parse(Base64.decode(element.getAttribute('value') as string) || '{}');
        const sourceData = cloneDeep(data2.content) as IBlockData;
        return {
          ...data2 || {},
          content: sourceData, // replace standard block
        };
      }
    }
    if (templateData) {
      const sourceData2 = cloneDeep(templateData.content) as IBlockData;
      return {
        ...templateData,
        content: sourceData2, // replace standard block
      };
    }

    return {
      subject: '',
      subTitle: '',
      content: BlockManager.getBlockByType(BasicType.PAGE).create({
        children: [BlockManager.getBlockByType(AdvancedType.WRAPPER).create()],
      }),
    } as IEmailTemplate;

  }, [templateData]);

  // save callback
  const onSubmit = useCallback(
    async (
      values: IEmailTemplate,
      form: FormApi<IEmailTemplate, Partial<IEmailTemplate>>,
    ) => {
      pushEvent({ event: 'EmailSave' });

      let el_json = document.querySelector('#data_json');
      if (el_json) {
        el_json.setAttribute('value', b64EncodeUnicode(JSON.stringify(values)));
      }

      Message.success(t('Saved success!'));


      // js komponent vyrendruje misto ceny placeholdery {prodId:123,value:"priceVatFormatted"}
      // values.content -> children rekurzivne dokud type===products a v nem data.value.products
      // a nem pole kde nahradit price za {prodId:123,value:priceVatFormatted}
      function findNode(currentNode) {
        let i, currentChild, result, currentItem;
        if (currentNode.children.length > 0) {
          // Use a for loop instead of forEach to avoid nested functions
          // Otherwise "return" will not work properly
          for (i = 0; i < currentNode.children.length; i += 1) {
            currentChild = currentNode.children[i];
            if (currentChild.type === 'products' && currentChild.data.value.products) {
              for (i = 0; i < currentChild.data.value.products.length; i += 1) {
                currentItem = currentChild.data.value.products[i];
                currentItem.currency = '';
                currentItem.price = '{prodId:' + currentItem.id + ',value:priceFormatted}';
                currentItem.priceVat = '{prodId:' + currentItem.id + ',value:priceVatFormatted}';
              }
            }
            // Search in the current child
            result = findNode(currentChild);
            // Return the result if the node has been found
            if (result !== false) {
              return result;
            }
          }
          // The node has not been found and we have no more options
          return false;
        } else {
          return currentNode;
        }
      }

      findNode(values.content);

      //export to mjml and then to html
      const mjml = (await import('mjml-browser')).default;

      let htmlContent = mjml(
        JsonToMjml({
          data: values.content,
          mode: 'production',
          context: values.content,
        }),
        {
          //beautify: true,-deprecated
          validationLevel: 'soft',
        },
      ).html;

      // replace &subset za &amp;subset, &display za &amp;display, protoze PHP DOMDocument to nezvlada
      htmlContent = htmlContent.replaceAll('&subset', '&amp;subset');
      htmlContent = htmlContent.replaceAll('&display', '&amp;display');

      let el_html = document.querySelector('#data_html');
      if (el_html) {
        el_html.setAttribute('value', b64EncodeUnicode(htmlContent));
      }

      // close modal with app
      // @ts-ignore
      window.destroyEmailBuilder();
      const modal = document.querySelector('.easy-email-interface');
      if (modal) {
        modal.innerHTML = '';
      }

      // send to API
      if (el_html) {
        const submitButton = el_html.closest('form')?.querySelector('input[type=Submit]');
        //const submitButton = document.querySelector('[data-widget-uid="compositionEditor"] form input[type=Submit]');
        if (submitButton) {
          if (submitButton) {
            submitButton.dispatchEvent(new Event('click'));
          }
        }
      }

    },
    [dispatch, history, id, initialValues],
  );

  const onBeforePreview: EmailEditorProviderProps['onBeforePreview'] = useCallback(
    (html: string, mergeTags) => {
      const engine = new Liquid();
      const tpl = engine.parse(html);
      return engine.renderSync(tpl, mergeTags);
    },
    [],
  );

  const themeStyleText = useMemo(() => {
    //if (theme === 'green') return greenTheme;
    //if (theme === 'purple') return purpleTheme;
    return blueTheme;
  }, [theme]);

  if (!initialValues) return null;

  defaultCategories.map(blocks => {
    if (typeof blocks.blocks !== 'undefined') {
      blocks.blocks.map(block => {
        let obj = customStyles.blocks.find(o => o.type === block.type);
        if (obj?.payload) {
          /*if (block.type === AdvancedType.HERO && obj) {
            console.log(block, obj);
            obj.payload.children.map((index, value) => {
              if(value.type === 'button' && obj?.payload.children) {
                block.payload.children[index] = obj.payload.children[0];
              }
            });
          } else {
            block['payload'] = obj.payload;
          }*/

          block['payload'] = obj.payload;
        }
      });
    }
    return blocks;
  });

  return (
    <ConfigProvider locale={locale}>
      <div className='easy-email'>
        <style>{themeStyleText}</style>
        <EmailEditorProvider
          key={id}
          height={'calc(100vh - 135px)'}
          data={initialValues}
          onUploadImage={onUploadImage}
          fontList={fontList}
          onSubmit={onSubmit}
          onChangeMergeTag={onChangeMergeTag}
          autoComplete
          //enabledLogic
          //enabledMergeTagsBadge
          dashed={false}
          mergeTags={mergeTags}
          mergeTagGenerate={tag => `{{${tag}}}`}
          onBeforePreview={onBeforePreview}
          socialIcons={[]}
          locale={localesData[localization]}
        >
          {({ values }, { submit }) => {
            return (
              <>
                <StandardLayout
                  compact={!smallScene}
                  categories={defaultCategories}
                >
                  <EmailEditor />
                </StandardLayout>
                {
                  enableHeader && <PageHeader
                    style={{ background: 'var(--color-bg-2)' }}
                    backIcon={false}
                    title=''
                    //onBack={() => history.push('/')}
                    extra={
                      <Stack alignment='center'>
                        <Button
                          loading={isSubmitting}
                          type='primary'
                          onClick={() => submit()}
                        >
                          {t('Save')}
                        </Button>
                      </Stack>
                    }
                  />
                }
              </>
            );
          }}
        </EmailEditorProvider>
        {modal}
        {mergeTagsModal}
      </div>
    </ConfigProvider>
  );
}

