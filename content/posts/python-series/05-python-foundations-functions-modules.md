---
title: "Part 5: Functions, Modules & File I/O in Python"
date: 2025-05-30
slug: python-functions-modules-file-io
description: "Learn how to define and use functions, organize code into modules, leverage Python's Standard Library, and perform file operations for reading and writing data."
tags: ["python", "functions", "modules", "packages", "standard library", "file io", "file handling"]
categories: ["Python Series"]
series: ["Python Mastery"]
series_order: 6
showToc: true
TocOpen: false
draft: false
#weight: 5
#cover:
    #image: "images/python-series/part5-cover.jpg"
    #alt: "Python Functions and Modules"
    #caption: "Structuring and organizing Python code"
    #relative: false
--- 

# Functions, Modules & File I/O in Python

These next concepts incredibly useful for organising code and working with external data. Let's explore how Python handles functions, modules, and file operations - all essential skills for financial analysis and reporting.

## Defining and Calling Functions

Functions are reusable blocks of code that perform specific tasks. They help keep your code DRY (Don't Repeat Yourself) and make it more maintainable.

### Basic Function Syntax

```python
def function_name(parameters):
    """Docstring explaining what the function does."""
    # Function body
    return result  # Optional
```

Here's a simple function that calculates compound interest:

```python
def calculate_compound_interest(principal, rate, time, compounds_per_year=1):
    """
    Calculate compound interest.
    
    Args:
        principal: Initial investment amount
        rate: Annual interest rate (as decimal, e.g., 0.05 for 5%)
        time: Time period in years
        compounds_per_year: Number of times interest compounds per year (default=1)
    
    Returns:
        The final amount after compound interest
    """
    return principal * (1 + rate/compounds_per_year)**(compounds_per_year*time)
```

Let's call this function:

```python
# Calculate investment growth at 5% interest, compounded quarterly for 10 years
initial_investment = 10000
final_amount = calculate_compound_interest(
    principal=initial_investment, 
    rate=0.05, 
    time=10, 
    compounds_per_year=4
)
print(f"${initial_investment} will grow to ${final_amount:.2f} after 10 years")
```

**Output:**
```
$10000 will grow to $16470.09 after 10 years
```

### Function Arguments

Python offers flexible ways to handle function arguments:

#### Positional vs. Keyword Arguments

```python
# Positional arguments (order matters)
result1 = calculate_compound_interest(10000, 0.05, 10, 4)

# Keyword arguments (order doesn't matter)
result2 = calculate_compound_interest(
    rate=0.05,
    principal=10000,
    compounds_per_year=4,
    time=10
)
```

#### Default Parameter Values

In our function, `compounds_per_year=1` provides a default value if not specified:

```python
# Using the default compounds_per_year (annual compounding)
annual_result = calculate_compound_interest(10000, 0.05, 10)
print(f"With annual compounding: ${annual_result:.2f}")
```

#### Variable Number of Arguments

For functions that need to accept varying numbers of arguments:

```python
# *args collects extra positional arguments as a tuple
def sum_all_values(*args):
    """Sum any number of values."""
    return sum(args)

# **kwargs collects extra keyword arguments as a dictionary
def create_financial_report(report_date, **kwargs):
    """Create a financial report with flexible data points."""
    report = {"date": report_date}
    report.update(kwargs)
    return report

# Example usage
total = sum_all_values(100, 250, 300, 75)
print(f"Total: ${total}")

report = create_financial_report(
    "2025-04-28",
    revenue=150000,
    expenses=95000,
    net_profit=55000,
    profit_margin=0.37
)
print(report)
```

## Variable Scope and Namespaces

Understanding scope is crucial for debugging and writing clean code.

### Local vs. Global Scope

```python
total_assets = 1000000  # Global variable

def calculate_roi(profit):
    investment = 100000  # Local variable
    return profit / investment * 100

# investment is not accessible here
print(f"Total assets: ${total_assets}")

roi = calculate_roi(25000)
print(f"ROI: {roi}%")
```

Local variables exist only within their function. Global variables can be accessed inside functions, but to modify them, you need the `global` keyword:

```python
balance = 5000  # Global variable

def deposit(amount):
    global balance  # Tell Python we want to modify the global variable
    balance += amount
    return balance

def withdraw(amount):
    global balance
    if balance >= amount:
        balance -= amount
        return balance
    else:
        return "Insufficient funds"

print(f"Initial balance: ${balance}")
deposit(1000)
print(f"After deposit: ${balance}")
withdraw(2000)
print(f"After withdrawal: ${balance}")
```

### Namespaces

Python uses namespaces to organise names and avoid conflicts. Each module, function, and class has its own namespace.

## Organising Code into Modules and Packages

As your financial scripts grow, organising code becomes essential.

### Modules

A module is simply a `.py` file containing code. Let's create a financial utilities module:

```python
# financial_utils.py
def calculate_roi(profit, investment):
    """Calculate Return on Investment as a percentage."""
    return (profit / investment) * 100

def calculate_npv(cash_flows, discount_rate):
    """
    Calculate Net Present Value of a series of cash flows.
    
    Args:
        cash_flows: List of cash flows, where index 0 is the initial investment (negative)
        discount_rate: Discount rate as decimal (e.g., 0.1 for 10%)
    """
    npv = 0
    for t, cash_flow in enumerate(cash_flows):
        npv += cash_flow / (1 + discount_rate) ** t
    return npv
```

To use this module:

```python
# main.py
import financial_utils

# Calculate ROI
investment = 50000
profit = 12500
roi = financial_utils.calculate_roi(profit, investment)
print(f"ROI: {roi}%")

# Calculate NPV of a project
cash_flows = [-100000, 30000, 35000, 45000, 50000]  # Initial investment + 4 years of returns
npv = financial_utils.calculate_npv(cash_flows, 0.08)
print(f"NPV: ${npv:.2f}")
```

You can also import specific functions:

```python
from financial_utils import calculate_roi, calculate_npv

# Now use without the module prefix
roi = calculate_roi(12500, 50000)
```

### Packages

Packages are directories containing multiple modules. They require an `__init__.py` file (which can be empty) to be recognised as packages.

```
finance_package/
├── __init__.py
├── analysis.py
├── reporting.py
└── utils.py
```

Using packages:

```python
# Import specific modules from a package
from finance_package import analysis, reporting

# Import specific functions from a module in a package
from finance_package.utils import calculate_roi
```

## Exploring the Standard Library

Python comes with a rich standard library. Here are some modules particularly useful for financial applications:

### Math Module

```python
import math

# Calculate loan payment using the PMT formula
principal = 250000
annual_rate = 0.04  # 4%
years = 30
monthly_rate = annual_rate / 12
num_payments = years * 12

# Monthly payment formula
payment = principal * (monthly_rate * math.pow(1 + monthly_rate, num_payments)) / (math.pow(1 + monthly_rate, num_payments) - 1)
print(f"Monthly mortgage payment: ${payment:.2f}")
```

### Random Module

```python
import random

# Simulate stock price movements (very simplified)
starting_price = 100
daily_volatility = 0.015  # 1.5%

prices = [starting_price]
for day in range(30):
    change = random.normalvariate(0, daily_volatility)
    new_price = prices[-1] * (1 + change)
    prices.append(new_price)

print(f"Starting price: ${starting_price:.2f}")
print(f"Ending price: ${prices[-1]:.2f}")
print(f"30-day return: {(prices[-1]/prices[0] - 1) * 100:.2f}%")
```

### Datetime Module

```python
from datetime import datetime, timedelta

# Calculate business days between dates
def business_days_between(start_date, end_date):
    """Count business days between two dates (excluding weekends)."""
    days = 0
    current_date = start_date
    while current_date <= end_date:
        # Monday = 0, Sunday = 6
        if current_date.weekday() < 5:  # Only count weekdays (0-4)
            days += 1
        current_date += timedelta(days=1)
    return days

# Calculate days until fiscal year end
today = datetime.now()
fiscal_year_end = datetime(today.year, 12, 31)
if today > fiscal_year_end:
    fiscal_year_end = datetime(today.year + 1, 12, 31)

business_days = business_days_between(today, fiscal_year_end)
print(f"Business days until fiscal year end: {business_days}")
```

### OS and Sys Modules

```python
import os
import sys

# Get the current working directory (useful for file paths)
current_dir = os.getcwd()
print(f"Current directory: {current_dir}")

# List all Excel files in the current directory
excel_files = [file for file in os.listdir() if file.endswith(('.xlsx', '.xls'))]
print("Excel files found:")
for file in excel_files:
    print(f"- {file}")

# Get Python version and platform information
print(f"Python version: {sys.version}")
print(f"Platform: {sys.platform}")
```

## Reading from/Writing to Text Files

File operations are essential for financial data analysis, reporting, and automation.

### Opening and Closing Files

The basic pattern is:

```python
# Open a file in read mode
file = open('data.txt', 'r')
# Do something with the file
content = file.read()
# Close the file
file.close()
```

However, this approach has problems if an error occurs before `close()`. The preferred way is using the `with` statement:

### The with Statement

```python
# Automatically handles proper closing of the file
with open('data.txt', 'r') as file:
    content = file.read()
    # File processing here

# File is automatically closed when the block ends
```

### Reading Text Files

Let's work with a sample CSV file containing financial transactions:

```python
# Sample contents of transactions.csv:
# date,description,amount
# 2025-01-15,Office supplies,-129.99
# 2025-01-18,Client payment,1500.00
# 2025-01-22,Software subscription,-49.99
# 2025-01-30,Consulting fees,2750.00

with open('transactions.csv', 'r') as file:
    # Read the entire file as a single string
    content = file.read()
    print("File contents:")
    print(content)
```

Reading line by line:

```python
with open('transactions.csv', 'r') as file:
    # Skip header
    header = file.readline()
    
    # Initialise counters
    total_income = 0
    total_expenses = 0
    
    # Process each transaction
    for line in file:
        # Remove whitespace and split by comma
        date, description, amount = line.strip().split(',')
        
        # Convert amount to float
        amount = float(amount)
        
        if amount >= 0:
            total_income += amount
        else:
            total_expenses += amount
    
    print(f"Total income: ${total_income:.2f}")
    print(f"Total expenses: ${total_expenses:.2f}")
    print(f"Net cash flow: ${total_income + total_expenses:.2f}")
```

### Writing to Text Files

Let's create a simple financial report:

```python
# Sample transaction data
transactions = [
    {"date": "2025-01-15", "description": "Office supplies", "amount": -129.99},
    {"date": "2025-01-18", "description": "Client payment", "amount": 1500.00},
    {"date": "2025-01-22", "description": "Software subscription", "amount": -49.99},
    {"date": "2025-01-30", "description": "Consulting fees", "amount": 2750.00}
]

# Calculate summary statistics
total_income = sum(t["amount"] for t in transactions if t["amount"] > 0)
total_expenses = sum(t["amount"] for t in transactions if t["amount"] < 0)
net_cash_flow = total_income + total_expenses

# Write the report to a file
with open('financial_report.txt', 'w') as report_file:
    report_file.write("MONTHLY FINANCIAL REPORT\n")
    report_file.write("======================\n\n")
    
    report_file.write("TRANSACTION DETAILS:\n")
    report_file.write("-----------------\n")
    
    for t in transactions:
        amount_str = f"${abs(t['amount']):.2f}"
        if t["amount"] < 0:
            amount_str = f"-{amount_str}"
        
        report_file.write(f"{t['date']} | {t['description'].ljust(20)} | {amount_str}\n")
    
    report_file.write("\nSUMMARY:\n")
    report_file.write("--------\n")
    report_file.write(f"Total Income:    ${total_income:.2f}\n")
    report_file.write(f"Total Expenses:  ${total_expenses:.2f}\n")
    report_file.write(f"Net Cash Flow:   ${net_cash_flow:.2f}\n")

print("Financial report generated: financial_report.txt")
```

### Handling Different File Modes

- `'r'`: Read (default)
- `'w'`: Write (creates new file or truncates existing)
- `'a'`: Append (adds to end of file)
- `'r+'`: Read and write
- `'b'`: Binary mode (used with other modes, e.g., `'rb'`)

## Working with CSV Files

While you can process CSV files manually as shown above, Python's `csv` module makes it easier:

```python
import csv

# Reading CSV
with open('transactions.csv', 'r') as file:
    csv_reader = csv.DictReader(file)
    
    # Process each row as a dictionary
    transactions = []
    for row in csv_reader:
        # Convert amount from string to float
        row['amount'] = float(row['amount'])
        transactions.append(row)
    
    print(f"Loaded {len(transactions)} transactions")

# Writing CSV
with open('budget_forecast.csv', 'w', newline='') as file:
    # Define column headers
    fieldnames = ['month', 'revenue', 'expenses', 'profit']
    
    # Create CSV writer
    csv_writer = csv.DictWriter(file, fieldnames=fieldnames)
    
    # Write header row
    csv_writer.writeheader()
    
    # Write data rows
    for month in range(1, 13):
        # Simple forecast model (for demonstration)
        revenue = 15000 + (month * 500)  # Increasing monthly
        expenses = 10000 + (month * 200)  # Increasing but slower
        profit = revenue - expenses
        
        csv_writer.writerow({
            'month': f"2025-{month:02d}",
            'revenue': revenue,
            'expenses': expenses,
            'profit': profit
        })

print("Budget forecast generated: budget_forecast.csv")
```

## Practical Example: Expense Analyser

Let's combine everything we've learned into a practical financial tool that:

1. Reads expense data from a CSV file
2. Categorises and analyses expenses
3. Generates a report with summary statistics

```python
import csv
from datetime import datetime
import os

def load_expenses(filename):
    """Load expense data from a CSV file."""
    expenses = []
    
    with open(filename, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            # Convert amount to float and date to datetime
            row['amount'] = float(row['amount'])
            row['date'] = datetime.strptime(row['date'], '%Y-%m-%d')
            expenses.append(row)
    
    return expenses

def categorize_expenses(expenses):
    """Group expenses by category."""
    categories = {}
    
    for expense in expenses:
        category = expense['category']
        
        if category not in categories:
            categories[category] = []
        
        categories[category].append(expense)
    
    return categories

def calculate_category_totals(categories):
    """Calculate total amount for each expense category."""
    totals = {}
    
    for category, expenses in categories.items():
        totals[category] = sum(expense['amount'] for expense in expenses)
    
    return totals

def generate_expense_report(expenses, categories, totals, output_file):
    """Generate a detailed expense report."""
    total_expenses = sum(totals.values())
    
    with open(output_file, 'w') as file:
        # Write header
        file.write("EXPENSE ANALYSIS REPORT\n")
        file.write("======================\n\n")
        
        # Write summary
        file.write(f"Total Expenses: ${total_expenses:.2f}\n")
        file.write(f"Number of Transactions: {len(expenses)}\n")
        file.write(f"Date Range: {min(e['date'] for e in expenses).strftime('%Y-%m-%d')} to {max(e['date'] for e in expenses).strftime('%Y-%m-%d')}\n\n")
        
        # Write category breakdown
        file.write("EXPENSE BREAKDOWN BY CATEGORY\n")
        file.write("----------------------------\n")
        
        # Sort categories by total amount (descending)
        sorted_categories = sorted(totals.items(), key=lambda x: x[1], reverse=True)
        
        for category, amount in sorted_categories:
            percentage = (amount / total_expenses) * 100
            file.write(f"{category.ljust(20)} ${amount:.2f} ({percentage:.1f}%)\n")
        
        # Write transaction details for each category
        file.write("\nDETAILED TRANSACTIONS BY CATEGORY\n")
        file.write("--------------------------------\n\n")
        
        for category, amount in sorted_categories:
            file.write(f"{category.upper()}\n")
            file.write(f"{'-' * len(category)}\n")
            
            # Sort expenses by date
            sorted_expenses = sorted(categories[category], key=lambda x: x['date'])
            
            for expense in sorted_expenses:
                date_str = expense['date'].strftime('%Y-%m-%d')
                file.write(f"{date_str} | {expense['description'].ljust(30)} | ${expense['amount']:.2f}\n")
            
            # Add category subtotal
            file.write(f"{'SUBTOTAL:'.ljust(41)} ${amount:.2f}\n\n")

# Usage example (assuming we have an expenses.csv file)
def main():
    # Check if the input file exists
    input_file = 'expenses.csv'
    if not os.path.exists(input_file):
        print(f"Error: File '{input_file}' not found.")
        print("Creating a sample expense file for demonstration...")
        
        # Create a sample file for demonstration
        with open(input_file, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['date', 'category', 'description', 'amount'])
            writer.writerow(['2025-01-05', 'Office', 'Printer paper', 24.99])
            writer.writerow(['2025-01-10', 'Software', 'Accounting software', 89.99])
            writer.writerow(['2025-01-15', 'Office', 'Desk organiser', 32.50])
            writer.writerow(['2025-01-18', 'Travel', 'Client meeting transportation', 45.75])
            writer.writerow(['2025-01-22', 'Software', 'Cloud storage subscription', 9.99])
            writer.writerow(['2025-01-25', 'Meals', 'Team lunch', 87.50])
            writer.writerow(['2025-01-29', 'Office', 'Printer ink', 65.85])
            writer.writerow(['2025-02-03', 'Travel', 'Conference registration', 299.00])
            writer.writerow(['2025-02-07', 'Meals', 'Client dinner', 125.40])
            writer.writerow(['2025-02-15', 'Software', 'Data analysis tool', 149.99])
        
        print(f"Sample file '{input_file}' created.")
    
    # Process the expense data
    expenses = load_expenses(input_file)
    categories = categorize_expenses(expenses)
    totals = calculate_category_totals(categories)
    
    # Generate the report
    output_file = 'expense_report.txt'
    generate_expense_report(expenses, categories, totals, output_file)
    
    print(f"Expense report generated: {output_file}")

if __name__ == "__main__":
    main()
```

This script demonstrates:

- Function definitions with docstrings
- File I/O with the `with` statement
- CSV processing
- Module imports and usage
- Error handling

## Conclusion

Functions, modules, and file I/O form the backbone of most Python applications, especially for financial tasks. By mastering these concepts, you'll be well-equipped to build tools for financial analysis, reporting, and automation.

In the next post, we'll explore virtual environments and package management, which will help you manage dependencies for larger projects.

**Practice Exercise:** Try extending the expense analyser to calculate monthly trends or generate a simple visualisation of spending by category. This will help reinforce the concepts we've covered while building something useful for your financial toolkit.