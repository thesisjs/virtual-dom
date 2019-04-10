import {IVirtualNode, NodeUtils, IVirtualHTMLNode} from "./VirtualNode";
import {mountNode, updateNode} from "./Reconciler";

export class VirtualDOM {

	public append(domNode: Node, node: IVirtualNode, insertBefore?: Node): IVirtualNode {
		node = NodeUtils.normalizeNode(node);
		mountNode(node);

		if (NodeUtils.hasChildren(node)) {
			this.mountChildren(node);
		}

		if (insertBefore) {
			domNode.insertBefore(node.dom, insertBefore);
		} else {
			domNode.appendChild(node.dom);
		}

		return node;
	}

	public update(oldNode: IVirtualNode, node: IVirtualNode): IVirtualNode {
		if (oldNode === node) {
			return;
		}

		node = NodeUtils.normalizeNode(node);
		updateNode(oldNode, node);

		const oldChildren = NodeUtils.hasChildren(oldNode);
		const newChildren = NodeUtils.hasChildren(node);

		let oldChild;
		let child;
		let insertBefore;
		let dom;
		let i;
		let j;

		// Updating children
		if (oldChildren && newChildren) {
			for (i = 0, j = 0; i < oldNode.children.length; i++, j++) {
				oldChild = oldNode.children[i];
				child = node.children[j];

				// Getting the next child not from this fragment
				insertBefore = oldChild.dom;

				if (NodeUtils.isFragment(oldChild)) {
					insertBefore = oldChild.children[0] && oldChild.children[0].dom;
				} else if (NodeUtils.isRawHTMLNode(oldChild)) {
					const {trackingNodes} = oldChild as IVirtualHTMLNode;
					insertBefore = trackingNodes && trackingNodes[0];
				}

				dom = node.dom || insertBefore && insertBefore.parentNode;

				// Remove a node that no longer exists
				if (child === undefined) {
					this.remove(oldChild);
					continue;
				}

				// Destroy previous child and create new
				if (oldChild.tag !== child.tag) {
					node.children[j] = this.append(dom, child, insertBefore);
					// Stay here
					i--;
					continue;
				}

				// Update a child by key
				if (child.key !== undefined && oldChild.key === child.key) {
					this.update(oldChild, child);
					continue;
				}

				// Insert new child before the old one
				node.children[j] = this.append(dom, child, insertBefore);
				// Stay here
				i--;
			}

			// Appending new children at the end
			if (j < node.children.length) {
				if (insertBefore) {
					insertBefore = insertBefore.nextSibling;
				}

				dom = node.dom || insertBefore && insertBefore.parentNode;

				for (i = j; i < node.children.length; i++) {
					child = node.children[i];
					node.children[i] = this.append(dom, child, insertBefore);
				}
			}
		} else if (newChildren) {
			this.mountChildren(node);
		} else if (oldChildren) {
			for (i = 0; i < oldNode.children.length; i++) {
				this.remove(oldNode.children[i]);
			}
		}

		return node;
	}

	public remove(node: IVirtualNode) {
		const {dom} = node;
		NodeUtils.disconnectWithDOM(dom);

		// Remove children
		if (NodeUtils.hasChildren(node)) {
			for (let i = 0; i < node.children.length; i++) {
				this.remove(node.children[i]);
			}
		}

		// Remove raw HTML contents
		if (NodeUtils.isRawHTMLNode(node)) {
			const {trackingNodes} = node as IVirtualHTMLNode;
			let trackingNode;

			for (let i = 0; i < trackingNodes.length; i++) {
				trackingNode = trackingNodes[i];

				if (trackingNode.parentNode) {
					trackingNode.parentNode.removeChild(trackingNode);
				}
			}
		}

		// Remove self from parent container
		if (!NodeUtils.isFragment(node) && dom && dom.parentNode) {
			dom.parentNode.removeChild(dom);
		}
	}

	private mountChildren(node: IVirtualNode) {
		const fragment = document.createDocumentFragment();

		for (let i = 0; i < node.children.length; i++) {
			node.children[i] = this.append(fragment, node.children[i]);
		}

		node.dom.appendChild(fragment);
	}

}
