---
title: "Part 4: Core Data Structures in Python"
date: 2025-05-22
slug: python-foundations-data-structures
description: "Explore Python's essential data structures: lists, tuples, dictionaries, and sets. Learn creation methods, manipulation techniques, and guidelines for choosing the right structure for your tasks."
tags: ["python", "data structures", "lists", "tuples", "dictionaries", "sets", "collections"]
categories: ["Python Series"]
series: ["Python Mastery"]
series_order: 5
showToc: true
TocOpen: false
draft: false
#weight: 4
cover:
    image: "images/python-series/part4-cover.jpg"
    alt: "Python Data Structures"
    caption: "Organizing data efficiently in Python"
    relative: false
---

# Post 4: Core Data Structures

Welcome to the fourth post in my Python learning journey. So far, we've installed Python, set up a development environment, and explored the basic syntax. Now it's time to dive deeper into Python's core data structures—the building blocks you'll use to organize and manipulate data in your programs.

In this post, we'll cover:

1. Lists: Python's versatile sequence type
2. Tuples: Immutable collections
3. Dictionaries: Key-value mapping
4. Sets: Unique value collections
5. Choosing the right data structure

As a finance professional, I've found these data structures similar to concepts we use every day—lists are like columns in spreadsheets, dictionaries resemble lookup tables, and sets are perfect for tracking unique items like account codes.

---

## 1. Lists

Lists are ordered, mutable (changeable) collections that can contain items of different types. They're perhaps the most commonly used data structure in Python.

### 1.1 Creating Lists

```python
# Empty list
empty_list = []

# List with initial values
numbers = [1, 2, 3, 4, 5]
mixed_data = [42, "hello", True, 3.14]

# Creating a list with the list() constructor
chars = list("Python")  # ['P', 'y', 't', 'h', 'o', 'n']

# List of repeated values
zeros = [0] * 5  # [0, 0, 0, 0, 0]
```

### 1.2 Accessing List Elements

```python
expenses = [1200, 450, 700, 95, 800]

# Indexing (zero-based)
first_expense = expenses[0]  # 1200
last_expense = expenses[-1]  # 800

# Slicing [start:end:step] - end index is exclusive
first_three = expenses[0:3]  # [1200, 450, 700]
# Shorthand for starting from beginning
first_three = expenses[:3]   # [1200, 450, 700]
# Shorthand for going to the end
last_three = expenses[2:]    # [700, 95, 800]
# Negative indices count from the end
last_two = expenses[-2:]     # [95, 800]
# Step value
every_other = expenses[::2]  # [1200, 700, 800]
# Reverse a list
reversed_expenses = expenses[::-1]  # [800, 95, 700, 450, 1200]
```

### 1.3 Modifying Lists

```python
departments = ["Finance", "Marketing", "IT", "Operations"]

# Changing an element
departments[1] = "Digital Marketing"

# Adding elements
departments.append("HR")  # Adds to the end
departments.insert(2, "Sales")  # Inserts at specific position

# Removing elements
departments.remove("IT")  # Removes first occurrence of value
popped_item = departments.pop()  # Removes and returns last item
popped_item = departments.pop(1)  # Removes item at index 1
del departments[0]  # Removes item at index 0

# Extending lists
dept1 = ["Finance", "HR"]
dept2 = ["IT", "Operations"]
dept1.extend(dept2)  # dept1 now contains ["Finance", "HR", "IT", "Operations"]
# Alternative: concatenation
all_depts = dept1 + dept2  # Creates a new list

# Finding elements
position = departments.index("HR")  # Raises ValueError if not found
count = departments.count("Finance")  # Counts occurrences of value
```

### 1.4 Useful List Operations

```python
numbers = [5, 2, 8, 1, 9]

# Sorting
numbers.sort()  # Modifies the list in-place: [1, 2, 5, 8, 9]
numbers.sort(reverse=True)  # Descending order: [9, 8, 5, 2, 1]

# If you don't want to modify the original list
sorted_numbers = sorted(numbers)  # Returns a new sorted list

# Reversing
numbers.reverse()  # Modifies the list in-place

# Finding min/max
minimum = min(numbers)
maximum = max(numbers)

# Sum of all elements
total = sum(numbers)

# Checking membership
if 5 in numbers:
    print("Found 5 in the list!")

# List comprehension (filtering and transforming)
even_numbers = [x for x in numbers if x % 2 == 0]
doubled = [x * 2 for x in numbers]
```

### 1.5 Nested Lists (2D Lists)

```python
# Quarterly expenses by department
quarterly_expenses = [
    [1200, 1500, 1100, 1800],  # Finance
    [900, 950, 1025, 1150],    # Marketing
    [850, 880, 920, 980]       # IT
]

# Accessing elements
finance_q1 = quarterly_expenses[0][0]  # 1200
marketing_q3 = quarterly_expenses[1][2]  # 1025

# Looping through a 2D list
for department in quarterly_expenses:
    for expense in department:
        print(expense, end=" ")
    print()  # New line after each department
```

---

## 2. Tuples

Tuples are similar to lists but are immutable (cannot be changed after creation). They're commonly used for fixed collections of items.

### 2.1 Creating Tuples

```python
# Empty tuple
empty_tuple = ()

# Tuple with values
coordinates = (10, 20)
person = ("John", 30, "Developer")

# Single-item tuple needs a comma
single_item = (42,)  # Without comma, it's just a number in parentheses

# Tuple packing (no parentheses needed)
employee = "Jane", 35, "Manager"

# Creating with tuple() constructor
letters = tuple("abc")  # ('a', 'b', 'c')
```

### 2.2 Accessing Tuple Elements

```python
coordinates = (10, 20, 30, 40, 50)

# Similar to list indexing and slicing
x = coordinates[0]  # 10
last = coordinates[-1]  # 50
subset = coordinates[1:4]  # (20, 30, 40)
```

### 2.3 Tuple Operations 