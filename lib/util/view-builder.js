/* namespace ViewBuilder
 *
 * Helper functions mostly for use in generating views
 * for the view class.
 *
 */
'use strict';

const ViewBuilder = {};

ViewBuilder.mapFunction = (keys, values) => {
    // view map function generation
    const result = 'emit(' + ViewBuilder.emitKey(keys) + ',' + ViewBuilder.emitValue(values) + ');';
    const pfi = _parametersForIf(keys, values);
    if (pfi.length > 0)
        result = 'if (' + pfi.join('&&') + ') { ' + result + ' }';
    result = 'function (doc) { ' + result + ' }';
    return result;
}

function _parametersForIf(keys, values) {
    // find nesting in keys and values to provision an if statement
    const result = [];
    for (const key of _wrap(keys)) {
        _addParametersForIf(result, key);
    }
    for (let value of _wrap(values)) {
        _addParametersForIf(result, value);
    }
    return result;
}

function _addParametersForIf(result, name) {
    // find nesting in a single parameter
    const parts = name.split('.');
    for (let i = 0; i < parts.length - 1; i++) {
        result.push('doc.' + parts.slice(0, i + 1).join('.'));
    }
}

ViewBuilder.emitKey = (keys) => {
    // view map function emit key rendering
    if (keys instanceof Array) {
        const result = [];
        for (let key of keys) {
            result.push('doc.' + key);
        }
        return '[' + result.join(',') + ']';
    }
    else
        return 'doc.' + keys;
}

ViewBuilder.emitValue = (keys) => {
    // view map function emit value rendering
    if (!keys)
        return 'null';
    let assembled = {};
    for (let key of _wrap(keys)) {
        _addNestedEmitValue(assembled, key.split('.'), key);
    }
    return JSON.stringify(assembled).replace(/"/g, '');
}

function _addNestedEmitValue(assembled, parts, orig) {
    if (parts.length > 1) {
        let key = parts.shift();
        assembled[key] = assembled[key] || {};
        _addNestedEmitValue(assembled[key], parts, orig);
    }
    else
        assembled[parts[0]] = 'doc.' + orig;
}

ViewBuilder.generateName = (keys, values) => {
    // view name generation
    // for looking up views using key value combinations
    let name = '';
    if (keys instanceof Array) {
        const kk = [];
        for (const key of keys) {
            kk.push(key.split('.').join('_D_'));
        }
        name += kk.join('_K_') + '_A_';
    }
    else
        name += keys.split('.').join('_D_');
    if (values) {
        name += '_S_';
        if (values instanceof Array) {
            const vv = [];
            for (const value of values) {
                vv.push(value.split('.').join('_D_'));
            }
            name += vv.join('_V_') + '_A_';
        }
        else
            name += values.split('.').join('_D_');
    }
    return name;
}

function _wrap(values) {
    return (values instanceof Array ? values : [values]);
}

module.exports = ViewBuilder;
