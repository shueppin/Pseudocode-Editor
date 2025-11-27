// === CENTRAL SYNTAX CONFIG ===
const KEYWORDS = [
  'for', 'if', 'else', 'then', 'do', 'return', 'in', 'of', 'while', 'end', 'break', 'next', 'continue', 'to', 'foreach', 'skip', 'function', 'mod', 'step', 'repeat', 'until', 'exit', 'class', 'instance'
];
const BUILTIN_VALUES = ['true', 'false', 'null', 'none'];


// Escape HTML (simple, safe)
function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Tokenizer that records start/end positions
function tokenize(raw) {
  const tokens = [];
  let i = 0;
  const len = raw.length;

  while (i < len) {
    const ch = raw[i];

    // Comments
    if (ch === '/' && raw[i+1] === '/') {
      let j = i + 2; while (j < len && raw[j] !== '\n') j++;
      tokens.push({ type: 'comment', text: raw.slice(i,j), start:i, end:j });
      i = j; continue;
    }

    // Strings
    if (ch === '"') {
      let j = i+1;
      while (j < len) {
        if (raw[j] === '\\') { j+=2; continue; }
        if (raw[j] === '"') { j++; break; }
        j++;
      }
      if (j > len) j = len;
      tokens.push({ type: 'string', text: raw.slice(i,j), start:i, end:j });
      i = j; continue;
    }

    // Identifiers / Keywords / Builtins
    if (/[A-Za-z_]/.test(ch)) {
      let j=i+1; while (j<len && /[A-Za-z0-9_]/.test(raw[j])) j++;
      const word = raw.slice(i,j);
      if (KEYWORDS.includes(word)) tokens.push({ type:'keyword', text:word, start:i,end:j });
      else if (BUILTIN_VALUES.includes(word)) tokens.push({ type:'value', text:word, start:i,end:j });
      else tokens.push({ type:'identifier', text:word, start:i,end:j });
      i=j; continue;
    }

    // Numbers
    if (/\d/.test(ch)) {
      let j=i+1; while (j<len && /[0-9]/.test(raw[j])) j++;
      tokens.push({ type:'value', text:raw.slice(i,j), start:i,end:j });
      i=j; continue;
    }

    // Whitespace
    if (/\s/.test(ch)) { tokens.push({ type:'whitespace', text:ch, start:i,end:i+1 }); i++; continue; }

    // Operators / punctuation
    tokens.push({ type:'operator', text:ch, start:i,end:i+1 });
    i++;
  }

  return tokens;
}

// Analyze tokens to find variables, params, functions
function analyzeTokens(tokens, raw) {
  const assignedVars = new Set();
  const loopVars = new Set();
  const paramVars = new Set();
  const functionSet = new Set();

  function findMatching(tokens,j,open,close){
    let depth=0;
    for(let k=j;k<tokens.length;k++){
      if(tokens[k].text===open) depth++;
      else if(tokens[k].text===close){
        depth--; if(depth===0) return k;
      }
    }
    return -1;
  }

  for(let i=0;i<tokens.length;i++){
    const t = tokens[i];

    // for <var> in ...
    if(t.type==='keyword' && t.text==='for'){
      let j=i+1; while(j<tokens.length && tokens[j].type==='whitespace') j++;
      if(tokens[j] && tokens[j].type==='identifier'){
        let k=j+1; while(k<tokens.length && tokens[k].type==='whitespace') k++;
        if(tokens[k] && tokens[k].type==='keyword' && tokens[k].text==='in') loopVars.add(tokens[j].text);
      }
    }

    // assignments
    if(t.type==='identifier'){
      let j=i+1; while(j<tokens.length && tokens[j].type==='whitespace') j++;
      if(tokens[j] && tokens[j].text==='['){
        const closeIdx = findMatching(tokens,j,'[',']');
        if(closeIdx!==-1){
          let k=closeIdx+1; while(k<tokens.length && tokens[k].type==='whitespace') k++;
          if(tokens[k] && tokens[k].text==='=') assignedVars.add(t.text);
        }
      } else if(tokens[j] && tokens[j].text==='=') assignedVars.add(t.text);
    }

    // function calls / declarations
    if(t.type==='identifier'){
      let j=i+1; while(j<tokens.length && tokens[j].type==='whitespace') j++;
      if(tokens[j] && tokens[j].text==='('){
        functionSet.add(t.text);
        const lineStart = raw.lastIndexOf('\n',t.start-1)+1;
        const between = raw.slice(lineStart,t.start).trim();
        if(between===''||between.endsWith('function')){
          const closeParenIdx = findMatching(tokens,j,'(',')');
          if(closeParenIdx!==-1){
            for(let p=j+1;p<closeParenIdx;p++){
              if(tokens[p].type==='identifier') paramVars.add(tokens[p].text);
            }
          }
        }
      }
    }
  }

  return { assignedVars, loopVars, paramVars, functionSet };
}

// Convert tokens + analysis to HTML
function tokensToHTML(tokens, analysis){
  const {assignedVars, loopVars, paramVars, functionSet} = analysis;
  const definedVars = new Set([...assignedVars, ...loopVars]);

  return tokens.map((t, idx) => {
    const esc = escapeHTML(t.text);

    if(t.type === 'comment') return `<span class="comment">${esc}</span>`;
    if(t.type === 'string') return `<span class="value">${esc}</span>`;
    if(t.type === 'keyword') return `<span class="keyword">${esc}</span>`;
    if(t.type === 'value') return `<span class="value">${esc}</span>`;

    if(t.type === 'identifier'){
      // next non-whitespace token
      let j = idx + 1; while(j < tokens.length && tokens[j].type === 'whitespace') j++;

      // Function names
      if(tokens[j] && tokens[j].text === '(' && functionSet.has(t.text)) return `<span class="function">${esc}</span>`;

      // Priority: assigned/loop variables override parameters
      if(definedVars.has(t.text)) return `<span class="variable">${esc}</span>`;
      if(paramVars.has(t.text)) return `<span class="param">${esc}</span>`;

      return esc;
    }

    return esc;
  }).join('');
}
// Main function
function highlightSyntax(raw){
  const tokens = tokenize(raw);
  const analysis = analyzeTokens(tokens,raw);
  const html = tokensToHTML(tokens,analysis);
  return html===''?'&nbsp;':html;
}