/* namespace DbViewBuilder
 *
 * Helper functions mostly for use in generating views
 * for the view class.
 *
 */
"use strict";

const DbViewBuilder = {};

DbViewBuilder.mapFunction = (keys, values) => {
    // view map function generation
    let result = "emit(" + DbViewBuilder.emitKey(keys) + "," + DbViewBuilder.emitValue(values) + ");";
    let pfi = _parametersForIf(keys, values);
    if (pfi.length > 0)
        result = "if (" + pfi.join('&&') + ") { " + result + " }";
    result = "function (doc) { " + result + " }";
    return result;
}

function _parametersForIf(keys, values) {
    // find nesting in keys to provision an if statement
    let result = [];
    if (keys instanceof Array)
        for (let key of keys) {
            _addParametersForIf(result, key);
        }
    else
        _addParametersForIf(result, keys);
    // find nesting in values to provision an if statement
    if (values) {
        if (values instanceof Array)
            for (let value of values) {
                _addParametersForIf(result, value);
            }
        else
            _addParametersForIf(result, values);
    }
    return result;
}

function _addParametersForIf(result, name) {
    // find nesting in a single parameter
    let parts = name.split('.');
    if (parts.length > 1) {
        for (let i = 0; i < parts.length - 1; i++) {
            result.push("doc." + parts.slice(0, i + 1).join('.'));
        }
    }
}

DbViewBuilder.emitKey = (keys) => {
    // view map function emit key rendering
    if (keys instanceof Array) {
        let result = [];
        for (let key of keys) {
            result.push("doc." + key);
        }
        return "[" + result.join(',') + "]";
    }
    else
        return "doc." + keys;
}

DbViewBuilder.emitValue = (keys) => {
    // view map function emit value rendering
    if (!keys)
        return "null";
    if (!(keys instanceof Array))
        keys = [keys];
    let assembled = {};
    for (let key of keys) {
        _addNestedEmitValue(assembled, key.split('.'), key);
    }
    return JSON.stringify(assembled).replace(/"/g, "");
}

function _addNestedEmitValue(assembled, parts, orig) {
    if (parts.length > 1) {
        let key = parts.shift();
        assembled[key] = assembled[key] || {};
        _addNestedEmitValue(assembled[key], parts, orig);
    }
    else
        assembled[parts[0]] = "doc." + orig;
}

DbViewBuilder.generateName = (keys, values) => {
    // view name generation
    // for looking up views using key value combinations
    let name = "";
    if (keys instanceof Array) {
        let kk = [];
        for (let key of keys) {
            kk.push(key.split('.').join('_D_'));
        }
        name += kk.join('_K_') + '_A_';
    }
    else
        name += keys.split('.').join('_D_');
    if (values) {
        name += "_S_";
        if (values instanceof Array) {
            let vv = [];
            for (let value of values) {
                vv.push(value.split('.').join('_D_'));
            }
            name += vv.join('_V_') + '_A_';
        }
        else
            name += values.split('.').join('_D_');
    }
    return name;
}

module.exports = DbViewBuilder;
