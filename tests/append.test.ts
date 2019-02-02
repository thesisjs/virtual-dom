import {VirtualDOM} from "../src";
import {IVirtualNode} from "../src/VirtualNode";

function testVDomAppend(node: IVirtualNode, expected: string) {
	const root = document.createElement("I");
	const vDom = new VirtualDOM();

	vDom.append(root, node);

	expect(root.innerHTML).toBe(expected);
}

describe("append", () => {

	test("append simple node", () => {
		testVDomAppend(
			{tag: "div"},
			"<div></div>",
		);
	});

	test("append text node", () => {
		testVDomAppend(
			{tag: "#", value: "Hello!"},
			"Hello!",
		);
	});

	test("append comment node", () => {
		testVDomAppend(
			{tag: "!", value: "Hello!"},
			"<!--Hello!-->",
		);
	});

	test("append node with simple attribute", () => {
		testVDomAppend(
			{tag: "div", attrs: {contenteditable: true}},
			'<div contenteditable=""></div>',
		);
	});

	test("append node with id", () => {
		testVDomAppend(
			{tag: "div", attrs: {id: "main"}},
			'<div id="main"></div>',
		);
	});

	test("append node with class", () => {
		testVDomAppend(
			{tag: "div", attrs: {class: "main main-content"}},
			'<div class="main main-content"></div>',
		);
	});

	test("append node with style string", () => {
		testVDomAppend(
			{tag: "div", attrs: {style: "min-height: 40px; transition: all 2s;"}},
			'<div style="min-height: 40px; transition: all 2s;"></div>',
		);
	});

	test("append node with style object", () => {
		testVDomAppend(
			{tag: "div", attrs: {style: {"min-height": "40px", "border": "0 none"}}},
			'<div style="min-height: 40px; border: 0px none;"></div>',
		);
	});

	test("append node with simple child", () => {
		testVDomAppend(
			{tag: "div", children: [{tag: "strong"}]},
			"<div><strong></strong></div>",
		);
	});

	test("append node with multiple children", () => {
		testVDomAppend(
			{
				tag: "div",
				children: [
					{tag: "span", attrs: {style: {color: "black"}}},
					{tag: "strong", children: [{tag: "#", value: "Hello!"}]},
				],
			},
			'<div><span style="color: black;"></span><strong>Hello!</strong></div>',
		);
	});

	test("append fragment node", () => {
		testVDomAppend(
			{
				children: [
					{tag: "div", attrs: {style: {color: "black"}}},
					{tag: "!", value: " value goes next "},
					{tag: "#", value: "Hello!"},
				],
			},
			'<div style="color: black;"></div><!-- value goes next -->Hello!',
		);
	});

});
