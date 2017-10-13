'use strict';


import {ajax} from './Ajax.js';




var parser = new DOMParser();
var documentCache = {};



class ShadowDoc extends HTMLElement
{
	static get observedAttributes() {return ['src']; }

	constructor()
	//Called when the element is created or upgraded
	{
		 // Always call super first in constructor
    	super();
    	this.root = this.attachShadow({mode: 'closed'});
		this.root.appendChild(document.createElement('slot'));
		this.cacheKey = Symbol();
		documentCache[this.cacheKey] = {};
	}

	get src() {return this.getAttribute('src');}
	set src(_src) {return this.setAttribute('src', _src);}

	connectedCallback()
	//Called when the element is inserted into a document, including into a shadow tree
	{
	}

	disconnectedCallback()
	//Called when the element is removed from a document
	{
	}

	attributeChangedCallback(attributeName, oldValue, newValue, namespace)
	//Called when an attribute is changed, appended, removed, or replaced on the element. Only called for observed attributes.
	{
		if (attributeName === 'src')
		{
			this.root.innerHTML = '';

			if (newValue in documentCache[this.cacheKey])
			{
				for (let node of documentCache[this.cacheKey][newValue].nodes)
					this.root.appendChild(node);
				return;
			}

			ajax(newValue)
			.then
			((xhttp) => {
				var doc = parser.parseFromString(xhttp.response, "text/html");
				if (xhttp.status >= 200 && xhttp.status < 300) {

					let cacheRecord = documentCache[this.cacheKey][newValue] = {nodes:[]};

					console.log(doc);

					for (let element of doc.head.childNodes)
					{
						let newNode = document.importNode(element, true);
						cacheRecord.nodes.push(newNode);
						this.root.appendChild(newNode);
					}
					for (let element of doc.body.childNodes)
					{
						let newNode = document.importNode(element, true);
						cacheRecord.nodes.push(newNode);
						this.root.appendChild(newNode);
					}
				} else {
					this.root.appendChild(document.createElement('slot'));
				}
			})
			.catch(() => this.root.appendChild(document.createElement('slot')));
		}
	}

	adoptedCallback(oldDocument, newDocument)
	//Called when the element is adopted into a new document
	{
	}
}


customElements.define('shadow-doc', ShadowDoc);