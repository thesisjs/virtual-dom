import {IVirtualNode, NodeUtils} from "./VirtualNode";
import {mountNode, updateNode} from "./Reconciler";

export class VirtualDOM {

	public append(domNode: Node, node: IVirtualNode, insertBefore?: Node) {
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

	public update(oldNode: IVirtualNode, node: IVirtualNode) {
		if (oldNode === node) {
			return;
		}

		updateNode(oldNode, node);

		const oldChildren = NodeUtils.hasChildren(oldNode);
		const newChildren = NodeUtils.hasChildren(node);

		let oldChild;
		let child;
		let nextChild;
		let dom;
		let i;
		let j;

		// Updating children
		if (oldChildren && newChildren) {
			for (i = 0, j = 0; i < oldNode.children.length; i++, j++) {
				oldChild = oldNode.children[i];
				child = node.children[j];

				// Getting the next child not from this fragment
				nextChild = oldChild.dom;
				if (NodeUtils.isFragment(oldChild)) {
					nextChild = oldChild.children[0] && oldChild.children[0].dom;
				}

				dom = node.dom || nextChild && nextChild.parentNode;

				// Remove a node that no longer exists
				if (!child) {
					this.remove(oldChild);
					continue;
				}

				// Destroy previous child and create new
				if (oldChild.tag !== child.tag) {
					this.append(dom, child, nextChild);
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
				this.append(dom, child, nextChild);
				// Stay here
				i--;
			}
		} else if (newChildren) {
			this.mountChildren(node);
		}
	}

	public remove(node: IVirtualNode) {
		const {dom} = node;
		NodeUtils.disconnectWithDOM(dom);

		if (NodeUtils.hasChildren(node)) {
			for (let i = 0; i < node.children.length; i++) {
				this.remove(node.children[i]);
			}
		}

		if (!NodeUtils.isFragment(node) && dom && dom.parentNode) {
			dom.parentNode.removeChild(dom);
		}
	}

	private mountChildren(node: IVirtualNode) {
		const fragment = document.createDocumentFragment();

		for (let i = 0; i < node.children.length; i++) {
			this.append(fragment, node.children[i]);
		}

		node.dom.appendChild(fragment);
	}

}
