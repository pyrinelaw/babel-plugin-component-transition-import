var babelTypes = require('babel-types');
const _ = require('lodash');
const util = require('./util.js');


/**
 * 根据库名找到对应配置
 * @param {*} name 库名
 * @param {*} libraryList 库集合
 */
const getOptions = function(name, list = []) {
    const options = _.find(list, function(d) {
        return d.name === name;
    });

    if (options) {
        return Object.assign(
            {splitChart: '_'},
            options,
        );
    }

    return null;
}

const getStyleUrl = function(name, localName, list) {
    const options = getOptions(name, list) || {};
    const style = options.style;
    const splitChart = options.splitChart || '';

    if (typeof(style) === 'string') {
        return `${name}/${style.replace(/\{\{name\}\}/g, util.convertName(localName, splitChart))}`;
    }

    // if (typeof(style) === 'function') {
    //     return style(localName);
    // }

    return '';
}

const getJsUrl = function(name, localName, list) {
    const options = getOptions(name, list) || {};
    const js = options.js;
    const splitChart = options.splitChart || undefined;

    if (typeof(js) === 'string') {
        return `${name}/${js.replace(/\{\{name\}\}/g, util.convertName(localName, splitChart))}`;
    }

    // if (typeof(js) === 'function') {
    //     return js(localName);
    // }

    return '';
}

module.exports = function (content) {

    const visitor = {
        // 过滤转换 import 引入
        ImportDeclaration(path, source) {
            const specifiers = path.node.specifiers;
            const nodeSource = path.node.source;
            const declarations = [];
            const sourceName = nodeSource.value;

            if (!babelTypes.isImportDefaultSpecifier(specifiers[0]) ) {
                specifiers.forEach((specifier) => {
                    const localName = specifier.local.name;
                    const styleUrl = getStyleUrl(sourceName, localName, source.opts);
                    const jsUrl = getJsUrl(sourceName, localName, source.opts);

                    if (styleUrl) {
                        // css 文件 插入 importImportDeclaration 节点
                        declarations.push(babelTypes.ImportDeclaration(                         
                            [babelTypes.importDefaultSpecifier(specifier.local)],
                            babelTypes.StringLiteral(getStyleUrl(sourceName, localName, source.opts)),
                        ));
                    }

                    if (jsUrl) {
                        // js 文件 创建 importImportDeclaration 节点
                        declarations.push(babelTypes.ImportDeclaration(                         
                            [babelTypes.importDefaultSpecifier(specifier.local)],
                            babelTypes.StringLiteral(getJsUrl(sourceName, localName, source.opts)),
                        ));
                    }
                });
                if (declarations.length > 0) {
                    path.replaceWithMultiple(declarations);
                }
            }
        }
    };
    return {
        visitor,
    };
}
