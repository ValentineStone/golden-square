'use strict';


import {ajax} from './Ajax.js';



class MFrame extends HTMLElement
{
	static get observedAttributes() {return ['url']; }

	constructor()
	//Called when the element is created or upgraded
	{
		 // Always call super first in constructor
    	super();
    	this.root = this.attachShadow({mode: 'closed'});
		console.log('constructor()');
	}

	connectedCallback()
	//Called when the element is inserted into a document, including into a shadow tree
	{
		console.log('connectedCallback()');
	}

	disconnectedCallback()
	//Called when the element is removed from a document
	{
		console.log('disconnectedCallback()');
	}

	attributeChangedCallback(attributeName, oldValue, newValue, namespace)
	//Called when an attribute is changed, appended, removed, or replaced on the element. Only called for observed attributes.
	{
		console.log('attributeChangedCallback(attributeName, oldValue, newValue, namespace)',attributeName, oldValue, newValue, namespace);
		if (attributeName === 'url')
			ajax(newValue)
				.then
				(
					(xhttp) =>
					{
						if (xhttp.status < 200 || xhttp.status >= 300)
						{
							this.style.whiteSpace = 'pre';
							this.style.color = 'red';
							this.root.textContent = `Unsuccessful/unsafe HTTP status: ${xhttp.status}`;
							return;
						}

						var [type, subtype] = xhttp.getResponseHeader('content-type').split(';')[0].split('/');

						console.log(type, subtype);

						switch (type)
						{
							case 'text':
								if (subtype === 'html')
								{
									this.style.whiteSpace = 'normal';
									this.style.color = 'initial';
									this.root.innerHTML = xhttp.responseText;
								}
								else
								{
									this.style.whiteSpace = 'pre';
									this.style.color = 'initial';
									this.root.textContent = xhttp.responseText;
								}
								break;
							case 'application':
								if (['javascript','json','xml'].includes(subtype))
								{
									this.style.whiteSpace = 'pre';
									this.style.color = 'blue';
									this.root.textContent = xhttp.responseText;
									break;
								}
							default:
							{
								this.style.whiteSpace = 'pre';
								this.style.color = 'red';
								this.root.textContent = `Unknown/unsafe MIME type: ${type}/${subtype}`;
							}
						}
					}
				)
				.catch((error) => {this.root.textContent = ''; /*throw error;*/});
	}

	adoptedCallback(oldDocument, newDocument)
	//Called when the element is adopted into a new document
	{
		console.log('adoptedCallback(oldDocument, newDocument)', oldDocument, newDocument);
	}

}


customElements.define('m-frame', MFrame);