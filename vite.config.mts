/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
/* eslint-disable sort-keys */
// import { InjectManifest } from 'workbox-webpack-plugin';
// import { exclude } from './tsconfig.json';
import { URL, fileURLToPath } from 'node:url';
import {
  // PluginOption,
  defineConfig, PluginOption, PreviewOptions, ServerOptions
  // ,loadEnv
  // ,transformWithEsbuild
} from 'vite';
// import type { OutputPlugin } from 'vite/node_modules/rollup';
// import externalGlobals from 'rollup-plugin-external-globals';
import { Plugin as importToCDN } from 'vite-plugin-cdn-import';
// import vitePluginCdn from 'vite-plugin-cdn';
// import react from '@vitejs/plugin-react';
import react from '@vitejs/plugin-react-swc';
// import { type UserConfig } from 'vite/dist/node';
import {
  // join,
  resolve
} from 'path';
// import svgr from 'vite-plugin-svgr';
import autoprefixer from 'autoprefixer';
// import stylelint from 'stylelint';
// import postcssCascadeLayers from "@csstools/postcss-cascade-layers";
// import postcssColorFunction from "@csstools/postcss-color-function";
// import postcssFontFormatKeywords from "@csstools/postcss-font-format-keywords";
// import postcssHwbFunction from "@csstools/postcss-hwb-function";
// import postcssIcUnit from "@csstools/postcss-ic-unit";
// import postcssIsPseudoClass from "@csstools/postcss-is-pseudo-class";
// import postcssNestedCalc from "@csstools/postcss-nested-calc";
// import csstools_postcssNormalizeDisplayValues from "@csstools/postcss-normalize-display-values";
// import postcssOklabFunction from "@csstools/postcss-oklab-function";
// import postcssProgressiveCustomProperties from "@csstools/postcss-progressive-custom-properties";
// import postcssSteppedValueFunctions from "@csstools/postcss-stepped-value-functions";
// import postcssTextDecorationShorthand from "@csstools/postcss-text-decoration-shorthand";
// import postcssTrigonometricFunctions from "@csstools/postcss-trigonometric-functions";
// import postcssUnsetValue from "@csstools/postcss-unset-value";

import postcss from 'postcss';
// import postcssAttributeCaseInsensitive from 'postcss-attribute-case-insensitive';
// import postcssBrowserComments from 'postcss-browser-comments';
import postcssCalc from 'postcss-calc';
// import postcssClamp from 'postcss-clamp';
// import postcssColorFunctionalNotation from 'postcss-color-functional-notation';
// import postcssColorHexAlpha from 'postcss-color-hex-alpha';
// import postcssColorRebeccapurple from 'postcss-color-rebeccapurple';
import postcssColormin from 'postcss-colormin';
import postcssConvertValues from 'postcss-convert-values';
// import postcssCustomMedia from 'postcss-custom-media';
// import postcssCustomProperties from 'postcss-custom-properties';
// import postcssCustomSelectors from 'postcss-custom-selectors';
// import postcssDirPseudoClass from 'postcss-dir-pseudo-class';
import postcssDiscardComments from 'postcss-discard-comments';
import postcssDiscardDuplicates from 'postcss-discard-duplicates';
import postcssDiscardEmpty from 'postcss-discard-empty';
// import postcssDiscardOverridden from 'postcss-discard-overridden';
import postcssDiscardUnused from 'postcss-discard-unused';
// import postcssDoublePositionGradients from 'postcss-double-position-gradients';
// import postcssEnvFunction from 'postcss-env-function';
// import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
// import postcssFocusVisible from 'postcss-focus-visible';
// import postcssFocusWithin from 'postcss-focus-within';
// import postcssFontVariant from 'postcss-font-variant';
// import postcssGapProperties from 'postcss-gap-properties';
// import postcssHtml from 'postcss-html';
// import postcssHtmlTransform from 'postcss-html-transform';
// import postcssImageSetFunction from 'postcss-image-set-function';
// import postcssImport from 'postcss-import';
// import postcssInitial from 'postcss-initial';
// import { } from 'postcss-js';
// import postcssLabFunction from 'postcss-lab-function';
// import postcssLess from 'postcss-less';
// import postcssLoadConfig from 'postcss-load-config';
// import postcssLoader from 'postcss-loader';
// import postcssLogical from 'postcss-logical';
// import postcssMarkdown from 'postcss-markdown';
// import postcssMediaMinmax from 'postcss-media-minmax';
// import postcssMediaQueryParser from 'postcss-media-query-parser';
import postcssMergeIdents from 'postcss-merge-idents';
import postcssMergeLonghand from 'postcss-merge-longhand';
import postcssMergeRules from 'postcss-merge-rules';
import postcssMinifyFontValues from 'postcss-minify-font-values';
import postcssMinifyGradients from 'postcss-minify-gradients';
import postcssMinifyParams from 'postcss-minify-params';
import postcssMinifySelectors from 'postcss-minify-selectors';
// import postcssModules from 'postcss-modules';
// import postcssModulesExtractImports from 'postcss-modules-extract-imports';
// import postcssModulesLocalByDefault from 'postcss-modules-local-by-default';
// import postcssModulesScope from 'postcss-modules-scope';
import postcssModulesValues from 'postcss-modules-values';
// import postcssNested from 'postcss-nested';
// import postcssNesting from 'postcss-nesting';
// import postcssNormalize from 'postcss-normalize';
import postcssNormalizeCharset from 'postcss-normalize-charset';
import postcssNormalizeDisplayValues from 'postcss-normalize-display-values';
import postcssNormalizePositions from 'postcss-normalize-positions';
import postcssNormalizeRepeatStyle from 'postcss-normalize-repeat-style';
import postcssNormalizeString from 'postcss-normalize-string';
import postcssNormalizeTimingFunctions from 'postcss-normalize-timing-functions';
import postcssNormalizeUnicode from 'postcss-normalize-unicode';
import postcssNormalizeUrl from 'postcss-normalize-url';
import postcssNormalizeWhitespace from 'postcss-normalize-whitespace';
// import postcssOpacityPercentage from 'postcss-opacity-percentage';
import postcssOrderedValues from 'postcss-ordered-values';
// import postcssOverflowShorthand from 'postcss-overflow-shorthand';
// import postcssPageBreak from 'postcss-page-break';
// import postcssPlace from 'postcss-place';
// import postcssPluginConstparse from 'postcss-plugin-constparse';
// import postcssPrefixSelector from 'postcss-prefix-selector';
// import postcssPresetEnv from 'postcss-preset-env';
// import postcssPseudoClassAnyLink from 'postcss-pseudo-class-any-link';
// import postcssPxtransform from 'postcss-pxtransform';
import postcssReduceIdents from 'postcss-reduce-idents';
import postcssReduceInitial from 'postcss-reduce-initial';
import postcssReduceTransforms from 'postcss-reduce-transforms';
// import postcssReplaceOverflowWrap from 'postcss-replace-overflow-wrap';
// import postcssReporter from 'postcss-reporter';
// import postcssResolveNestedSelector from 'postcss-resolve-nested-selector';
// import postcssSafeParser from 'postcss-safe-parser';
// import postcssSass from 'postcss-sass';
// import postcssScss from 'postcss-scss';
// import postcssSelectorNot from 'postcss-selector-not';
// import postcssSelectorParser from 'postcss-selector-parser';
// import postcssSortMediaQueries from 'postcss-sort-media-queries';
import postcssSvgo from 'postcss-svgo';
// import postcssSyntax from 'postcss-syntax';
import postcssUniqueSelectors from 'postcss-unique-selectors';
// import postcssUrl from 'postcss-url';
// import { } from 'postcss-value-parser';
import postcssZindex from 'postcss-zindex';
import externalGlobals from "rollup-plugin-external-globals";
import { createHtmlPlugin } from 'vite-plugin-html';
import viteCompression from 'vite-plugin-compression';
import { Options } from 'html-minifier-terser';
// import viteCompress from 'vite-plugin-compress';

// import viteCompression2 from 'vite-plugin-compression2';
// import viteGlsl from 'vite-plugin-glsl';
// import rollupGzip from 'rollup-plugin-gzip';
// import viteZipFile from 'vite-plugin-zip-file';
import viteSvgo from 'vite-plugin-svgo';

// import viteImagemin from '@vheemstra/vite-plugin-imagemin';
// import viteCompress from '@crashmax/vite-plugin-compress';

import viteCompressions from 'vite-plugin-compressions';
import viteMinipic from 'vite-plugin-minipic';
// import viteImagemin from 'vite-plugin-imagemin';

// import viteSquoosh from 'vite-plugin-squoosh';

// import legacy from '@vitejs/plugin-legacy';
// import commonjs from 'rollup-plugin-commonjs';//引入commojs
// import commonjs from '@rollup/plugin-commonjs';//引入commojs
// import requireTransform from 'vite-plugin-require-transform';//引入require
// import { } from 'vite-plugin-svg-icons';
// import svgLoader from 'vite-svg-loader';
// import reactSvgPlugin from 'vite-plugin-react-svg';
// //vitejs.dev/config/
const isSplitModule = true;
const serverOptions: ServerOptions & PreviewOptions = {
  'host': true,
  'open': true,
  'cors': true,
  // port: 5173, // 指定开发服务器端口
  // strictPort: true, // 若端口已被占用则会直接退出
  // https: {}, // 启用 TLS + HTTP/2
  // 'https': false,
  // 'strictPort': true, // 若端口已被占用则会直接退出
  // hmr: { // 禁用或配置 HMR 连接
  //   // ...
  // },
  // watch: { // 传递给 chokidar 的文件系统监听器选项
  //   // ...
  // },
  // middlewareMode: true, // 以中间件模式创建 Vite 服务器
  // origin: 'http://127.0.0.1:5173/', // 用于定义开发调试阶段生成资产的 origin
  'proxy': {
    '/api': {
      target: 'http://47.99.129.94',
      'changeOrigin': true,
      // 'secure': true
      // 'rewrite': (path) => path.replace(/^\/api/u, '')
    }
  },
  // 'fs': {
  //   'strict': false //  支持引用除入口目录的文件
  // 'allow': [], // 限制哪些文件可以通过 /@fs/ 路径提供服务
  // 'deny': [
  //   '.env',
  //   '.env.*',
  //   '*.{pem,crt}'
  // ] // 用于限制 Vite 开发服务器提供敏感文件的黑名单
  // }
};
const sw = 'service-worker';
const swUrl = `src/${sw}.ts`;
const swSrc = resolve(__dirname, swUrl) ?? fileURLToPath(new URL(swUrl, import.meta.url));


// eslint-disable-next-line @typescript-eslint/no-unsafe-call
//@ts-expect-error
export default defineConfig(({ mode, command }) => {
  const isBuild = true && mode === 'production' && command === 'build';
  const isUseCDN = true && isBuild;

  const vitePluginCompression: Parameters<typeof viteCompression>[0] = {
    threshold: 0,
    disable: false,
    algorithm: 'gzip',
    compressionOptions: {
      level: 9,
      memLevel: 9,
    },
    deleteOriginFile: false,
    filter (file) {
      /*
(jpg)|(png)|(gif)|(ico)|(jpeg)|(bmp)|(JPG)|(webp)|(GIF)|(PNG)|(tif)|(tiff)|(ani)|(tga)|(ICO)|(psd)|(BMP)|(wmf)
|(m4a)|(mp3)|(ogg)|(wav)|(m3u)|(WAV)|(it)|(voc)|(au)|(aiff)|(aifc)|(aif)|(mod)|(wma)|(mid)|(fla)
|(gz)|(tar)|(zip)|(rar)|(jar)|(7z)|(cab)|(tgz)|(Z)|(bz2)|(CAB)
      */
      const toLow = file.toLowerCase();
      return !toLow.includes('.git') && !/\.((jpg)|(png)|(gif)|(ico)|(jpeg)|(bmp)|(webp)|(tif)|(tiff)|(ani)|(tga)|(psd)|(wmf)|(m4a)|(mp3)|(ogg)|(wav)|(it)|(voc)|(au)|(aiff)|(aifc)|(aif)|(mod)|(wma)|(mid)|(fla)|(gz)|(tar)|(zip)|(rar)|(jar)|(7z)|(cab)|(tgz)|(z)|(bz2))$/.test(toLow);
    },
  };
  return ({
    'root': resolve('./src'), //  入口index.html，注意入口js应该与index.html 同一目录下（只能写到目录，不能写到具体文件）
    'base': './', // 'base': '/'，process.cwd()
    // mode:'',
    // cacheDir:'',
    // assetsInclude: ['**/*.gltf'], // 指定额外的 picomatch 模式 作为静态资源处理
    // logLevel: 'info', // 调整控制台输出的级别 'info' | 'warn' | 'error' | 'silent'
    // envDir: '/', // 用于加载 .env 文件的目录
    // envPrefix: [], // 以 envPrefix 开头的环境变量会通过 import.meta.env 暴露在你的客户端源码中
    'plugins': [
      react(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      // https://cdn.bytedance.com
      isUseCDN ? importToCDN({
        'modules': [
          {
            'name': 'axios',
            'var': 'axios',
            // 'path': '//cdn.bootcdn.net/ajax/libs/axios/1.3.6/axios.min.js'
            // 'path': '//cdn.staticfile.net/axios/1.7.7/axios.min.js'
            'path': '//lf26-cdn-tos.bytecdntp.com/cdn/expire-9-y/axios/0.26.0/axios.min.js'
          },
          {
            'name': 'clsx',
            'var': 'classNames',
            // 'path': '//cdn.bootcdn.net/ajax/libs/classnames/2.3.2/index.min.js'
            'path': '//lf6-cdn-tos.bytecdntp.com/cdn/expire-9-y/classnames/2.3.1/index.min.js'
          },
          {
            'name': 'filesize',
            'var': 'filesize',
            // 'path': '//cdn.bootcdn.net/ajax/libs/filesize/9.0.9/filesize.min.js'
            'path': '//lf26-cdn-tos.bytecdntp.com/cdn/expire-9-y/filesize/8.0.7/filesize.es6.min.js'
          },
          {
            'name': 'lodash',
            'var': '_',
            // 'path': '//cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js'
            // 'path': '//cdn.staticfile.net/lodash.js/4.17.21/lodash.min.js'
            'path': '//lf26-cdn-tos.bytecdntp.com/cdn/expire-9-y/lodash.js/4.17.21/lodash.min.js',
          },
          {
            'name': 'react-is',
            'var': 'ReactIs',
            // 'path': '//cdn.bootcdn.net/ajax/libs/react-is/18.2.0/umd/react-is.production.min.js'
            'path': '//lf3-cdn-tos.bytecdntp.com/cdn/expire-9-y/react-is/17.0.2/umd/react-is.production.min.js'
          },
          // {
          //   'name': 'react',
          //   'var': 'React',
          //   // 'path': '//cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.production.min.js'
          //   'path': '//lf3-cdn-tos.bytecdntp.com/cdn/expire-9-y/react/18.2.0/umd/react.production.min.js'
          //   // 'path': '//cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.development.js'
          // },
          // {
          //   'name': 'react-dom',
          //   'var': 'ReactDOM',
          //   // 'path': '//cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'
          //   'path': '//lf26-cdn-tos.bytecdntp.com/cdn/expire-9-y/react-dom/18.2.0/umd/react-dom.production.min.js'
          //   // 'path': '//cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'
          //   // 'path': '//cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.development.js'
          //   // 'path': '//cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.development.min.js'
          // },
          // {
          //   'name': 'react-fast-compare',
          //   'var': 'ReactFastCompare',
          //   // 'path': '//cdn.bootcdn.net/ajax/libs/react-fast-compare/3.2.2/index.min.js'
          //   'path': '//lf26-cdn-tos.bytecdntp.com/cdn/expire-9-y/react-fast-compare/3.2.0/index.min.js'
          // },
          // {
          //   'name': '@floating-ui',
          //   'var': 'floating',
          //   'path': '//cdn.bootcdn.net/ajax/libs/floating.js/2.7.0/floating.js'
          // },

          // {
          //   'name': 'react-transition-group',
          //   'var': 'ReactTransitionGroup',
          //   // 'path': '//cdn.bootcdn.net/ajax/libs/react-transition-group/4.4.5/react-transition-group.min.js'
          //   'path': '//lf3-cdn-tos.bytecdntp.com/cdn/expire-9-y/react-transition-group/4.4.2/react-transition-group.min.js'
          // },
          // {
          //   'name': 'zrender',
          //   'var': 'zrender',
          //   // 'path': '//cdn.bootcdn.net/ajax/libs/zrender/5.6.1/zrender.min.js'
          //   'path': '//lf6-cdn-tos.bytecdntp.com/cdn/expire-9-y/zrender/5.3.0/zrender.min.js'
          // },
          // {
          //   'name': 'react-router',
          //   'var': 'ReactRouter',
          //   // 'path': '//cdn.bootcdn.net/ajax/libs/react-router/6.15.0/react-router.production.min.js'
          //   'path': '//lf9-cdn-tos.bytecdntp.com/cdn/expire-9-y/react-router/6.2.2/react-router.production.min.js'
          // },
          // {
          //   'name': 'react-router-dom',
          //   'var': 'ReactRouterDOM',
          //   // 'path': '//cdn.bootcdn.net/ajax/libs/react-router-dom/6.15.0/react-router-dom.production.min.js'
          //   'path': '//lf6-cdn-tos.bytecdntp.com/cdn/expire-9-y/react-router-dom/6.2.2-pre.0/react-router-dom.production.min.js'
          // },
          // {
          //   'name': '@mui/material',
          //   'var': 'MaterialUI',
          //   'path': '//cdn.bootcdn.net/ajax/libs/material-ui/4.12.4/umd/material-ui.production.min.js'
          //   // 'path': '//cdn.bootcdn.net/ajax/libs/material-ui/4.12.4/umd/material-ui.development.js'
          //   // 'path': '//unpkg.com/@material-ui/core/umd/material-ui.production.min.js'
          // },
          // {
          //   'name': 'redux',
          //   'var': 'Redux',
          //   'path': '//cdn.bootcdn.net/ajax/libs/redux/4.2.1/redux.min.js'
          // },
          // {
          //   'name': 'react-redux',
          //   'var': 'ReactRedux',
          //   'path': '//cdn.bootcdn.net/ajax/libs/react-redux/8.0.5/react-redux.min.js'
          // },
          // {
          //   'name': 'redux-thunk',
          //   'var': 'ReduxThunk',
          //   'path': '//cdn.bootcdn.net/ajax/libs/redux-thunk/2.4.2/redux-thunk.min.js'
          // },
          // {
          //   'name': 'prop-types',
          //   'var': 'PropTypes',
          //   'path': '//cdn.bootcdn.net/ajax/libs/prop-types/15.8.1/prop-types.min.js'
          // },
          // {
          //   'name': 'uuid',
          //   'var': 'uuid',
          //   'path': '//cdn.bootcdn.net/ajax/libs/uuid/8.3.2/uuid.min.js'
          // },
          // {
          //   'name': 'echarts',
          //   'var': 'echarts',
          //   'path': '//cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js'
          // },
          // {
          //   'name': 'mockjs',
          //   'var': 'Mock',
          //   'path': '//cdn.bootcdn.net/ajax/libs/Mock.js/1.0.0/mock-min.js'
          // },
          // {
          //   'name': 'react/react-jsx-runtime',
          //   'var': 'ReactJsxRuntime',
          //   'path': '//cdn.bootcdn.net/ajax/libs/react/18.2.0/cjs/react-jsx-runtime.production.min.js'
          // },
          // {
          //   'name': 'object-assign',
          //   'var': 'ObjectAssign',
          //   'path': '//unpkg.com/object-assign@4.1.1/index.js'
          // },
          // {
          //   'name': '@popperjs',
          //   'var': 'Popper',
          //   'path': '//cdn.bootcdn.net/ajax/libs/popper.js/2.11.7/umd/popper.js'
          // },
          // {
          //   'name': '@emotion',
          //   'var': 'emotion',
          //   'path': '//cdn.bootcdn.net/ajax/libs/babel-standalone/7.21.4/babel.min.js'
          // },
          // {
          //   'name': '@babel',
          //   'var': 'babel',
          //   // 'path': '//cdn.bootcdn.net/ajax/libs/babel-standalone/7.26.4/babel.min.js'
          //   'path': '//lf6-cdn-tos.bytecdntp.com/cdn/expire-9-y/babel-standalone/7.0.0-alpha.20/babel.min.js'
          // },
          // {
          //   'name': 'tslib',
          //   'var': 'tslib',
          //   'path': '//lf6-cdn-tos.bytecdntp.com/cdn/expire-9-y/tslib/2.3.1/tslib.min.js'
          //   // 'path': '//cdn.bootcdn.net/ajax/libs/tslib/2.6.2/tslib.min.js'
          // },
        ]
      }) : undefined,
      isBuild ? (createHtmlPlugin({
        minify: {
          //deepseek
          collapseBooleanAttributes: true,
          collapseInlineTagWhitespace: true,
          collapseWhitespace: true,
          decodeEntities: true,
          includeAutoGeneratedTags: false,
          noNewlinesBeforeTagClose: true,
          preserveLineBreaks: false,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeEmptyElements: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeTagWhitespace: true,
          processConditionalComments: true,
          trimCustomFragments: true,
          useShortDoctype: true,  // <!DOCTYPE html> -> <!doctypehtml>

          // deepseek遗漏的
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
          sortAttributes: true,
          sortClassName: true,

          // @default
          caseSensitive: false,
          conservativeCollapse: false,
          continueOnParseError: false,
          html5: true,
          keepClosingSlash: false,
          preventAttributesEscaping: false,
        } as Options,  // 开启HTML压缩
        // inject: {
        //   data: {
        //     title: 'My App',  // 动态注入HTML变量
        //   },
        // },
        verbose: true,
      }) as PluginOption) : undefined,
      ...(isBuild ? [
        // viteCompression2({
        //   threshold: 0,
        //   algorithm: 'gzip',
        //   compressionOptions: {
        //     level: 9,
        //     memLevel: 9,
        //   },
        //   deleteOriginalAssets: false,
        //   skipIfLargerOrEqual: true,
        // }),
        // rollupGzip({
        //   filter (file) {
        //     return !file.includes('.git');
        //   },
        // }),
        // viteGlsl({}),
        viteSvgo({
          multipass: true
        }),
        viteMinipic({}),
        // viteImagemin({}),
        // viteImagemin({
        //   plugins: []
        // }),
        // viteCompress({}),
        viteCompressions(vitePluginCompression),

      ] : []),
      isBuild ? viteCompression(vitePluginCompression) : undefined,
      // isBuild ? viteCompress.default({
      //   threshold: 0,
      //   verbose: true,
      //   svgo: {
      //     cleanupAttrs: true,
      //     inlineStyles: true,
      //     removeDoctype: true,
      //     removeXMLProcInst: true,
      //     removeComments: true,
      //     removeMetadata: true,
      //     removeTitle: true,
      //     removeDesc: true,
      //     removeUselessDefs: true,
      //     removeXMLNS: true,
      //     removeEditorsNSData: true,
      //     removeEmptyAttrs: true,
      //     removeHiddenElems: true,
      //     removeEmptyText: true,
      //     removeEmptyContainers: true,
      //     removeViewBox: true,
      //     cleanupEnableBackground: true,
      //     minifyStyles: true,
      //     convertStyleToAttrs: true,
      //     convertColors: true,
      //     convertEllipseToCircle: true,
      //     convertPathData: true,
      //     convertTransform: true,
      //     removeUnknownsAndDefaults: true,
      //     removeNonInheritableGroupAttrs: true,
      //     removeUselessStrokeAndFill: true,
      //     removeUnusedNS: true,
      //     prefixIds: true,
      //     cleanupIDs: true,
      //     cleanupNumericValues: true,
      //     cleanupListOfValues: true,
      //     moveElemsAttrsToGroup: true,
      //     moveGroupAttrsToElems: true,
      //     collapseGroups: true,
      //     removeRasterImages: true,
      //     mergePaths: true,
      //     convertShapeToPath: true,
      //     sortAttrs: true,
      //     sortDefsChildren: true,
      //     removeDimensions: true,
      //     removeAttrs: true,
      //     removeAttributesBySelector: true,
      //     removeElementsByAttr: true,
      //     addClassesToSVGElement: true,
      //     addAttributesToSVGElement: true,
      //     removeOffCanvasPaths: true,
      //     removeStyleElement: true,
      //     removeScriptElement: true,
      //     reusePaths: true,
      //   },
      //   pngquant: {
      //     speed: 11,
      //     strip: true,
      //     quality: [1, 1],
      //     verbose: true,
      //     posterize: 15,
      //   }
      // }) : undefined,
      isBuild ? ({
        name: 'hjx',
        cacheKey: 'hjx',
        version: 'hjx',
        enforce: 'post',
        apply: 'build',
        config: {
          order: 'post',
        },
        configResolved: {
          order: 'post',
        },
        configureServer: {
          order: 'post',
        },
        configurePreviewServer: {
          order: 'post',
        },
        transformIndexHtml: {
          order: 'post',
          enforce: 'post',
          // transform (...args) {
          //   console.log(...args);
          //   return args[0];
          // },
          handler (
            ...args
            // [html, ctx]
          ) {
            // import { parse, serialize } from 'parse5'; // 用于解析和序列化 HTML
            // function transformScriptTags () {
            //   return {
            //     name: 'transform-script-tags', // 插件名称

            //     // 使用 transformIndexHtml 钩子来处理 HTML
            //     transformIndexHtml (html) {
            //       const ast = parse(html); // 将 HTML 字符串解析为 AST（抽象语法树）

            //       // 递归遍历 AST 节点的函数
            //       function walk (node) {
            //         if (node.tagName === 'script') {
            //           // 找到 <script> 标签
            //           let hasAsync = false;
            //           for (const attr of node.attrs) {
            //             if (attr.name === 'async') {
            //               hasAsync = true;
            //               // 从属性列表中移除 async
            //               node.attrs = node.attrs.filter((a) => a.name !== 'async');
            //             }
            //           }

            //           //检查defer属性是否已经存在，如果不存在则添加
            //           let hasDefer = false;
            //           for (const attr of node.attrs) {
            //             if (attr.name === 'defer') {
            //               hasDefer = true;
            //               break;
            //             }
            //           }
            //           if (!hasDefer) {
            //             node.attrs.push({ name: 'defer', value: '' }); // 添加 defer 属性
            //           }
            //         }

            //         // 递归处理子节点
            //         if (node.childNodes) {
            //           node.childNodes.forEach(walk);
            //         }
            //       }

            //       // 从根节点开始遍历
            //       ast.childNodes.forEach(walk);

            //       // 将修改后的 AST 序列化回 HTML 字符串
            //       return serialize(ast);
            //     },
            //   };
            // }

            // import { createFilter } from 'vite';
            // import cheerio from 'cheerio';

            // function addDeferToScriptsPlugin () {
            //   return {
            //     name: 'add-defer-to-scripts',
            //     enforce: 'pre', // 确保在 Vite 默认 HTML 处理前执行

            //     // 处理 HTML 内容
            //     transformIndexHtml (html) {
            //       const $ = cheerio.load(html);

            //       // 找到所有 script 标签，添加 defer 属性
            //       $('script').each((_, element) => {
            //         const el = $(element);
            //         if (!el.attr('defer')) {
            //           el.attr('defer', '');
            //         }
            //       });

            //       return $.html();
            //     },
            //   };
            // }

            const [html, ctx] = args;
            // console.log(...args);
            // return html;
            return html.replace(/<script (async )?/g, '<script defer ');
          },
        },
        handleHotUpdate: {
          order: 'post',
        },
        // resolveId: {
        //   order: 'post',
        //   handler () {
        //     return 'hjx';
        //   }
        // },
        // load: {
        //   order: 'post',
        // },
        // transform: {
        //   order: 'post',
        //   handler (...args) {
        //     console.log(...args);
        //     return args[0];
        //   }
        // },
      } as PluginOption) : undefined,


      // commonjs() as PluginOption,
      // // 我的入口文件是ts类型，所以下面必须加上.ts$，否则在main.ts无法使用require
      // requireTransform({
      //   fileRegex: /.tsx$/
      // }), //配置require
      // (() => {
      //   const res = react();
      //   if (Array.isArray(res)) {
      //     return;
      //   }
      //   return res;
      // })(),
      // svgr({
      //   svgrOptions: {
      //     icon: true,
      //     ref: true,
      //     titleProp: true,
      //     descProp: true,
      //     expandProps: true,
      //     dimensions: true,
      //     // native: true,
      //     runtimeConfig: true,
      //     // typescript: true,
      //     prettier: true,
      //     svgo: true,
      //     memo: true,
      //     index: true,
      //   },
      //   exportAsDefault: true
      //   // 这里可以添加SVGR的选项
      // }),
      // svgLoader({
      //   svgoConfig: {
      //     multipass: true,
      //     js2svg: {
      //       pretty: true,
      //       useShortTags: true,
      //       eol: 'crlf',
      //       finalNewline: true
      //     }
      //   },
      //   defaultImport: 'component',// or 'raw'
      //   svgo: true
      // }),
      // reactSvgPlugin({
      //   // Default behavior when importing `.svg` files, possible options are: 'url' and `component`
      //   defaultExport: 'component',
      //   // Boolean flag to enable/disable SVGO
      //   svgo: true,
      //   // SVGO configuration object
      //   svgoConfig: {},
      //   // Props to be forwarded on SVG tag, ossible options: "start", "end" or false
      //   expandProps: 'end',
      //   // Setting this to true will forward ref to the root SVG tag
      //   ref: false,
      //   // Setting this to true will wrap the exported component in React.memo
      //   memo: false,
      //   // Replace an attribute value by an other.
      //   // The main usage of this option is to change an icon color to "currentColor" in order to inherit from text color.
      //   // replaceAttrValues: { old: 'new' },
      //   replaceAttrValues: null,
      //   // Add props to the root SVG tag
      //   // svgProps: { name: 'value' },
      //   svgProps: null,
      //   // Add title tag via title property
      //   // <SvgIcon title="Accessible icon name" /> => <svg><title>Accessible icon name</title><...></svg>
      //   // <SvgIcon title="Accessible icon name" titleId="iconName" /> => <svg aria-labelledby="iconName><title id="iconName">Accessible icon name</title><...></svg>
      //   titleProp: false,
      // }),
      // legacy({
      //   // targets: ['chrome < 60', 'edge < 15'],
      //   // polyfills: ['es.promise.finally', 'es/map', 'es/set'],
      //   // modernPolyfills: ['es.promise.finally'],
      //   // renderLegacyChunks: true,
      //   // polyfills: ['es.global-this'],
      //   // renderLegacyChunks: false,
      //   targets: ['Android >= 11', 'Chrome >= 83'],
      //   modernPolyfills: true,
      //   externalSystemJS: true
      // }),
      // {
      //   name: 'treat-js-files-as-jsx',
      //   async transform (code, id) {
      //     if (!id.match(/src\/.*\.js$/)) return null;
      //     // Use the exposed transform from vite, instead of directly
      //     // transforming with esbuild
      //     return transformWithEsbuild(code, id, {
      //       loader: 'tsx',
      //       jsx: 'automatic',
      //     });
      //   },
      // },
      // vitePluginCdn({
      //   enabled: true,
      //   esm: true,
      //   'modules': [
      //     {
      //       'name': 'react',
      //       'url': '//cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.production.min.js'
      //     },
      //     {
      //       'name': 'react-dom',
      //       'url': '//cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'
      //     },
      //     {
      //       'name': 'axios',
      //       'url': '//cdn.bootcdn.net/ajax/libs/axios/1.3.6/axios.min.js'
      //     },
      //     {
      //       'name': 'prop-types',
      //       'url': '//cdn.bootcdn.net/ajax/libs/prop-types/15.8.1/prop-types.min.js'
      //     },
      //     {
      //       'name': 'react-transition-group',
      //       'url': '//cdn.bootcdn.net/ajax/libs/react-transition-group/4.4.5/react-transition-group.min.js'
      //     },
      //     {
      //       'name': '@mui/material',
      //       'url': '//cdn.bootcdn.net/ajax/libs/material-ui/4.12.4/umd/material-ui.production.min.js'
      //       // 'url': '//unpkg.com/@material-ui/core/umd/material-ui.production.min.js'
      //     },]
      // }),
    ],
    'resolve': {
      'alias': {
        // '@': resolve(__dirname, 'src'),
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      // dedupe: [], // 强制 Vite 始终将列出的依赖项解析为同一副本
      // conditions: [], // 解决程序包中 情景导出 时的其他允许条件
      // mainFields: [], // 解析包入口点尝试的字段列表
      // preserveSymlinks: false, // 启用此选项会使 Vite 通过原始文件路径确定文件身份
      'extensions': [
        // '.mjs',
        // '.mts',
        '.js',
        '.ts',
        // '.jsx',
        '.tsx',
        // '.vue',
        // '.cjs',
        // '.cts',
      ]
    },
    'esbuild': {
      // 'jsxInject': 'use \'strict\';',
      'pure': [
        'console.log',
        'debugger',
      ],
      // 'jsxFactory': 'React.createElement',
      // 'jsxFragment': 'React.Fragment',
      'drop': [
        'console',
        'debugger'
      ],
      // loader: "tsx", // 或者 "jsx"
      // include: [
      //   // 为.jsx和.tsx文件添加这个，以保持正常行为
      //   "src/**/*.jsx",
      //   "src/**/*.tsx",
      //   "node_modules/**/*.jsx",
      //   "node_modules/**/*.tsx",
      //   // --- 或者 ---   
      //   // 添加这些行以允许所有.js文件包含JSX
      //   "src/**/*.js",
      //   "node_modules/**/*.js",
      //   // 添加这些行以允许所有.ts文件包含JSX
      //   "src/**/*.ts",
      //   "node_modules/**/*.ts",
      // ],
    },
    'build': {
      'rollupOptions': {
        // external: swSrc,
        'input': {
          'main': resolve(__dirname, 'src/index.html'),
          [sw]: swSrc,
        },
        ...(isSplitModule ? {
          'output': {
            'chunkFileNames': 'js/[name]-[hash].js',
            'entryFileNames': (chunkInfo) => {
              if (chunkInfo.facadeModuleId === swSrc.replace(/\\/g, '/'))
                return `${sw}.js`;
              return 'js/[name]-[hash].js';
            },
            'assetFileNames': '[ext]/[name]-[hash].[ext]',
            manualChunks (id, _meta) {
              // if (id === resolve(__dirname, 'src/service-worker.ts').replaceAll('\\', '/'))
              //   return ''
              // eslint-disable-next-line no-magic-numbers, @typescript-eslint/no-magic-numbers
              return id.toString().split('node_modules/')[1]?.split('/')[0]?.toString() ?? null;
              //   if (id.includes('node_modules')) {
              //     return 'id_node_modules';
              //   }
              // }
            },
            hoistTransitiveImports: true,
            plugins: [
              // commonjs() as OutputPlugin
            ]
            // preserveModules: true,
          },
          plugins: [
            // commonjs()
            externalGlobals({})
          ]
        } : null),
        plugins: [
          // commonjs()
        ],
        // treeshake: true,
        treeshake: {
          // moduleSideEffects: false,    // 强制认为所有模块均无副作用（需谨慎），默认值，识别 package.json 的 sideEffects
          propertyReadSideEffects: false,  // 优化纯属性访问，减少属性访问副作用检查
          tryCatchDeoptimization: false,   // 禁用 try-catch 的降级处理，true：Rollup 会认为 ‌try 代码块中的代码可能存在副作用‌，从而 ‌禁用对其中代码的 Tree-Shaking 优化‌（保守策略）；false 时，Rollup 会 ‌尝试优化 try 块中的代码‌，像普通代码一样进行 Tree-Shaking（激进策略）
        },
        // 'external': ['react/jsx-runtime']
      },
      // 'target': 'modules', // 设置最终构建的浏览器兼容目标  //es2015(编译成es5) | modules
      // target: ['edge90', 'chrome90', 'firefox90', 'safari15'],
      target: 'esnext',
      // 'outDir': 'dist', // 构建得包名  默认：dist
      'outDir': resolve('dist'),
      'assetsDir': 'assets', // 静态资源得存放路径文件名  assets
      'sourcemap': false, // 构建后是否生成 source map 文件
      // 'brotliSize': false, // 启用/禁用 brotli 压缩大小报告。 禁用该功能可能会提高大型项目的构建性能
      'minify': 'esbuild', // 项目压缩 :boolean | 'terser' | 'esbuild'
      'manifest': true,
      'ssrManifest': true, // 生成 manifest.json 文件
      'cssCodeSplit': true, // 启用/禁用 CSS 代码拆分。启用后，CSS 将拆分为动态块，而不是内联到 HTML <head> 中的 <style> 标签中。这可以显着提高首次渲染性能，但是如果您的应用程序依赖于在首次渲染之前注入的 CSS，则可能会导致 FOUC。默认情况下启用
      'assetsInlineLimit': 0, // 小于此阈值（以字节为单位）的导入或 URL 资源将内联为 base64 URL。设置为 0 可以完全禁用资源内联。默认情况下，限制为 4kb
      // 'mode': 'development' // 'development' | 'production' | 'none
      // 'chunkSizeWarningLimit': 1000, // chunk 大小警告的限制（以 kbs 为单位）默认：500
      // 'cssTarget': 'chrome61' // 防止 vite 将 rgba() 颜色转化为 #RGBA 十六进制符号的形式  (要兼容的场景是安卓微信中的 webview 时,它不支持 CSS 中的 #RGBA 十六进制颜色符号)
      // 'terserOptions': {
      //   'compress': {
      //     'drop_console': true,
      //     'drop_debugger': true,
      //     'pure_funcs': [
      //       'console.log',
      //       'debugger'
      //     ],
      //     // 'keep_infinity': true,
      //     // 'passes': 0,
      //     // 'toplevel': true,
      //     'unsafe': false,
      //     'unsafe_arrows': false,
      //     'unsafe_comps': false,
      //     'unsafe_Function': false,
      //     'unsafe_math': false,
      //     'unsafe_methods': false,
      //     'unsafe_proto': false,
      //     'unsafe_regexp': false,
      //     'unsafe_symbols': false,
      //     'unsafe_undefined': false
      //   }
      // },
      'write': true, // 启用将构建后的文件写入磁盘
      'emptyOutDir': true, // 构建时清空该目录
      // 'watch': null, // 设置为 {} 则会启用 rollup 的监听器
      // polyfillModulePreload: true, // 是否自动注入 module preload 的 polyfill
      // cssTarget: '', // 允许用户为 CSS 的压缩设置一个不同的浏览器 target 与 build.target 一致
      // ssr: undefined, // 生成面向 SSR 的构建
      // terserOptions: {}, // 传递给 Terser 的更多 minify 选项
      // chunkSizeWarningLimit: 500, // chunk 大小警告的限制
      // 'external': [
      //   '@emotion',
      //   '@babel'
      // ],
      // 'plugins': [
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      //   externalGlobals({
      //     '@emotion': 'emotion',
      //     '@babel': 'babel',
      //     // '@mui/material': 'Button',
      //     // '@mui/material': {
      //     //   Button: '@mui/material'
      //     // }
      //   })
      // ]
    },
    'server': {
      ...serverOptions,
      'open': 'http://localhost:5173/#/?BCviz_file=example_cohesion.txt&dataset=example.txt',
      'hmr': true,
      'watch': {
        // 'ignored': exclude,
        followSymlinks: false,
        awaitWriteFinish: true,
        usePolling: false
      },
    },
    'css': {
      'modules': {
        // 'localsConvention': 'camelCaseOnly'
        // 'scopeBehaviour': 'global' || 'local'
      },
      'devSourcemap': false,
      // preprocessorOptions: { // css的预处理器选项
      //   scss: {
      //     additionalData: `$injectedColor: orange;`
      //   }
      // },
      'postcss': {
        plugins: [
          autoprefixer({}),
          // stylelint(),

          // postcssCascadeLayers(),
          // postcssColorFunction({}),
          // postcssFontFormatKeywords(),
          // postcssHwbFunction(),
          // postcssIcUnit({}),
          // postcssIsPseudoClass({}),
          // postcssNestedCalc({}),
          // csstools_postcssNormalizeDisplayValues(),
          // postcssOklabFunction({}),
          // postcssProgressiveCustomProperties(),
          // postcssSteppedValueFunctions({}),
          // postcssTextDecorationShorthand({}),
          // postcssTrigonometricFunctions({}),
          // postcssUnsetValue(),

          postcss(),
          // postcssAttributeCaseInsensitive(),
          // postcssClamp({}),
          // postcssColorFunctionalNotation(),
          // postcssColorHexAlpha({}),
          // postcssColorRebeccapurple({}),
          // postcssCustomProperties({}),
          // postcssDoublePositionGradients({}),
          // postcssFlexbugsFixes({}),
          // postcssFocusVisible({}),
          // postcssFocusWithin({}),
          // postcssFontVariant(),
          // postcssGapProperties({}),
          // postcssImageSetFunction(),
          // postcssLabFunction({}),
          // postcssModules({}),  // 会加下划线前缀
          // postcssModulesExtractImports({}),
          // postcssModulesLocalByDefault({}),  // postcssModules注释了，这个会报错
          // postcssModulesScope({}), //不要用！！！会带文件路径
          postcssModulesValues(),
          // postcssNested({}),
          // postcssNesting({}),
          // postcssSelectorNot(),

          postcssCalc({}),
          postcssColormin({}),
          postcssConvertValues(),
          postcssDiscardComments({}),
          postcssDiscardDuplicates(),
          postcssDiscardEmpty(),
          postcssDiscardUnused({}),
          // postcssImport({}),
          // postcssLoadConfig({}),  //!报错
          postcssMergeIdents(),
          postcssMergeLonghand(),
          postcssMergeRules(),
          postcssMinifyFontValues({}),
          postcssMinifyGradients(),
          postcssMinifyParams({}),
          postcssMinifySelectors(),
          postcssNormalizeCharset({}),
          postcssNormalizeDisplayValues(),
          postcssNormalizePositions(),
          postcssNormalizeRepeatStyle(),
          postcssNormalizeString({}),
          postcssNormalizeTimingFunctions(),
          postcssNormalizeUnicode(),
          postcssNormalizeUrl({}),
          postcssNormalizeWhitespace(),
          postcssOrderedValues(),
          postcssReduceIdents({}),
          postcssReduceInitial(),
          postcssReduceTransforms(),
          // postcssSelectorParser({}),  //!报错
          postcssSvgo({}),
          postcssUniqueSelectors(),
          postcssZindex({}),
        ]
      },

      // 'preprocessorOptions': { // css的预处理器选项
      //   'scss': {
      //     // 'additionalData': '$injectedColor: orange;'
      //   }
      // }
    },
    'json': {
      'namedExports': true, // 是否支持从.json文件中进行按名导入
      // 'stringify': true// 从 .json 文件中导入的 JSON5 模块将被转换为 ES 模块 //  开启此项，导入的 JSON 会被转换为 export default JSON.parse("...") 会禁用按名导入
    },
    'clearScreen': false, // 设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息
    'preview': {
      ...serverOptions,
      'open': 'http://localhost:4173/#/?BCviz_file=example_cohesion.txt&dataset=example.txt',
    },
    'publicDir': resolve('./public'),
    worker: {
      format: 'es',
      'rollupOptions': {
        // 'input': {
        //   'main': resolve(__dirname, 'src/index.html')
        // },
        'output': {
          assetFileNames: 'assets/worker_asset.[name].[ext]',
          chunkFileNames: 'assets/worker_chunk.[name].js',
          entryFileNames: 'assets/worker_entry.[name].js'
        },
        // 'external': ['react/jsx-runtime']
      },
    },
    // 'logLevel': 'error' // 调整控制台输出的级别 'info' | 'warn' | 'error' | 'silent'
    // 'envDir': '/', // 用于加载 .env 文件的目录
    // 'envPrefix': [], // 以 envPrefix 开头的环境变量会通过 import.meta.env 暴露在你的客户端源码中
    'optimizeDeps': {
      //   'entries': [], // 指定自定义条目——该值需要遵循 fast-glob 模式
      'exclude': [
        // "react/juntime",
        // "react",
        // "react-dom",
        // "clsx"
      ], // 在预构建中强制排除的依赖项
      //   'include': [], // 可强制预构建链接的包
      //   'keepNames': false // true 可以在函数和类上保留 name 属性
    }
    // 'ssr': {
    //   'external': [], // 列出的是要为 SSR 强制外部化的依赖,
    //   'noExternal': '', // 列出的是防止被 SSR 外部化依赖项
    //   'target': 'node' // SSR 服务器的构建目标
    // }
  });
});
