### babel-plugin-style-import

babel-loader 组件，组件单独引入

达到类似效果：
``` javascript
import {
    DatePicker, 
    message, 
    Alert,
} from 'antd';
// => 
import 'antd/lib/date_picker/style/index.less';
import 'antd/lib/message/style/index.less';
import 'antd/lib/alert/style/index.less';
import 'antd/lib/date-picker/index.js';
import 'antd/lib/message/index.js';
import 'antd/lib/alert/index.js';
```

### 配置示例
babel-loader 中 loader 是按照顺序执行的，建议放置在最前

以 antd 为例
``` javascript
const importOptionsList = [
    {
        // 组件库名称
        name: 'antd',
        // 文件转换规则，默认为'_',传入空字符串将不转换
        splitChart: '-',
        // 样式文件名，最终导出为 {{libraryName}}/{{stylePath}}
        style: 'lib/{{name}}/style/index.less',
        // js 文件名，最终导出为 {{libraryName}}/{{jsPath}}
        js: 'lib/{{name}}/index.js',
    },
];
rules: [
    {
        test: /\.vue$/,
        use: [
            {
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false,
                    },
                    loaders: {
                        js: {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                presets: ['es2015', 'stage-2'],
                                plugins: [
                                    [
                                        'babel-plugin-component-transition-import',
                                        importOptionsList,
                                    ],
                                    ...
                                ],
                            },
                        },
                    }
                }
            }
        ]
    },
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-2'],
                    plugins: [
                        [
                            'babel-plugin-component-transition-import',
                            importOptionsList,
                        ],
                        ...
                    ],
                },
            },
        ],
    },
];
```

### 配置 Api
| 参数 | 类型 | 是否必传 | 默认值 | 说明 |
| :------ | :------ | :------ | :------ | :------ | 
|name |String |是 | 无 |组件库名 | 
|splitChart |String |否 |'_' |组件文件夹拆分字符，('HeadBack', '_') => 'head_back',传入空字符串将不转换| 
|style |String |否 |无 | style 在 libray 中所属目录，不传则不处理 | 
|js |String |否 |无 | js 在 libray 中所属目录，不传则不处理 | 

babel-import-style-import/util

``` javascript
const util = require('babel-plugin-component-transition-import/lib/util.js');
util.convertName('HeadBack', '-');  // output 'head-back'
```

### github
[https://github.com/pyrinelaw/babel-plugin-component-transition-import](https://github.com/pyrinelaw/babel-plugin-component-transition-import)

### demo 路径
- /test