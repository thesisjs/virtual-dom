
type VirtualNodeStyle = string | Partial<CSSStyleDeclaration>;

type VirtualNodeAttribute = string | number | boolean | VirtualNodeStyle;

interface VirtualNodeAttrs {
	[attr: string]: VirtualNodeAttribute;
}

interface VirtualNodeEvents {
	[event: string]: EventListenerObject;
}

interface VirtualNode {
	tag?: string;
	attrs?: VirtualNodeAttrs;
	events?: any;
	children?: VirtualNode[];
	value?: string;
	key?: string;

	dom?: Node;
}

interface VirtualTextNode extends VirtualNode {
	value: string;
	tag: '#';
	dom: Text;
}

interface VirtualCommentNode extends VirtualNode {
	value: string;
	tag: '!';
	dom: Comment;
}


const NODE_TEXT = 0;
const NODE_COMMENT = 1;
const NODE_HTML = 2;
const NODE_ELEMENT = 3;
const NODE_FRAGMENT = 4;

type VirtualNodeType = typeof NODE_TEXT
	| typeof NODE_COMMENT
	| typeof NODE_HTML
	| typeof NODE_ELEMENT
	| typeof NODE_FRAGMENT;

const VirtualNodeKey = Symbol('virtualNode');


class NodeUtils {

	static mounted(node: VirtualNode) {
		return !!node.dom;
	}

	static isFragment(node: VirtualNode) {
		return node.tag === undefined;
	}

	static isTextNode(node: VirtualNode) {
		return node.tag === '#';
	}

	static isCommentNode(node: VirtualNode) {
		return node.tag === '!';
	}

	static isRawHTMLNode(node: VirtualNode) {
		return node.tag === '<';
	}

	static hasAttributes(node: VirtualNode) {
		return !!node.attrs;
	}

	static hasChildren(node: VirtualNode) {
		return !!node.children;
	}

	static getType(node: VirtualNode): VirtualNodeType {
		switch (node.tag) {
			case '#': return NODE_TEXT;
			case '!': return NODE_COMMENT;
			case '<': return NODE_HTML;
			case undefined: return NODE_FRAGMENT;
			default: return NODE_ELEMENT;
		}
	}

	static setDOMStyle(domNode: HTMLElement, style: VirtualNodeStyle) {
		let styleKey;

		switch (typeof style) {
			case 'string': {
				domNode.setAttribute('style', style);
				break;
			}

			case 'object': {
				for (styleKey in style) {
					domNode.style.setProperty(styleKey, style[styleKey]);
				}

				break;
			}
		}
	}

	static setDOMAttribute(domNode: HTMLElement, attr: string, value: VirtualNodeAttribute) {
		if (!value) {
			return;
		}

		switch (attr) {
			case 'id': {
				domNode.id = String(value);
				break;
			}

			case 'class': {
				domNode.classList.value = String(value);
				break;
			}

			case 'style': {
				NodeUtils.setDOMStyle(domNode, value as VirtualNodeStyle);
				break;
			}

			default: {
				domNode.setAttribute(attr, String(value));
				break;
			}
		}
	}

	static connectWithDOM(node: VirtualNode) {
		(node.dom as any)[VirtualNodeKey] = node;
	}

	static swapDOMConnection(fromNode: VirtualNode, toNode: VirtualNode) {
		toNode.dom = fromNode.dom;
		fromNode.dom = undefined;

		NodeUtils.connectWithDOM(toNode);
	}

	static disconnectWithDOM(domNode: Node) {
		(domNode as any)[VirtualNodeKey] = null;
	}

	static getConnectedVirtualNode(domNode: Node) {
		return (domNode as any)[VirtualNodeKey]
	}

}


function mountTextNode(node: VirtualTextNode) {
	node.dom = document.createTextNode(node.value);
	NodeUtils.connectWithDOM(node);
}

function mountCommentNode(node: VirtualCommentNode) {
	node.dom = document.createComment(node.value);
	NodeUtils.connectWithDOM(node);
}

function mountFragmentNode(node: VirtualNode) {
	node.dom = document.createDocumentFragment();
}


function mountElementNode(node: VirtualNode) {
	const dom = document.createElement(node.tag);

	if (NodeUtils.hasAttributes(node)) {
		let attr;
		let value;

		for (attr in node.attrs) {
			value = node.attrs[attr];
			NodeUtils.setDOMAttribute(dom, attr, value);
		}
	}

	node.dom = dom;
	NodeUtils.connectWithDOM(node);
}


function mountNode(node: VirtualNode) {
	switch (NodeUtils.getType(node)) {
		case NODE_TEXT: return mountTextNode(node as VirtualTextNode);
		case NODE_COMMENT: return mountCommentNode(node as VirtualCommentNode);
		case NODE_FRAGMENT: return mountFragmentNode(node);
		case NODE_ELEMENT: return mountElementNode(node);
	}
}

function updateTextNode(oldNode: VirtualTextNode, node: VirtualTextNode) {
	NodeUtils.swapDOMConnection(oldNode, node);
	node.dom.data = node.value;
}

function updateCommentNode(oldNode: VirtualCommentNode, node: VirtualCommentNode) {
	NodeUtils.swapDOMConnection(oldNode, node);
	node.dom.data = node.value;
}

// Assuming oldNode.tag === node.tag
function updateElementNode(oldNode: VirtualNode, node: VirtualNode) {
	NodeUtils.swapDOMConnection(oldNode, node);

	const dom = node.dom as HTMLElement;
	const prevAttrs = NodeUtils.hasAttributes(oldNode);
	const nextAttrs = NodeUtils.hasAttributes(node);

	let attr;
	let value;
	let oldValue;
	let typeofValue;
	let typeofOldValue;
	let styleAttr;

	if (prevAttrs && nextAttrs) {
		// Delete old and set new attributes

		// Delete unused attributes, update used values
		for (attr in oldNode.attrs) {
			value = node.attrs[attr];
			oldValue = oldNode.attrs[attr];
			typeofValue = typeof value;
			typeofOldValue = typeof oldNode.attrs[attr];

			if (oldValue && !value) {
				dom.removeAttribute(attr);
				continue;
			}

			if (attr === 'style') {
				if (
					typeofValue === 'object' &&
					typeofOldValue === 'string'
				) {
					// Clear styles if we update from string to object
					dom.removeAttribute('style');
				} else if (
					typeofValue === 'object' &&
					typeofOldValue === 'object'
				) {
					// Clear styles if we update between objects
					for (styleAttr in oldValue as object) {
						if ((value as any)[styleAttr] === undefined) {
							dom.style.removeProperty(styleAttr);
						}
					}
				}
			}

			NodeUtils.setDOMAttribute(dom, attr, value);
		}

		// Add new attributes
		for (attr in node.attrs) {
			value = node.attrs[attr];

			if (!oldNode.attrs) {
				dom.setAttribute(attr, String(value));
			}
		}

	} else if (prevAttrs) {
		// Delete old attributes

		for (attr in oldNode.attrs) {
			dom.removeAttribute(attr);
		}
	} else if (nextAttrs) {
		// Set new attributes

		for (attr in node.attrs) {
			value = node.attrs[attr];
			NodeUtils.setDOMAttribute(dom, attr, value);
		}
	}
}

function updateNode(oldNode: VirtualNode, node: VirtualNode) {
	switch (NodeUtils.getType(node)) {
		case NODE_TEXT: return updateTextNode(oldNode as VirtualTextNode, node as VirtualTextNode);
		case NODE_COMMENT: return updateCommentNode(oldNode as VirtualCommentNode, node as VirtualCommentNode);
		// case NODE_FRAGMENT: return mountFragmentNode(node);
		case NODE_ELEMENT: return updateElementNode(oldNode, node);
	}
}


class VDom {

	private mountChildren(node: VirtualNode) {
		const fragment = document.createDocumentFragment();

		for (let i = 0; i < node.children.length; i++) {
			this.append(fragment, node.children[i]);
		}

		node.dom.appendChild(fragment);
	}

	public append(domNode: Node, node: VirtualNode, insertBefore?: Node) {
		mountNode(node);

		if (NodeUtils.hasChildren(node)) {
			this.mountChildren(node);
		}

		if (insertBefore) {
			domNode.insertBefore(node.dom, insertBefore);
		} else {
			domNode.appendChild(node.dom);
		}
	}

	public update(oldNode: VirtualNode, node: VirtualNode) {
		if (oldNode === node) {
			return;
		}

		updateNode(oldNode, node);

		const oldChildren = NodeUtils.hasChildren(oldNode);
		const newChildren = NodeUtils.hasChildren(node);

		let oldChild;
		let child;

		// Updating children
		if (oldChildren && newChildren) {
			for (let i = 0; i < oldNode.children.length; i++) {
				oldChild = oldNode.children[i];
				child = node.children[i];

				// Remove a node that no longer exists
				if (!child) {
					this.remove(oldChild);
					continue;
				}

				// Destroy previous child and create new
				if (oldChild.tag !== child.tag) {
					this.append(node.dom, child, oldChild.dom);
					this.remove(oldChild);
					continue;
				}

				// Update a child by key
				if (oldChild.key === child.key) {
					this.update(oldChild, child);
					continue;
				}

				// Insert new child before the old one
				this.append(node.dom, child, oldChild.dom);
				// Stay here
				i--;
			}
		} else if (newChildren) {
			this.mountChildren(node);
		}
	}

	public remove(node: VirtualNode) {
		const {dom} = node;
		NodeUtils.disconnectWithDOM(dom);
		dom.parentNode.removeChild(dom);
	}

}


function testVDomAppend(node: VirtualNode, expected: string) {
	const root = document.createElement('I');
	const vDom = new VDom();

	vDom.append(root, node);

	expect(root.innerHTML).toBe(expected);
}

function testVDomUpdate(firstNode: VirtualNode, secondNode: VirtualNode, expected: string) {
	const root = document.createElement('I');
	const vDom = new VDom();

	vDom.append(root, firstNode);
	vDom.update(firstNode, secondNode);

	expect(root.innerHTML).toBe(expected);
}


describe('update', () => {

	test('update same node', () => {
		const node = {tag: 'div'};

		testVDomUpdate(
			node,
			node,
			'<div></div>',
		);
	});

	test('update text node', () => {
		testVDomUpdate(
			{tag: '#', value: 'First'},
			{tag: '#', value: 'Second'},
			'Second',
		);
	});

	test('update comment node', () => {
		testVDomUpdate(
			{tag: '!', value: 'First'},
			{tag: '!', value: 'Second'},
			'<!--Second-->',
		);
	});

	test('update attribute', () => {
		testVDomUpdate(
			{tag: 'div', attrs: {'aria-disabled': false}},
			{tag: 'div', attrs: {'aria-disabled': true}},
			'<div aria-disabled="true"></div>',
		);
	});

	test('update id', () => {
		testVDomUpdate(
			{tag: 'div', attrs: {id: 'first'}},
			{tag: 'div', attrs: {id: 'second'}},
			'<div id="second"></div>',
		);
	});

	test('update class', () => {
		testVDomUpdate(
			{tag: 'div', attrs: {class: 'main hidden'}},
			{tag: 'div', attrs: {class: 'main visible'}},
			'<div class="main visible"></div>',
		);
	});

	test('update style as string', () => {
		testVDomUpdate(
			{tag: 'div', attrs: {style: 'color: black;'}},
			{tag: 'div', attrs: {style: 'opacity: 0;'}},
			'<div style="opacity: 0;"></div>',
		);
	});

	test('update style as object', () => {
		testVDomUpdate(
			{tag: 'div', attrs: {style: {color: 'black'}}},
			{tag: 'div', attrs: {style: {opacity: '0'}}},
			'<div style="opacity: 0;"></div>',
		);
	});

	test('update style from string to object', () => {
		testVDomUpdate(
			{tag: 'div', attrs: {style: 'color: black;'}},
			{tag: 'div', attrs: {style: {opacity: '0'}}},
			'<div style="opacity: 0;"></div>',
		);
	});

	test('update style from object to string', () => {
		testVDomUpdate(
			{tag: 'div', attrs: {style: {color: 'black'}}},
			{tag: 'div', attrs: {style: 'opacity: 0;'}},
			'<div style="opacity: 0;"></div>',
		);
	});

	test('update node with simple child', () => {
		testVDomUpdate(
			{
				tag: 'div',
				children: [
					{
						tag: 'strong'
					}
				]
			},
			{
				tag: 'div',
				children: [
					{
						tag: 'strong',
						attrs: {
							'data-id': 14
						}
					}
				]
			},
			'<div><strong data-id="14"></strong></div>',
		);
	});

	test('update node with multiple children', () => {
		testVDomUpdate(
			{
				tag: 'div',
				children: [
					{
						tag: 'span',
						attrs: {
							style: {
								color: 'black'
							}
						}
					},
					{
						tag: 'strong',
						children: [
							{
								tag: '#',
								value: 'Hello!'
							}
						]
					}
				]
			},
			{
				tag: 'div',
				children: [
					{
						tag: 'span',
						attrs: {
							style: {
								color: 'black'
							}
						},
						children: [
							{
								tag: '#',
								value: 'World'
							}
						]
					},
					{
						tag: 'strong',
						children: [
							{
								tag: '!',
								value: 'Hello!'
							}
						]
					}
				]
			},
			'<div><span style="color: black;">World</span><strong><!--Hello!--></strong></div>',
		);
	});

});

describe('append', () => {

	test('append simple node', () => {
		testVDomAppend(
			{
				tag: 'div',
			},
			'<div></div>',
		);
	});

	test('append text node', () => {
		testVDomAppend(
			{
				tag: '#',
				value: 'Hello!'
			},
			'Hello!',
		);
	});

	test('append comment node', () => {
		testVDomAppend(
			{
				tag: '!',
				value: 'Hello!'
			},
			'<!--Hello!-->',
		);
	});

	test('append node with simple attribute', () => {
		testVDomAppend(
			{
				tag: 'div',
				attrs: {
					contenteditable: true
				}
			},
			'<div contenteditable="true"></div>',
		);
	});

	test('append node with id', () => {
		testVDomAppend(
			{
				tag: 'div',
				attrs: {
					id: 'main'
				}
			},
			'<div id="main"></div>',
		);
	});

	test('append node with class', () => {
		testVDomAppend(
			{
				tag: 'div',
				attrs: {
					class: "main main-content"
				}
			},
			'<div class="main main-content"></div>',
		);
	});

	test('append node with style string', () => {
		testVDomAppend(
			{
				tag: 'div',
				attrs: {
					style: 'min-height: 40px; transition: all 2s;'
				}
			},
			'<div style="min-height: 40px; transition: all 2s;"></div>',
		);
	});

	test('append node with style object', () => {
		testVDomAppend(
			{
				tag: 'div',
				attrs: {
					style: {
						minHeight: '40px',
						border: '0 none'
					}
				}
			},
			'<div style="min-height: 40px; border: 0px none;"></div>',
		);
	});

	test('append node with simple child', () => {
		testVDomAppend(
			{
				tag: 'div',
				children: [
					{
						tag: 'strong'
					}
				]
			},
			'<div><strong></strong></div>',
		);
	});

	test('append node with multiple children', () => {
		testVDomAppend(
			{
				tag: 'div',
				children: [
					{
						tag: 'span',
						attrs: {
							style: {
								color: 'black'
							}
						}
					},
					{
						tag: 'strong',
						children: [
							{
								tag: '#',
								value: 'Hello!'
							}
						]
					}
				]
			},
			'<div><span style="color: black;"></span><strong>Hello!</strong></div>',
		);
	});

	test('append fragment node', () => {
		testVDomAppend(
			{
				children: [
					{
						tag: 'div',
						attrs: {
							style: {
								color: 'black'
							}
						}
					},
					{
						tag: '!',
						value: ' value goes next '
					},
					{
						tag: '#',
						value: 'Hello!'
					}
				]
			},
			'<div style="color: black;"></div><!-- value goes next -->Hello!',
		);
	});


});
