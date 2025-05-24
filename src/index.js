import "./styles.css";

const elementList = document.querySelector(".left-bar");
const page = document.getElementById("doc");

const tagIcon = {
    H1: "format_h1",
    H2: "format_h2",
    H3: "format_h3",
    H4: "format_h4",
    H5: "format_h5",
    H6: "format_h6",
    DIV: "square",
    SPAN: "code",
    P: "subject",
    UL: "format_list_bulleted",
    LI: "horizontal_rule",
};

const tracker = {
    tree: new WeakMap(),
    page: new WeakMap(),
    set: (li, dom) => {
        tracker.tree.set(li, dom);
        tracker.page.set(dom, li);
    },
    delete: (el) => {
        tracker.tree.get(el).remove();
        tracker.page.get(el).remove();
        tracker.tree.delete(el);
        tracker.page.delete(el);
    },
    get: (el) => {
        return tracker.tree.get(el) || tracker.page.get(el);
    },
};

function renderNodeTree(el) {
    const nodeTreeEl = document.createElement("div");
    nodeTreeEl.classList.add("el-menu");
    nodeTreeEl.appendChild(generateTree(el));

    function generateTree(el) {
        const children = Array.from(el.children);

        const ul = document.createElement("ul");

        children.forEach((child) => {
            const li = document.createElement("li");
            if (child.children.length > 0) {
                li.innerHTML = `<i class="material-icons drop-icon">keyboard_arrow_down</i>
                    <i class="material-icons">${tagIcon[child.tagName]}</i>
                    <span>${child.tagName}</span>`;
                ul.appendChild(li);
                const subUl = generateTree(child);
                ul.appendChild(subUl);
            } else {
                li.innerHTML = `<i class="material-icons">${tagIcon[child.tagName]}</i>
                    <span>${child.tagName}</span>`;
                ul.appendChild(li);
            }
            tracker.set(li, child);
        });

        return ul;
    }

    return nodeTreeEl;
}

const nodeTree = renderNodeTree(page);

let activeEl;

nodeTree.addEventListener("mouseover", (e) => {
    const el = e.target;
    const li = el.closest("LI");
    if (li) {
        console.log(li);
        const correspondingEl = tracker.get(li);
        correspondingEl.classList.add("active-el");
    }
});

nodeTree.addEventListener("mouseout", (e) => {
    const el = e.target;
    const li = el.closest("LI");
    if (activeEl && li === activeEl) return;
    if (li) {
        const correspondingEl = tracker.get(li);
        correspondingEl.classList.remove("active-el");
    }
});

nodeTree.addEventListener("click", (e) => {
    const el = e.target;
    const li = el.closest("LI");
    if (li) {
        li.classList.add("active");
        if (activeEl) {
            activeEl.classList.remove("active");
            const correspondingEl = tracker.get(activeEl);
            correspondingEl.classList.remove("active-el");
        }
        activeEl = li;
        const correspondingEl = tracker.get(activeEl);
        correspondingEl.classList.add("active-el");
    }
});

elementList.appendChild(nodeTree);

console.log(tracker);
