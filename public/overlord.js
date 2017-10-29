'use strict';

let modelPack = { default: 'en-US', 'en-US': {} };

let renderModelQueue = new Set();
let afterLoadRenderPeding = false;
let awaitingModelLoad = true;

function getModelJSON(modelPack, modelName, lang) {
  return (modelPack[lang] || modelPack[modelPack.default])[modelName] || {};
}

function getModelXML(modelPack, modelName, lang) {
  let defaultLang = modelPack.querySelector('default').textContent;
  let defaultLangModel = modelPack.querySelector(defaultLang);
  let langModel = modelPack.querySelector(lang) || defaultLangModel;
  let model = langModel.querySelector(modelName) || defaultLangModel.querySelector(modelName);

  return model;
}

function renderModelJSON() {

  console.debug('renderModelJSON();');
  if (awaitingModelLoad) {
    console.debug('LOADING, WILL RENDER ONCE LOADED');
    afterLoadRenderPeding = true;
    return;
  }

  let renderModelBuffer = renderModelQueue;
  renderModelQueue = new Set();
  console.debug('RENDERING MODELS', renderModelBuffer);
  for (let element of renderModelBuffer)
    Object.assign(element, getModelJSON(modelPack, element.dataset.model, element.lang || document.documentElement.lang));
  console.debug('DONE RENDERING');
}

function renderModelXML() {
  
    console.debug('renderModelXML();');
    if (awaitingModelLoad) {
      console.debug('LOADING, WILL RENDER ONCE LOADED');
      afterLoadRenderPeding = true;
      return;
    }
  
    let renderModelBuffer = renderModelQueue;
    renderModelQueue = new Set();
    console.debug('RENDERING MODELS', renderModelBuffer);
    for (let element of renderModelBuffer) {
      let model = getModelXML(modelPack, element.dataset.model, element.lang || document.documentElement.lang);
      if (model) {
        for (let attribute of model.attributes)
          element.setAttribute(attribute.name, attribute.value);
        if (model.textContent)
          element.textContent = model.textContent;
      }
    }
    console.debug('DONE RENDERING');
  }

function reRenderModelJSON() {
  document.querySelectorAll('[data-model]')
    .forEach(element => renderModelQueue.add(element));
  renderModelJSON();
}

function reRenderModelXML() {
  document.querySelectorAll('[data-model]')
    .forEach(element => renderModelQueue.add(element));
  renderModelXML();
}

function loadModelJSON(url) {
  awaitingModelLoad = true;
  fetch(url)
    .then(response => response.json())
    .then(json => {
      modelPack = json;
      console.debug('LOADED LANGPACK');
      awaitingModelLoad = false;
      if (afterLoadRenderPeding)
        renderModelJSON();
      afterLoadRenderPeding = false;
    });
}

function loadModelXML(url) {
  awaitingModelLoad = true;
  fetch(url)
    .then(response => response.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(xml => {
      modelPack = xml;
      console.log(xml);
      console.debug('LOADED LANGPACK');
      awaitingModelLoad = false;
      if (afterLoadRenderPeding)
        renderModelXML();
      afterLoadRenderPeding = false;
    });
}

loadModelXML('/lang/pack.xml');
//loadModelJSON('/lang/pack.json');
window.addEventListener('load', () => {
  console.debug('LOADED WINDOW');
  renderModelXML();
});




// create an observer instance
let childrenObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      console.log('adding', node);
      if (node instanceof HTMLElement && node.dataset.model) {
        renderModelQueue.add(node);
      }
    });
  });
  if (renderModelQueue.size)
    renderModelXML();
});

// pass in the target node, as well as the observer options
childrenObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});


let langAttributeObserver = new MutationObserver(reRenderModelXML);

// pass in the target node, as well as the observer options
langAttributeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['lang']
});