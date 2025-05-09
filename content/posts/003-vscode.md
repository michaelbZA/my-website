---
title: 'VS Code Mastery'
date: 2025-05-02
slug: vscode-mastery
draft: false
tags: ["vscode"]
categories: ["VS Code"]
---

# VS Code Mastery: A Beginner's Guide to Being Productive

So you've downloaded VS Code and opened it up. Now what?  In this guide, I'll walk you through everything I've learned about making VS Code work for you, especially if you're just getting started.

## Why I Chose VS Code

Before getting into the details, let me share why I chose VS Code:

- Lightweight enough to open quickly
- Powerful enough for serious development
- Enormous extension ecosystem
- Regular updates with new features
- Works consistently across Windows, Mac, and Linux

## Getting Started: The VS Code Interface

When you first open VS Code, here's what you're looking at:

- **Activity Bar**: The vertical bar on the far left with icons for different views
- **Side Bar**: Shows different panels like Explorer, Search, and Extensions
- **Editor Area**: Where you edit your files (can be split!)
- **Status Bar**: At the bottom, showing helpful information
- **Panel**: Terminal, problems, output (toggle with `Ctrl+J` or `Cmd+J` on Mac)

![VS Code Interface Areas]

Don't worry if it feels like a lot—we'll break it down piece by piece.

## Essential Keyboard Shortcuts I Use Daily

Learning keyboard shortcuts dramatically improved my productivity. Here are the ones I use constantly:

| Shortcut (Windows/Linux) | Shortcut (Mac) | Action |
|--------------------------|----------------|--------|
| `Ctrl+P` | `Cmd+P` | Quick Open file |
| `Ctrl+Shift+P` | `Cmd+Shift+P` | Command Palette |
| `Ctrl+,` | `Cmd+,` | User Settings |
| `Ctrl+B` | `Cmd+B` | Toggle sidebar |
| `Ctrl+J` | `Cmd+J` | Toggle panel (terminal) |
| `Ctrl+\` | `Cmd+\` | Split editor |
| `Ctrl+Tab` | `Cmd+Tab` | Switch between open files |
| `Alt+Up/Down` | `Option+Up/Down` | Move line up/down |
| `Ctrl+D` | `Cmd+D` | Add selection to next find match |
| `Ctrl+Space` | `Cmd+Space` | Trigger suggestion |
| `F12` | `F12` | Go to definition |
| `Alt+F12` | `Option+F12` | Peek definition |
| `Ctrl+Shift+F` | `Cmd+Shift+F` | Search across files |
| `Ctrl+~` | `Cmd+~` | Open integrated terminal |

I found that learning just 3-4 shortcuts a week was manageable and made a huge difference over time.

## The Command Palette: Your Best Friend

If I could highlight just one feature, it would be the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac). It gives you access to virtually every command in VS Code.

Try this right now:
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "theme"
3. Select "Color Theme"
4. Browse through available themes

I use the Command Palette to:
- Run specific commands
- Change settings
- Open user/workspace settings
- Toggle features on/off
- Format documents
- And so much more!

Pro tip: Commands prefixed with `>` are VS Code commands, while others are for navigating files or settings.

## File Navigation That Saved Me Hours

Finding files quickly is essential for productivity. Here's how I navigate efficiently:

### Quick Open (`Ctrl+P` / `Cmd+P`)
Just start typing the filename—it uses fuzzy matching so you don't need the exact name.

### Navigating Inside Files
- `Ctrl+G` (`Cmd+G` on Mac): Go to specific line number
- `Ctrl+Shift+O` (`Cmd+Shift+O`): Navigate to symbols in the current file
- `F12`: Jump to definition
- `Alt+F12`: Peek definition (shows definition in a popup)
- `Ctrl+Shift+\`: Jump to matching bracket

### Go Back/Forward
- `Alt+Left/Right` (`Ctrl+- / Ctrl+Shift+-` on Mac): Navigate back and forth through your position history

## Supercharging Your Editing

These editing features have transformed how I write code:

### Multi-Cursor Editing
This was a game-changer for me:
- `Alt+Click` (`Option+Click` on Mac): Add cursor at mouse position
- `Ctrl+Alt+Up/Down` (`Cmd+Option+Up/Down`): Add cursor above/below
- `Ctrl+D` (`Cmd+D`): Select next occurrence of current selection
- `Ctrl+Shift+L` (`Cmd+Shift+L`): Select all occurrences of current selection

### Text Manipulation
- `Alt+Up/Down` (`Option+Up/Down`): Move current line up/down
- `Shift+Alt+Up/Down` (`Shift+Option+Up/Down`): Copy line up/down
- `Ctrl+Shift+K` (`Cmd+Shift+K`): Delete line
- `Ctrl+/` (`Cmd+/`): Toggle line comment
- `Shift+Alt+A` (`Shift+Option+A`): Toggle block comment
- `Ctrl+Space` (`Cmd+Space`): Trigger suggestions

I use multi-cursor editing for bulk edits that would otherwise take forever.

## VS Code Extensions That Changed My Workflow

Extensions are what make VS Code truly shine. Here are the ones I can't live without:

### Productivity Boosters
- **Prettier**: Automatic code formatting
- **ESLint**: JavaScript linting
- **GitLens**: Enhanced Git capabilities
- **Error Lens**: Inline error display
- **Auto Rename Tag**: Automatically rename paired HTML/XML tags
- **Path Intellisense**: Autocompletes filenames

### Theme and Appearance
- **Material Icon Theme**: Better file icons
- **One Dark Pro**: My preferred theme
- **Bracket Pair Colorizer 2**: Color-codes matching brackets

### Language-Specific Extensions
- **Python**: Enhanced Python development
- **Jupyter**: Jupyter notebook support
- **C/C++**: For C language support
- **markdownlint**: Linting for markdown files

Installing extensions is easy:
1. Click the Extensions icon in the Activity Bar (or `Ctrl+Shift+X`)
2. Search for the extension
3. Click Install

I recommend reviewing your extensions periodically and removing ones you don't use to keep VS Code running smoothly.

## Integrated Terminal: No More Window Switching

The integrated terminal (`Ctrl+`` or `Cmd+`` on Mac) has saved me from constantly switching between windows:

- Create multiple terminals by clicking the `+` button
- Split terminal views with the split button
- Switch between terminals with the dropdown
- Rename terminals for better organisation

You can configure your default shell in settings:
1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "settings"
3. Select "Preferences: Open Settings (JSON)"
4. Add your preferred terminal settings:

```json
"terminal.integrated.defaultProfile.windows": "PowerShell",
"terminal.integrated.defaultProfile.linux": "bash",
"terminal.integrated.defaultProfile.osx": "zsh"
```

## Debugging Made Simple

VS Code's debugging capabilities eliminate the need for `print` statements everywhere:

1. Click the Run and Debug icon in the Activity Bar
2. Click "create a launch.json file"
3. Select your environment

Key debugging actions:
- `F5`: Start/Continue
- `F9`: Toggle breakpoint
- `F10`: Step over
- `F11`: Step into
- `Shift+F11`: Step out
- `Ctrl+F5`: Run without debugging

The debug console lets you evaluate expressions and inspect variables in real-time, which was a revelation for me coming from print-based debugging.

## Customising VS Code to Your Preferences

VS Code's customisation options are nearly endless. Here's how I personalised mine:

### Settings.json

My essential customisations:

```json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "'Fira Code', Consolas, 'Courier New', monospace",
  "editor.fontLigatures": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.minimap.enabled": false,
  "editor.rulers": [80, 120],
  "editor.wordWrap": "on",
  "workbench.colorTheme": "One Dark Pro",
  "workbench.iconTheme": "material-icon-theme",
  "terminal.integrated.fontSize": 14,
  "files.autoSave": "onFocusChange",
  "explorer.confirmDelete": false,
  "editor.bracketPairColorization.enabled": true
}
```

You can access settings via:
- `Ctrl+,` (`Cmd+,` on Mac) for the Settings UI
- Command Palette > "Preferences: Open Settings (JSON)" for JSON editing

### Workspace Settings

For project-specific settings, create a `.vscode` folder in your project with:
- `settings.json`: Project-specific settings
- `launch.json`: Debugging configurations
- `tasks.json`: Task configurations
- `extensions.json`: Recommended extensions

This allows you to have different settings for different projects.

## Working with Git Integration

VS Code's built-in Git support eliminates the need for separate Git clients:

- The Source Control panel shows changes clearly
- Inline change markers show what's changed in each file
- Commit, push, pull, and branch directly from VS Code
- Resolve merge conflicts with a visual interface

To get started with Git:
1. Open a folder that's a Git repository
2. Make some changes
3. Click the Source Control icon in the Activity Bar
4. Stage changes by clicking the `+` icon
5. Enter a commit message and press `Ctrl+Enter` to commit

Adding GitLens extends these capabilities even further with blame annotations, history browsing, and more.

## Snippets: Stop Typing the Same Code Over and Over

Custom snippets have saved me countless hours of typing repetitive code:

1. Open Command Palette > "Snippets: Configure User Snippets"
2. Select a language or create a global snippet file
3. Add your snippets:

```json
"Print to console": {
  "prefix": "log",
  "body": [
    "console.log('$1');",
    "$2"
  ],
  "description": "Log output to console"
}
```

Now typing "log" and pressing Tab will insert `console.log('');` with the cursor positioned between the quotes.

I've created snippets for common patterns in each language I use.

## Remote Development: Life-Changing Feature

Working on remote machines and containers transformed my development workflow:

1. Install the "Remote Development" extension pack
2. Click the remote indicator in the bottom-left corner
3. Select your remote connection type:
   - SSH: Connect to remote servers
   - WSL: Work in Windows Subsystem for Linux
   - Containers: Work inside Docker containers

This lets you use VS Code's full power while code executes in a different environment—perfect for consistent development environments or working with remote servers.

## Workspace Organisation for Large Projects

For complex projects, I use these organisation features:

- **Multi-root workspaces**: Add multiple folders to a single workspace
- **File explorer groups**: Organise folders logically
- **Workspace settings**: Override settings for specific projects

To create a multi-root workspace:
1. Open a folder
2. Go to File > "Add Folder to Workspace"
3. Save the workspace file (File > "Save Workspace As...")

This approach is perfect for microservice architectures or when working with frontend and backend code simultaneously.

## Lesser-Known Features

Some features I discovered after using VS Code for a while:

- **Zen Mode**: `Ctrl+K Z` (`Cmd+K Z` on Mac) for distraction-free coding
- **Breadcrumbs**: Navigate file structure at the top of editors
- **Linked Editing**: Edit HTML opening and closing tags simultaneously
- **Emmet**: Built-in HTML/CSS abbreviations (try typing `div>ul>li*5` and pressing Tab)
- **IntelliSense**: Smart autocomplete that learns from your codebase
- **Code Folding**: Collapse sections with the arrows in the gutter
- **Split Editor**: `Ctrl+\` to edit files side by side

## Synchronising Settings Across Machines

VS Code Settings Sync keeps my environment consistent across computers:

1. Click the account icon in the bottom of the Activity Bar
2. Turn on Settings Sync
3. Select what to sync (settings, extensions, keybindings, etc.)

Now your customisations follow you to any machine with VS Code installed.

## Problems I've Encountered (and How I Fixed Them)

### High Memory Usage
- Disable unused extensions
- Set `"files.exclude"` for large folders you don't need indexed
- Use `"search.exclude"` to skip folders during searches

### Slow Performance
- Update VS Code to the latest version
- Try disabling extensions one by one to find the culprit
- Check for large files that might be slowing things down

### Language Server Issues
- Reinstall the language extension
- Check output panel for error messages
- Configure language server settings explicitly

## My Weekly VS Code Learning Habit

I made the most progress with VS Code by adopting a simple habit: learn one new feature per week.

On a weekly basis:
1. Open the Command Palette
2. Type "help" and select "Interactive Playground"
3. Try one new feature or shortcut
4. Practice it throughout the week

This incremental approach helped me build confidence without feeling overwhelmed.

## Conclusion: VS Code Changed How I Code

When I first started using VS Code, I was just using it as a basic text editor. Now, it's become an extension of my thinking process when coding. The features I've covered in this post have genuinely made me more productive and helped me write better code.

Don't feel like you need to learn everything at once! Start with the Command Palette and a few shortcuts, then gradually expand your knowledge. Before long, you'll be navigating and editing code with an efficiency.

## Resources for Going Further

- [Official VS Code Documentation](https://code.visualstudio.com/docs)
- [VS Code Tips and Tricks](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)
- [Keyboard Shortcut Reference](https://code.visualstudio.com/docs/getstarted/keybindings#_keyboard-shortcuts-reference)

Happy coding!