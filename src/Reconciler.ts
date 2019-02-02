import {
	IVirtualNode,
	NodeUtils,
	NODE_TEXT,
	NODE_COMMENT,
	NODE_HTML,
	NODE_ELEMENT,
	NODE_FRAGMENT,
	IVirtualTextNode,
	IVirtualCommentNode,
	IVirtualHTMLNode,
} from "./VirtualNode";

function mountTextNode(node: IVirtualTextNode) {
	node.dom = document.createTextNode(node.value);
	NodeUtils.connectWithDOM(node);
}

function mountCommentNode(node: IVirtualCommentNode) {
	node.dom = document.createComment(node.value);
	NodeUtils.connectWithDOM(node);
}

function mountHTMLNode(node: IVirtualHTMLNode) {
	node.dom = document.createDocumentFragment();
	const helper = document.createElement("P");
	node.dom.appendChild(helper);

	helper.insertAdjacentHTML("beforebegin", node.value);
	node.dom.removeChild(helper);

	// Save nodes for updating later
	node.trackingNodes = [];
	for (let i = 0; i < node.dom.childNodes.length; i++) {
		node.trackingNodes.push(node.dom.childNodes[i]);
	}
}

function mountFragmentNode(node: IVirtualNode) {
	node.dom = document.createDocumentFragment();
}

function mountElementNode(node: IVirtualNode) {
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

function updateTextNode(oldNode: IVirtualTextNode, node: IVirtualTextNode) {
	NodeUtils.swapDOMConnection(oldNode, node);
	node.dom.data = node.value;
}

function updateCommentNode(oldNode: IVirtualCommentNode, node: IVirtualCommentNode) {
	NodeUtils.swapDOMConnection(oldNode, node);
	node.dom.data = node.value;
}

function updateHTMLNode(oldNode: IVirtualHTMLNode, node: IVirtualHTMLNode) {
	if (oldNode.value === node.value) {
		return;
	}

	// Remove all tracked nodes
	if (oldNode.trackingNodes) {
		let trackingNode;

		for (let i = 0; i < oldNode.trackingNodes.length; i++) {
			trackingNode = oldNode.trackingNodes[i];

			if (trackingNode.parentNode) {
				trackingNode.parentNode.removeChild(trackingNode);
			}
		}
	}

	NodeUtils.disconnectWithDOM(oldNode.dom);
	oldNode.dom = undefined;

	mountHTMLNode(node);
}

// Assuming oldNode.tag === node.tag
function updateElementNode(oldNode: IVirtualNode, node: IVirtualNode) {
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

			if (attr === "style") {
				if (
					typeofValue === "object" &&
					typeofOldValue === "string"
				) {
					// Clear styles if we update from string to object
					dom.removeAttribute("style");
				} else if (
					typeofValue === "object" &&
					typeofOldValue === "object"
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

			if (!oldNode.attrs[attr]) {
				NodeUtils.setDOMAttribute(dom, attr, value);
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

export function mountNode(node: IVirtualNode) {
	switch (NodeUtils.getType(node)) {
		case NODE_TEXT: return mountTextNode(node as IVirtualTextNode);
		case NODE_COMMENT: return mountCommentNode(node as IVirtualCommentNode);
		case NODE_HTML: return mountHTMLNode(node as IVirtualHTMLNode);
		case NODE_FRAGMENT: return mountFragmentNode(node);
		case NODE_ELEMENT: return mountElementNode(node);
	}
}

export function updateNode(oldNode: IVirtualNode, node: IVirtualNode) {
	switch (NodeUtils.getType(node)) {
		case NODE_TEXT: return updateTextNode(oldNode as IVirtualTextNode, node as IVirtualTextNode);
		case NODE_COMMENT: return updateCommentNode(oldNode as IVirtualCommentNode, node as IVirtualCommentNode);
		case NODE_HTML: return updateHTMLNode(oldNode as IVirtualHTMLNode, node as IVirtualHTMLNode);
		case NODE_ELEMENT: return updateElementNode(oldNode, node);
	}
}
