import {VirtualDOM} from "../src";

describe("cito", () => {

	const virtualDOM = new VirtualDOM();

	const suites = {
		"attrs div": [
			{
				name: "none",
				node: {tag: "div"},
				html: "<div></div>",
			},
			{
				name: "null",
				node: {tag: "div", attrs: null},
				html: "<div></div>",
			},
			{
				name: "empty",
				node: {tag: "div", attrs: {}},
				html: "<div></div>",
			},
			{
				name: "id 1",
				node: {tag: "div", attrs: {id: "id1"}},
				html: '<div id="id1"></div>',
			},
			{
				name: "id 2",
				node: {tag: "div", attrs: {id: "id2"}},
				html: '<div id="id2"></div>',
			},
			{
				name: "id and class",
				node: {tag: "div", attrs: {id: "id1", class: "class1"}},
				html: '<div id="id1" class="class1"></div>',
			},
			{
				name: "id and class",
				node: {tag: "div", attrs: {id: "id1", class: "class1"}},
				html: '<div id="id1" class="class1"></div>',
			},
			{
				name: "title",
				node: {tag: "div", attrs: {title: "title1"}},
				html: '<div title="title1"></div>',
			},
			{
				name: "data-attr",
				node: {tag: "div", attrs: {"data-attr": "attr1"}},
				html: '<div data-attr="attr1"></div>',
			},
		],
			"attrs input": [
			{
				name: "empty",
				node: {tag: "input"},
				html: "<input>",
			},
			{
				name: "required false",
				node: {tag: "input", attrs: {required: false}},
				html: "<input>",
			},
			{
				name: "required true",
				node: {tag: "input", attrs: {required: true}},
				html: '<input required="">',
			},
		],
			"general": [
			{
				name: "children none",
				node: {tag: "div"},
				html: "<div></div>",
			},
			{
				name: "children empty",
				node: {tag: "div", children: []},
				html: "<div></div>",
			},
			{
				name: "text",
				node: {tag: "div", children: "text"},
				html: "<div>text</div>",
			},
			{
				name: "text array",
				node: {tag: "div", children: ["text"]},
				html: "<div>text</div>",
			},
			{
				name: "two ul",
				node: {
					tag: "div", children: [
						{tag: "ul", children: [{tag: "li", children: ["t0"]}]},
						{tag: "ul", children: [{tag: "li", children: ["t1"]}, {tag: "li", children: ["t2"]}]},
					],
				},
				html: "<div><ul><li>t0</li></ul><ul><li>t1</li><li>t2</li></ul></div>",
			},
			{
				name: "two ul reversed",
				node: {
					tag: "div", children: [
						{tag: "ul", children: [{tag: "li", children: ["t1"]}, {tag: "li", children: ["t2"]}]},
						{tag: "ul", children: [{tag: "li", children: ["t0"]}]},
					],
				},
				html: "<div><ul><li>t1</li><li>t2</li></ul><ul><li>t0</li></ul></div>",
			},
		],
			"text": [
			{
				name: "text empty",
				node: {
					tag: "div", children: "",
				},
				html: "<div></div>",
			},
			{
				name: "text empty array",
				node: {
					tag: "div", children: [""],
				},
				html: "<div></div>",
			},
			{
				name: "two texts empty",
				node: {
					tag: "div", children: ["", ""],
				},
				html: "<div></div>",
			},
			{
				name: "text object empty",
				node: {
					tag: "div", children: {tag: "#", children: ""},
				},
				html: "<div></div>",
			},
			{
				name: "text object empty array",
				node: {
					tag: "div", children: [{tag: "#", children: ""}],
				},
				html: "<div></div>",
			},
			{
				name: "text",
				node: {
					tag: "div", children: "text",
				},
				html: "<div>text</div>",
			},
			{
				name: "text object",
				node: {
					tag: "div", children: {tag: "#", children: "text"},
				},
				html: "<div>text</div>",
			},
			{
				name: "element b + text empty",
				node: {
					tag: "div", children: [
						{tag: "b", children: "t0"},
						"",
					],
				},
				html: "<div><b>t0</b></div>",
			},
			{
				name: "element b + text",
				node: {
					tag: "div", children: [
						{tag: "b", children: "t0"},
						"t1",
					],
				},
				html: "<div><b>t0</b>t1</div>",
			},
			{
				name: "text empty + element b",
				node: {
					tag: "div", children: [
						"",
						{tag: "b", children: "t1"},
					],
				},
				html: "<div><b>t1</b></div>",
			},
			{
				name: "text + element b",
				node: {
					tag: "div", children: [
						"t0",
						{tag: "b", children: "t1"},
					],
				},
				html: "<div>t0<b>t1</b></div>",
			},
			{
				name: "text 0 + text 1",
				node: {
					tag: "div", children: ["t0", "t1"],
				},
				html: "<div>t0t1</div>",
			},
			{
				name: "text 1 + text 0",
				node: {
					tag: "div", children: ["t1", "t0"],
				},
				html: "<div>t1t0</div>",
			},
		],
			"escaping": [
			{
				name: "attr",
				node: {tag: "div", attrs: {title: '\"&'}},
				html: '<div title="&quot;&amp;"></div>',
			},
			{
				name: "content",
				node: {tag: "div", children: "<&>"},
				html: "<div>&lt;&amp;&gt;</div>",
			},
		],
			"comments": [
			{
				name: "comment 1",
				node: {tag: "div", children: {tag: "!", children: "comment 1"}},
				html: "<div><!--comment 1--></div>",
			},
			{
				name: "comment 2",
				node: {tag: "div", children: {tag: "!", children: "comment 2"}},
				html: "<div><!--comment 2--></div>",
			},
		],
			"html": [
			{
				name: "html empty",
				node: {
					tag: "div", children: {tag: "<", children: ""},
				},
				html: "<div></div>",
			},
			{
				name: "html empty array",
				node: {
					tag: "div", children: [{tag: "<", children: ""}],
				},
				html: "<div></div>",
			},
			{
				name: "two html empty",
				node: {
					tag: "div", children: [
						{tag: "<", children: ""},
						{tag: "<", children: ""},
					],
				},
				html: "<div></div>",
			},
			{
				name: "html b",
				node: {
					tag: "div", children: {tag: "<", children: "<b>t0</b>"},
				},
				html: "<div><b>t0</b></div>",
			},
			{
				name: "two html b",
				node: {
					tag: "div", children: {tag: "<", children: "<b>t0</b><b>t1</b>"},
				},
				html: "<div><b>t0</b><b>t1</b></div>",
			},
			{
				name: "element b + html empty",
				node: {
					tag: "div", children: [
						{tag: "b", children: "t0"},
						{tag: "<", children: ""},
					],
				},
				html: "<div><b>t0</b></div>",
			},
			{
				name: "element b + html b",
				node: {
					tag: "div", children: [
						{tag: "b", children: "t0"},
						{tag: "<", children: "<b>t1</b>"},
					],
				},
				html: "<div><b>t0</b><b>t1</b></div>",
			},
			{
				name: "html empty + element b",
				node: {
					tag: "div", children: [
						{tag: "<", children: ""},
						{tag: "b", children: "t1"},
					],
				},
				html: "<div><b>t1</b></div>",
			},
			{
				name: "html b + element b",
				node: {
					tag: "div", children: [
						{tag: "<", children: "<b>t0</b>"},
						{tag: "b", children: "t1"},
					],
				},
				html: "<div><b>t0</b><b>t1</b></div>",
			},
			{
				name: "text + html text",
				node: {
					tag: "div", children: [
						"t0",
						{tag: "<", children: "ht1"},
					],
				},
				html: "<div>t0ht1</div>",
			},
			{
				name: "text + b",
				node: {
					tag: "div", children: [
						"t0",
						{tag: "<", children: "<b>t1</b>"},
					],
				},
				html: "<div>t0<b>t1</b></div>",
			},
			{
				name: "text + (html text + b)",
				node: {
					tag: "div", children: [
						"t0",
						{tag: "<", children: "ht1<b>t2</b>"},
					],
				},
				html: "<div>t0ht1<b>t2</b></div>",
			},
			{
				name: "html + (html b + text)",
				node: {
					tag: "div", children: [
						"t0",
						{tag: "<", children: "<b>t1</b>ht2"},
					],
				},
				html: "<div>t0<b>t1</b>ht2</div>",
			},
		],
			"lists": [
			{
				name: "empty",
				node: {
					tag: "ul",
					children: [],
				},
				html: "<ul></ul>",
			},
			{
				name: "2 li",
				node: {
					tag: "ul",
					children: [
						{tag: "li", children: ["t0"]},
						{tag: "li", children: ["t", "1"]},
					],
				},
				html: "<ul><li>t0</li><li>t1</li></ul>",
			},
			{
				name: "3 li",
				node: {
					tag: "ul",
					children: [
						{tag: "li", children: ["t", "0"]},
						{tag: "li", children: ["t1"]},
						{tag: "li", children: ["t2"]},
					],
				},
				html: "<ul><li>t0</li><li>t1</li><li>t2</li></ul>",
			},
			{
				name: "5 li",
				node: {
					tag: "ul",
					children: [
						{tag: "li", children: ["t0"]},
						{tag: "li", children: ["t1"]},
						{tag: "li", children: ["t2"]},
						{tag: "li", children: ["t", "3"]},
						{tag: "li", children: ["t", "4"]},
					],
				},
				html: "<ul><li>t0</li><li>t1</li><li>t2</li><li>t3</li><li>t4</li></ul>",
			},
		],
			"keyed lists": [
			{
				name: "0",
				node: {
					tag: "ul",
					children: [{tag: "li", key: 0, children: ["t0"]}],
				},
				html: "<ul><li>t0</li></ul>",
			},
			{
				name: "1",
				node: {
					tag: "ul",
					children: [{tag: "li", key: 1, children: ["t1"]}],
				},
				html: "<ul><li>t1</li></ul>",
			},
			{
				name: "2",
				node: {
					tag: "ul",
					children: [{tag: "li", key: 2, children: ["t2"]}],
				},
				html: "<ul><li>t2</li></ul>",
			},
			{
				name: "9",
				node: {
					tag: "ul",
					children: [{tag: "li", key: 9, children: ["t9"]}],
				},
				html: "<ul><li>t9</li></ul>",
			},
			{
				name: "0-1-2",
				node: {
					tag: "ul",
					children: [
						{tag: "li", key: 0, children: ["t0"]},
						{tag: "li", key: 1, children: ["t1"]},
						{tag: "li", key: 2, children: ["t2"]},
					],
				},
				html: "<ul><li>t0</li><li>t1</li><li>t2</li></ul>",
			},
			{
				name: "1-0-2",
				node: {
					tag: "ul",
					children: [
						{tag: "li", key: 1, children: ["t1"]},
						{tag: "li", key: 0, children: ["t0"]},
						{tag: "li", key: 2, children: ["t2"]},
					],
				},
				html: "<ul><li>t1</li><li>t0</li><li>t2</li></ul>",
			},
			{
				name: "0-2-1",
				node: {
					tag: "ul",
					children: [
						{tag: "li", key: 0, children: ["t0"]},
						{tag: "li", key: 2, children: ["t2"]},
						{tag: "li", key: 1, children: ["t1"]},
					],
				},
				html: "<ul><li>t0</li><li>t2</li><li>t1</li></ul>",
			},
			{
				name: "1-2",
				node: {
					tag: "ul",
					children: [
						{tag: "li", key: 1, children: ["t1"]},
						{tag: "li", key: 2, children: ["t2"]},
					],
				},
				html: "<ul><li>t1</li><li>t2</li></ul>",
			},
			{
				name: "0-1",
				node: {
					tag: "ul",
					children: [
						{tag: "li", key: 0, children: ["t0"]},
						{tag: "li", key: 1, children: ["t1"]},
					],
				},
				html: "<ul><li>t0</li><li>t1</li></ul>",
			},
			{
				name: "0-1-2-3-4",
				node: {
					tag: "ul",
					children: [
						{tag: "li", key: 0, children: ["t0"]},
						{tag: "li", key: 1, children: ["t1"]},
						{tag: "li", key: 2, children: ["t2"]},
						{tag: "li", key: 3, children: ["t3"]},
						{tag: "li", key: 4, children: ["t4"]},
					],
				},
				html: "<ul><li>t0</li><li>t1</li><li>t2</li><li>t3</li><li>t4</li></ul>",
			},
			{
				name: "4-3-2-1-0",
				node: {
					tag: "ul",
					children: [
						{tag: "li", key: 4, children: ["t4"]},
						{tag: "li", key: 3, children: ["t3"]},
						{tag: "li", key: 2, children: ["t2"]},
						{tag: "li", key: 1, children: ["t1"]},
						{tag: "li", key: 0, children: ["t0"]},
					],
				},
				html: "<ul><li>t4</li><li>t3</li><li>t2</li><li>t1</li><li>t0</li></ul>",
			},
			{
				name: "2-1-4-0-3",
				node: {
					tag: "ul",
					children: [
						{tag: "li", key: 2, children: ["t2"]},
						{tag: "li", key: 1, children: ["t1"]},
						{tag: "li", key: 4, children: ["t4"]},
						{tag: "li", key: 0, children: ["t0"]},
						{tag: "li", key: 3, children: ["t3"]},
					],
				},
				html: "<ul><li>t2</li><li>t1</li><li>t4</li><li>t0</li><li>t3</li></ul>",
			},
			{
				name: "4-1-2",
				node: {
					tag: "ul",
					children: [
						{tag: "li", key: 4, children: ["t4"]},
						{tag: "li", key: 1, children: ["t1"]},
						{tag: "li", key: 2, children: ["t2"]},
					],
				},
				html: "<ul><li>t4</li><li>t1</li><li>t2</li></ul>",
			},
			{
				name: "0-4",
				node: {
					tag: "ul",
					children: [
						{tag: "li", key: 0, children: ["t0"]},
						{tag: "li", key: 4, children: ["t4"]},
					],
				},
				html: "<ul><li>t0</li><li>t4</li></ul>",
			},
			{
				name: "0-5-4",
				node: {
					tag: "ul",
					children: [
						{tag: "li", key: 0, children: ["t0"]},
						{tag: "li", key: 5, children: ["t5"]},
						{tag: "li", key: 4, children: ["t4"]},
					],
				},
				html: "<ul><li>t0</li><li>t5</li><li>t4</li></ul>",
			},
			{
				name: "0-5-6-4",
				node: {
					tag: "ul",
					children: [
						{tag: "li", key: 0, children: ["t0"]},
						{tag: "li", key: 6, children: ["t6"]},
						{tag: "li", key: 5, children: ["t5"]},
						{tag: "li", key: 4, children: ["t4"]},
					],
				},
				html: "<ul><li>t0</li><li>t6</li><li>t5</li><li>t4</li></ul>",
			},
		],
			"keyed html": [
			{
				name: "0",
				node: {
					tag: "div",
					children: [
						{tag: "<", key: 0, children: "<b>t0.0</b><b>t0.1</b>"},
					],
				},
				html: "<div><b>t0.0</b><b>t0.1</b></div>",
			},
			{
				name: "1",
				node: {
					tag: "div",
					children: [
						{tag: "<", key: 1, children: "<b>t1.0</b><b>t1.1</b>"},
					],
				},
				html: "<div><b>t1.0</b><b>t1.1</b></div>",
			},
			{
				name: "0-1",
				node: {
					tag: "div",
					children: [
						{tag: "<", key: 0, children: "<b>t0.0</b><b>t0.1</b>"},
						{tag: "<", key: 1, children: "<b>t1.0</b><b>t1.1</b>"},
					],
				},
				html: "<div><b>t0.0</b><b>t0.1</b><b>t1.0</b><b>t1.1</b></div>",
			},
			{
				name: "1-0",
				node: {
					tag: "div",
					children: [
						{tag: "<", key: 1, children: "<b>t1.0</b><b>t1.1</b>"},
						{tag: "<", key: 0, children: "<b>t0.0</b><b>t0.1</b>"},
					],
				},
				html: "<div><b>t1.0</b><b>t1.1</b><b>t0.0</b><b>t0.1</b></div>",
			},
		],
			"style": [
			{
				name: "none",
				node: {tag: "div"},
				html: "<div></div>",
			},
			{
				name: "null",
				node: {tag: "div", attrs: {style: null}},
				html: "<div></div>",
			},
			{
				name: "string empty",
				node: {tag: "div", attrs: {style: ""}},
				html: '<div style=""></div>',
			},
			{
				name: "string color",
				node: {tag: "div", attrs: {style: "color: red;"}},
				html: '<div style="color: red;"></div>',
			},
			{
				name: "string color and display",
				node: {tag: "div", attrs: {style: "color: red; display: inline;"}},
				html: '<div style="color: red; display: inline;"></div>',
			},
			{
				name: "object empty",
				node: {tag: "div", attrs: {style: {}}},
				html: "<div></div>",
			},
			{
				name: "object color",
				node: {tag: "div", attrs: {style: {color: "red"}}},
				html: '<div style="color: red;"></div>',
			},
			{
				name: "object color and display",
				node: {tag: "div", attrs: {style: {color: "red", display: "inline"}}},
				html: '<div style="color: red; display: inline;"></div>',
			},
			/* Something's wrong with JSDOM?
			{
				name: "object color !important",
				node: {tag: "div", attrs: {style: {color: "red !important"}}},
				html: '<div style="color: red !important;"></div>',
			},*/
		],
			"simple fragments": [
			{
				name: "fragment without children",
				node: {tag: "div", children: {}},
				html: "<div></div>",
			},
			{
				name: "two fragments without children",
				node: {tag: "div", children: [{}, {}]},
				html: "<div></div>",
			},
			{
				name: "fragment with empty children array",
				node: {tag: "div", children: {children: []}},
				html: "<div></div>",
			},
			{
				name: "fragment with null children",
				node: {tag: "div", children: {children: null}},
				html: "<div></div>",
			},
			{
				name: "fragment with text children array",
				node: {tag: "div", children: {children: ["text"]}},
				html: "<div>text</div>",
			},
			{
				name: "fragment with text child",
				node: {tag: "div", children: {children: "text"}},
				html: "<div>text</div>",
			},
		],
			"surrounded fragments": [
			{
				name: "div + empty fragment",
				node: {
					tag: "div",
					children: [
						{tag: "div", children: "t0"},
						{
							children: [],
						},
					],
				},
				html: "<div><div>t0</div></div>",
			},
			{
				name: "div + fragment with 2 div",
				node: {
					tag: "div",
					children: [
						{tag: "div", children: "t0"},
						{
							children: [
								{tag: "div", children: "t1"},
								{tag: "div", children: "t2"},
							],
						},
					],
				},
				html: "<div><div>t0</div><div>t1</div><div>t2</div></div>",
			},
			{
				name: "fragment with 2 div + div",
				node: {
					tag: "div",
					children: [
						{
							children: [
								{tag: "div", children: "t1"},
								{tag: "div", children: "t2"},
							],
						},
						{tag: "div", children: "t3"},
					],
				},
				html: "<div><div>t1</div><div>t2</div><div>t3</div></div>",
			},
			{
				name: "fragment with 2 div",
				node: {
					tag: "div",
					children: [
						{
							children: [
								{tag: "div", children: "t1"},
								{tag: "div", children: "t2"},
							],
						},
					],
				},
				html: "<div><div>t1</div><div>t2</div></div>",
			},
			{
				name: "div + fragment with 3 div",
				node: {
					tag: "div",
					children: [
						{tag: "div", children: "t0"},
						{
							children: [
								{tag: "div", children: "t1"},
								{tag: "div", children: "t2"},
								{tag: "div", children: "t3"},
							],
						},
					],
				},
				html: "<div><div>t0</div><div>t1</div><div>t2</div><div>t3</div></div>",
			},
			{
				name: "div + fragment with 2 div + div",
				node: {
					tag: "div",
					children: [
						{tag: "div", children: "t0"},
						{
							children: [
								{tag: "div", children: "t1"},
								{tag: "div", children: "t2"},
							],
						},
						{tag: "div", children: "t3"},
					],
				},
				html: "<div><div>t0</div><div>t1</div><div>t2</div><div>t3</div></div>",
			},
			{
				name: "div + empty fragment + div",
				node: {
					tag: "div",
					children: [
						{tag: "div", children: "t0"},
						{
							children: [],
						},
						{tag: "div", children: "t3"},
					],
				},
				html: "<div><div>t0</div><div>t3</div></div>",
			},
			{
				name: "div + fragment with text + div",
				node: {
					tag: "div",
					children: [
						{tag: "div", children: "t0"},
						{
							children: "t1",
						},
						{tag: "div", children: "t3"},
					],
				},
				html: "<div><div>t0</div>t1<div>t3</div></div>",
			},
			{
				name: "div + fragment with html + div",
				node: {
					tag: "div",
					children: [
						{tag: "div", children: "t0"},
						{
							children: {tag: "<", children: "<b>t1</b>"},
						},
						{tag: "div", children: "t3"},
					],
				},
				html: "<div><div>t0</div><b>t1</b><div>t3</div></div>",
			},
		],
			"keyed fragments": [
			{
				name: "0",
				node: {
					tag: "ul",
					children: [
						{key: 0, children: [{tag: "li", children: "t0.0"}, {tag: "li", children: "t0.1"}]},
					],
				},
				html: "<ul><li>t0.0</li><li>t0.1</li></ul>",
			},
			{
				name: "0-1",
				node: {
					tag: "ul",
					children: [
						{key: 0, children: [{tag: "li", children: "t0.0"}, {tag: "li", children: "t0.1"}]},
						{key: 1, children: [{tag: "li", children: "t1.0"}, {tag: "li", children: "t1.1"}]},
					],
				},
				html: "<ul><li>t0.0</li><li>t0.1</li><li>t1.0</li><li>t1.1</li></ul>",
			},
			{
				name: "1-0",
				node: {
					tag: "ul",
					children: [
						{key: 1, children: [{tag: "li", children: "t1.0"}, {tag: "li", children: "t1.1"}]},
						{key: 0, children: [{tag: "li", children: "t0.0"}, {tag: "li", children: "t0.1"}]},
					],
				},
				html: "<ul><li>t1.0</li><li>t1.1</li><li>t0.0</li><li>t0.1</li></ul>",
			},
			{
				name: "1",
				node: {
					tag: "ul",
					children: [
						{key: 1, children: [{tag: "li", children: "t1.0"}, {tag: "li", children: "t1.1"}]},
					],
				},
				html: "<ul><li>t1.0</li><li>t1.1</li></ul>",
			},
			{
				name: "0-1-2",
				node: {
					tag: "ul",
					children: [
						{key: 0, children: [{tag: "li", children: "t0.0"}, {tag: "li", children: "t0.1"}]},
						{key: 1, children: [{tag: "li", children: "t1.0"}, {tag: "li", children: "t1.1"}]},
						{key: 2, children: [{tag: "li", children: "t2.0"}, {tag: "li", children: "t2.1"}]},
					],
				},
				html: "<ul><li>t0.0</li><li>t0.1</li><li>t1.0</li><li>t1.1</li><li>t2.0</li><li>t2.1</li></ul>",
			},
			{
				name: "2-1-0",
				node: {
					tag: "ul",
					children: [
						{key: 2, children: [{tag: "li", children: "t2.0"}, {tag: "li", children: "t2.1"}]},
						{key: 1, children: [{tag: "li", children: "t1.0"}, {tag: "li", children: "t1.1"}]},
						{key: 0, children: [{tag: "li", children: "t0.0"}, {tag: "li", children: "t0.1"}]},
					],
				},
				html: "<ul><li>t2.0</li><li>t2.1</li><li>t1.0</li><li>t1.1</li><li>t0.0</li><li>t0.1</li></ul>",
			},
			{
				name: "0-2",
				node: {
					tag: "ul",
					children: [
						{key: 0, children: [{tag: "li", children: "t0.0"}, {tag: "li", children: "t0.1"}]},
						{key: 2, children: [{tag: "li", children: "t2.0"}, {tag: "li", children: "t2.1"}]},
					],
				},
				html: "<ul><li>t0.0</li><li>t0.1</li><li>t2.0</li><li>t2.1</li></ul>",
			},
			{
				name: "2-0",
				node: {
					tag: "ul",
					children: [
						{key: 2, children: [{tag: "li", children: "t2.0"}, {tag: "li", children: "t2.1"}]},
						{key: 0, children: [{tag: "li", children: "t0.0"}, {tag: "li", children: "t0.1"}]},
					],
				},
				html: "<ul><li>t2.0</li><li>t2.1</li><li>t0.0</li><li>t0.1</li></ul>",
			},
		],
			"nested fragments": [
			{
				name: "fragment > text",
				node: {
					tag: "div",
					children: {children: {children: "t0"}},
				},
				html: "<div>t0</div>",
			},
			{
				name: "fragment > div",
				node: {
					tag: "div",
					children: {children: {tag: "div", children: "t0"}},
				},
				html: "<div><div>t0</div></div>",
			},
			{
				name: "fragment > fragment > text",
				node: {
					tag: "div",
					children: {children: {children: "t00"}},
				},
				html: "<div>t00</div>",
			},
			{
				name: "fragment > fragment > text + text",
				node: {
					tag: "div",
					children: {children: {children: ["t00", "t01"]}},
				},
				html: "<div>t00t01</div>",
			},
			{
				name: "fragment > fragment > html",
				node: {
					tag: "div",
					children: {children: {children: {tag: "<", children: "<b>t00</b>"}}},

				},
				html: "<div><b>t00</b></div>",
			},
			{
				name: "fragment > fragment > div",
				node: {
					tag: "div",
					children: {children: {children: {tag: "div", children: "t00"}}},
				},
				html: "<div><div>t00</div></div>",
			},
			{
				name: "fragment > fragment > div + div",
				node: {
					tag: "div",
					children: {children: {children: [{tag: "div", children: "t00"}, {tag: "div", children: "t01"}]}},
				},
				html: "<div><div>t00</div><div>t01</div></div>",
			},
		],
	};

	function deepClone(node: object) {
		return JSON.parse(JSON.stringify(node));
	}

	Object.keys(suites).forEach((suiteName) => {
		(suites as any)[suiteName].forEach((testData: any) => {
			test(`[append] ${suiteName}: ${testData.name}`, () => {
				const root = document.createElement("I");
				virtualDOM.append(root, deepClone(testData.node));

				expect(root.innerHTML).toEqual(testData.html);
			});
		});
	});

	Object.keys(suites).forEach((suiteName) => {
		const tests = (suites as any)[suiteName];

		tests.forEach((def1: any) => {
			tests.forEach((def2: any) => {
				if ((def1.updateOnlySelf || def2.updateOnlySelf) && def1 !== def2) {
					return;
				}

				test(`[update] ${suiteName}: ${def1.name} -> ${def2.name}`, () => {
					const root = document.createElement("I");
					const node = deepClone(def1.node);

					virtualDOM.append(root, node);
					virtualDOM.update(node, deepClone(def2.node));

					expect(root.innerHTML).toEqual(def2.html);
				});

				test(`[update] ${suiteName}: ${def1.name} -> ${def2.name} -> ${def1.name}`, () => {
					const root = document.createElement("I");
					const def1Node = deepClone(def1.node);
					const def2Node = deepClone(def2.node);

					virtualDOM.append(root, def1Node);
					virtualDOM.update(def1Node, def2Node);
					virtualDOM.update(def2Node, deepClone(def1.node));

					expect(root.innerHTML).toEqual(def1.html);
				});
			});
		});
	});

});
