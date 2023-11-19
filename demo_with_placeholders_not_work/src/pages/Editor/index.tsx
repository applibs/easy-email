/* eslint-disable react/jsx-wrap-multilines */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch} from 'react-redux';
import template from '@demo/store/template';
import {useAppSelector} from '@demo/hooks/useAppSelector';
import {useLoading} from '@demo/hooks/useLoading';
import {Button, Message, PageHeader, Select} from '@arco-design/web-react';
import {useQuery} from '@demo/hooks/useQuery';
//import {useHistory} from 'react-router-dom';
import {cloneDeep, set, isEqual} from 'lodash';
import {Loading} from '@demo/components/loading';
import mjml from 'mjml-browser';
import {copy} from '@demo/utils/clipboard';
import {useEmailModal} from './components/useEmailModal';
import services from '@demo/services';
import {IconMoonFill, IconSunFill} from '@arco-design/web-react/icon';
import {Liquid} from 'liquidjs';
import {
    BlockAvatarWrapper,
    EmailEditor,
    EmailEditorProvider,
    EmailEditorProviderProps,
    IEmailTemplate,
} from 'easy-email-editor';

import {Stack} from '@demo/components/Stack';
import {pushEvent} from '@demo/utils/pushEvent';
import {FormApi} from 'final-form';
import {UserStorage} from '@demo/utils/user-storage';

import {useCollection} from './components/useCollection';
import {AdvancedType, BasicType, BlockManager, IBlockData, JsonToMjml} from 'easy-email-core';
import {
    BlockAttributeConfigurationManager,
    BlockMarketManager,
    ExtensionProps,
    StandardLayout,
} from 'easy-email-extensions';
import {AutoSaveAndRestoreEmail} from '@demo/components/AutoSaveAndRestoreEmail';

// Register external blocks
import './components/CustomBlocks';

import 'easy-email-editor/lib/style.css';
import 'easy-email-extensions/lib/style.css';
import blueTheme from '@arco-themes/react-easy-email-theme/css/arco.css?inline';
import purpleTheme from '@arco-themes/react-easy-email-theme-purple/css/arco.css?inline';
import greenTheme from '@arco-themes/react-easy-email-theme-green/css/arco.css?inline';
import {testMergeTags} from './testMergeTags';
import {useMergeTagsModal} from './components/useMergeTagsModal';

import {useWindowSize} from 'react-use';
import {CustomBlocksType} from './components/CustomBlocks/constants';
import localesData from 'easy-email-localization/locales/locales.json';
import {t} from 'easy-email-core';
import createSliceState from "@demo/store/common/createSliceState";
import ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";

//console.log(localesData);

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
                payload: {attributes: {padding: '0px 0px 0px 0px'}},
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
            <BlockAvatarWrapper type={CustomBlocksType.PRODUCTS}>
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
                    <img
                        src={
                            './images/products.png'
                        }
                        style={{
                            maxWidth: '100%',
                        }}
                    />
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
    'Montserrat'
].map(item => ({value: item, label: item}));

export default function Editor() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [theme, setTheme] = useState<'blue' | 'green' | 'purple'>('blue');
    const dispatch = useDispatch();
    //const history = useHistory();
    const templateData = useAppSelector('template');
    const [locale, setLocale] = useState('cs');
    const {addCollection, removeCollection, collectionCategory} = useCollection();

    const {width} = useWindowSize();

    const smallScene = width < 1400;

    const enableHeader = false;

    const [placeholders, setPlaceholders] = useState({});

    useEffect(() => {
        const element = document.getElementById('EMAIL_PLACEHOLDERS') as HTMLElement;
        if (element && element.textContent) {
            setPlaceholders(JSON.parse(element.textContent));
        } else {
            setPlaceholders(testMergeTags);
        }
    }, []);

    useEffect(() => {
        setMergeTags(placeholders);
    }, [placeholders]);

    const {openModal, modal} = useEmailModal();
    const {id, userId} = useQuery();
    const loading = useLoading(template.loadings.fetchById);
    const {
        modal: mergeTagsModal,
        openModal: openMergeTagsModal,
        mergeTags,
        setMergeTags,
    } = useMergeTagsModal(placeholders || {});

    const isSubmitting = useLoading([
        template.loadings.create,
        template.loadings.updateById,
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
        if (id) {
            if (!userId) {
                UserStorage.getAccount().then(account => {
                    dispatch(template.actions.fetchById({id: +id, userId: account.user_id}));
                });
            } else {
                dispatch(template.actions.fetchById({id: +id, userId: +userId}));
            }
        } else {
            //dispatch(template.actions.fetchDefaultTemplate(undefined));
        }

        return () => {
            dispatch(template.actions.set(null));
        };
    }, [dispatch, id, userId]);

    useEffect(() => {
        if (isDarkMode) {
            document.body.setAttribute('arco-theme', 'dark');
        } else {
            document.body.removeAttribute('arco-theme');
        }
    }, [isDarkMode]);

    //todo: upload pres URL na backendu
    const onUploadImage = async (blob: Blob) => {
        const compressionFile = await (
            await imageCompression
        ).default(blob as File, {
            maxWidthOrHeight: initialValues ? initialValues.content.attributes.width.replace('px', '') : 1440,
        });

        return services.common.upload(compressionFile);
    };

    const onChangeTheme = useCallback(t => {
        setTheme(t);
    }, []);

    const onChangeMergeTag = useCallback((path: string, val: any) => {
        setMergeTags(old => {
            const newObj = cloneDeep(old);
            set(newObj, path, val);
            return newObj;
        });
    }, []);

    const onExportHtml = (values: IEmailTemplate) => {
        pushEvent({event: 'HtmlExport'});
        const html = mjml(
            JsonToMjml({
                data: values.content,
                mode: 'production',
                context: values.content,
                dataSource: mergeTags,
            }),
            {
                beautify: true,
                validationLevel: 'soft',
            },
        ).html;

        copy(html);
        Message.success('Copied to pasteboard!');
    };

    const onExportMJML = (values: IEmailTemplate) => {
        const html = JsonToMjml({
            data: values.content,
            mode: 'production',
            context: values.content,
            dataSource: mergeTags,
        });

        copy(html);
        pushEvent({event: 'MJMLExport', payload: {values, mergeTags}});
        Message.success('Copied to pasteboard!');
    };

    const initialValues: IEmailTemplate | null = useMemo(() => {

        if (!templateData) {
            const data = window.localStorage.getItem('EMAIL_TEMPLATE');
            if (data) {
                const data2 = JSON.parse(data);
                const sourceData = cloneDeep(data2.content) as IBlockData;
                return {
                    ...data2 || {},
                    content: sourceData, // replace standard block
                };
            }
        }
        if (templateData) {
            const sourceData = cloneDeep(templateData.content) as IBlockData;
            return {
                ...templateData,
                content: sourceData, // replace standard block
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
            pushEvent({event: 'EmailSave'});

            //custom: ulozit do localStorage
            window.localStorage.setItem('EMAIL_TEMPLATE', JSON.stringify(values));
            Message.success(t('Saved success!'));

            //export to mjml and then to html
            const mjml = (await import('mjml-browser')).default;
            const htmlContent = mjml(
                JsonToMjml({
                    data: values.content,
                    mode: 'production',
                    context: values.content,
                }),
                {
                    beautify: true,
                    validationLevel: 'soft',
                },
            ).html;
            window.localStorage.setItem('EMAIL_HTML', htmlContent);

            /*
            if (id) {
              const isChanged = !(
                isEqual(initialValues?.content, values.content) &&
                isEqual(initialValues?.subTitle, values?.subTitle) &&
                isEqual(initialValues?.subject, values?.subject)
              );

              if (!isChanged) {
                Message.success('Updated success!');
                form.restart(values);
                return;
              }
              dispatch(
                template.actions.updateById({
                  id: +id,
                  template: values,
                  success() {
                    Message.success('Updated success!');
                    form.restart(values);
                  },
                }),
              );
            } else {
              dispatch(
                template.actions.create({
                  template: values,
                  success(id, newTemplate) {
                    Message.success('Saved success!');
                    form.restart(newTemplate);
                    history.replace(`/editor?id=${id}`);
                  },
                }),
              );
            }*/
        },
        [dispatch, id, initialValues],
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
        if (theme === 'green') return greenTheme;
        if (theme === 'purple') return purpleTheme;
        return blueTheme;
    }, [theme]);

    if (!templateData && loading) {
        return (
            <Loading loading={loading}>
                <div style={{height: '100vh'}}/>
            </Loading>
        );
    }

    if (!initialValues) return null;

    const DefaultPageConfigPanel = BlockAttributeConfigurationManager.get(BasicType.PAGE);
    BlockAttributeConfigurationManager.add({
        [BasicType.PAGE]: () => (
            <DefaultPageConfigPanel
                hideSubject
                hideSubTitle
            />
        ),
    });

    return (
        <div>
            <style>{themeStyleText}</style>
            <EmailEditorProvider
                key={id}
                height={'calc(100vh - 68px)'}
                data={initialValues}
                // interactiveStyle={{
                //   hoverColor: '#78A349',
                //   selectedColor: '#1890ff',
                // }}
                // onAddCollection={addCollection}
                // onRemoveCollection={({ id }) => removeCollection(id)}
                onUploadImage={onUploadImage}
                fontList={fontList}
                onSubmit={onSubmit}
                onChangeMergeTag={onChangeMergeTag}
                autoComplete
                enabledLogic
                // enabledMergeTagsBadge
                dashed={false}
                mergeTags={mergeTags}
                mergeTagGenerate={tag => `{{${tag}}}`}
                onBeforePreview={onBeforePreview}
                socialIcons={[]}
                locale={localesData[locale]}
            >
                {({values}, {submit}) => {
                    return (
                        <>
                            {
                                enableHeader && <PageHeader
                                    style={{background: 'var(--color-bg-2)'}}
                                    backIcon={false}
                                    title=''
                                    //onBack={() => history.push('/')}
                                    extra={
                                        <Stack alignment='center'>
                                            <Button
                                                onClick={() => setIsDarkMode(v => !v)}
                                                shape='circle'
                                                type='text'
                                                icon={isDarkMode ? <IconMoonFill/> : <IconSunFill/>}
                                            ></Button>

                                            <Select
                                                onChange={onChangeTheme}
                                                value={theme}
                                            >
                                                <Select.Option value='blue'>Blue</Select.Option>
                                                <Select.Option value='green'>Green</Select.Option>
                                                <Select.Option value='purple'>Purple</Select.Option>
                                            </Select>
                                            <Select
                                                onChange={setLocale}
                                                value={locale}
                                            >
                                                <Select.Option value='en'>English</Select.Option>
                                                <Select.Option value='cs'>Čeština</Select.Option>
                                                <Select.Option value='it'>Italian</Select.Option>
                                            </Select>


                                            <Button onClick={() => onExportMJML(values)}>Export MJML</Button>

                                            <Button onClick={() => onExportHtml(values)}>Export html</Button>

                                            <Button onClick={() => openModal(values, mergeTags)}>
                                                Send test email
                                            </Button>
                                            <Button
                                                loading={isSubmitting}
                                                type='primary'
                                                onClick={() => submit()}
                                            >
                                                Save
                                            </Button>
                                        </Stack>
                                    }
                                />
                            }
                            <StandardLayout
                                compact={!smallScene}
                                categories={defaultCategories}
                            >
                                <EmailEditor/>
                            </StandardLayout>
                            <AutoSaveAndRestoreEmail/>
                        </>
                    );
                }}
            </EmailEditorProvider>
            {modal}
            {mergeTagsModal}
            <style>{`#bmc-wbtn {display:none !important;}`}</style>
        </div>
    );
}

function replaceStandardBlockToAdvancedBlock(blockData: IBlockData) {
    const map = {
        [BasicType.TEXT]: AdvancedType.TEXT,
        [BasicType.BUTTON]: AdvancedType.BUTTON,
        [BasicType.IMAGE]: AdvancedType.IMAGE,
        [BasicType.DIVIDER]: AdvancedType.DIVIDER,
        [BasicType.SPACER]: AdvancedType.SPACER,
        [BasicType.SOCIAL]: AdvancedType.SOCIAL,
        [BasicType.ACCORDION]: AdvancedType.ACCORDION,
        [BasicType.CAROUSEL]: AdvancedType.CAROUSEL,
        [BasicType.NAVBAR]: AdvancedType.NAVBAR,
        [BasicType.WRAPPER]: AdvancedType.WRAPPER,
        [BasicType.SECTION]: AdvancedType.SECTION,
        [BasicType.GROUP]: AdvancedType.GROUP,
        [BasicType.COLUMN]: AdvancedType.COLUMN,
    };

    if (map[blockData.type]) {
        blockData.type = map[blockData.type];
    }
    blockData.children.forEach(replaceStandardBlockToAdvancedBlock);
    return blockData;
}
