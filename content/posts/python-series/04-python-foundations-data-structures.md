---
title: "Part 4: Core Data Structures in Python"
date: 2025-05-15
slug: python-core-data-structures
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

```python
employee = ("Jane", 35, "Manager", "HR")

# Count and index (like lists)
age_pos = employee.index(35)
count = employee.count("Manager")

# Concatenation
more_info = employee + ("Full-time",)

# Unpacking (very useful feature!)
name, age, role, department = employee

# Returning multiple values from a function (using tuple unpacking)
def get_employee_stats():
    return "Jane", 35, 85000

name, age, salary = get_employee_stats()
```

### 2.4 Why Use Tuples?

1. **Immutability** - Values can't be changed accidentally
2. **Hashable** - Can be used as dictionary keys (lists cannot)
3. **Slightly more efficient** than lists for fixed data
4. **Signal intent** - Using a tuple indicates the data shouldn't change

```python
# Using tuples as dictionary keys (not possible with lists)
locations = {
    (40.7128, -74.0060): "New York",
    (34.0522, -118.2437): "Los Angeles"
}
```

---

## 3. Dictionaries

Dictionaries store data as key-value pairs, providing fast lookups by key. They're unordered in Python versions before 3.7 and preserve insertion order in 3.7+.

### 3.1 Creating Dictionaries

```python
# Empty dictionary
empty_dict = {}

# Dictionary with initial key-value pairs
employee = {
    "name": "Jane Smith",
    "age": 35,
    "department": "Finance",
    "salary": 75000
}

# Alternative creation with dict() constructor
employee = dict(name="Jane Smith", age=35, department="Finance")

# Creating from sequences of pairs
items = [("name", "Jane"), ("age", 35)]
employee = dict(items)
```

### 3.2 Accessing Dictionary Values

```python
employee = {
    "name": "Jane Smith",
    "age": 35,
    "department": "Finance",
    "salary": 75000
}

# Access by key
name = employee["name"]  # "Jane Smith"

# KeyError if key doesn't exist
# salary = employee["bonus"]  # Raises KeyError

# Using get() method (safer, returns None or default value if key not found)
bonus = employee.get("bonus")  # None
bonus = employee.get("bonus", 0)  # Returns 0 if key not found
```

### 3.3 Modifying Dictionaries

```python
employee = {"name": "Jane", "department": "Finance"}

# Adding or updating values
employee["age"] = 35  # Add new key-value pair
employee["name"] = "Jane Smith"  # Update existing value

# Removing items
removed_value = employee.pop("age")  # Removes and returns value
del employee["department"]  # Removes key-value pair

# Clearing all items
employee.clear()  # Empty dictionary {}
```

### 3.4 Useful Dictionary Operations

```python
expenses = {
    "rent": 1200,
    "utilities": 250,
    "groceries": 400,
    "entertainment": 150
}

# Get all keys
keys = expenses.keys()  # dict_keys(['rent', 'utilities', 'groceries', 'entertainment'])

# Get all values
values = expenses.values()  # dict_values([1200, 250, 400, 150])

# Get all key-value pairs as tuples
items = expenses.items()  # dict_items([('rent', 1200), ('utilities', 250), ...])

# Iterating over a dictionary
for key in expenses:
    print(f"{key}: ${expenses[key]}")

# Better way to iterate over keys and values
for category, amount in expenses.items():
    print(f"{category}: ${amount}")

# Check if key exists
if "rent" in expenses:
    print("Rent is accounted for")

# Merging dictionaries (Python 3.9+)
monthly = {"rent": 1200, "utilities": 250}
occasional = {"repairs": 100, "insurance": 80}
all_expenses = monthly | occasional  # Python 3.9+

# Merging dictionaries (earlier versions)
all_expenses = {**monthly, **occasional}  # Unpacking syntax

# Dictionary comprehension
doubled_expenses = {k: v * 2 for k, v in expenses.items()}
large_expenses = {k: v for k, v in expenses.items() if v > 200}
```

### 3.5 Nested Dictionaries

```python
# Department budget by quarter and category
department_budget = {
    "Finance": {
        "Q1": {"salaries": 50000, "equipment": 10000, "travel": 5000},
        "Q2": {"salaries": 52000, "equipment": 8000, "travel": 6000}
    },
    "IT": {
        "Q1": {"salaries": 60000, "equipment": 20000, "travel": 3000},
        "Q2": {"salaries": 65000, "equipment": 15000, "travel": 2000}
    }
}

# Accessing nested values
finance_q1_salaries = department_budget["Finance"]["Q1"]["salaries"]

# Safely accessing nested values
import pprint  # Pretty print module for better display of nested structures

# Loop through nested dictionary
for dept, quarters in department_budget.items():
    print(f"\n{dept} Department:")
    for quarter, categories in quarters.items():
        print(f"  {quarter}:")
        for category, amount in categories.items():
            print(f"    {category}: ${amount}")
```

---

## 4. Sets

Sets are unordered collections of unique elements. They're perfect for removing duplicates and performing mathematical set operations.

### 4.1 Creating Sets

```python
# Empty set (can't use {} as that creates an empty dictionary)
empty_set = set()

# Set with initial values
fruits = {"apple", "banana", "cherry"}

# Creating a set from a list (removes duplicates)
numbers = set([1, 2, 2, 3, 4, 4, 5])  # {1, 2, 3, 4, 5}
unique_chars = set("mississippi")  # {'m', 'i', 's', 'p'}
```

### 4.2 Set Operations

```python
employees_dept_a = {"Alice", "Bob", "Charlie", "David"}
employees_dept_b = {"Charlie", "David", "Eve", "Frank"}
candidates = {"Eve", "Grace", "Heidi"}

# Add and remove elements
employees_dept_a.add("Grace")
employees_dept_a.remove("Bob")  # Raises KeyError if not found
employees_dept_a.discard("Bob")  # No error if not found

# Set operations
# Union (all employees)
all_employees = employees_dept_a | employees_dept_b
# or
all_employees = employees_dept_a.union(employees_dept_b)

# Intersection (employees in both departments)
in_both_depts = employees_dept_a & employees_dept_b
# or
in_both_depts = employees_dept_a.intersection(employees_dept_b)

# Difference (employees in A but not in B)
only_in_a = employees_dept_a - employees_dept_b
# or
only_in_a = employees_dept_a.difference(employees_dept_b)

# Symmetric difference (employees in either dept but not both)
in_one_dept = employees_dept_a ^ employees_dept_b
# or
in_one_dept = employees_dept_a.symmetric_difference(employees_dept_b)

# Subset and superset
is_subset = employees_dept_a <= employees_dept_b  # False
is_proper_subset = candidates < all_employees  # True (candidates is a proper subset of all_employees)
```

### 4.3 Common Set Uses

```python
# Removing duplicates from a list
transactions = [1001, 1002, 1001, 1003, 1002, 1004]
unique_transactions = list(set(transactions))

# Membership testing (very efficient for large datasets)
if "Alice" in employees_dept_a:
    print("Alice works in Department A")

# Finding common elements
customer_ids = {101, 102, 103, 104, 105}
premium_ids = {102, 104, 106}
common_ids = customer_ids & premium_ids

# Set comprehensions
even_numbers = {x for x in range(10) if x % 2 == 0}  # {0, 2, 4, 6, 8}
```

---

## 5. Choosing the Right Data Structure

Selecting the appropriate data structure can make your code more efficient and readable. Here's a quick guide:

### 5.1 When to Use Each Structure

**Use Lists when:**
- You need an ordered collection
- Items might need to be changed, added, or removed
- You need to store duplicate values
- You need to maintain insertion order

**Use Tuples when:**
- You have a fixed collection that shouldn't change
- You want to return multiple values from a function
- You need elements that can serve as dictionary keys
- You want to ensure data integrity (immutability)

**Use Dictionaries when:**
- You need key-value mapping (lookups by key)
- You want fast lookups by a specific identifier
- You're working with named attributes or properties
- You need to count occurrences of items

**Use Sets when:**
- You only care about unique values (no duplicates)
- You need to perform set operations (union, intersection)
- You want to quickly check if an item exists
- You're removing duplicates from a collection

### 5.2 Performance Considerations

Data structure choice affects performance. In general:

- **Lists**: O(1) for append/pop at end, O(n) for insert/delete elsewhere
- **Dictionaries**: O(1) average for key lookups, insertions, and deletions
- **Sets**: O(1) average for membership testing, adding, removing

```python
# Example: Different approaches to counting word frequencies

text = "to be or not to be that is the question"
words = text.split()

# Using a list (inefficient for counting)
def count_with_list(words):
    counts = []
    for word in words:
        found = False
        for item in counts:
            if item[0] == word:
                item[1] += 1
                found = True
                break
        if not found:
            counts.append([word, 1])
    return counts

# Using a dictionary (efficient)
def count_with_dict(words):
    counts = {}
    for word in words:
        if word in counts:
            counts[word] += 1
        else:
            counts[word] = 1
    return counts

# Even more concise with collections.Counter
from collections import Counter
def count_with_counter(words):
    return Counter(words)

# Compare results
print(count_with_list(words))
print(count_with_dict(words))
print(dict(count_with_counter(words)))
```

---

## Practice Exercise: Financial Portfolio Tracker

Let's apply these data structures by creating a simple portfolio tracker:

```python
def portfolio_tracker():
    # Initialize portfolio using a dictionary of dictionaries
    portfolio = {}
    transactions = []
    
    while True:
        print("\nPortfolio Tracker")
        print("1. Add stock")
        print("2. Record transaction")
        print("3. View portfolio")
        print("4. View transaction history")
        print("5. Top holdings")
        print("6. Exit")
        
        choice = input("Enter your choice (1-6): ")
        
        if choice == "1":
            ticker = input("Enter stock ticker symbol: ").upper()
            company = input("Enter company name: ")
            sector = input("Enter sector: ")
            
            portfolio[ticker] = {
                "company": company,
                "sector": sector,
                "shares": 0,
                "cost_basis": 0,
                "current_price": float(input("Enter current price: $"))
            }
            print(f"Added {ticker} to portfolio.")
            
        elif choice == "2":
            ticker = input("Enter stock ticker symbol: ").upper()
            if ticker not in portfolio:
                print(f"Error: {ticker} not in portfolio. Add it first.")
                continue
                
            transaction_type = input("Buy or sell? ").lower()
            shares = int(input("Number of shares: "))
            price = float(input("Price per share: $"))
            date = input("Date (YYYY-MM-DD): ")
            
            # Record transaction
            transaction = (date, ticker, transaction_type, shares, price)
            transactions.append(transaction)
            
            # Update portfolio
            if transaction_type == "buy":
                # Calculate new cost basis
                current_shares = portfolio[ticker]["shares"]
                current_basis = portfolio[ticker]["cost_basis"]
                new_shares = current_shares + shares
                
                if new_shares > 0:  # Avoid division by zero
                    new_basis = (current_shares * current_basis + shares * price) / new_shares
                else:
                    new_basis = 0
                
                portfolio[ticker]["shares"] += shares
                portfolio[ticker]["cost_basis"] = new_basis
            
            elif transaction_type == "sell":
                if portfolio[ticker]["shares"] < shares:
                    print("Error: Not enough shares.")
                    transactions.pop()  # Remove the last transaction
                    continue
                portfolio[ticker]["shares"] -= shares
            
            print(f"Transaction recorded. You now have {portfolio[ticker]['shares']} shares of {ticker}.")
            
        elif choice == "3":
            if not portfolio:
                print("Portfolio is empty.")
                continue
                
            print("\nCurrent Portfolio:")
            print(f"{'Ticker':<6} {'Company':<20} {'Sector':<15} {'Shares':<8} {'Cost Basis':<12} {'Current':<9} {'Value':<12} {'Gain/Loss':<10}")
            print("-" * 100)
            
            total_value = 0
            for ticker, data in portfolio.items():
                shares = data["shares"]
                if shares > 0:  # Only show stocks we still own
                    cost_basis = data["cost_basis"]
                    current = data["current_price"]
                    value = shares * current
                    gain_loss = value - (shares * cost_basis)
                    
                    print(f"{ticker:<6} {data['company'][:20]:<20} {data['sector'][:15]:<15} {shares:<8} ${cost_basis:<10.2f} ${current:<7.2f} ${value:<10.2f} ${gain_loss:<8.2f}")
                    total_value += value
            
            print("-" * 100)
            print(f"Total Portfolio Value: ${total_value:.2f}")
            
        elif choice == "4":
            if not transactions:
                print("No transactions recorded.")
                continue
                
            print("\nTransaction History:")
            print(f"{'Date':<12} {'Ticker':<6} {'Type':<6} {'Shares':<8} {'Price':<8} {'Total':<12}")
            print("-" * 55)
            
            for date, ticker, trans_type, shares, price in transactions:
                total = shares * price
                print(f"{date:<12} {ticker:<6} {trans_type:<6} {shares:<8} ${price:<6.2f} ${total:<10.2f}")
            
        elif choice == "5":
            if not portfolio:
                print("Portfolio is empty.")
                continue
                
            # Use a list to sort holdings by value
            holdings = []
            for ticker, data in portfolio.items():
                if data["shares"] > 0:
                    value = data["shares"] * data["current_price"]
                    holdings.append((ticker, data["company"], value))
            
            # Sort by value (descending)
            holdings.sort(key=lambda x: x[2], reverse=True)
            
            print("\nTop Holdings:")
            print(f"{'Rank':<5} {'Ticker':<6} {'Company':<20} {'Value':<12}")
            print("-" * 45)
            
            for i, (ticker, company, value) in enumerate(holdings[:5], 1):
                print(f"{i:<5} {ticker:<6} {company[:20]:<20} ${value:<10.2f}")
            
        elif choice == "6":
            print("Thank you for using Portfolio Tracker!")
            break
        
        else:
            print("Invalid choice. Please try again.")

# Run the application
if __name__ == "__main__":
    portfolio_tracker()
```

This example demonstrates:
- Dictionaries for storing portfolio data
- Lists for transaction history
- Tuples for individual transactions
- Sorting and filtering data
- Calculating values based on stored data

---

## What's Next?

Now that we've covered Python's core data structures, the next post will explore functions, modules, and file I/O—essential tools for organizing your code and working with external data.

Stay tuned for Post 5: Functions, Modules & File I/O!

---

*This post is part of my journey learning Python. I'm a chartered accountant exploring programming to enhance my analytical toolkit. If you have questions or spot any errors, please reach out.*