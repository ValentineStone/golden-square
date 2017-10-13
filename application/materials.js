'use strict';

var path = require('path');
var appDir = path.dirname(require.main.filename);

const endpoint = require('./endpoint');
const utils = require('./at-root')('modules/es5/utils');
const RawRequired = require('./rawRequired');





function calculate(_what) {
  switch (_what) {
    case 'product':
      return calculateProduct;
  }
}


function calculateProduct(param) {
  var frames = endpoint.materials.search(param.frameName);
  if (!frames || !frames.length) return {error:'Unknown material'};
  if (frames.length > 1) return {error:'Multiple materials match'};
  var frame = frames[0];
  var rawRequired = new RawRequired();
  var rawRequiredFrameXLenght = frame.width * 2 + param.workSize.x;
  var rawRequiredFrameYLenght = frame.width * 2 + param.workSize.y;
  rawRequired.push(frame.id, 2, rawRequiredFrameXLenght);
  rawRequired.push(frame.id, 2, rawRequiredFrameYLenght);
  console.log(rawRequired.list);
  return rawRequired.list;
}


if (module) module.exports = calculate;

/*

function place_material_request() {
  var materials = root.main.materials;
  var ext = root.extra;

  var work_width = iinf(ext.work_size.x);
  var work_height = iinf(ext.work_size.y);

  if (!(work_width && work_height))
    return;

  var total_width = work_width;
  var total_height = work_height;

  if (!ext.paperframe.__hidden) {
    var ppfr_width = iina(ext.paperframe.size.x);
    var ppfr_height = iina(ext.paperframe.size.y);

    var ppfr_overlap_x = iinf(ext.extended.paperframe_overlap.x);
    var ppfr_overlap_y = iinf(ext.extended.paperframe_overlap.y);

    var inner_width = Math.max(0, work_width - 2 * ppfr_overlap_x);
    var inner_height = Math.max(0, work_height - 2 * ppfr_overlap_y);

    total_width = inner_width + 2 * ppfr_width;
    total_height = inner_height + 2 * ppfr_height;
  }


  var perimeter = 2 * (total_width + total_height);
  var area = total_width * total_height;

  var avg_width = iina(ext.extended.avg_size.x);
  var avg_height = iina(ext.extended.avg_size.y);

  var complexity_k = iinf(ext.extended.complexity_k);
  var complexity = 1 + (complexity_k - 1) * (1 - Math.min(1, 2 * (avg_width + avg_height) / perimeter));



  if (!ext.paperframe.__hidden) {
    var paperframe_price = iina(ext.paperframe.price);

    if (paperframe_price && (ppfr_width || ppfr_height)) {
      var paperframe_amount = total_width * total_height - inner_width * inner_height;
      var paperframe_total = paperframe_price * paperframe_amount / 10000; // cm2 to m2
      materials.__push
        (
        Math.randomByte(),
        'Паспарту',
        Math.ceil2z(paperframe_amount) + ' см<sup>2</sup>',
        Math.ceil2z(paperframe_total * complexity)
        );
    }
  }




  var frame_price = iina(ext.frame.price);
  var frame_size = iina(ext.frame.thickness);

  if (!ext.frame.__hidden && frame_price) {
    var frame_amount = perimeter + 8 * frame_size;
    var frame_total = frame_price * frame_amount / 100;
    materials.__push
      (
      Math.randomByte(),
      'Рама',
      Math.ceil2z(frame_amount) + ' см',
      Math.ceil2z(frame_total * complexity)
      );
  }

  if (!ext.do_glass.__hidden)
    materials.__push
      (
      Math.randomByte(),
      'Стекло',
      Math.ceil2z(area) + ' см<sup>2</sup>',
      Math.ceil2z(area * iina(ext.extended.glass_price) * complexity / 10000)
      );

  if (!ext.do_stretch.__hidden) {
    materials.__push
      (
      Math.randomByte(),
      'Подрамник',
      Math.ceil2z(perimeter) + ' см',
      Math.ceil2z(perimeter * iina(ext.extended.underframe_price) * complexity / 100)
      );
    materials.__push
      (
      Math.randomByte(),
      'Натяжка',
      '',
      Math.ceil2z(iina(ext.extended.stretch_price) * complexity)
      );
  }

  if (!ext.do_print.__hidden)
    materials.__push
      (
      Math.randomByte(),
      'Печать',
      Math.ceil2z(area) + ' см<sup>2</sup>',
      Math.ceil2z(area * iina(ext.do_print.price) / 10000)
      );

  materials.__push
    (
    Math.randomByte(),
    'Работа мастера',
    '',
    Math.ceil2z(iina(ext.extended.master_price) * complexity)
    );

}

function order_onchange() {
  var total = root.main.materials.__sumcol(4);
  var rate = 1 + iinf(root.main.price_rate) / 100;
  if (rate > 0) total *= rate;
  iout(root.main.price_total, Math.ceil2z(total));
}
*/