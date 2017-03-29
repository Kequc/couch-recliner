// 'use strict';

// const ShowMeta = {};

// ShowMeta.catalogFixed = (doc, design, name, callback) => {
//     ShowMeta.catalog(doc.constructor, doc.getId(), design, name, callback);
// }

// ShowMeta.catalog = (Model, id, design, name, callback, tries = 0) => {
//     tries++;
//     Model.db.show(id, design, name, (err, result) => {
//         if (err && tries <= 1 && (err.name === 'no_db_file' || err.name === 'not_found')) {
//             _updateDesign(Model, design, [name], (err) => {
//                 if (err)
//                     callback(err);
//                 else
//                     ShowMeta.catalog(Model, id, design, name, callback, tries);
//             });
//         }
//         else if (err)
//             callback(err);
//         else
//             callback(undefined, result); // executed successfully
//     });
// }

// function _updateDesign(Model, designId, names, callback) {
//     const design = this.db.designs[designId];
//     if (!design) {
//         callback(new Err('show', 'not_defined', 'No design specified for: ' + designId));
//         return;
//     }
//     // generate design document
//     const body = {
//         language: design.language,
//         shows: {}
//     };
//     for (const name of names) {
//         if (design.shows[name])
//             body.shows[name] = design.shows[name];
//         else {
//             callback(new Err('show', 'missing_show', 'Missing deinition for: ' + name));
//             return;
//         }
//     }
//     // update design
//     DocMeta.updateOrWrite(Model, '_design/' + designId, body, callback);
// }

// module.exports = ShowMeta;
