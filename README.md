# Pseudocode Editor with Syntax Highlighting

This is a web-based **Pseudocode editor** featuring live syntax highlighting. It highlights:

- **Keywords** (`for`, `if`, `else`, `do`, `end`, etc. - Full list can be found in `highlight.js`)
- **Variables** (assigned using `=` or loop variables)
- **Function names**
- **Function parameters**
- **Built-in values** (`true`, `false`, `null`, `none`)
- **Strings**
- **Comments**


## Demo

You can try it live at: [https://shueppin.github.io/Pseudocode-Editor/](https://shueppin.github.io/Pseudocode-Editor/)


## Usage

- You will see an example code when starting the editor.
- Type your pseudocode in the editor.
- Click **Clear Code** to reset.
- Tabs automatically insert 4 spaces.


## Features

- Real-time syntax highlighting while typing
- Preserves indentation and line numbers
- Supports array indexing and function parameters
- Handles multi-line strings and function definitions
- Tab key inserts 4 spaces

Feel free to report bugs if you find any.


## Structure

Modular approach with two JavaScript files:

1. **highlight.js** – contains the tokenizer and syntax highlighting logic.
2. **window.js** – handles DOM interactions, line numbers, scrolling, tab insertion, and the clear button.
