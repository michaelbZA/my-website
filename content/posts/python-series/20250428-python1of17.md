---
title: "Part 1: Getting Started with Python on Windows"
date: 2025-04-28
slug: python-foundations-getting-started
description: "Learn what Python is, install it on Windows, and write your first Python program in this introductory guide to the Python programming language."
tags: ["python", "beginner", "windows", "installation", "tutorial"]
categories: ["Python Series"]
series: ["Python Mastery"]
series_order: 2
showToc: true
TocOpen: false
draft: false
# weight: 10
#cover:
    #image: "images/python-part1-cover.jpg" # Replace with your actual image path
    #alt: "Python Programming Guide"
    #caption: "Getting Started with Python"
    #relative: false
---

# Post 1: Getting Started with Python on Windows

Welcome to the first post in my Python learning series. As I learn Python myself, I'll be documenting my journey here. This first post covers the essentials to get you up and running with Python on Windows:

1. What Python is and why it's worth learning
2. Installing Python on Windows (with step-by-step instructions)
3. Quick install notes for macOS & Linux users
4. Writing your first "Hello, World!" program
5. Using the Python interactive shell

---

## 1. What Is Python (and Why Learn It)?

Python is a high-level, interpreted programming language that's gained enormous popularity for good reason. After looking into various languages, I chose to learn Python because:

- **Readability**: Its clean syntax uses indentation and fewer symbols than languages like C++ or Java, making code easier to understand
- **Versatility**: It's used across multiple domains from web development (Django, Flask) to data analysis (NumPy, pandas) and automation
- **Package ecosystem**: PyPI (Python Package Index) hosts over 400,000 third-party packages that extend Python's capabilities
- **Community support**: Extensive documentation, forums, and tutorials make finding help straightforward

For me as a finance professional, Python's data analysis capabilities are particularly valuable, but its applications stretch across many fields.

---

## 2. Installing Python on Windows

Here's how to get Python installed on Windows 10/11:

### 2.1 Download the Installer
1. Visit the official Python download page: https://www.python.org/downloads/windows
2. Click the button for the latest stable release (currently Python 3.11.x)

### 2.2 Run the Installer
1. Locate and double-click the downloaded file (typically named python-3.x.x-amd64.exe)
2. **IMPORTANT**: Check the box that says "Add Python 3.x to PATH" at the bottom of the installer
   - This allows you to run Python from any directory in Command Prompt
3. Click "Install Now" for the standard installation, or "Customize installation" if you want to change specific options

### 2.3 Verify the Installation
1. Open Command Prompt (press Win + R, type `cmd`, and hit Enter)
2. Type the following command and press Enter:
   ```
   python --version
   ```
3. You should see output like:
   ```
   Python 3.11.4
   ```
   (Your version number might differ)

---

## 3. Quick Notes for macOS & Linux

- **macOS**:
  - Many Macs come with Python 2.7 preinstalled, but you'll want Python 3
  - The simplest approach is using Homebrew:
    ```
    brew install python
    ```
  - Alternatively, download the installer from python.org

- **Linux**:
  - Most Linux distributions include Python
  - For Ubuntu/Debian:
    ```
    sudo apt update
    sudo apt install python3 python3-pip
    ```

For complete instructions, see the official Python documentation:
- macOS: https://docs.python.org/3/using/mac.html
- Linux: https://docs.python.org/3/using/unix.html

---

## 4. Your First "Hello, World!" Script

Time to write your first Python program:

1. In Command Prompt, navigate to a folder where you want to create your script:
   ```
   cd C:\Users\YourUsername\Documents
   ```

2. Create a new file named `hello.py` using any text editor (Notepad, VS Code, etc.)

3. Type this line in the file:
   ```python
   print("Hello, World!")
   ```

4. Save the file, then run it by typing in Command Prompt:
   ```
   python hello.py
   ```

5. You should see:
   ```
   Hello, World!
   ```

Congratulations—you've written and executed your first Python program!

---

## 5. Exploring the Python Interactive Shell

Python comes with an interactive shell (also called a REPL—Read-Evaluate-Print Loop) that lets you test code snippets immediately:

1. In Command Prompt, simply type:
   ```
   python
   ```

2. You'll see the Python prompt (`>>>`) where you can type code directly:
   ```python
   >>> 2 + 2
   4
   >>> name = "Python"
   >>> print(f"I'm learning {name}!")
   I'm learning Python!
   ```

3. Try some basic math:
   ```python
   >>> 5 * 7
   35
   >>> 10 / 2
   5.0
   ```

4. To exit, type:
   ```python
   >>> exit()
   ```
   Or press Ctrl+Z followed by Enter on Windows.

The interactive shell is excellent for quick experiments and calculations without creating a file.

---

## Practice Exercise

Before moving on, try this quick exercise:

1. Create a new Python file named `greeting.py`
2. Write code that:
   - Assigns your name to a variable
   - Prints a greeting that includes your name
3. Run the script to see the output

**Example solution** (don't peek until you've tried!):
```python
name = "Alex"
print(f"Nice to meet you, {name}!")
```

---

## What's Next?

Now that you have Python installed and have run your first code, you're ready to:
- Explore text editors and IDEs that will make coding more efficient (coming in Post 2)
- Learn Python syntax fundamentals to build more complex programs
- Begin solving real problems with your new skills

Stay tuned for Post 2: Text Editors vs. IDEs for Python Development!

---

*This post is part of my journey learning Python. I'm a chartered accountant exploring programming to enhance my analytical toolkit. If you have questions or spot any errors, please leave a comment below.*