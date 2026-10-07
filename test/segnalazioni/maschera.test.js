import {
  PRIVATO,
  mascheraAzioni,
  mascheraDom,
  mascheraEventi,
} from "../../src/segnalazioni/maschera.js";

const M = "•••";

// A minimal rrweb 2.x recording: Meta, FullSnapshot, an input event and a mutation.
function registrazione() {
  return [
    {
      type: 4,
      data: { href: "http://x/", width: 800, height: 600 },
      timestamp: 1,
    },
    {
      type: 2,
      timestamp: 2,
      data: {
        node: {
          type: 0,
          id: 1,
          childNodes: [
            {
              type: 2,
              id: 2,
              tagName: "html",
              attributes: {},
              childNodes: [
                {
                  type: 2,
                  id: 3,
                  tagName: "style",
                  attributes: {},
                  childNodes: [
                    {
                      type: 3,
                      id: 4,
                      textContent: ".a{color:red}",
                      isStyle: true,
                    },
                  ],
                },
                {
                  type: 2,
                  id: 5,
                  tagName: "div",
                  attributes: { class: "riga" },
                  childNodes: [{ type: 3, id: 6, textContent: "Mario Rossi" }],
                },
                {
                  type: 2,
                  id: 7,
                  tagName: "input",
                  attributes: { type: "text", value: "abc" },
                  childNodes: [],
                },
                {
                  type: 2,
                  id: 9,
                  tagName: "div",
                  attributes: { "data-segnala-privato": "" },
                  childNodes: [{ type: 3, id: 10, textContent: "IBAN IT60X" }],
                },
                {
                  type: 2,
                  id: 11,
                  tagName: "input",
                  attributes: { type: "password", value: "pw-vera" },
                  childNodes: [],
                },
              ],
            },
          ],
        },
        initialOffset: { top: 0, left: 0 },
      },
    },
    {
      type: 3,
      timestamp: 3,
      data: { source: 5, id: 7, text: "abcd", isChecked: false },
    },
    {
      type: 3,
      timestamp: 4,
      data: { source: 5, id: 11, text: "pw-nuova", isChecked: false },
    },
    {
      type: 3,
      timestamp: 5,
      data: {
        source: 0,
        texts: [
          { id: 6, value: "Luigi Bianchi" },
          { id: 10, value: "IBAN DE89" },
        ],
        attributes: [{ id: 7, attributes: { value: "q", class: "x" } }],
        removes: [],
        adds: [
          {
            parentId: 5,
            nextId: null,
            node: { type: 3, id: 8, textContent: "nuovo testo" },
          },
          {
            parentId: 9,
            nextId: null,
            node: { type: 3, id: 12, textContent: "altro segreto" },
          },
        ],
      },
    },
  ];
}

const trova = (nodo, id) => {
  if (nodo.id === id) return nodo;
  for (const figlio of nodo.childNodes ?? []) {
    const hit = trova(figlio, id);
    if (hit) return hit;
  }
  return null;
};

test("mascheraEventi replaces text nodes and input values but keeps node ids and structure", () => {
  const originali = registrazione();
  const copia = JSON.parse(JSON.stringify(originali));
  const out = mascheraEventi(originali);

  // Deep copy: the input is never touched.
  expect(originali).toEqual(copia);
  expect(out).toHaveLength(originali.length);
  expect(out.map((e) => e.type)).toEqual(originali.map((e) => e.type));

  const radice = out[1].data.node;
  expect(trova(radice, 6).textContent).toBe(M);
  expect(trova(radice, 4).textContent).toBe(".a{color:red}");
  expect(trova(radice, 5).attributes.class).toBe("riga");
  expect(trova(radice, 7).attributes.value).toBe(M);
  expect(trova(radice, 7).attributes.type).toBe("text");
  for (const id of [1, 2, 3, 4, 5, 6, 7, 9, 10, 11])
    expect(trova(radice, id)).not.toBeNull();

  expect(out[2].data.text).toBe(M);
  expect(out[2].data.id).toBe(7);
  const mut = out[4].data;
  expect(mut.texts.map((t) => t.value)).toEqual([M, M]);
  expect(mut.attributes[0].attributes).toEqual({ value: M, class: "x" });
  expect(mut.adds[0].node).toMatchObject({ id: 8, textContent: M });
});

test("PRIVATO elements are masked even when maschera is off", () => {
  const out = mascheraEventi(registrazione(), { tutto: false });
  const radice = out[1].data.node;
  // Ordinary content stays readable...
  expect(trova(radice, 6).textContent).toBe("Mario Rossi");
  expect(trova(radice, 7).attributes.value).toBe("abc");
  expect(out[2].data.text).toBe("abcd");
  expect(out[4].data.texts[0].value).toBe("Luigi Bianchi");
  expect(out[4].data.adds[0].node.textContent).toBe("nuovo testo");
  // ...private content never does.
  expect(trova(radice, 10).textContent).toBe(M);
  expect(trova(radice, 11).attributes.value).toBe(M);
  expect(out[3].data.text).toBe(M);
  expect(out[4].data.texts[1].value).toBe(M);
  expect(out[4].data.adds[1].node.textContent).toBe(M);

  // Same rule on the screenshot clone.
  const radiceDom = document.createElement("div");
  radiceDom.innerHTML =
    '<span id="v">visibile</span><div data-segnala-privato><b id="s">segreto</b></div>' +
    '<input id="p" type="password" value="pw"><input id="t" value="libero">';
  mascheraDom(radiceDom, { tutto: false });
  expect(radiceDom.querySelector("#v").textContent).toBe("visibile");
  expect(radiceDom.querySelector("#s").textContent).toBe(M);
  expect(radiceDom.querySelector("#p").value).toBe(M);
  expect(radiceDom.querySelector("#p").getAttribute("value")).toBe(M);
  expect(radiceDom.querySelector("#t").value).toBe("libero");
  expect(PRIVATO).toBe('[data-segnala-privato], input[type="password"]');
});

test("mascheraDom with maschera on hides every text and value but keeps elements", () => {
  const radice = document.createElement("div");
  radice.innerHTML =
    '<p class="c">Mario <b>Rossi</b></p><textarea id="ta">nota</textarea><input id="i" value="x">';
  mascheraDom(radice);
  expect(radice.querySelector("p").className).toBe("c");
  expect(radice.querySelector("b").textContent).toBe(M);
  expect(radice.querySelector("#ta").value).toBe(M);
  expect(radice.querySelector("#i").value).toBe(M);
  expect(radice.textContent).not.toMatch(/Mario|Rossi|nota/);
});

test("mascheraAzioni hides the free text of clicks, keeps data-segnala names", () => {
  const out = mascheraAzioni([
    { ts: "t", tipo: "click", elemento: "Mario Rossi", fonte: "testo" },
    { ts: "t", tipo: "click", elemento: "Clienti attivi", fonte: "data-segnala" },
    { ts: "t", tipo: "richiesta", url: "/api/x", metodo: "GET", stato: 200 },
  ]);
  expect(out[0].elemento).toBe(M);
  expect(out[1].elemento).toBe("Clienti attivi");
  expect(out[2].url).toBe("/api/x");
});
