---
title: "Part 14: Introduction to Object-Oriented Programming (OOP) in Python"
date: 2025-07-31
slug: introduction-object-oriented-programming-python
description: "Understand the fundamentals of OOP in Python including classes, objects, methods, and attributes. Learn about encapsulation, inheritance, and polymorphism through practical examples."
tags: ["python", "oop", "object-oriented programming", "classes", "objects", "inheritance", "polymorphism", "encapsulation"]
categories: ["Python Series"]
series: ["Python Mastery"]
series_order: 15
showToc: true
TocOpen: false
draft: false
#weight: 14
#cover:
    #image: "images/python-series/part14-cover.jpg"
    #alt: "Python OOP"
    #caption: "Object-oriented programming with Python"
    #relative: false
--- 

# Introduction to Object-Oriented Programming (OOP) in Python: A Finance Perspective

As a finance professional learning Python, I've discovered that Object-Oriented Programming (OOP) is one of those concepts that initially seems abstract but becomes incredibly powerful once you understand it. In this post, I'll break down what OOP is, why it matters, and how we can use it to model financial concepts in our code.

## What is Object-Oriented Programming?

In the simplest terms, OOP is a programming paradigm that organizes code around "objects" rather than functions and logic. An object bundles related data (attributes) and behaviors (methods) together.

Think of it this way: in finance, we deal with various entities like accounts, investments, transactions, and financial instruments. Each has specific properties and actions associated with them. OOP gives us a way to represent these real-world entities in our code.

## Key Concepts in OOP

### 1. Classes vs. Objects

**Classes** are like blueprints or templates that define the structure and behavior of a particular type of object. **Objects** are specific instances created from these classes.

In finance terms:
- A **class** might be `BankAccount`, which describes what all bank accounts have in common
- An **object** would be a specific account, like `my_checking_account`

Let's create our first class:

```python
class BankAccount:
    """A simple bank account class"""
    
    def __init__(self, account_number, holder_name, balance=0.0):
        """Initialize a new bank account"""
        self.account_number = account_number
        self.holder_name = holder_name
        self.balance = balance
        self.transactions = []
```

### 2. The `__init__` Method and `self`

The `__init__` method (short for "initialize") is a special method that runs automatically whenever we create a new object from a class. It's sometimes called a constructor.

`self` is a reference to the specific instance of the class that's being created or operated on. It's how the object keeps track of its own data.

Let's create some bank account objects:

```python
# Creating instances of the BankAccount class
checking = BankAccount("CHK123456", "John Doe", 1000.00)
savings = BankAccount("SAV789012", "John Doe", 5000.00)

# Accessing attributes
print(f"Account Holder: {checking.holder_name}")
print(f"Checking Balance: ${checking.balance:.2f}")
print(f"Savings Balance: ${savings.balance:.2f}")
```

Output:
```
Account Holder: John Doe
Checking Balance: $1000.00
Savings Balance: $5000.00
```

### 3. Methods: Adding Behavior to Our Objects

Methods are functions that belong to a class. They define what actions objects of that class can perform.

Let's add some methods to our `BankAccount` class:

```python
class BankAccount:
    """A simple bank account class"""
    
    def __init__(self, account_number, holder_name, balance=0.0):
        """Initialize a new bank account"""
        self.account_number = account_number
        self.holder_name = holder_name
        self.balance = balance
        self.transactions = []
        
        # Record opening deposit if initial balance was provided
        if balance > 0:
            self.transactions.append(("DEPOSIT", balance, "Initial deposit"))
    
    def deposit(self, amount, description="Deposit"):
        """Add funds to the account"""
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
            
        self.balance += amount
        self.transactions.append(("DEPOSIT", amount, description))
        return self.balance
    
    def withdraw(self, amount, description="Withdrawal"):
        """Remove funds from the account if sufficient balance exists"""
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
            
        if amount > self.balance:
            raise ValueError("Insufficient funds")
            
        self.balance -= amount
        self.transactions.append(("WITHDRAWAL", amount, description))
        return self.balance
        
    def get_balance(self):
        """Return the current balance"""
        return self.balance
        
    def print_statement(self):
        """Print a simple account statement"""
        print(f"\nAccount Statement for {self.account_number} ({self.holder_name})")
        print(f"Current Balance: ${self.balance:.2f}")
        print("\nTransaction History:")
        print("Type       | Amount     | Description")
        print("-" * 50)
        
        for trans_type, amount, description in self.transactions:
            print(f"{trans_type:<10} | ${amount:<9.2f} | {description}")
```

Now let's use our enhanced `BankAccount` class:

```python
# Create a new account
account = BankAccount("CHK123456", "John Doe", 1000.00)

# Perform some transactions
account.deposit(500, "Paycheck")
account.withdraw(200, "Grocery shopping")
account.deposit(1000, "Tax refund")
account.withdraw(800, "Rent payment")

# Print a statement
account.print_statement()
```

This would output:
```
Account Statement for CHK123456 (John Doe)
Current Balance: $1500.00

Transaction History:
Type       | Amount     | Description
--------------------------------------------------
DEPOSIT    | $1000.00   | Initial deposit
DEPOSIT    | $500.00    | Paycheck
WITHDRAWAL | $200.00    | Grocery shopping
DEPOSIT    | $1000.00   | Tax refund
WITHDRAWAL | $800.00    | Rent payment
```

## The Four Pillars of OOP

### 1. Encapsulation

Encapsulation refers to bundling data and methods that operate on that data within a single unit (the class) and restricting direct access to some of an object's components. It helps protect the integrity of the data.

In Python, we use naming conventions to indicate that certain attributes or methods should be treated as private (although Python doesn't strictly enforce this):

```python
class BankAccount:
    def __init__(self, account_number, holder_name, balance=0.0):
        self.account_number = account_number
        self.holder_name = holder_name
        self._balance = balance  # Prefixed with underscore to indicate it's "protected"
        self.__transaction_id = 1000  # Double underscore for "private" attributes
        self.transactions = []
        
        if balance > 0:
            self.__record_transaction("DEPOSIT", balance, "Initial deposit")
    
    def __record_transaction(self, trans_type, amount, description):
        """Private method to record transactions with IDs"""
        self.transactions.append((self.__transaction_id, trans_type, amount, description))
        self.__transaction_id += 1
    
    def deposit(self, amount, description="Deposit"):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
            
        self._balance += amount
        self.__record_transaction("DEPOSIT", amount, description)
        return self._balance
    
    # Other methods...
```

With encapsulation:
- We've made `_balance` protected (indicated by single underscore)
- We've made `__transaction_id` and `__record_transaction` private (indicated by double underscore)
- We still provide public methods to interact with these protected attributes safely

### 2. Inheritance

Inheritance allows a class to inherit attributes and methods from another class. The original class is called the parent or base class, and the new class is the child or derived class.

Let's create specialized account types that inherit from our `BankAccount` class:

```python
class SavingsAccount(BankAccount):
    """A bank account that earns interest"""
    
    def __init__(self, account_number, holder_name, balance=0.0, interest_rate=0.01):
        # Call the parent class's __init__ method
        super().__init__(account_number, holder_name, balance)
        self.interest_rate = interest_rate
    
    def apply_interest(self):
        """Apply interest to the account balance"""
        interest = self._balance * self.interest_rate
        self.deposit(interest, "Interest payment")
        return self._balance


class CheckingAccount(BankAccount):
    """A bank account for frequent transactions with overdraft protection"""
    
    def __init__(self, account_number, holder_name, balance=0.0, overdraft_limit=100.0):
        super().__init__(account_number, holder_name, balance)
        self.overdraft_limit = overdraft_limit
    
    def withdraw(self, amount, description="Withdrawal"):
        """Override withdraw to implement overdraft protection"""
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
            
        if amount > (self._balance + self.overdraft_limit):
            raise ValueError(f"Amount exceeds balance plus overdraft limit of ${self.overdraft_limit}")
            
        self._balance -= amount
        self._record_transaction("WITHDRAWAL", amount, description)
        
        if self._balance < 0:
            self._record_transaction("FEE", 15, "Overdraft fee")
            self._balance -= 15
            
        return self._balance
```

Now we can use these specialized account types:

```python
# Create a savings account
savings = SavingsAccount("SAV12345", "John Doe", 5000.00, 0.02)  # 2% interest
savings.deposit(1000, "Bonus")
savings.apply_interest()  # Apply interest
savings.print_statement()

# Create a checking account with overdraft protection
checking = CheckingAccount("CHK67890", "John Doe", 500.00, 200.00)  # $200 overdraft limit
checking.withdraw(600, "Emergency expense")  # This will use the overdraft
checking.print_statement()
```

### 3. Polymorphism

Polymorphism allows objects of different classes to be treated as objects of a common base class. The most common use is when a parent class reference is used to refer to a child class object.

Let's see polymorphism in action with our bank accounts:

```python
def process_month_end(account):
    """Process month-end activities for any type of account"""
    print(f"Processing month-end for {account.account_number}")
    
    # Apply specific actions based on account type
    if isinstance(account, SavingsAccount):
        account.apply_interest()
        print("Applied interest to savings account")
    elif isinstance(account, CheckingAccount):
        if account.get_balance() < 100:
            print("Low balance warning issued")
    
    # Common actions for all account types
    account.print_statement()

# Create different account types
accounts = [
    BankAccount("BNK-001", "Alice Smith", 1500),
    SavingsAccount("SAV-002", "Bob Johnson", 5000, 0.025),
    CheckingAccount("CHK-003", "Carol Williams", 750, 300)
]

# Process all accounts the same way, but with type-specific behaviors
for account in accounts:
    process_month_end(account)
```

This demonstrates polymorphism—we're treating different account types through a common interface, but each responds according to its specific implementation.

### 4. Abstraction

Abstraction means hiding complex implementation details and showing only the necessary features of an object. Python supports abstraction through abstract base classes (ABCs).

Let's create an abstract base class for financial instruments:

```python
from abc import ABC, abstractmethod

class FinancialInstrument(ABC):
    """Abstract base class for financial instruments"""
    
    def __init__(self, symbol, name, current_price):
        self.symbol = symbol
        self.name = name
        self.current_price = current_price
    
    @abstractmethod
    def calculate_value(self, quantity):
        """Calculate the value of holding a certain quantity"""
        pass
    
    @abstractmethod
    def risk_level(self):
        """Return the risk level of this instrument"""
        pass
    
    def update_price(self, new_price):
        """Update the current price"""
        self.current_price = new_price


class Stock(FinancialInstrument):
    """A stock/equity financial instrument"""
    
    def __init__(self, symbol, name, current_price, beta=1.0):
        super().__init__(symbol, name, current_price)
        self.beta = beta  # Beta measures volatility
    
    def calculate_value(self, quantity):
        return self.current_price * quantity
    
    def risk_level(self):
        if self.beta < 0.8:
            return "Low"
        elif self.beta < 1.2:
            return "Medium"
        else:
            return "High"


class Bond(FinancialInstrument):
    """A bond financial instrument"""
    
    def __init__(self, symbol, name, current_price, yield_rate, maturity_date):
        super().__init__(symbol, name, current_price)
        self.yield_rate = yield_rate
        self.maturity_date = maturity_date
    
    def calculate_value(self, quantity):
        return self.current_price * quantity
    
    def risk_level(self):
        # Simple risk assessment based on yield
        if self.yield_rate < 0.03:
            return "Low"
        elif self.yield_rate < 0.06:
            return "Medium"
        else:
            return "High"
    
    def calculate_income(self, face_value, quantity):
        """Calculate annual income from the bond"""
        return face_value * quantity * self.yield_rate
```

Note that we can't create an instance of `FinancialInstrument` directly because it's abstract. We must create one of its concrete subclasses.

```python
# Try to create an abstract class instance - this would fail
# instrument = FinancialInstrument("ABST", "Abstract Instrument", 100)  # This will raise an error

# Create concrete implementations
apple_stock = Stock("AAPL", "Apple Inc.", 175.50, 1.2)
govt_bond = Bond("GOVT10", "10-Year Treasury", 98.75, 0.035, "2033-05-15")

# Use polymorphism
instruments = [apple_stock, govt_bond]
portfolio_value = 0

for instrument in instruments:
    quantity = 10  # Assume we own 10 of each
    value = instrument.calculate_value(quantity)
    portfolio_value += value
    print(f"{instrument.symbol} ({instrument.name}):")
    print(f"  Risk Level: {instrument.risk_level()}")
    print(f"  Value of 10 units: ${value:.2f}")

print(f"\nTotal portfolio value: ${portfolio_value:.2f}")
```

## Practical Financial Application: Portfolio Management

Let's build a simple portfolio management system that demonstrates these OOP concepts together:

```python
class Asset:
    """Base class for any asset that can be held in a portfolio"""
    
    def __init__(self, symbol, name):
        self.symbol = symbol
        self.name = name
    
    @abstractmethod
    def current_value(self):
        """Return the current value of this asset"""
        pass
    
    def __str__(self):
        return f"{self.symbol} - {self.name}"


class Cash(Asset):
    """Cash holdings in a portfolio"""
    
    def __init__(self, amount, currency="USD"):
        super().__init__(currency, f"Cash ({currency})")
        self.amount = amount
    
    def current_value(self):
        return self.amount


class Stock(Asset):
    """Stock/equity asset"""
    
    def __init__(self, symbol, name, shares, price_per_share):
        super().__init__(symbol, name)
        self.shares = shares
        self.price = price_per_share
    
    def current_value(self):
        return self.shares * self.price
    
    def update_price(self, new_price):
        self.price = new_price


class Bond(Asset):
    """Bond asset"""
    
    def __init__(self, symbol, name, face_value, quantity, market_price, yield_rate):
        super().__init__(symbol, name)
        self.face_value = face_value
        self.quantity = quantity
        self.market_price = market_price
        self.yield_rate = yield_rate
    
    def current_value(self):
        return self.market_price * self.quantity
    
    def annual_income(self):
        return self.face_value * self.quantity * self.yield_rate


class Portfolio:
    """A collection of financial assets"""
    
    def __init__(self, name, owner):
        self.name = name
        self.owner = owner
        self.assets = []
    
    def add_asset(self, asset):
        """Add an asset to the portfolio"""
        self.assets.append(asset)
    
    def remove_asset(self, symbol):
        """Remove an asset from the portfolio by symbol"""
        self.assets = [asset for asset in self.assets if asset.symbol != symbol]
    
    def total_value(self):
        """Calculate the total value of all assets"""
        return sum(asset.current_value() for asset in self.assets)
    
    def asset_allocation(self):
        """Calculate the percentage allocation of each asset class"""
        total = self.total_value()
        allocation = {}
        
        for asset in self.assets:
            asset_type = type(asset).__name__
            asset_value = asset.current_value()
            
            if asset_type not in allocation:
                allocation[asset_type] = 0
            
            allocation[asset_type] += asset_value
        
        # Convert to percentages
        for asset_type in allocation:
            allocation[asset_type] = (allocation[asset_type] / total) * 100
            
        return allocation
    
    def print_summary(self):
        """Print a summary of the portfolio"""
        print(f"\n=== {self.name} Portfolio Summary ===")
        print(f"Owner: {self.owner}")
        print(f"Total Value: ${self.total_value():.2f}")
        
        print("\nAssets:")
        print(f"{'Symbol':<10} {'Type':<10} {'Name':<30} {'Value':<15}")
        print("-" * 65)
        
        for asset in self.assets:
            asset_type = type(asset).__name__
            print(f"{asset.symbol:<10} {asset_type:<10} {asset.name:<30} ${asset.current_value():<15.2f}")
        
        print("\nAsset Allocation:")
        allocation = self.asset_allocation()
        for asset_type, percentage in allocation.items():
            print(f"{asset_type}: {percentage:.2f}%")
```

Now let's use our portfolio management system:

```python
# Create a retirement portfolio
retirement = Portfolio("Retirement", "John Doe")

# Add assets
retirement.add_asset(Cash(15000))
retirement.add_asset(Stock("AAPL", "Apple Inc.", 50, 175.50))
retirement.add_asset(Stock("MSFT", "Microsoft Corporation", 25, 330.75))
retirement.add_asset(Bond("T-BOND", "Treasury Bond", 1000, 10, 980, 0.035))

# Print the portfolio summary
retirement.print_summary()

# Update a stock price and see the impact
for asset in retirement.assets:
    if isinstance(asset, Stock) and asset.symbol == "AAPL":
        print(f"\nUpdating {asset.symbol} price from ${asset.price} to $190.25")
        asset.update_price(190.25)

# Print the updated portfolio
retirement.print_summary()
```

## Why OOP Matters: Organizing and Reusing Code

OOP offers several advantages that become increasingly important as your projects grow:

1. **Organization**: OOP helps structure your code around real-world entities, making it easier to understand and maintain.

2. **Reusability**: Inherit and extend classes rather than rewriting code from scratch.

3. **Modularity**: Each class handles a specific entity, making it easier to update, test, and debug.

4. **Encapsulation**: Hide implementation details and protect data integrity.

5. **Real-world modeling**: Financial concepts translate naturally to OOP—assets, accounts, transactions, and portfolios all become classes.

## Common OOP Pitfalls to Avoid

1. **Overengineering**: Don't create complex class hierarchies if simpler solutions work. Start with basic classes and refine as needed.

2. **Inheritance Overuse**: Not everything needs inheritance. Consider composition (having one class contain instances of another) when appropriate.

3. **Forgetting `self`**: Always include `self` as the first parameter in instance methods.

4. **Misusing Private Attributes**: Don't circumvent the leading underscore convention—it's there for a reason.

## Practical Exercise: Build a Loan Calculator Class

As a finance professional, understanding loan calculations is essential. Let's create a `Loan` class that encapsulates different loan calculations:

```python
class Loan:
    """A class representing a loan with various calculation methods"""
    
    def __init__(self, principal, annual_interest_rate, years, compounding_periods=12):
        self.principal = principal
        self.annual_rate = annual_interest_rate
        self.years = years
        self.compounding_periods = compounding_periods
        
    def monthly_payment(self):
        """Calculate the fixed monthly payment"""
        # Convert annual rate to monthly rate
        r = self.annual_rate / 12
        n = self.years * 12
        
        # Use the formula: PMT = P * (r * (1+r)^n) / ((1+r)^n - 1)
        numerator = r * (1 + r) ** n
        denominator = (1 + r) ** n - 1
        
        if denominator == 0:
            return self.principal / n  # Zero interest edge case
        
        return self.principal * (numerator / denominator)
    
    def total_payment(self):
        """Calculate the total amount paid over the loan term"""
        return self.monthly_payment() * self.years * 12
    
    def total_interest(self):
        """Calculate the total interest paid over the loan term"""
        return self.total_payment() - self.principal
    
    def amortization_schedule(self, show_every_period=True):
        """Generate an amortization schedule"""
        schedule = []
        remaining_balance = self.principal
        monthly_rate = self.annual_rate / 12
        payment = self.monthly_payment()
        
        for period in range(1, self.years * 12 + 1):
            interest_payment = remaining_balance * monthly_rate
            principal_payment = payment - interest_payment
            remaining_balance -= principal_payment
            
            if show_every_period or period % 12 == 0 or period == 1:
                schedule.append({
                    'period': period,
                    'payment': payment,
                    'principal': principal_payment,
                    'interest': interest_payment,
                    'remaining': max(0, remaining_balance)  # Avoid negative zero
                })
        
        return schedule
    
    def print_loan_summary(self):
        """Print a summary of the loan details"""
        print("\n=== Loan Summary ===")
        print(f"Principal: ${self.principal:.2f}")
        print(f"Annual Interest Rate: {self.annual_rate:.2%}")
        print(f"Term: {self.years} years")
        print(f"Monthly Payment: ${self.monthly_payment():.2f}")
        print(f"Total Payments: ${self.total_payment():.2f}")
        print(f"Total Interest: ${self.total_interest():.2f}")
    
    def print_amortization_table(self, periods_per_year=1):
        """Print an amortization table"""
        schedule = self.amortization_schedule(show_every_period=False)
        
        print("\n=== Amortization Schedule ===")
        print(f"{'Period':<10} {'Payment':<15} {'Principal':<15} {'Interest':<15} {'Remaining':<15}")
        print("-" * 70)
        
        for entry in schedule:
            print(f"{entry['period']:<10} ${entry['payment']:<14.2f} ${entry['principal']:<14.2f} ${entry['interest']:<14.2f} ${entry['remaining']:<14.2f}")


# Example use:
home_loan = Loan(350000, 0.045, 30)  # $350,000 at 4.5% for 30 years
home_loan.print_loan_summary()
home_loan.print_amortization_table()

car_loan = Loan(30000, 0.039, 5)  # $30,000 at 3.9% for 5 years
car_loan.print_loan_summary()
```

## Conclusion

Object-Oriented Programming provides a powerful way to structure your Python code, especially when modeling real-world financial entities and processes. By organizing your code into classes with attributes and methods, you create reusable, maintainable components that can grow with your applications.

In this post, we covered:

- The basics of classes and objects
- Method creation and the role of `self`
- The four pillars of OOP: encapsulation, inheritance, polymorphism, and abstraction
- Practical financial applications using OOP principles

As your Python skills progress, you'll find OOP concepts becoming increasingly valuable, especially for financial modeling, analysis, and application development.

## Next Steps

- Practice creating your own financial classes (e.g., Investment, FinancialReport)
- Explore more complex inheritance relationships
- Learn about dataclasses (Python 3.7+) for even cleaner class definitions
- Look into property decorators for more controlled attribute access