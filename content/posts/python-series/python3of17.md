---
title: "Part 3: Python Syntax Fundamentals & Language Features"
date: 2025-05-15
slug: python-foundations-syntax
description: "Master Python's core syntax including variables, data types, control flow, comprehensions, lambdas, iterators, generators, and basic error handling mechanisms."
tags: ["python", "syntax", "control flow", "comprehensions", "lambdas", "iterators", "generators", "error handling"]
categories: ["Python Series"]
series: ["Python Mastery"]
series_order: 4
showToc: true
TocOpen: false
draft: false
#weight: 3
#cover:
    #image: "images/python-series/part3-cover.jpg"
    #alt: "Python Syntax Fundamentals"
    #caption: "Building blocks of Python programming"
    #relative: false
---

# Post 3: Python Syntax Fundamentals & Language Features

Welcome to the third post in my Python learning journey. In the first two posts, we installed Python and set up a proper development environment. Now it's time to dive into the language itself. This post covers the fundamental building blocks of Python code that I've been learning.

We'll explore:

1. Variables and basic data types
2. Operators and expressions
3. Control flow with conditionals and loops
4. List comprehensions and lambdas
5. Iterators and generators
6. Error handling with try/except

This post is a bit longer than the previous ones, but these fundamentals form the foundation of everything else in Python, so it's worth taking the time to understand them.

---

## 1. Variables and Basic Data Types

Python is dynamically typed, meaning you don't need to declare variable types explicitly. Coming from Excel formulas where everything just works, I found this quite intuitive.

### 1.1 Variables and Assignment

Variables in Python are created when you first assign a value to them:

```python
# Creating variables
name = "Alex"
age = 35
hourly_rate = 45.50
is_python_fun = True
```

Variable names:
- Can contain letters, numbers, and underscores
- Cannot start with a number
- Are case-sensitive (`rate` and `Rate` are different variables)
- Should follow the `snake_case` convention (lowercase with underscores)

### 1.2 Basic Data Types

Python has several built-in data types:

#### Numbers
```python
# Integers (whole numbers)
count = 10
negative_number = -5

# Floating-point (decimals)
pi = 3.14159
discount_rate = 0.15

# Complex numbers
complex_number = 3 + 4j  # Not often used in business applications
```

#### Strings
```python
# Text enclosed in quotes (single or double)
first_name = "John"
last_name = 'Doe'

# Multi-line strings use triple quotes
address = """123 Main Street
Anytown, CA 12345"""

# String concatenation
full_name = first_name + " " + last_name  # "John Doe"

# f-strings (Python 3.6+) - my preferred way to format strings
greeting = f"Hello, {first_name}! You are {age} years old."
```

#### Booleans
```python
# True or False values
is_active = True
has_paid = False

# Boolean operations
is_valid_customer = is_active and has_paid  # False
can_contact = is_active or has_paid  # True
is_not_active = not is_active  # False
```

#### None Type
```python
# Represents absence of value (similar to NULL in databases)
result = None
```

### 1.3 Type Conversion

Python can convert between types:

```python
# String to number
age_str = "35"
age_num = int(age_str)  # 35 as integer
price_float = float("45.50")  # 45.5 as float

# Number to string
count_str = str(10)  # "10" as string

# Check type of a variable
print(type(age_num))  # <class 'int'>
```

---

## 2. Operators and Expressions

Python supports various operators for calculations and comparisons.

### 2.1 Arithmetic Operators

```python
a = 10
b = 3

addition = a + b        # 13
subtraction = a - b     # 7
multiplication = a * b  # 30
division = a / b        # 3.3333... (always returns float)
floor_division = a // b # 3 (integer division, rounds down)
modulus = a % b         # 1 (remainder of division)
exponent = a ** b       # 1000 (10 raised to power of 3)
```

### 2.2 Comparison Operators

```python
a = 10
b = 3

equal = a == b              # False
not_equal = a != b          # True
greater_than = a > b        # True
less_than = a < b           # False
greater_or_equal = a >= b   # True
less_or_equal = a <= b      # False
```

### 2.3 Assignment Operators

```python
# Simple assignment
x = 10

# Combined operators
x += 5   # Same as x = x + 5 (x becomes 15)
x -= 3   # Same as x = x - 3 (x becomes 12)
x *= 2   # Same as x = x * 2 (x becomes 24)
x /= 4   # Same as x = x / 4 (x becomes 6.0)
```

---

## 3. Control Flow

Control flow determines the order in which code executes based on conditions and loops.

### 3.1 Conditional Statements (if/elif/else)

Python uses indentation (whitespace) to define code blocks:

```python
age = 25

if age < 18:
    print("Minor")
elif age < 65:
    print("Adult")
else:
    print("Senior")
```

Multiple conditions:

```python
income = 75000
years_employed = 3

if income > 50000 and years_employed >= 2:
    print("Loan approved")
elif income > 30000 or years_employed >= 5:
    print("Further review needed")
else:
    print("Loan denied")
```

### 3.2 Loops

#### For Loops

For loops iterate over sequences (lists, strings, etc.):

```python
# Loop through a list
expenses = [1200, 450, 700, 95]
total = 0
for expense in expenses:
    total += expense

print(f"Total expenses: ${total}")  # Total expenses: $2445

# Loop with a range
for i in range(5):  # 0, 1, 2, 3, 4
    print(i)

# Loop with index and value using enumerate
for index, value in enumerate(expenses):
    print(f"Expense {index+1}: ${value}")
```

#### While Loops

While loops execute as long as a condition is true:

```python
count = 0
while count < 5:
    print(count)
    count += 1  # Don't forget this or you'll create an infinite loop!

# Break and continue
number = 0
while True:  # Infinite loop
    number += 1
    if number == 3:
        continue  # Skip the rest of this iteration
    if number == 6:
        break  # Exit the loop entirely
    print(number)  # Prints 1, 2, 4, 5
```

---

## 4. List Comprehensions and Lambdas

These are more advanced features that make Python code concise and expressive.

### 4.1 List Comprehensions

List comprehensions provide a compact way to create lists:

```python
# Traditional way
numbers = [1, 2, 3, 4, 5]
squares = []
for n in numbers:
    squares.append(n * n)
print(squares)  # [1, 4, 9, 16, 25]

# With list comprehension
squares = [n * n for n in numbers]
print(squares)  # [1, 4, 9, 16, 25]

# With conditional filtering
even_squares = [n * n for n in numbers if n % 2 == 0]
print(even_squares)  # [4, 16]
```

### 4.2 Dictionary and Set Comprehensions

Similar syntax works for dictionaries and sets:

```python
# Dictionary comprehension
number_to_square = {n: n * n for n in numbers}
print(number_to_square)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Set comprehension (eliminates duplicates)
values = [1, 2, 2, 3, 4, 4, 5]
unique_values = {v for v in values}
print(unique_values)  # {1, 2, 3, 4, 5}
```

### 4.3 Lambda Functions

Lambdas are small anonymous functions defined with the `lambda` keyword:

```python
# Traditional function
def add(a, b):
    return a + b

# Equivalent lambda function
add_lambda = lambda a, b: a + b

print(add(2, 3))        # 5
print(add_lambda(2, 3)) # 5
```

Lambdas are often used with functions like `map()`, `filter()`, and `sorted()`:

```python
# Map applies a function to each item in an iterable
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x * x, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# Filter creates a list of elements for which a function returns True
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)  # [2, 4]

# Sorted with a custom key function
employees = [
    {"name": "Alice", "salary": 60000},
    {"name": "Bob", "salary": 50000},
    {"name": "Charlie", "salary": 75000}
]
sorted_by_salary = sorted(employees, key=lambda emp: emp["salary"])
print(sorted_by_salary)  # Sorts employees by salary
```

---

## 5. Iterators and Generators

These features help process data efficiently, especially when working with large datasets.

### 5.1 Iterators

An iterator is an object that can be iterated (looped) over. Python's `for` loops work with iterators:

```python
# Lists, tuples, dictionaries, and sets are all iterable
numbers = [1, 2, 3]
for num in numbers:  # numbers.__iter__() is called implicitly
    print(num)
```

You can create your own iterator:

```python
# Manual iteration with iter() and next()
numbers = [1, 2, 3]
iterator = iter(numbers)

print(next(iterator))  # 1
print(next(iterator))  # 2
print(next(iterator))  # 3
# print(next(iterator))  # Would raise StopIteration exception
```

### 5.2 Generators

Generators are functions that return an iterator using the `yield` keyword:

```python
def count_up_to(max):
    count = 1
    while count <= max:
        yield count
        count += 1

# Using the generator
counter = count_up_to(5)
print(next(counter))  # 1
print(next(counter))  # 2

# Or in a loop
for number in count_up_to(3):
    print(number)  # Prints 1, 2, 3
```

Generators are memory-efficient because they generate values on-demand rather than storing the entire sequence in memory. This is especially useful for large datasets.

---

## 6. Error Handling with try/except

Python uses exceptions to handle errors gracefully:

```python
# Basic try/except
try:
    result = 10 / 0  # Division by zero raises an exception
    print(result)
except ZeroDivisionError:
    print("Cannot divide by zero!")

# Handling multiple exception types
try:
    number = int(input("Enter a number: "))
    result = 100 / number
    print(result)
except ValueError:
    print("That's not a valid number!")
except ZeroDivisionError:
    print("Cannot divide by zero!")

# Try/except/else/finally
try:
    file = open("data.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("File not found!")
else:
    # Runs if no exception occurred
    print(f"File content: {content}")
finally:
    # Always runs, regardless of exception
    if 'file' in locals() and not file.closed:
        file.close()
        print("File closed!")
```

---

## Practice Exercise: Financial Calculator

Let's apply what we've learned to build a simple financial calculator:

Create a program that:
1. Asks the user for their monthly income and expenses
2. Calculates their monthly savings
3. Projects savings over time with compound interest
4. Handles invalid inputs gracefully with try/except

Here's a starter template:

```python
def calculate_savings_projection(monthly_savings, annual_interest_rate, years):
    # Convert annual interest rate to monthly and decimal
    monthly_rate = annual_interest_rate / 100 / 12
    months = years * 12
    
    # Project savings
    total = 0
    for month in range(1, months + 1):
        total = total + monthly_savings  # Add monthly contribution
        interest = total * monthly_rate  # Calculate interest
        total = total + interest         # Add interest to total
        
        # Print yearly totals
        if month % 12 == 0:
            print(f"Year {month // 12}: ${total:.2f}")
    
    return total

try:
    income = float(input("Enter your monthly income: $"))
    expenses = float(input("Enter your monthly expenses: $"))
    
    monthly_savings = income - expenses
    if monthly_savings <= 0:
        print("Your expenses exceed your income. No savings to project.")
    else:
        interest_rate = float(input("Enter annual interest rate (%): "))
        years = int(input("Enter number of years to project: "))
        
        print(f"\nMonthly savings: ${monthly_savings:.2f}")
        print(f"Projecting growth over {years} years at {interest_rate}% annual interest:")
        
        final_amount = calculate_savings_projection(monthly_savings, interest_rate, years)
        print(f"\nFinal savings after {years} years: ${final_amount:.2f}")
        
except ValueError:
    print("Please enter valid numbers only.")
```

---

## What's Next?

Now that we've covered the syntax fundamentals, the next post will dive into Python's core data structures in more detail. We'll explore lists, tuples, dictionaries, and sets—and when to use each one.

Stay tuned for Post 4: Core Data Structures!

---

*This post is part of my journey learning Python. I'm a chartered accountant exploring programming to enhance my analytical toolkit. If you have questions or spot any errors, please leave a comment below.*