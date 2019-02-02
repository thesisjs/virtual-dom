import {VirtualDOM} from "../src";
import {IVirtualNode} from "../src/VirtualNode";

function testVDomUpdate(firstNode: IVirtualNode, secondNode: IVirtualNode, expected: string) {
	const root = document.createElement("I");
	const vDom = new VirtualDOM();

	vDom.append(root, firstNode);
	vDom.update(firstNode, secondNode);

	expect(root.innerHTML).toBe(expected);
}

describe("update", () => {

	test("update same node", () => {
		const node = {tag: "div"};

		testVDomUpdate(
			node,
			node,
			"<div></div>",
		);
	});

	test("update text node", () => {
		testVDomUpdate(
			{tag: "#", value: "First"},
			{tag: "#", value: "Second"},
			"Second",
		);
	});

	test("update comment node", () => {
		testVDomUpdate(
			{tag: "!", value: "First"},
			{tag: "!", value: "Second"},
			"<!--Second-->",
		);
	});

	test("update attribute", () => {
		testVDomUpdate(
			{tag: "div", attrs: {"aria-disabled": false}},
			{tag: "div", attrs: {"aria-disabled": true}},
			'<div aria-disabled=""></div>',
		);
	});

	test("update id", () => {
		testVDomUpdate(
			{tag: "div", attrs: {id: "first"}},
			{tag: "div", attrs: {id: "second"}},
			'<div id="second"></div>',
		);
	});

	test("update class", () => {
		testVDomUpdate(
			{tag: "div", attrs: {class: "main hidden"}},
			{tag: "div", attrs: {class: "main visible"}},
			'<div class="main visible"></div>',
		);
	});

	test("update style as string", () => {
		testVDomUpdate(
			{tag: "div", attrs: {style: "color: black;"}},
			{tag: "div", attrs: {style: "opacity: 0;"}},
			'<div style="opacity: 0;"></div>',
		);
	});

	test("update style as object", () => {
		testVDomUpdate(
			{tag: "div", attrs: {style: {color: "black"}}},
			{tag: "div", attrs: {style: {opacity: "0"}}},
			'<div style="opacity: 0;"></div>',
		);
	});

	test("update style from string to object", () => {
		testVDomUpdate(
			{tag: "div", attrs: {style: "color: black;"}},
			{tag: "div", attrs: {style: {opacity: "0"}}},
			'<div style="opacity: 0;"></div>',
		);
	});

	test("update style from object to string", () => {
		testVDomUpdate(
			{tag: "div", attrs: {style: {color: "black"}}},
			{tag: "div", attrs: {style: "opacity: 0;"}},
			'<div style="opacity: 0;"></div>',
		);
	});

	test("update node with simple child", () => {
		testVDomUpdate(
			{tag: "div", children: [{tag: "strong"}]},
			{tag: "div", children: [{tag: "strong", attrs: {"data-id": 14}}]},
			'<div><strong data-id="14"></strong></div>',
		);
	});

	test("update node with multiple children", () => {
		testVDomUpdate(
			{
				tag: "div",
				children: [
					{tag: "span", attrs: {style: {color: "black"}}},
					{tag: "strong", children: [{tag: "#", value: "Hello!"}]},
				],
			},
			{
				tag: "div",
				children: [
					{tag: "span", attrs: {style: {color: "black"}}, children: [
						{tag: "#", value: "World"},
					]},
					{tag: "strong", children: [{tag: "!", value: "Hello!"}]},
				],
			},
			'<div><span style="color: black;">World</span><strong><!--Hello!--></strong></div>',
		);
	});

	test("update keyed node with multiple children", () => {
		testVDomUpdate(
			{
				tag: "div",
				key: "1",
				children: [
					{tag: "span", key: "2", attrs: {style: {color: "black"}}},
					{tag: "strong", key: "3", children: [{tag: "#", key: "4", value: "Hello!"}]},
				],
			},
			{
				tag: "div",
				key: "1",
				children: [
					{tag: "span", key: "2", attrs: {style: {color: "black"}}, children: [
							{tag: "#", key: "5", value: "World"},
						]},
					{tag: "strong", key: "3", children: [{tag: "!", key: "4", value: "Hello!"}]},
				],
			},
			'<div><span style="color: black;">World</span><strong><!--Hello!--></strong></div>',
		);
	});

	test("update fragment", () => {
		testVDomUpdate(
			{
				children: [
					{tag: "div", key: "1", attrs: {style: {color: "black"}}},
					{tag: "!", key: "2", value: " value goes next "},
					{tag: "#", key: "3", value: "Hello!"},
				],
			},
			{
				children: [
					{tag: "div", key: "1", attrs: {style: {opacity: "0"}}},
					{tag: "#", key: "3", value: "OwO"},
				],
			},
			'<div style="opacity: 0;"></div>OwO',
		);
	});

	test("update node with a fragment child", () => {
		testVDomUpdate(
			{
				tag: "div",
				children: [
					{tag: "b"},
					{
						children: [
							{tag: "div", attrs: {style: {color: "black"}}},
							{tag: "!", value: " value goes next "},
							{tag: "#", value: "Hello!"},
						],
					},
					{tag: "i"},
				],
			},
			{
				tag: "div",
				children: [
					{tag: "b"},
					{tag: "a"},
					{
						children: [
							{tag: "div", attrs: {style: {opacity: "0"}}},
							{tag: "#", value: "OwO"},
						],
					},
					{tag: "i"},
				],
			},
			'<div><b></b><a></a><div style="opacity: 0;"></div>OwO<i></i></div>',
		);
	});

	test("update node with a keyed fragment child", () => {
		testVDomUpdate(
			{
				tag: "div",
				key: "1",
				children: [
					{tag: "b", key: "2"},
					{
						key: "4",
						children: [
							{tag: "div", key: "5", attrs: {style: {color: "black"}}},
							{tag: "!", key: "6", value: " value goes next "},
							{tag: "#", key: "7", value: "Hello!"},
						],
					},
					{tag: "i", key: "8"},
				],
			},
			{
				tag: "div",
				key: "1",
				children: [
					{tag: "b", key: "2"},
					{tag: "a", key: "3"},
					{
						key: "4",
						children: [
							{tag: "div", key: "5", attrs: {style: {opacity: "0"}}},
							{tag: "#", key: "7", value: "OwO"},
						],
					},
					{tag: "i", key: "9"},
				],
			},
			'<div><b></b><a></a><div style="opacity: 0;"></div>OwO<i></i></div>',
		);
	});

	xtest("cito error test", () => {
		testVDomUpdate(
			{tag: "div", attrs: {}},
			{tag: "div", attrs: {id: "id1"}},
			'<div id="id1"></div>',
		);
	});

});
