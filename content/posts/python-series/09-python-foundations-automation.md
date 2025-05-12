---
title: "Part 9: Command-Line Tools & Automation with Python"
date: 2025-06-26
slug: python-command-line-automation
description: "Build command-line interfaces with argparse, create installable CLI tools, automate file operations, control GUI applications, and develop practical automation projects."
tags: ["python", "cli", "argparse", "automation", "pyautogui", "os", "shutil", "scripting"]
categories: ["Python Series"]
series: ["Python Mastery"]
series_order: 10
showToc: true
TocOpen: false
draft: false
#weight: 9
#cover:
    #image: "images/python-series/part9-cover.jpg"
    #alt: "Python Automation"
    #caption: "Building command-line tools and automating tasks"
    #relative: false
--- 

# Command-Line Tools & Automation in Python

As a finance professional learning to code, I've discovered that some of the most practical Python applications aren't fancy data visualizations or machine learning models, but rather simple automation scripts that save time on repetitive tasks. In this post, I'll walk through how to build command-line tools and automate everyday processes using Python.

## Building Command-Line Scripts with argparse

When you're working with financial data, you often need flexible tools that can handle different inputs. The `argparse` module lets you build command-line scripts that accept various arguments and options.

### Basic argparse Structure

First, let's create a simple script that calculates compound interest:

```python
import argparse

def calculate_compound_interest(principal, rate, time, compounds_per_year=1):
    """Calculate compound interest.
    
    Args:
        principal: Initial investment amount
        rate: Annual interest rate (decimal)
        time: Time in years
        compounds_per_year: Number of times interest compounds per year
        
    Returns:
        Final amount after compound interest
    """
    return principal * (1 + rate/compounds_per_year)**(compounds_per_year*time)

def main():
    # Create argument parser
    parser = argparse.ArgumentParser(description='Calculate compound interest')
    
    # Add arguments
    parser.add_argument('principal', type=float, help='Initial investment amount')
    parser.add_argument('rate', type=float, help='Annual interest rate (decimal)')
    parser.add_argument('time', type=float, help='Time in years')
    parser.add_argument('--compounds', type=int, default=1, 
                        help='Number of times interest compounds per year (default: 1)')
    
    # Parse arguments
    args = parser.parse_args()
    
    # Calculate result
    result = calculate_compound_interest(
        args.principal, 
        args.rate, 
        args.time, 
        args.compounds
    )
    
    # Print result
    print(f"Initial principal: ${args.principal:.2f}")
    print(f"Annual rate: {args.rate:.2%}")
    print(f"Time: {args.time} years")
    print(f"Compounds per year: {args.compounds}")
    print(f"Final amount: ${result:.2f}")
    print(f"Interest earned: ${result - args.principal:.2f}")

if __name__ == "__main__":
    main()
```

Save this script as `compound_interest.py` and run it from the command line:

```
python compound_interest.py 10000 0.05 5 --compounds 12
```

This would calculate the compound interest on $10,000 at 5% annual interest for 5 years, compounded monthly.

### Understanding argparse Components

Let's break down what's happening in our script:

1. We create an `ArgumentParser` object with a description
2. We add arguments with `add_argument()`:
   - Positional arguments (`principal`, `rate`, `time`) are required
   - Optional arguments (like `--compounds`) start with `--` and have default values
3. We parse the command-line arguments with `parse_args()`
4. We access the values via `args.parameter_name`

### Adding Help Text

One of the best features of `argparse` is automatic help text generation. Users can run your script with `-h` or `--help` to see instructions:

```
python compound_interest.py --help
```

Which produces:

```
usage: compound_interest.py [-h] [--compounds COMPOUNDS] principal rate time

Calculate compound interest

positional arguments:
  principal             Initial investment amount
  rate                  Annual interest rate (decimal)
  time                  Time in years

optional arguments:
  -h, --help            show this help message and exit
  --compounds COMPOUNDS Number of times interest compounds per year (default: 1)
```

### More argparse Features

For financial applications, you might want to add more sophisticated options:

```python
parser.add_argument('--currency', default='$', help='Currency symbol to display')
parser.add_argument('--output-file', help='Save results to a file')
parser.add_argument('--verbose', '-v', action='store_true', help='Display additional information')
```

The `action='store_true'` creates a flag that's either True or False depending on whether it's included.

## Packaging Entry Points for Installable Commands

If you find yourself using the same script frequently, you can package it so it's available as a system-wide command.

### Creating a Package Structure

First, organize your files like this:

```
finance_tools/
├── finance_tools/
│   ├── __init__.py
│   ├── compound_interest.py
│   └── other_modules.py
├── README.md
└── pyproject.toml
```

### Setting Up pyproject.toml

Create a `pyproject.toml` file:

```toml
[build-system]
requires = ["setuptools>=42", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "finance_tools"
version = "0.1.0"
description = "Financial calculation tools"
readme = "README.md"
authors = [{name = "Your Name", email = "your.email@example.com"}]
license = {text = "MIT"}
requires-python = ">=3.6"

[project.scripts]
compound-interest = "finance_tools.compound_interest:main"
```

The `[project.scripts]` section is what creates the entry point. After installing this package, you'll be able to run `compound-interest` directly from your command line without typing `python` first.

### Installing Your Package

Install your package in development mode:

```
pip install -e .
```

Now you can run:

```
compound-interest 10000 0.05 5 --compounds 12
```

## Automating File and Folder Tasks

As a finance professional, you probably deal with lots of reports, spreadsheets, and data files. Python can help automate file handling tasks.

### Basic File Operations with os and shutil

Here's a script that organizes financial statements by month and type:

```python
import os
import shutil
import re
import argparse
from datetime import datetime

def organize_financial_statements(source_dir, target_dir):
    """Organize financial statements into folders by month and type.
    
    Assumes filenames like: 'Income_Statement_2023-05-15.xlsx' or 'Balance_Sheet_05_15_2023.pdf'
    """
    # Create target directory if it doesn't exist
    os.makedirs(target_dir, exist_ok=True)
    
    # Regular expressions for date patterns
    patterns = [
        r'(\d{4})-(\d{2})-\d{2}',  # YYYY-MM-DD
        r'(\d{2})_\d{2}_(\d{4})',  # MM_DD_YYYY
        r'(\d{2})-\d{2}-(\d{4})'   # MM-DD-YYYY
    ]
    
    # Document types to look for
    doc_types = ['Income_Statement', 'Balance_Sheet', 'Cash_Flow', 'Trial_Balance']
    
    # Process each file in the source directory
    for filename in os.listdir(source_dir):
        file_path = os.path.join(source_dir, filename)
        
        # Skip directories
        if os.path.isdir(file_path):
            continue
            
        # Try to extract date
        date_found = False
        for pattern in patterns:
            match = re.search(pattern, filename)
            if match:
                # Extract year and month
                if len(match.group(1)) == 4:  # If first group is year (YYYY-MM-DD)
                    year, month = match.group(1), match.group(2)
                else:  # If first group is month (MM_DD_YYYY)
                    month, year = match.group(1), match.group(2)
                
                month_name = datetime.strptime(month, "%m").strftime("%B")
                date_found = True
                break
        
        if not date_found:
            # If no date pattern found, put in 'Unsorted'
            year, month_name = 'Unsorted', 'Unsorted'
        
        # Try to match document type
        doc_type = 'Other'
        for dtype in doc_types:
            if dtype in filename:
                doc_type = dtype
                break
        
        # Create year and month folders if they don't exist
        year_dir = os.path.join(target_dir, year)
        os.makedirs(year_dir, exist_ok=True)
        
        month_dir = os.path.join(year_dir, month_name)
        os.makedirs(month_dir, exist_ok=True)
        
        # Create document type folder if it doesn't exist
        doc_type_dir = os.path.join(month_dir, doc_type)
        os.makedirs(doc_type_dir, exist_ok=True)
        
        # Copy the file to its destination
        dest_path = os.path.join(doc_type_dir, filename)
        shutil.copy2(file_path, dest_path)
        print(f"Copied {filename} to {dest_path}")

def main():
    parser = argparse.ArgumentParser(description='Organize financial statements by date and type')
    parser.add_argument('source_dir', help='Directory containing financial statements')
    parser.add_argument('--target-dir', default='./Organized_Statements',
                       help='Target directory for organized files (default: ./Organized_Statements)')
    
    args = parser.parse_args()
    organize_financial_statements(args.source_dir, args.target_dir)
    print("Financial statement organization complete!")

if __name__ == "__main__":
    main()
```

This script:
1. Scans a directory for financial documents
2. Extracts dates and document types from filenames
3. Creates an organized folder structure by year, month, and document type
4. Copies files to the appropriate locations

### Understanding Key File Operations

- `os.path.join()`: Combines path components correctly for your operating system
- `os.makedirs()`: Creates directories recursively with `exist_ok=True` to avoid errors
- `os.listdir()`: Lists files and directories in a path
- `shutil.copy2()`: Copies files while preserving metadata

### Automating Financial Report Backups

Here's another practical example that creates date-stamped backups of your financial reports:

```python
import os
import shutil
import datetime
import argparse
import zipfile

def backup_financial_reports(reports_dir, backup_dir=None):
    """Create a date-stamped ZIP backup of financial reports."""
    # Set default backup directory if none provided
    if backup_dir is None:
        backup_dir = os.path.join(os.path.dirname(reports_dir), 'Backups')
    
    # Create backup directory if it doesn't exist
    os.makedirs(backup_dir, exist_ok=True)
    
    # Create timestamp for backup filename
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_filename = f"Financial_Reports_Backup_{timestamp}.zip"
    backup_path = os.path.join(backup_dir, backup_filename)
    
    # Create ZIP file
    with zipfile.ZipFile(backup_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Walk through all files in the reports directory
        for root, _, files in os.walk(reports_dir):
            for file in files:
                file_path = os.path.join(root, file)
                # Calculate path relative to reports_dir for ZIP structure
                rel_path = os.path.relpath(file_path, reports_dir)
                zipf.write(file_path, rel_path)
                print(f"Added {rel_path} to backup")
    
    print(f"Backup created at: {backup_path}")
    print(f"Total size: {os.path.getsize(backup_path) / (1024*1024):.2f} MB")
    
    return backup_path

def main():
    parser = argparse.ArgumentParser(description='Create a backup of financial reports')
    parser.add_argument('reports_dir', help='Directory containing financial reports')
    parser.add_argument('--backup-dir', help='Target directory for backups')
    
    args = parser.parse_args()
    backup_financial_reports(args.reports_dir, args.backup_dir)

if __name__ == "__main__":
    main()
```

## Automating GUI Interactions with PyAutoGUI

Sometimes you need to automate interactions with desktop applications that don't have APIs. For example, maybe you need to extract data from an older accounting system that can only export data through its GUI. PyAutoGUI can help automate these interactions.

### Installing and Setting Up PyAutoGUI

```
pip install pyautogui
```

### Safety Features

PyAutoGUI has a fail-safe feature - quickly move your mouse to any corner of the screen to abort the script. This is crucial when you're testing automation that controls your mouse!

### Basic PyAutoGUI Example

Here's a simple script that could help export a monthly report from a financial application:

```python
import pyautogui
import time
import argparse
from datetime import datetime

# Safety delay - gives you time to switch to the target application
SAFETY_DELAY = 5

def export_monthly_report(year, month):
    """Automate exporting a monthly report from a financial application.
    
    Args:
        year: Year for the report
        month: Month number (1-12) for the report
    """
    # Convert month number to name for the filename
    month_name = datetime.strptime(f"{month}", "%m").strftime("%B")
    
    print(f"Preparing to export {month_name} {year} report...")
    print(f"Switch to your financial application within {SAFETY_DELAY} seconds!")
    time.sleep(SAFETY_DELAY)
    
    # Click on 'Reports' menu
    pyautogui.click(x=100, y=20)  # Adjust coordinates based on your application
    time.sleep(1)
    
    # Click on 'Monthly' option
    pyautogui.click(x=100, y=50)  # Adjust coordinates based on your application
    time.sleep(1)
    
    # Fill in date fields
    pyautogui.typewrite(str(year))
    pyautogui.press('tab')
    pyautogui.typewrite(str(month).zfill(2))
    pyautogui.press('tab')
    
    # Click 'Generate Report' button
    pyautogui.click(x=200, y=300)  # Adjust coordinates based on your application
    time.sleep(3)  # Wait for report to generate
    
    # Save the report
    pyautogui.hotkey('ctrl', 's')  # Press Ctrl+S to save
    time.sleep(1)
    
    # Type the filename
    filename = f"Financial_Report_{year}_{month_name}.xlsx"
    pyautogui.typewrite(filename)
    pyautogui.press('enter')
    time.sleep(2)
    
    print(f"Report exported as {filename}")

def main():
    parser = argparse.ArgumentParser(description='Automate monthly report export')
    parser.add_argument('--year', type=int, default=datetime.now().year, 
                        help='Year for the report (default: current year)')
    parser.add_argument('--month', type=int, default=datetime.now().month - 1 or 12,
                        help='Month for the report (1-12, default: previous month)')
    
    args = parser.parse_args()
    
    # Validate month
    if not 1 <= args.month <= 12:
        print("Error: Month must be between 1 and 12")
        return
        
    export_monthly_report(args.year, args.month)

if __name__ == "__main__":
    main()
```

**Important note**: The coordinates in this script (e.g., `pyautogui.click(x=100, y=20)`) need to be adjusted for your specific application. Use `pyautogui.position()` to get the coordinates of your mouse pointer.

### PyAutoGUI Key Functions

- `pyautogui.click(x, y)`: Move mouse to coordinates and click
- `pyautogui.typewrite('text')`: Type text
- `pyautogui.press('key')`: Press a single key
- `pyautogui.hotkey('ctrl', 's')`: Press multiple keys simultaneously
- `pyautogui.screenshot()`: Take a screenshot
- `pyautogui.locateOnScreen('image.png')`: Find an image on screen

## Putting It All Together: Sample Financial Automation Project

Let's build a financial quarter-end automation tool that:
1. Creates organized backup of last quarter's data
2. Generates reports using a GUI application
3. Organizes the reports into the correct folders

```python
import os
import argparse
import time
import datetime
import pyautogui
import shutil
import zipfile

def get_last_quarter(reference_date=None):
    """Calculate the previous quarter based on a reference date."""
    if reference_date is None:
        reference_date = datetime.datetime.now()
    
    current_month = reference_date.month
    current_year = reference_date.year
    
    # Calculate previous quarter end month (3, 6, 9, or 12)
    last_quarter_month = ((current_month - 1) // 3) * 3
    if last_quarter_month == 0:
        last_quarter_month = 12
        last_quarter_year = current_year - 1
    else:
        last_quarter_year = current_year
        
    return last_quarter_year, last_quarter_month

def create_backup(data_dir, backup_dir=None):
    """Create a date-stamped ZIP backup."""
    if backup_dir is None:
        backup_dir = os.path.join(os.path.dirname(data_dir), 'Quarterly_Backups')
    
    os.makedirs(backup_dir, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_filename = f"Financial_Data_Backup_{timestamp}.zip"
    backup_path = os.path.join(backup_dir, backup_filename)
    
    with zipfile.ZipFile(backup_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(data_dir):
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, data_dir)
                zipf.write(file_path, rel_path)
                print(f"Added {rel_path} to backup")
    
    print(f"Backup created at: {backup_path}")
    return backup_path

def generate_quarterly_reports(year, quarter, output_dir):
    """Automate generating quarterly reports using PyAutoGUI."""
    os.makedirs(output_dir, exist_ok=True)
    
    # Calculate quarter end month
    end_month = quarter * 3
    
    # Quarter name for folder organization
    quarter_name = f"Q{quarter}_{year}"
    
    print(f"Preparing to generate {quarter_name} reports...")
    print("Switch to your financial application within 5 seconds!")
    time.sleep(5)
    
    # This is a simplified example - you would need to adjust coordinates
    # and actions based on your specific application
    
    # Click on Reports menu
    pyautogui.click(x=100, y=20)
    time.sleep(1)
    
    # Click on Quarterly Reports
    pyautogui.click(x=100, y=80)
    time.sleep(1)
    
    # Enter year and quarter
    pyautogui.typewrite(str(year))
    pyautogui.press('tab')
    pyautogui.typewrite(str(quarter))
    pyautogui.press('tab')
    
    # Generate reports
    report_types = [
        "Income_Statement",
        "Balance_Sheet",
        "Cash_Flow",
        "Accounts_Receivable"
    ]
    
    for report_type in report_types:
        # Select report type from dropdown
        pyautogui.press('down', presses=report_types.index(report_type) + 1)
        pyautogui.press('enter')
        time.sleep(1)
        
        # Click Generate button
        pyautogui.click(x=200, y=300)
        time.sleep(3)  # Wait for report to generate
        
        # Save report
        pyautogui.hotkey('ctrl', 's')
        time.sleep(1)
        
        # Type filename and save to output directory
        filename = f"{report_type}_{quarter_name}.xlsx"
        filepath = os.path.join(output_dir, filename)
        pyautogui.typewrite(filepath)
        pyautogui.press('enter')
        time.sleep(2)
        
        print(f"Generated {filename}")
        
        # Return to report selection
        pyautogui.click(x=150, y=150)
        time.sleep(1)
    
    return output_dir

def organize_reports(reports_dir, organized_dir=None):
    """Organize reports into a structured folder system."""
    if organized_dir is None:
        organized_dir = os.path.join(os.path.dirname(reports_dir), 'Organized_Reports')
    
    os.makedirs(organized_dir, exist_ok=True)
    
    # Process each file in the reports directory
    for filename in os.listdir(reports_dir):
        file_path = os.path.join(reports_dir, filename)
        
        # Skip directories
        if os.path.isdir(file_path):
            continue
            
        # Extract information from filename
        parts = filename.split('_')
        if len(parts) >= 3:
            report_type = parts[0]
            quarter_info = parts[1]  # e.g., "Q1"
            year = parts[2].split('.')[0]  # Remove file extension
            
            # Create folders if they don't exist
            year_dir = os.path.join(organized_dir, year)
            os.makedirs(year_dir, exist_ok=True)
            
            quarter_dir = os.path.join(year_dir, quarter_info)
            os.makedirs(quarter_dir, exist_ok=True)
            
            # Copy the file to its destination
            dest_path = os.path.join(quarter_dir, filename)
            shutil.copy2(file_path, dest_path)
            print(f"Organized {filename} to {dest_path}")
    
    return organized_dir

def main():
    parser = argparse.ArgumentParser(description='Automate quarterly financial processes')
    parser.add_argument('--data-dir', default='./Financial_Data',
                       help='Directory containing financial data')
    parser.add_argument('--year', type=int, 
                       help='Year for processing (default: previous quarter\'s year)')
    parser.add_argument('--quarter', type=int,
                       help='Quarter for processing (1-4, default: previous quarter)')
    
    args = parser.parse_args()
    
    # Determine year and quarter if not specified
    if args.year is None or args.quarter is None:
        calc_year, calc_month = get_last_quarter()
        
        # Map month to quarter
        calc_quarter = (calc_month + 2) // 3
        
        if args.year is None:
            args.year = calc_year
        if args.quarter is None:
            args.quarter = calc_quarter
    
    # Validate quarter
    if not 1 <= args.quarter <= 4:
        print("Error: Quarter must be between 1 and 4")
        return
    
    print(f"=== Starting Quarter-End Process for Q{args.quarter} {args.year} ===")
    
    # Step 1: Create backup
    print("\n-- Step 1: Creating Data Backup --")
    backup_path = create_backup(args.data_dir)
    
    # Step 2: Generate reports
    print("\n-- Step 2: Generating Quarterly Reports --")
    reports_dir = f"./Reports_Q{args.quarter}_{args.year}"
    reports_path = generate_quarterly_reports(args.year, args.quarter, reports_dir)
    
    # Step 3: Organize reports
    print("\n-- Step 3: Organizing Reports --")
    organized_dir = organize_reports(reports_path)
    
    print("\n=== Quarter-End Process Complete ===")
    print(f"Data backup: {backup_path}")
    print(f"Reports directory: {reports_path}")
    print(f"Organized reports: {organized_dir}")

if __name__ == "__main__":
    main()
```

## Conclusion

Automation is where Python really shines for finance professionals. Even if you never build a complex data model or web application, these automation tools can save you hours of repetitive work each week:

- CLI tools with `argparse` help you build flexible, reusable scripts
- Package entry points let you install your tools system-wide
- File operations with `os` and `shutil` organize your financial documents
- PyAutoGUI can automate interactions with desktop financial applications

As you build your automation toolkit, start small with scripts that solve specific pain points in your workflow. Over time, you'll develop a collection of tools that dramatically increase your productivity.

## Next Steps

- Try automating a simple task you perform regularly
- Build a command-line tool for a financial calculation you frequently need
- Create a script to organize a messy folder of financial documents
- Consider which parts of your quarter-end process could be automated

Remember that the best automations are the ones that solve your specific problems. The scripts in this post are just starting points - customize them to fit your unique workflow needs.

## Resources

- [argparse documentation](https://docs.python.org/3/library/argparse.html)
- [PyAutoGUI documentation](https://pyautogui.readthedocs.io/en/latest/)
- [Python Packaging User Guide](https://packaging.python.org/en/latest/)
- [shutil documentation](https://docs.python.org/3/library/shutil.html)
- [Real Python: Command-Line Apps with argparse](https://realpython.com/command-line-interfaces-python-argparse/)