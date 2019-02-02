
export type VirtualNodeStyle = string | object;

export type VirtualNodeAttribute = string | number | boolean | VirtualNodeStyle;

export interface IVirtualNodeAttrs {
	[attr: string]: VirtualNodeAttribute;
}

export interface IVirtualNodeEvents {
	[event: string]: EventListenerObject;
}

export interface IVirtualNode {
	tag?: string;
	attrs?: IVirtualNodeAttrs;
	events?: any;
	children?: IVirtualNode[];
	value?: string;
	key?: string;

	dom?: Node;
}

export interface IVirtualTextNode extends IVirtualNode {
	value: string;
	tag: "#";
	dom: Text;
}

export interface IVirtualCommentNode extends IVirtualNode {
	value: string;
	tag: "!";
	dom: Comment;
}

export const NODE_TEXT = 0;
export const NODE_COMMENT = 1;
export const NODE_HTML = 2;
export const NODE_ELEMENT = 3;
export const NODE_FRAGMENT = 4;

export type VirtualNodeType = typeof NODE_TEXT
	| typeof NODE_COMMENT
	| typeof NODE_HTML
	| typeof NODE_ELEMENT
	| typeof NODE_FRAGMENT;

export const VirtualNodeKey = Symbol("virtualNode");

export class NodeUtils {

	public static mounted(node: IVirtualNode) {
		return !!node.dom;
	}

	public static isFragment(node: IVirtualNode) {
		return node.tag === undefined;
	}

	public static isTextNode(node: IVirtualNode) {
		return node.tag === "#";
	}

	public static isCommentNode(node: IVirtualNode) {
		return node.tag === "!";
	}

	public static isRawHTMLNode(node: IVirtualNode) {
		return node.tag === "<";
	}

	public static hasAttributes(node: IVirtualNode) {
		return !!node.attrs;
	}

	public static hasChildren(node: IVirtualNode) {
		return !!node.children;
	}

	public static getType(node: IVirtualNode): VirtualNodeType {
		switch (node.tag) {
			case "#": return NODE_TEXT;
			case "!": return NODE_COMMENT;
			case "<": return NODE_HTML;
			case undefined: return NODE_FRAGMENT;
			default: return NODE_ELEMENT;
		}
	}

	public static setDOMStyle(domNode: HTMLElement, style: VirtualNodeStyle) {
		let styleKey;

		switch (typeof style) {
			case "string": {
				domNode.setAttribute("style", style);
				break;
			}

			case "object": {
				for (styleKey in style) {
					domNode.style.setProperty(styleKey, (style as any)[styleKey]);
				}

				break;
			}
		}
	}

	public static setDOMAttribute(domNode: HTMLElement, attr: string, value: VirtualNodeAttribute) {
		if (!value) {
			return;
		}

		switch (attr) {
			case "id": {
				domNode.id = String(value);
				break;
			}

			case "class": {
				domNode.classList.value = String(value);
				break;
			}

			case "style": {
				NodeUtils.setDOMStyle(domNode, value as VirtualNodeStyle);
				break;
			}

			default: {
				domNode.setAttribute(attr, String(value));
				break;
			}
		}
	}

	public static connectWithDOM(node: IVirtualNode) {
		(node.dom as any)[VirtualNodeKey] = node;
	}

	public static swapDOMConnection(fromNode: IVirtualNode, toNode: IVirtualNode) {
		toNode.dom = fromNode.dom;
		fromNode.dom = undefined;

		NodeUtils.connectWithDOM(toNode);
	}

	public static disconnectWithDOM(domNode: Node) {
		(domNode as any)[VirtualNodeKey] = null;
	}

	public static getConnectedVirtualNode(domNode: Node) {
		return (domNode as any)[VirtualNodeKey];
	}

}
