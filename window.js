/*
This script manages the editor textarea, highlight layer, line numbers, scroll syncing, tab insertion, clear button, and input updates.
It uses highlight.js for syntax highlighting.
*/

// Elements
const editor = document.getElementById('editor');
const highlightLayer = document.getElementById('highlight');
const lineNumbers = document.getElementById('lineNumbers');
const clearBtn = document.getElementById('clearBtn');

// Update line numbers
function updateLineNumbers(text){
  const lines = text===''?1:text.split('\n').length;
  lineNumbers.textContent = Array.from({length:lines},(_,i)=>i+1).join('\n');
}

// Update highlight layer
function updateHighlight(){
  const text = editor.value;
  let highlighted = highlightSyntax(text); // from highlight.js
  highlighted += '<br>&nbsp;'; // extra line for empty end
  highlightLayer.innerHTML = highlighted;
  updateLineNumbers(text);
}

// Clear button
clearBtn.addEventListener('click',()=>{
  editor.value='';
  editor.scrollTop=0;
  highlightLayer.scrollTop=0;
  lineNumbers.scrollTop=0;
  updateHighlight();
});

// Tab key insertion
editor.addEventListener('keydown',(e)=>{
  if(e.key==='Tab'){
    e.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.value = editor.value.slice(0,start)+'    '+editor.value.slice(end);
    editor.selectionStart = editor.selectionEnd = start + 4;
    updateHighlight();
  }
});

// Scroll sync
editor.addEventListener('scroll',()=>{
  highlightLayer.scrollTop = editor.scrollTop;
  highlightLayer.scrollLeft = editor.scrollLeft;
  lineNumbers.scrollTop = editor.scrollTop;
});

// Input sync
editor.addEventListener('input', updateHighlight);

// Initial highlight
updateHighlight();


let hasUnsavedChanges = false;

// Whenever the editor changes:
editor.addEventListener("input", () => {
  hasUnsavedChanges = true;
});

window.addEventListener("beforeunload", (event) => {
  if (!hasUnsavedChanges) return;   // allow navigation without warning

  event.preventDefault();
  event.returnValue = "";
});
