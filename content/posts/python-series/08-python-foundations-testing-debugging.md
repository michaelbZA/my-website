---
title: "Part 8: Testing & Debugging Python Code"
date: 2025-06-19
slug: python-testing-debugging
description: "Master unit testing with unittest and pytest, learn Test-Driven Development workflows, handle custom exceptions, use the debugger effectively, and implement structured logging."
tags: ["python", "testing", "unittest", "pytest", "debugging", "pdb", "exceptions", "logging", "TDD"]
categories: ["Python Series"]
series: ["Python Mastery"]
series_order: 9
showToc: true
TocOpen: false
draft: false
#weight: 8
#cover:
    #image: "images/python-series/part8-cover.jpg"
    #alt: "Python Testing and Debugging"
    #caption: "Creating reliable Python applications"
    #relative: false
--- 

# Testing & Debugging: Building Reliable Financial Tools

When working with financial data and calculations, accuracy isn't just important—it's essential. A small bug in your code could mean reporting incorrect figures, making flawed investment decisions, or even compliance issues. This post will guide you through testing and debugging techniques that ensure your financial Python code works correctly and reliably.

## Why Testing Matters in Finance

Imagine you've created a Python script that calculates loan amortisation schedules. Your company uses this tool to price thousands of loans. If there's an error in your interest calculation logic, even a small one, the financial impact could be enormous.

As a finance professional, you need confidence in your code. Testing provides that confidence by systematically verifying that your calculations work correctly across a range of scenarios and edge cases.

## Unit Testing Basics

Unit testing involves testing individual components (usually functions) in isolation to ensure they work as expected.

### Getting Started with unittest

Python's built-in `unittest` framework provides all the tools you need for basic testing. Let's test our financial ratio calculator from the previous post:

First, create a file called `test_ratio_calculator.py`:

```python
import unittest
from ratio_calculator import calculate_current_ratio, calculate_debt_to_equity

class TestFinancialRatios(unittest.TestCase):
    
    def test_current_ratio(self):
        # Test basic calculation
        self.assertEqual(calculate_current_ratio(100000, 50000), 2.0)
        
        # Test with zero liabilities - should raise ValueError
        with self.assertRaises(ValueError):
            calculate_current_ratio(100000, 0)
    
    def test_debt_to_equity(self):
        # Test basic calculation
        self.assertEqual(calculate_debt_to_equity(200000, 400000), 0.5)
        
        # Test highly leveraged company
        self.assertEqual(calculate_debt_to_equity(800000, 200000), 4.0)
        
        # Test with zero equity - should raise ValueError
        with self.assertRaises(ValueError):
            calculate_debt_to_equity(100000, 0)

if __name__ == '__main__':
    unittest.main()
```

Run the tests with:

```bash
python test_ratio_calculator.py
```

If all tests pass, you'll see something like:

```
..
----------------------------------------------------------------------
Ran 2 tests in 0.001s

OK
```

If a test fails, `unittest` will tell you which test failed and why, helping you pinpoint the issue.

### Common Assertions in unittest

Here are some assertions particularly useful for financial calculations:

```python
# Checking exact equality
self.assertEqual(calculate_npv(cash_flows, 0.1), 1025.79)

# Checking approximate equality (for floating point calculations)
self.assertAlmostEqual(calculate_irr([-1000, 500, 600]), 0.0734, places=4)

# Checking if a value is greater than another
self.assertGreater(calculate_profit_margin(revenue, costs), 0)

# Checking if an exception is raised for invalid inputs
with self.assertRaises(ValueError):
    calculate_pe_ratio(stock_price=50, earnings_per_share=0)
```

## Moving to pytest

While `unittest` is perfectly capable, `pytest` offers a more modern and flexible approach to testing. Let's see how we might test the same functions with `pytest`:

1. Install pytest:

```bash
pip install pytest
```

2. Create a file named `test_ratios_pytest.py`:

```python
import pytest
from ratio_calculator import calculate_current_ratio, calculate_debt_to_equity

def test_current_ratio_basic():
    assert calculate_current_ratio(100000, 50000) == 2.0

def test_current_ratio_zero_liabilities():
    with pytest.raises(ValueError):
        calculate_current_ratio(100000, 0)

def test_debt_to_equity_basic():
    assert calculate_debt_to_equity(200000, 400000) == 0.5

def test_debt_to_equity_high_leverage():
    assert calculate_debt_to_equity(800000, 200000) == 4.0

def test_debt_to_equity_zero_equity():
    with pytest.raises(ValueError):
        calculate_debt_to_equity(100000, 0)
```

3. Run the tests:

```bash
pytest test_ratios_pytest.py -v
```

The `-v` flag gives you verbose output showing each test that was run.

### The Power of pytest Fixtures

One of pytest's most powerful features is fixtures, which let you set up preconditions for your tests. This is especially useful for financial testing where you might have complex data structures:

```python
import pytest
from financial_analyzer import StockAnalyzer

@pytest.fixture
def sample_stock_data():
    # Return a sample dataset that can be used by multiple tests
    return {
        'ticker': 'AAPL',
        'prices': [150.25, 151.30, 149.80, 152.50, 153.75],
        'volumes': [12345678, 9876543, 11234567, 10234567, 13456789],
        'financials': {
            'revenue': 365.82,  # In billions
            'net_income': 94.68,  # In billions
            'total_assets': 351.0,  # In billions
            'total_liabilities': 287.91,  # In billions
            'shareholders_equity': 63.09  # In billions
        }
    }

def test_pe_ratio_calculation(sample_stock_data):
    analyzer = StockAnalyzer(sample_stock_data)
    # Assuming current price is the last in the list and EPS is net_income / outstanding_shares
    # For this example, let's say outstanding_shares is 16.07B
    expected_pe = 150.25 / (94.68 / 16.07)
    assert round(analyzer.calculate_pe_ratio(), 2) == round(expected_pe, 2)

def test_debt_to_equity_ratio(sample_stock_data):
    analyzer = StockAnalyzer(sample_stock_data)
    expected_ratio = 287.91 / 63.09
    assert round(analyzer.calculate_debt_to_equity(), 2) == round(expected_ratio, 2)
```

This way, you set up your test data once and reuse it across multiple tests.

### Parameterised Tests for Multiple Scenarios

Financial calculations often need to be tested with multiple sets of inputs. Pytest's parameterisation makes this elegant:

```python
import pytest
from finance_calcs import calculate_compound_interest

@pytest.mark.parametrize("principal,rate,time,compounding,expected", [
    (1000, 0.05, 5, 1, 1276.28),    # Annual compounding
    (1000, 0.05, 5, 12, 1283.36),   # Monthly compounding
    (1000, 0.05, 5, 365, 1284.52),  # Daily compounding
])
def test_compound_interest(principal, rate, time, compounding, expected):
    result = calculate_compound_interest(principal, rate, time, compounding)
    assert round(result, 2) == expected
```

This tests our compound interest function with annual, monthly, and daily compounding periods, all in a single test function.

## Test-Driven Development (TDD) for Finance

Test-Driven Development is a methodology where you write tests before you write code. For financial calculations, this approach can be particularly beneficial:

1. **Write the test first**: Define what your function should do before implementing it
2. **Run the test and watch it fail**: Confirm the test works
3. **Write the implementation**: Create the function to make the test pass
4. **Run the test again**: Verify your implementation works
5. **Refactor**: Clean up your code while ensuring tests continue to pass

### A TDD Example: Calculating EBITDA

Let's say we need to add an EBITDA calculation function. Following TDD:

1. First, write the test:

```python
# test_financial_metrics.py
import pytest
from financial_metrics import calculate_ebitda

def test_calculate_ebitda():
    # EBITDA = Net Income + Interest + Taxes + Depreciation + Amortisation
    income_statement = {
        'net_income': 1000000,
        'interest_expense': 200000,
        'income_tax': 300000,
        'depreciation': 150000,
        'amortisation': 50000
    }
    
    expected_ebitda = 1700000  # Sum of all the components
    
    assert calculate_ebitda(income_statement) == expected_ebitda
```

2. Run the test (it will fail since we haven't implemented the function yet):

```bash
pytest test_financial_metrics.py
```

3. Implement the function:

```python
# financial_metrics.py
def calculate_ebitda(income_statement):
    """
    Calculate EBITDA from income statement components.
    
    Args:
        income_statement (dict): Dictionary containing income statement items
        
    Returns:
        float: EBITDA value
    """
    return (
        income_statement['net_income'] +
        income_statement['interest_expense'] +
        income_statement['income_tax'] +
        income_statement['depreciation'] +
        income_statement['amortisation']
    )
```

4. Run the test again - it should pass now!

## Debugging Financial Code

Even with tests, bugs will sometimes creep into your code. Let's explore techniques to find and fix them.

### Print-Driven Debugging

The simplest debugging technique is adding `print()` statements to your code:

```python
def calculate_loan_payment(principal, annual_rate, years):
    monthly_rate = annual_rate / 12
    print(f"Monthly rate: {monthly_rate}")
    
    num_payments = years * 12
    print(f"Number of payments: {num_payments}")
    
    payment = principal * (monthly_rate * (1 + monthly_rate) ** num_payments) / \
              ((1 + monthly_rate) ** num_payments - 1)
    print(f"Calculated payment: {payment}")
    
    return payment
```

While simple, this approach can be effective for quick debugging sessions.

### Using Python's Built-in Debugger (pdb)

For more complex issues, Python's debugger (pdb) gives you interactive control:

```python
def analyze_portfolio(holdings):
    import pdb; pdb.set_trace()  # Debugger will start here
    
    total_value = 0
    for ticker, data in holdings.items():
        shares = data['shares']
        price = data['current_price']
        position_value = shares * price
        total_value += position_value
    
    return total_value
```

When this code runs, it will pause at the `pdb.set_trace()` line and drop you into an interactive debugger. Common commands include:

- `n` (next): Execute the current line and move to the next one
- `s` (step): Step into a function call
- `c` (continue): Continue execution until the next breakpoint
- `p variable_name`: Print the value of a variable
- `q` (quit): Exit the debugger

### IDE-Based Debugging

Most modern IDEs offer powerful visual debugging:

1. Set a breakpoint by clicking in the margin next to your code
2. Start the debugger (usually with a "Debug" button)
3. The program will pause at your breakpoint
4. Examine variables, step through code, and find issues

This is particularly useful for financial applications where you need to inspect complex data structures or track down calculation errors.

### Common Financial Code Bugs

Watch out for these common issues in financial code:

1. **Rounding errors**: Financial calculations often require precise decimal handling

```python
# Problematic: Floating point imprecision
0.1 + 0.2  # Returns 0.30000000000000004

# Better: Use Decimal for financial calculations
from decimal import Decimal
Decimal('0.1') + Decimal('0.2')  # Returns Decimal('0.3')
```

2. **Off-by-one errors in time periods**: Check if your code correctly handles time period boundaries

```python
# Is this calculating 29 or 30 days of interest?
days_in_month = 30
daily_interest = principal * (annual_rate / 365)
total_interest = 0

# Potential off-by-one error
for day in range(days_in_month):  # This gives 0-29, so only 30 days
    total_interest += daily_interest
```

3. **Negative input validation**: Financial functions often have domain restrictions

```python
def calculate_loan_payment(principal, rate, years):
    # Validate inputs
    if principal <= 0:
        raise ValueError("Principal must be positive")
    if rate < 0:
        raise ValueError("Interest rate cannot be negative")
    if years <= 0:
        raise ValueError("Loan term must be positive")
    
    # Rest of the calculation
```

## Custom Exceptions for Financial Validation

Creating custom exceptions helps make your financial code more robust and self-documenting:

```python
class NegativePrincipalError(ValueError):
    """Raised when a negative principal amount is provided"""
    pass

class ZeroDivisionFinancialError(ValueError):
    """Raised when a financial calculation would result in division by zero"""
    pass

def calculate_return_on_investment(gain, cost):
    """
    Calculate ROI: (Gain - Cost) / Cost
    
    Args:
        gain (float): The amount gained from the investment
        cost (float): The cost of the investment
        
    Returns:
        float: ROI as a decimal
        
    Raises:
        NegativePrincipalError: If cost is negative
        ZeroDivisionFinancialError: If cost is zero
    """
    if cost < 0:
        raise NegativePrincipalError("Investment cost cannot be negative")
    if cost == 0:
        raise ZeroDivisionFinancialError("Cannot calculate ROI with zero cost")
    
    return (gain - cost) / cost
```

These custom exceptions make error handling clearer and provide better feedback to users of your code.

## Structured Logging for Financial Applications

For production financial applications, proper logging is essential for auditing and debugging:

```python
import logging

# Set up logging
logging.basicConfig(
    filename='financial_calculations.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def calculate_mortgage_payment(principal, rate, years):
    """Calculate monthly mortgage payment"""
    logging.info(f"Calculating mortgage payment: principal={principal}, rate={rate}, years={years}")
    
    try:
        monthly_rate = rate / 12
        num_payments = years * 12
        
        if monthly_rate == 0:
            payment = principal / num_payments
        else:
            payment = principal * (monthly_rate * (1 + monthly_rate) ** num_payments) / \
                      ((1 + monthly_rate) ** num_payments - 1)
        
        logging.info(f"Calculated payment: {payment}")
        return payment
    
    except Exception as e:
        logging.error(f"Error calculating mortgage payment: {str(e)}")
        raise
```

This creates a log file with timestamped entries that can be invaluable for tracking down issues in complex financial applications.

### Logging Levels

Different logging levels serve different purposes:

- `logging.DEBUG`: Detailed information, typically useful only for diagnosing problems
- `logging.INFO`: Confirmation that things are working as expected
- `logging.WARNING`: Indication that something unexpected happened, but the program is still working
- `logging.ERROR`: Due to a more serious problem, the program couldn't perform a function
- `logging.CRITICAL`: A serious error indicating the program may be unable to continue running

For financial applications, consider using these levels to differentiate between routine calculations and potential issues:

```python
def analyze_investment_portfolio(portfolio):
    logging.info(f"Analyzing portfolio with {len(portfolio)} positions")
    
    for position in portfolio:
        # Log routine information
        logging.debug(f"Processing position: {position['ticker']}")
        
        # Log potential concerns
        if position['allocation'] > 0.20:  # More than 20% in single position
            logging.warning(f"High concentration in {position['ticker']}: {position['allocation']:.1%}")
        
        # Log serious issues
        if position['value'] < 0:
            logging.error(f"Negative position value for {position['ticker']}: {position['value']}")
```

### Handling Sensitive Financial Data in Logs

Be careful not to log sensitive financial information:

```python
# BAD: Logging personal financial data
logging.info(f"Processing transaction for account {account_number}, balance: {balance}")

# GOOD: Log only what's necessary without exposing private data
logging.info(f"Processing transaction for account ending in {account_number[-4:]}")
```

## Putting It All Together: A Complete Financial Testing Example

Let's bring everything together with a complete example for a financial calculator module:

```python
# financial_calculator.py
from decimal import Decimal
import logging

# Set up logging
logging.basicConfig(
    filename='financial_calculator.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

class FinancialError(Exception):
    """Base class for financial calculation errors"""
    pass

class NegativeValueError(FinancialError):
    """Raised when a negative value is provided where it's not allowed"""
    pass

class ZeroValueError(FinancialError):
    """Raised when a zero value is provided where it's not allowed"""
    pass

def npv(cash_flows, discount_rate):
    """
    Calculate Net Present Value for a series of cash flows.
    
    Args:
        cash_flows (list): List of cash flows where the first element is typically negative (investment)
        discount_rate (float): Annual discount rate as a decimal (e.g., 0.1 for 10%)
        
    Returns:
        Decimal: Net Present Value rounded to 2 decimal places
        
    Raises:
        TypeError: If inputs are not in the expected format
        ValueError: If discount_rate is less than -1
    """
    logging.info(f"Calculating NPV with discount rate: {discount_rate}")
    logging.debug(f"Cash flows: {cash_flows}")
    
    if not isinstance(cash_flows, (list, tuple)):
        logging.error("Cash flows must be a list or tuple")
        raise TypeError("Cash flows must be a list or tuple")
    
    if not all(isinstance(cf, (int, float, Decimal)) for cf in cash_flows):
        logging.error("All cash flows must be numeric")
        raise TypeError("All cash flows must be numeric")
    
    if discount_rate < -1:
        logging.error(f"Invalid discount rate: {discount_rate}")
        raise ValueError("Discount rate cannot be less than -100%")
    
    # Convert to Decimal for precise financial calculations
    npv_value = Decimal('0')
    rate = Decimal(str(discount_rate))
    
    for i, cf in enumerate(cash_flows):
        cf_decimal = Decimal(str(cf))
        # Initial cash flow isn't discounted
        if i == 0:
            npv_value += cf_decimal
        else:
            npv_value += cf_decimal / (Decimal('1') + rate) ** Decimal(str(i))
    
    logging.info(f"NPV calculation result: {npv_value.quantize(Decimal('0.01'))}")
    return npv_value.quantize(Decimal('0.01'))  # Round to 2 decimal places

def irr(cash_flows, guess=0.1, tolerance=0.0001, max_iterations=1000):
    """
    Calculate Internal Rate of Return for a series of cash flows.
    
    Args:
        cash_flows (list): List of cash flows where the first element is typically negative
        guess (float): Initial guess for IRR
        tolerance (float): The calculation will stop when the result is within this tolerance
        max_iterations (int): Maximum number of iterations to perform
        
    Returns:
        float: The internal rate of return as a decimal
        
    Raises:
        ValueError: If calculation doesn't converge
    """
    # Implementation using Newton's method
    # (Full implementation would go here)
    logging.info("IRR calculation requested")
    # Simplified example return for brevity
    return 0.1548
```

And here's how we would test this module:

```python
# test_financial_calculator.py
import pytest
from decimal import Decimal
from financial_calculator import npv, irr, NegativeValueError, ZeroValueError

class TestNPV:
    def test_basic_npv_calculation(self):
        # Initial investment of 1000, followed by 4 annual returns
        cash_flows = [-1000, 300, 400, 400, 300]
        assert npv(cash_flows, 0.1) == Decimal('152.92')
    
    def test_npv_with_all_positive_values(self):
        # All positive cash flows (unusual but mathematically valid)
        cash_flows = [1000, 300, 400, 500]
        assert npv(cash_flows, 0.1) > Decimal('1000')
    
    def test_npv_with_high_discount_rate(self):
        cash_flows = [-1000, 300, 400, 400, 300]
        # High discount rate should reduce NPV
        assert npv(cash_flows, 0.25) < npv(cash_flows, 0.1)
    
    def test_npv_with_invalid_input(self):
        # Test with non-list input
        with pytest.raises(TypeError):
            npv("not a list", 0.1)
        
        # Test with non-numeric cash flows
        with pytest.raises(TypeError):
            npv([-1000, "300", 400], 0.1)
        
        # Test with invalid discount rate
        with pytest.raises(ValueError):
            npv([-1000, 300, 400], -1.5)  # Can't have less than -100% discount

class TestIRR:
    def test_basic_irr_calculation(self):
        cash_flows = [-1000, 300, 400, 400, 300]
        # Using almost equal because IRR can have small floating point differences
        assert abs(irr(cash_flows) - 0.1548) < 0.0001
    
    # Additional IRR tests would go here...

# We could add more test classes for other financial functions
```

## Conclusion

For finance professionals using Python, robust testing and debugging aren't optional extras—they're essential practices that ensure your calculations are reliable and accurate. By incorporating unit tests, effective debugging strategies, and structured logging into your workflow, you can build financial tools that you and your colleagues can trust.

In our next post, we'll explore how to turn your financial scripts into proper command-line tools and automate routine financial tasks—a crucial skill for improving your productivity as a finance professional.

## Practice Exercises

1. Create a simple function to calculate compound interest with different compounding periods, then write tests for it using pytest.
2. Debug a financial calculation by setting breakpoints and using your IDE's debugging tools.
3. Implement a custom exception for a financial calculation and write a test that verifies it's raised appropriately.
4. Add structured logging to a financial script you've already written.

## Further Resources

- [pytest Documentation](https://docs.pytest.org/)
- [Python Debugging with pdb](https://docs.python.org/3/library/pdb.html)
- [Python's logging Module](https://docs.python.org/3/library/logging.html)
- [Test-Driven Development by Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530/) by Kent Beck
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882/) by Robert C. Martin