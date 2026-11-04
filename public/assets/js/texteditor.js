import {
    createWindow,
    bringWindowTopmost,
    newSystemStatus,
    WINMASK
} from "./windows.js";

const STORAGE_KEY = "retrosystem-text-editor";
const ALLOWED_TAGS = new Set(["B", "BR", "DIV", "EM", "H2", "H3", "I", "LI", "OL", "P", "STRONG", "U", "UL"]);
let textEditorWindowHandle = undefined;

function sanitizeDocument(html) {
    const parsed = new DOMParser().parseFromString(html, "text/html");

    function clean(node) {
        Array.from(node.childNodes).forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                if (!ALLOWED_TAGS.has(child.tagName)) {
                    clean(child);
                    child.replaceWith(...child.childNodes);
                } else {
                    Array.from(child.attributes).forEach(attribute => child.removeAttribute(attribute.name));
                    clean(child);
                }
            } else if (child.nodeType !== Node.TEXT_NODE) {
                child.remove();
            }
        });
    }

    clean(parsed.body);
    return parsed.body.innerHTML;
}

function textEditorWindow() {
    if (textEditorWindowHandle != undefined) {
        bringWindowTopmost(textEditorWindowHandle);
        return;
    }

    textEditorWindowHandle = createWindow(
        "textEditorWindow",
        "Text Editor",
        -1,
        -1,
        680,
        520,
        WINMASK.MOVABLE | WINMASK.CLOSABLE,
        () => {
            textEditorWindowHandle = undefined;
            return true;
        }
    );
    const editor = textEditorWindowHandle.querySelector("#editorContent");
    const filename = textEditorWindowHandle.querySelector("#editorFilename");
    const status = textEditorWindowHandle.querySelector("#editorStatus");
    const fileInput = textEditorWindowHandle.querySelector("#editorOpen");

    function setStatus(message) {
        status.textContent = message;
        newSystemStatus(message);
    }

    function saveLocally() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                content: editor.innerHTML,
                filename: filename.value
            }));
            status.textContent = "Saved in this browser";
        } catch (error) {
            setStatus("Could not save in this browser.");
            console.error("Unable to save the text editor document to local storage.", error);
        }
    }

    try {
        const savedDocument = localStorage.getItem(STORAGE_KEY);
        if (savedDocument) {
            const parsedDocument = JSON.parse(savedDocument);
            if (typeof parsedDocument.content === "string") {
                editor.innerHTML = sanitizeDocument(parsedDocument.content);
            }
            if (typeof parsedDocument.filename === "string" && parsedDocument.filename.trim()) {
                filename.value = parsedDocument.filename;
            }
        }
    } catch (error) {
        setStatus("Could not load the saved document.");
        console.error("Unable to restore the text editor document from local storage.", error);
    }

    editor.addEventListener("input", saveLocally);
    filename.addEventListener("input", saveLocally);

    editor.addEventListener("paste", event => {
        event.preventDefault();
        const text = event.clipboardData?.getData("text/plain");
        if (text !== undefined) {
            document.execCommand("insertText", false, text);
        }
    });

    textEditorWindowHandle.querySelectorAll("[data-command]").forEach(button => {
        button.addEventListener("mousedown", event => event.preventDefault());
        button.addEventListener("click", () => {
            editor.focus();
            document.execCommand(button.dataset.command, false);
            saveLocally();
        });
    });

    textEditorWindowHandle.querySelector("#editorHeading").addEventListener("change", event => {
        editor.focus();
        document.execCommand("formatBlock", false, event.target.value);
        saveLocally();
    });

    textEditorWindowHandle.querySelector("#editorNew").addEventListener("click", () => {
        editor.replaceChildren();
        filename.value = "document.txt";
        saveLocally();
        editor.focus();
        setStatus("New document ready.");
    });

    textEditorWindowHandle.querySelector("#editorSave").addEventListener("click", async () => {
        const content = editor.innerText;
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const requestedName = (filename.value.trim() || "document.txt")
            .split(/[\\/]/)
            .pop()
            .replace(/[<>:"|?*\u0000-\u001f]/g, "_");
        const downloadName = /\.[^./\\]+$/.test(requestedName) ? requestedName : `${requestedName}.txt`;
        saveLocally();

        try {
            if (typeof window.showSaveFilePicker === "function") {
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: downloadName,
                    types: [{
                        description: "Text document",
                        accept: { "text/plain": [".txt", ".md"] }
                    }]
                });
                const writable = await fileHandle.createWritable();
                await writable.write(blob);
                await writable.close();
                setStatus(`Saved ${downloadName}.`);
            } else {
                const downloadUrl = URL.createObjectURL(blob);
                const downloadLink = document.createElement("a");
                downloadLink.download = downloadName;
                downloadLink.href = downloadUrl;
                downloadLink.click();
                window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
                setStatus(`Downloaded ${downloadName}.`);
            }
        } catch (error) {
            if (error.name === "AbortError") return;
            setStatus("Could not save the document.");
            console.error("Unable to save the text editor document.", error);
        }
    });

    fileInput.addEventListener("change", async () => {
        const file = fileInput.files?.[0];
        if (!file) return;

        try {
            editor.textContent = await file.text();
            filename.value = file.name;
            saveLocally();
            editor.focus();
            setStatus(`Opened ${file.name}.`);
        } catch (error) {
            setStatus(`Could not open ${file.name}.`);
            console.error(`Unable to open text file "${file.name}".`, error);
        } finally {
            fileInput.value = "";
        }
    });

    newSystemStatus("Text Editor opened.");
}

export { textEditorWindow };
