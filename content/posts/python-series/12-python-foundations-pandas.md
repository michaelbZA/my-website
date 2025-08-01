---
title: "Part 12: Data Analysis with pandas"
date: 2025-07-17
slug: data-analysis-with-pandas
description: "Master data analysis in Python using pandas. Learn to work with Series and DataFrame objects, import data from various sources, and perform essential data manipulation operations."
tags: ["python", "pandas", "data analysis", "dataframe", "csv", "excel", "data manipulation", "data cleaning"]
categories: ["Python Series"]
series: ["Python Mastery"]
series_order: 13
showToc: true
TocOpen: false
draft: false
#weight: 12
#cover:
    #image: "images/python-series/part12-cover.jpg"
    #alt: "Pandas Data Analysis"
    #caption: "Analyzing data with pandas in Python"
    #relative: false
--- 

# Data Analysis with pandas for Finance and Accounting

Welcome to post #12 in our Python journey! In the previous post, we explored NumPy and its powerful numerical capabilities. Now we're taking a step up to pandas, which builds on NumPy's foundation to provide specialised tools for working with tabular and time series data—exactly the kind of data we deal with daily in finance and accounting.

## Why pandas for Finance?

pandas is specifically designed for data analysis and manipulation, with particular strengths in:

- Working with tabular data (like spreadsheets, CSV files, and SQL tables)
- Handling time series (perfect for financial data)
- Cleaning messy data (a constant challenge in real-world accounting)
- Joining and merging datasets (combining data from multiple sources)
- Advanced grouping and aggregation (similar to pivot tables in Excel)

If you've spent hours manipulating data in Excel, pandas will feel both familiar yet incredibly more powerful—think Excel on steroids with the automation capabilities of Python.

## Installing pandas

Let's start by installing pandas:

```python
pip install pandas
```

If you're using Anaconda, pandas is already included in the distribution.

Let's verify the installation:

```python
import pandas as pd
print(pd.__version__)
```

You should see the version number displayed (like `2.0.3` or similar). By convention, pandas is imported with the alias `pd` to make your code more readable.

## The Core pandas Data Structures

pandas provides two primary data structures:

1. **Series**: A one-dimensional labeled array (like a column in a spreadsheet)
2. **DataFrame**: A two-dimensional labeled data structure with columns (like a spreadsheet or SQL table)

Let's explore both with financial examples.

### Series: One-Dimensional Data

A Series is essentially a column of data with labeled indices:

```python
import pandas as pd
import numpy as np

# Create a Series of monthly expenses
monthly_expenses = pd.Series([1200, 1500, 1100, 1800], 
                            index=['Rent', 'Payroll', 'Utilities', 'Inventory'])

print(monthly_expenses)
# Output:
# Rent         1200
# Payroll      1500
# Utilities    1100
# Inventory    1800
# dtype: int64

# Access by label
print(f"Monthly rent: ${monthly_expenses['Rent']}")  # Output: Monthly rent: $1200

# Access by position
print(f"Second highest expense: ${monthly_expenses.iloc[1]}")  # Output: Second highest expense: $1500

# Perform calculations
print(f"Total monthly expenses: ${monthly_expenses.sum()}")  # Output: Total monthly expenses: $5600
print(f"Average expense: ${monthly_expenses.mean()}")  # Output: Average expense: $1400

# Filter expenses greater than 1200
high_expenses = monthly_expenses[monthly_expenses > 1200]
print(high_expenses)
# Output:
# Payroll      1500
# Inventory    1800
# dtype: int64
```

Series are useful for representing:
- A single financial metric across multiple companies
- Monthly or yearly values for a specific account
- Daily stock prices

### DataFrame: Two-Dimensional Data

DataFrames are where pandas really shines. Think of them as an Excel spreadsheet within Python:

```python
# Create a DataFrame representing a simplified income statement
income_statement = pd.DataFrame({
    'Q1': [100000, 45000, 15000, 40000],
    'Q2': [110000, 47000, 15000, 48000],
    'Q3': [95000, 42000, 16000, 37000],
    'Q4': [125000, 52000, 17000, 56000]
}, index=['Revenue', 'COGS', 'Operating Expenses', 'Net Income'])

print(income_statement)
# Output:
#                      Q1     Q2     Q3     Q4
# Revenue          100000 110000  95000 125000
# COGS              45000  47000  42000  52000
# Operating Expenses 15000  15000  16000  17000
# Net Income        40000  48000  37000  56000

# Or create the same DataFrame with a different orientation
# (More commonly used format with rows as observations and columns as variables)
income_statement_alt = pd.DataFrame({
    'Quarter': ['Q1', 'Q2', 'Q3', 'Q4'],
    'Revenue': [100000, 110000, 95000, 125000],
    'COGS': [45000, 47000, 42000, 52000],
    'Operating_Expenses': [15000, 15000, 16000, 17000],
    'Net_Income': [40000, 48000, 37000, 56000]
})

print(income_statement_alt)
# Output:
#   Quarter  Revenue   COGS  Operating_Expenses  Net_Income
# 0      Q1   100000  45000               15000       40000
# 1      Q2   110000  47000               15000       48000
# 2      Q3    95000  42000               16000       37000
# 3      Q4   125000  52000               17000       56000
```

The orientation you choose often depends on your data and analysis goals. For financial data:
- Use index for time periods and columns for accounts when tracking few accounts over time
- Use rows for time periods and columns for accounts when tracking many accounts

## Reading Data from External Sources

In real-world finance, data often comes from external files. pandas excels at importing from various sources:

### Reading from CSV

CSVs are common for exporting financial data:

```python
# Read a transaction register CSV file
# transactions.csv contains: Date,Description,Category,Amount
transactions = pd.read_csv('transactions.csv')

# Preview the first 5 rows
print(transactions.head())
# Output:
#         Date               Description    Category  Amount
# 0  2023-01-05          Office Supplies    Expense   -89.99
# 1  2023-01-07  Client Payment - ABC Inc     Income  1250.00
# 2  2023-01-10                   Payroll    Expense -4500.00
# 3  2023-01-15           Software License    Expense  -199.99
# 4  2023-01-18            Bank Interest     Income     2.13
```

### Reading from Excel

Excel files are ubiquitous in finance and accounting:

```python
# Install openpyxl first if you haven't:
# pip install openpyxl

# Read an Excel file, specifying the sheet
financial_data = pd.read_excel('financial_model.xlsx', sheet_name='Income Statement')

# Preview the data
print(financial_data.head())
```

### Connecting to Databases

For more enterprise-level finance applications:

```python
# pip install sqlalchemy
# pip install pymysql (or other database driver)

from sqlalchemy import create_engine

# Connect to database (example with MySQL)
engine = create_engine('mysql+pymysql://username:password@localhost/finance_db')

# Read data directly from SQL query
sql_query = "SELECT * FROM general_ledger WHERE account_type = 'Asset' AND transaction_date > '2023-01-01'"
gl_data = pd.read_sql(sql_query, engine)

print(gl_data.head())
```

## Inspecting and Exploring Your Data

When you receive a new financial dataset, your first step is usually to understand its structure:

```python
# Assuming we've loaded our transactions data
print(f"Data shape (rows, columns): {transactions.shape}")
print("\nColumn names:")
print(transactions.columns.tolist())

print("\nData types:")
print(transactions.dtypes)

print("\nSummary statistics:")
print(transactions.describe())

print("\nMissing values:")
print(transactions.isnull().sum())

# Check for duplicates
print(f"\nDuplicate rows: {transactions.duplicated().sum()}")
```

## Data Selection and Filtering

pandas offers powerful ways to select and filter data:

```python
# Select specific columns
amounts_and_categories = transactions[['Category', 'Amount']]
print(amounts_and_categories.head())

# Filter rows based on conditions
expenses = transactions[transactions['Amount'] < 0]
income = transactions[transactions['Amount'] > 0]

print(f"Total expenses: ${expenses['Amount'].sum():.2f}")
print(f"Total income: ${income['Amount'].sum():.2f}")

# Filter with multiple conditions
# Find large office expenses
large_office_expenses = transactions[
    (transactions['Category'] == 'Expense') & 
    (transactions['Description'].str.contains('Office')) & 
    (transactions['Amount'] < -100)
]
print(large_office_expenses)

# Select data from a specific date range
# First, ensure Date is a datetime type
transactions['Date'] = pd.to_datetime(transactions['Date'])

# Filter for Q1 data
q1_data = transactions[(transactions['Date'] >= '2023-01-01') & 
                       (transactions['Date'] <= '2023-03-31')]
print(f"Q1 transaction count: {len(q1_data)}")
```

## Handling Missing Data

Missing data is a common challenge in financial datasets:

```python
# Check for missing values
print(transactions.isnull().sum())

# Fill missing values in Amount column with 0
transactions['Amount'] = transactions['Amount'].fillna(0)

# Fill missing categories with 'Uncategorized'
transactions['Category'] = transactions['Category'].fillna('Uncategorized')

# Drop rows with any remaining missing values
transactions_clean = transactions.dropna()

# Alternative: Only drop rows where specific columns are missing
transactions_essential = transactions.dropna(subset=['Date', 'Amount'])
```

## Data Transformation and Feature Engineering

Often, you'll need to create new calculated fields for financial analysis:

```python
# Add a Month column for easier grouping
transactions['Month'] = transactions['Date'].dt.strftime('%Y-%m')

# Add an Absolute Amount column for analysis
transactions['Abs_Amount'] = transactions['Amount'].abs()

# Categorize transactions by size
def categorize_amount(amount):
    if abs(amount) < 100:
        return 'Small'
    elif abs(amount) < 1000:
        return 'Medium'
    else:
        return 'Large'

transactions['Size_Category'] = transactions['Amount'].apply(categorize_amount)

# Create a new column indicating if it's end of quarter
transactions['Is_Quarter_End'] = transactions['Date'].dt.is_quarter_end

# Add a calculated running balance
transactions = transactions.sort_values('Date')
transactions['Running_Balance'] = transactions['Amount'].cumsum()

print(transactions.head())
```

## Grouping and Aggregation: The Heart of Financial Analysis

Grouping operations are similar to Excel's pivot tables and are perfect for financial reporting:

```python
# Group by Category and calculate sum, count, and average
category_summary = transactions.groupby('Category').agg({
    'Amount': ['sum', 'count', 'mean'],
    'Description': 'count'  # count of transactions
})

print(category_summary)

# Group by Month and Category to see spending trends
monthly_by_category = transactions.groupby(['Month', 'Category'])['Amount'].sum().unstack()

print(monthly_by_category)

# Calculate monthly totals
monthly_totals = transactions.groupby('Month')['Amount'].sum()
print(monthly_totals)

# Find the month with the highest expenses
monthly_expenses = transactions[transactions['Amount'] < 0].groupby('Month')['Amount'].sum()
highest_expense_month = monthly_expenses.idxmin()  # min because expenses are negative
print(f"Month with highest expenses: {highest_expense_month}, Amount: ${monthly_expenses.min():.2f}")
```

## Advanced Financial Calculations

Let's implement some practical financial calculations:

```python
# Monthly Profit and Loss Statement
monthly_pl = transactions.pivot_table(
    index='Month',
    columns='Category',
    values='Amount',
    aggfunc='sum'
).fillna(0)

# Add a Profit column
monthly_pl['Profit'] = monthly_pl['Income'] + monthly_pl['Expense']  # Adding because expenses are negative

print(monthly_pl)

# Calculate running cash balance by date
daily_net = transactions.groupby('Date')['Amount'].sum().reset_index()
daily_net['Running_Balance'] = daily_net['Amount'].cumsum()

print(daily_net.head())

# Calculate 30-day moving average of daily transaction amounts
transactions_by_date = transactions.groupby('Date')['Amount'].sum()
moving_avg_30d = transactions_by_date.rolling(window=30).mean()

print(moving_avg_30d.tail())
```

## Merging and Joining Datasets

In finance, we often need to combine data from multiple sources:

```python
# Create a sample budget DataFrame
budget = pd.DataFrame({
    'Category': ['Rent', 'Utilities', 'Payroll', 'Marketing', 'Software'],
    'Budgeted_Amount': [1200, 300, 5000, 1000, 500]
})

# Group actual expenses by category
actual_expenses = transactions[transactions['Amount'] < 0].groupby('Category')['Amount'].sum().abs().reset_index()
actual_expenses.columns = ['Category', 'Actual_Amount']

# Merge the budget with actual expenses
budget_vs_actual = pd.merge(budget, actual_expenses, on='Category', how='outer')

# Calculate variance (negative means over budget)
budget_vs_actual['Variance'] = budget_vs_actual['Budgeted_Amount'] - budget_vs_actual['Actual_Amount']
budget_vs_actual['Variance_Percent'] = (budget_vs_actual['Variance'] / budget_vs_actual['Budgeted_Amount']) * 100

print(budget_vs_actual)

# Find categories that are over budget
over_budget = budget_vs_actual[budget_vs_actual['Variance'] < 0]
print("\nCategories over budget:")
print(over_budget)
```

## Time Series Analysis: Perfect for Financial Data

pandas has exceptional support for time series data:

```python
# Convert Date to datetime if not already
transactions['Date'] = pd.to_datetime(transactions['Date'])

# Set Date as index for time series analysis
ts_data = transactions.set_index('Date')

# Resample to get monthly totals
monthly_data = ts_data['Amount'].resample('M').sum()
print(monthly_data)

# Compute rolling average (e.g., 3-month rolling revenue)
income_only = ts_data[ts_data['Amount'] > 0]
rolling_3m_revenue = income_only['Amount'].resample('M').sum().rolling(window=3).mean()
print(rolling_3m_revenue)

# Calculate percent change period-over-period
monthly_growth = monthly_data.pct_change() * 100
print(f"Monthly growth rates (%):\n{monthly_growth}")

# Seasonal decomposition
from statsmodels.tsa.seasonal import seasonal_decompose

# Need 2+ years of data for proper decomposition, but here's the concept:
# Assuming we have enough data:
# decomposition = seasonal_decompose(monthly_data, model='additive', period=12)
# fig = decomposition.plot()
```

## Handling Excel-Like Functionality with pandas

If you're transitioning from Excel, pandas offers similar functionality with more power:

```python
# VLOOKUP equivalent
product_info = pd.DataFrame({
    'Product_ID': ['A001', 'B002', 'C003', 'D004'],
    'Product_Name': ['Laptop', 'Monitor', 'Keyboard', 'Mouse'],
    'Unit_Cost': [1200, 300, 80, 25]
})

sales = pd.DataFrame({
    'Date': ['2023-01-15', '2023-01-20', '2023-01-22', '2023-01-25'],
    'Product_ID': ['A001', 'C003', 'A001', 'B002'],
    'Quantity': [2, 5, 1, 3]
})

# Merge sales with product info (like VLOOKUP)
sales_with_info = pd.merge(sales, product_info, on='Product_ID')

# Calculate total sales amount
sales_with_info['Total_Cost'] = sales_with_info['Quantity'] * sales_with_info['Unit_Cost']
print(sales_with_info)

# Pivot tables
pivot_sales = sales_with_info.pivot_table(
    index='Product_Name',
    values=['Quantity', 'Total_Cost'],
    aggfunc={'Quantity': 'sum', 'Total_Cost': 'sum'}
)
print(pivot_sales)

# Sort by total cost (descending)
print(pivot_sales.sort_values('Total_Cost', ascending=False))
```

## Exporting and Saving Your Analysis

Once your analysis is complete, you'll often need to export the results:

```python
# Export as CSV
budget_vs_actual.to_csv('budget_analysis.csv', index=False)

# Export to Excel
with pd.ExcelWriter('financial_analysis.xlsx') as writer:
    budget_vs_actual.to_excel(writer, sheet_name='Budget Analysis', index=False)
    pivot_sales.to_excel(writer, sheet_name='Sales by Product')
    monthly_pl.to_excel(writer, sheet_name='Monthly P&L')
    
# Export specific results to JSON (useful for web applications)
over_budget.to_json('over_budget_alert.json', orient='records')
```

## Case Study: Comprehensive Financial Analysis

Let's pull everything together in a finance-focused case study:

```python
# 1. Load and prepare data
transactions = pd.read_csv('transactions.csv')
transactions['Date'] = pd.to_datetime(transactions['Date'])
transactions['Month'] = transactions['Date'].dt.strftime('%Y-%m')
transactions['Quarter'] = transactions['Date'].dt.to_period('Q').astype(str)

# 2. Clean data
transactions['Category'] = transactions['Category'].fillna('Uncategorized')
transactions['Amount'] = transactions['Amount'].fillna(0)

# 3. Create income and expense dataframes
income = transactions[transactions['Amount'] > 0]
expenses = transactions[transactions['Amount'] < 0]
expenses['Abs_Amount'] = expenses['Amount'].abs()  # Make expenses positive for easier calculations

# 4. Quarterly Financial Reports
quarterly_summary = pd.DataFrame({
    'Total_Income': income.groupby('Quarter')['Amount'].sum(),
    'Total_Expenses': expenses.groupby('Quarter')['Abs_Amount'].sum(),
})

quarterly_summary['Net_Profit'] = quarterly_summary['Total_Income'] - quarterly_summary['Total_Expenses']
quarterly_summary['Profit_Margin'] = quarterly_summary['Net_Profit'] / quarterly_summary['Total_Income'] * 100

print("Quarterly Financial Summary:")
print(quarterly_summary)

# 5. Top 5 expense categories
top_expenses = expenses.groupby('Category')['Abs_Amount'].sum().sort_values(ascending=False).head(5)
print("\nTop 5 Expense Categories:")
print(top_expenses)

# 6. Monthly trend analysis
monthly_net = pd.DataFrame({
    'Income': income.groupby('Month')['Amount'].sum(),
    'Expenses': expenses.groupby('Month')['Abs_Amount'].sum() * -1  # Make expenses negative again
})

monthly_net['Net'] = monthly_net['Income'] + monthly_net['Expenses']  # Net will be positive or negative
monthly_net['3M_Rolling_Avg'] = monthly_net['Net'].rolling(window=3).mean()

print("\nMonthly Trend Analysis:")
print(monthly_net)

# 7. Cash flow analysis
transactions = transactions.sort_values('Date')
transactions['Running_Balance'] = transactions['Amount'].cumsum()

# Find any days where cash balance went negative
cash_issues = transactions[transactions['Running_Balance'] < 0]
if not cash_issues.empty:
    print("\nCash Flow Alert - Negative Balance Detected:")
    print(cash_issues[['Date', 'Running_Balance']].head())

# 8. Year-over-year comparison (assuming we have multiple years of data)
transactions['Year'] = transactions['Date'].dt.year
yoy_income = income.groupby(['Year', 'Quarter'])['Amount'].sum().unstack()
print("\nYear-over-Year Quarterly Income:")
print(yoy_income)

# 9. Export key insights to Excel
with pd.ExcelWriter('financial_insights.xlsx') as writer:
    quarterly_summary.to_excel(writer, sheet_name='Quarterly Summary')
    top_expenses.to_excel(writer, sheet_name='Top Expenses')
    monthly_net.to_excel(writer, sheet_name='Monthly Trends')
    
print("\nFinancial analysis complete! Results exported to 'financial_insights.xlsx'")
```

## Key Takeaways from pandas for Finance Professionals

For finance and accounting professionals, pandas offers several key advantages:

1. **Automation**: Automate repetitive data tasks that would take hours in Excel
2. **Scale**: Handle much larger datasets than Excel can manage
3. **Reproducibility**: Document your analysis as code for future reference or audit
4. **Flexibility**: Customize your analysis beyond what Excel templates allow
5. **Integration**: Connect directly to databases, APIs, and other data sources
6. **Analysis Power**: Perform complex statistical operations with minimal code

## Next Steps

Now that you understand the basics of pandas for financial data analysis, you're ready to move on to data visualization in our next post. We'll explore how to transform these financial insights into compelling visualizations using Matplotlib and Seaborn!

## Exercise: Financial Data Analysis

Before you go, try this exercise to practice your pandas skills:

You have a CSV file of transactions with columns for Date, Description, Category, and Amount. Using pandas:

1. Calculate the monthly income, expenses, and net profit
2. Find the top 3 expense categories by total amount
3. Create a month-over-month percentage change analysis of your net profit
4. Identify any expense categories that show an increasing trend over time

Good luck, and feel free to share your solutions in the comments!

---

*This post is part of my journey learning Python. I'm a chartered accountant exploring programming to enhance my financial analysis toolkit. Follow along as we discover together how Python can transform our work in finance and accounting!*