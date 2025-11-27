# Pseudocode Editor with Syntax Highlighting

This is a web-based **Pseudocode editor** featuring live syntax highlighting. It highlights:

- **Keywords** (`for`, `if`, `else`, `do`, `end`, etc.)
- **Variables** (assigned using `=` or loop variables)
- **Function names**
- **Function parameters**
- **Built-in values** (`true`, `false`, `null`, `none`)
- **Strings**
- **Comments**


## Demo

You can try it live at: [https://shueppin.github.io/Pseudocode-Editor/](https://shueppin.github.io/Pseudocode-Editor/)


## Usage

- Type your pseudocode in the editor.
- Click **Clear Code** to reset.
- Tabs automatically insert 4 spaces.
- Scroll in the editor; the highlight overlay and line numbers sync automatically.


## Features

- Real-time syntax highlighting while typing
- Preserves indentation and line numbers
- Supports array indexing and function parameters
- Handles multi-line strings
- Tab key inserts 4 spaces


## Structure

Modular approach with two JavaScript files:

1. **highlight.js** – contains the tokenizer and syntax highlighting logic.
2. **window.js** – handles DOM interactions, line numbers, scrolling, tab insertion, and the clear button.
