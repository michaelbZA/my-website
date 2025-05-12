---
title: "Part 13: Data Visualisation Basics in Python"
date: 2025-07-24
slug: python-data-visualisation-basics
description: "Create effective data visualisations using Matplotlib and Seaborn. Learn to make various plot types, customise their appearance, and save your figures for reports and presentations."
tags: ["python", "data visualisation", "matplotlib", "seaborn", "plotting", "charts", "graphs"]
categories: ["Python Series"]
series: ["Python Mastery"]
series_order: 14
showToc: true
TocOpen: false
draft: false
#weight: 13
#cover:
    #image: "images/python-series/part13-cover.jpg"
    #alt: "Python Data Visualization"
    #caption: "Creating effective visualizations with Python"
    #relative: false
--- 

# Data Visualization Basics in Python

Welcome to the thirteenth post in our Python learning series! In this article, we'll explore how to create effective data visualizations in Python - an essential skill for analyzing and communicating financial data.

If you've been following along, you've already learned how to work with data using NumPy and pandas. Now it's time to bring that data to life through visualization. Whether you're analyzing budget trends, tracking investment performance, or presenting financial reports, the right visualization can transform raw numbers into actionable insights.

## Why Data Visualization Matters in Finance

As a finance professional, I've found that visualizations can:

- Quickly identify trends that might be missed in spreadsheets
- Effectively communicate financial performance to stakeholders
- Spot outliers or anomalies in financial data
- Compare actual results against forecasts more intuitively
- Support data-driven decision making

Let's dive into the tools and techniques we'll need to create these visualizations.

## Setting Up Your Environment

First, make sure you have the necessary libraries installed. If you're using Anaconda, you likely already have these. If not, install them using pip:

```python
pip install matplotlib seaborn pandas numpy
```

Let's import the libraries we'll need:

```python
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# Set the style for our plots
plt.style.use('seaborn-v0_8-whitegrid')  # Clean, professional look
```

## Matplotlib Basics: Your Visualization Foundation

Matplotlib is the cornerstone of Python visualization. While it can be a bit verbose, it gives you complete control over your plots.

### Creating a Simple Line Plot

Let's start with a simple line chart showing monthly revenue:

```python
# Sample financial data
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
revenue = [45000, 48000, 47500, 52000, 56000, 58000]

# Create a simple line plot
plt.figure(figsize=(10, 6))  # Set figure size (width, height in inches)
plt.plot(months, revenue, marker='o', linewidth=2, color='#004D99')
plt.title('Monthly Revenue (2025)', fontsize=15)
plt.xlabel('Month', fontsize=12)
plt.ylabel('Revenue ($)', fontsize=12)
plt.grid(True, linestyle='--', alpha=0.7)
plt.tight_layout()
plt.show()
```

This code creates a line chart showing monthly revenue. Let's break down what each part does:

- `plt.figure(figsize=(10, 6))`: Sets the size of our chart (width by height in inches)
- `plt.plot()`: Creates the actual line plot with data points
- `marker='o'`: Adds circular markers at each data point
- `linewidth=2`: Makes the line thicker for better visibility
- `color='#004D99'`: Sets a professional blue color using hex code
- The remaining functions add title, labels, and grid lines

### Bar Charts for Comparison

Bar charts are excellent for comparing categorical data, like department expenses:

```python
departments = ['Finance', 'Marketing', 'Operations', 'IT', 'HR']
expenses = [65000, 72000, 89000, 56000, 48000]

plt.figure(figsize=(10, 6))
bars = plt.bar(departments, expenses, color='#2D7BB6')

# Add value labels on top of each bar
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height + 1000,
             f'${height:,}', ha='center', va='bottom')

plt.title('Q1 Department Expenses', fontsize=15)
plt.xlabel('Department', fontsize=12)
plt.ylabel('Expenses ($)', fontsize=12)
plt.ylim(0, max(expenses) * 1.15)  # Add some headroom for the labels
plt.tight_layout()
plt.show()
```

This code adds a nice touch by displaying the actual values above each bar, making it easy to see the exact numbers while still getting the visual comparison.

### Pie Charts for Part-to-Whole Relationships

Pie charts can be effective for showing how parts make up a whole, such as budget allocation:

```python
categories = ['Salaries', 'Marketing', 'R&D', 'Operations', 'Other']
budget_allocation = [45, 15, 20, 12, 8]  # percentages

plt.figure(figsize=(10, 7))
plt.pie(budget_allocation, labels=categories, autopct='%1.1f%%',
        startangle=90, shadow=False, explode=[0.05, 0, 0, 0, 0],
        colors=['#4878D0', '#EE854A', '#6ACC64', '#D65F5F', '#956CB4'])
plt.title('Annual Budget Allocation', fontsize=15)
plt.axis('equal')  # Equal aspect ratio ensures the pie chart is circular
plt.tight_layout()
plt.show()
```

The `explode` parameter slightly separates the 'Salaries' slice to emphasize it as the largest expense.

### Histograms for Distribution Analysis

Histograms help visualize the distribution of continuous data. This is useful for analyzing things like daily stock returns:

```python
# Generate some random daily returns data (normally distributed)
np.random.seed(42)  # For reproducibility
daily_returns = np.random.normal(0.001, 0.02, 250)  # Mean, std dev, number of trading days

plt.figure(figsize=(10, 6))
plt.hist(daily_returns, bins=25, alpha=0.7, color='#2D7BB6', edgecolor='black')
plt.axvline(x=0, color='r', linestyle='--', alpha=0.7)  # Add line at x=0
plt.title('Distribution of Daily Stock Returns', fontsize=15)
plt.xlabel('Daily Return', fontsize=12)
plt.ylabel('Frequency', fontsize=12)
plt.grid(True, linestyle='--', alpha=0.7)
plt.tight_layout()
plt.show()
```

The red vertical line at x=0 helps distinguish between positive and negative returns.

### Scatter Plots for Correlation Analysis

Scatter plots are perfect for examining relationships between two variables, like the correlation between marketing spend and revenue:

```python
# Generate sample data
np.random.seed(42)
marketing_spend = np.random.normal(50000, 15000, 30)  # 30 months of data
revenue = 3.5 * marketing_spend + np.random.normal(20000, 40000, 30)  # Revenue with noise

plt.figure(figsize=(10, 6))
plt.scatter(marketing_spend, revenue, alpha=0.7, color='#2D7BB6', edgecolor='black')

# Add a trend line
z = np.polyfit(marketing_spend, revenue, 1)
p = np.poly1d(z)
plt.plot(marketing_spend, p(marketing_spend), "r--", alpha=0.7)

plt.title('Correlation: Marketing Spend vs. Revenue', fontsize=15)
plt.xlabel('Marketing Spend ($)', fontsize=12)
plt.ylabel('Revenue ($)', fontsize=12)
plt.grid(True, linestyle='--', alpha=0.7)
plt.tight_layout()
plt.show()
```

The trend line helps visualize the overall relationship between the variables.

## Customizing Matplotlib Plots

Now let's look at some additional customization options that can make your financial visualizations more professional and effective.

### Creating Subplots

Often you'll want to show multiple related charts together. Subplots are perfect for this:

```python
# Generate some financial data
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
revenue = [45000, 48000, 47500, 52000, 56000, 58000]
expenses = [38000, 42000, 40000, 43000, 45000, 47000]
profit = [r - e for r, e in zip(revenue, expenses)]

# Create subplots
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))

# First subplot: Revenue and Expenses
ax1.plot(months, revenue, 'o-', label='Revenue', linewidth=2, color='#2D7BB6')
ax1.plot(months, expenses, 's-', label='Expenses', linewidth=2, color='#EE854A')
ax1.set_title('Revenue vs. Expenses (H1 2025)', fontsize=15)
ax1.set_ylabel('Amount ($)', fontsize=12)
ax1.grid(True, linestyle='--', alpha=0.7)
ax1.legend()

# Second subplot: Profit
bars = ax2.bar(months, profit, color='#6ACC64')
# Add value labels on top of each bar
for bar in bars:
    height = bar.get_height()
    ax2.text(bar.get_x() + bar.get_width()/2., height + 500,
             f'${height:,}', ha='center', va='bottom')
    
ax2.set_title('Monthly Profit (H1 2025)', fontsize=15)
ax2.set_xlabel('Month', fontsize=12)
ax2.set_ylabel('Profit ($)', fontsize=12)
ax2.grid(True, linestyle='--', alpha=0.7)

plt.tight_layout()
plt.show()
```

This code creates two charts stacked vertically: a line chart comparing revenue and expenses, and a bar chart showing the resulting profit.

### Adding Annotations

Annotations can add important context to your charts:

```python
quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025']
stock_price = [45.50, 48.75, 52.30, 54.10, 62.80]

fig, ax = plt.subplots(figsize=(10, 6))
ax.plot(quarters, stock_price, 'o-', linewidth=2, color='#2D7BB6')

# Add annotation for significant event
ax.annotate('New Product Launch', 
            xy=(3, 54.10),  # Position to point at
            xytext=(3, 58),  # Text position
            arrowprops=dict(facecolor='black', shrink=0.05, width=1.5),
            fontsize=12)

# Add annotation for earnings report
ax.annotate('Earnings Beat\nEstimates by 15%', 
            xy=(4, 62.80),  # Position to point at
            xytext=(3.5, 67),  # Text position
            arrowprops=dict(facecolor='black', shrink=0.05, width=1.5),
            fontsize=12)

ax.set_title('Quarterly Stock Price', fontsize=15)
ax.set_ylabel('Price ($)', fontsize=12)
ax.grid(True, linestyle='--', alpha=0.7)
plt.tight_layout()
plt.show()
```

### Saving Your Plots

Save your visualizations for reports or presentations:

```python
plt.figure(figsize=(10, 6))
plt.plot(months, revenue, marker='o', linewidth=2, color='#004D99')
plt.title('Monthly Revenue (2025)', fontsize=15)
plt.xlabel('Month', fontsize=12)
plt.ylabel('Revenue ($)', fontsize=12)
plt.grid(True, linestyle='--', alpha=0.7)
plt.tight_layout()

# Save in different formats
plt.savefig('monthly_revenue.png', dpi=300)  # High-resolution PNG
plt.savefig('monthly_revenue.pdf')  # PDF for publications
plt.savefig('monthly_revenue.svg')  # Scalable vector graphic
```

## Advanced Visualization with Seaborn

Seaborn builds on matplotlib and provides a higher-level interface for creating attractive statistical graphics.

### Heatmaps for Correlation Matrices

Heatmaps are excellent for visualizing correlation matrices of financial instruments:

```python
# Generate correlated returns for 5 assets
np.random.seed(42)
n = 1000  # Number of days
# Create correlated returns for 5 assets
corr_matrix = np.array([
    [1.0, 0.7, 0.5, 0.3, 0.1],
    [0.7, 1.0, 0.6, 0.4, 0.2],
    [0.5, 0.6, 1.0, 0.7, 0.5],
    [0.3, 0.4, 0.7, 1.0, 0.6],
    [0.1, 0.2, 0.5, 0.6, 1.0]
])
asset_names = ['S&P 500', 'NASDAQ', 'DJIA', 'Treasury Bonds', 'Gold']

plt.figure(figsize=(10, 8))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', 
            xticklabels=asset_names, yticklabels=asset_names,
            linewidths=0.5, vmin=-1, vmax=1)
plt.title('Asset Correlation Matrix', fontsize=15)
plt.tight_layout()
plt.show()
```

This creates a heatmap showing the correlation between different assets, with values annotated directly on the cells.

### Box Plots for Distribution Comparison

Box plots are useful for comparing distributions, like monthly expenses across departments:

```python
# Create sample data
departments = ['Finance', 'Marketing', 'Operations', 'IT', 'HR']
data = {
    'Department': np.repeat(departments, 20),
    'Monthly_Expense': [
        *np.random.normal(5000, 800, 20),   # Finance
        *np.random.normal(8500, 1200, 20),  # Marketing
        *np.random.normal(7200, 1500, 20),  # Operations
        *np.random.normal(6800, 1000, 20),  # IT
        *np.random.normal(4500, 600, 20)    # HR
    ]
}
df = pd.DataFrame(data)

plt.figure(figsize=(12, 7))
sns.boxplot(x='Department', y='Monthly_Expense', data=df, palette='muted')
plt.title('Monthly Expense Distribution by Department', fontsize=15)
plt.xlabel('Department', fontsize=12)
plt.ylabel('Monthly Expense ($)', fontsize=12)
plt.grid(True, linestyle='--', alpha=0.7)
plt.tight_layout()
plt.show()
```

Box plots show the median, quartiles, and outliers, giving you a complete picture of each distribution.

### Pair Plots for Multi-variable Analysis

When analyzing multiple variables, pair plots can show all possible scatter plots at once:

```python
# Generate sample financial metrics for companies
np.random.seed(42)
n_companies = 30
revenue = np.random.normal(1000, 300, n_companies)
profit_margin = np.random.normal(0.15, 0.05, n_companies)
debt_to_equity = np.random.normal(0.5, 0.2, n_companies)
pe_ratio = np.random.normal(18, 5, n_companies)

df = pd.DataFrame({
    'Revenue': revenue,
    'Profit_Margin': profit_margin,
    'Debt_to_Equity': debt_to_equity,
    'PE_Ratio': pe_ratio
})

# Create pair plot
sns.pairplot(df, height=2.5, corner=True)
plt.suptitle('Relationships Between Financial Metrics', y=1.02, fontsize=16)
plt.tight_layout()
plt.show()
```

This creates scatter plots for every combination of variables, helping you spot relationships between multiple financial metrics at once.

### Combined Line and Bar Chart

For financial reports, you often want to combine different chart types, like showing monthly profit as bars with a revenue trend line:

```python
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
revenue = [250, 310, 290, 340, 390, 420]  # in thousands
profit = [50, 70, 65, 85, 100, 115]  # in thousands

fig, ax1 = plt.subplots(figsize=(10, 6))

# Bar chart for profit
ax1.bar(months, profit, color='#6ACC64', alpha=0.7, label='Profit')
ax1.set_xlabel('Month', fontsize=12)
ax1.set_ylabel('Profit ($ thousands)', fontsize=12)
ax1.tick_params(axis='y')

# Create second y-axis for revenue
ax2 = ax1.twinx()
ax2.plot(months, revenue, 'o-', color='#2D7BB6', linewidth=2, label='Revenue')
ax2.set_ylabel('Revenue ($ thousands)', fontsize=12)
ax2.tick_params(axis='y')

# Add legends
lines1, labels1 = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper left')

plt.title('Monthly Revenue and Profit (H1 2025)', fontsize=15)
plt.grid(True, linestyle='--', alpha=0.7)
plt.tight_layout()
plt.show()
```

This creates a dual-axis chart with bars for profit and a line for revenue, making it easy to see the relationship between the two.

## Best Practices for Financial Visualizations

Based on my experience in finance, here are some best practices to make your visualizations more effective:

1. **Choose the right chart type** for your data and the story you want to tell:
   - Line charts for trends over time
   - Bar charts for comparing categories
   - Pie charts for part-to-whole relationships (use sparingly)
   - Scatter plots for correlations
   - Box plots for distributions

2. **Keep it simple and focused** - make sure your visualization answers a specific question or highlights a key insight.

3. **Use consistent colors** that represent your data appropriately (red for negative, green for positive in financial contexts).

4. **Label everything clearly** - titles, axes, legends, and data points where appropriate.

5. **Consider your audience** - executives might want high-level trends, while analysts need more detailed visualizations.

6. **Use appropriate scales** - avoid truncating axes in ways that might exaggerate changes.

7. **Add context with annotations** - highlight key events or outliers to tell the complete story.

## Practical Exercise: Financial Dashboard

Let's put everything together to create a simple financial dashboard with multiple charts:

```python
# Create sample data
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
revenue = [250, 310, 290, 340, 390, 420]  # in thousands
expenses = [200, 240, 225, 255, 290, 305]  # in thousands
profit = [r - e for r, e in zip(revenue, expenses)]  # in thousands
profit_margin = [p/r for p, r in zip(profit, revenue)]
expense_breakdown = {
    'Salaries': [120, 125, 130, 132, 135, 140],
    'Marketing': [30, 55, 40, 58, 82, 85],
    'Operations': [35, 40, 35, 45, 50, 55],
    'Other': [15, 20, 20, 20, 23, 25]
}

# Create a 2x2 grid of subplots
fig, axs = plt.subplots(2, 2, figsize=(15, 12))

# Plot 1: Revenue and Expenses line chart (top left)
axs[0, 0].plot(months, revenue, 'o-', label='Revenue', linewidth=2, color='#2D7BB6')
axs[0, 0].plot(months, expenses, 's-', label='Expenses', linewidth=2, color='#EE854A')
axs[0, 0].set_title('Revenue vs. Expenses', fontsize=14)
axs[0, 0].set_ylabel('Amount ($ thousands)', fontsize=12)
axs[0, 0].grid(True, linestyle='--', alpha=0.7)
axs[0, 0].legend()

# Plot 2: Profit bar chart (top right)
bars = axs[0, 1].bar(months, profit, color='#6ACC64')
for bar in bars:
    height = bar.get_height()
    axs[0, 1].text(bar.get_x() + bar.get_width()/2., height + 2,
             f'${height:,}k', ha='center', va='bottom')
axs[0, 1].set_title('Monthly Profit', fontsize=14)
axs[0, 1].set_ylabel('Profit ($ thousands)', fontsize=12)
axs[0, 1].grid(True, linestyle='--', alpha=0.7)

# Plot 3: Expense breakdown stacked bar chart (bottom left)
bottom = np.zeros(6)
for category, values in expense_breakdown.items():
    axs[1, 0].bar(months, values, bottom=bottom, label=category)
    bottom += values
axs[1, 0].set_title('Expense Breakdown', fontsize=14)
axs[1, 0].set_xlabel('Month', fontsize=12)
axs[1, 0].set_ylabel('Expenses ($ thousands)', fontsize=12)
axs[1, 0].legend()
axs[1, 0].grid(True, linestyle='--', alpha=0.7)

# Plot 4: Profit margin line chart (bottom right)
axs[1, 1].plot(months, [m*100 for m in profit_margin], 'D-', color='#956CB4', linewidth=2)
for i, m in enumerate(profit_margin):
    axs[1, 1].text(i, m*100 + 0.5, f'{m*100:.1f}%', ha='center')
axs[1, 1].set_title('Profit Margin', fontsize=14)
axs[1, 1].set_xlabel('Month', fontsize=12)
axs[1, 1].set_ylabel('Margin (%)', fontsize=12)
axs[1, 1].grid(True, linestyle='--', alpha=0.7)

plt.tight_layout()
plt.suptitle('H1 2025 Financial Performance Dashboard', fontsize=18, y=1.02)
plt.subplots_adjust(top=0.9)
plt.savefig('financial_dashboard.png', dpi=300, bbox_inches='tight')
plt.show()
```

This code creates a comprehensive financial dashboard with four different visualizations that provide a complete picture of the financial performance.

## Conclusion

Data visualization is a powerful tool in your financial analysis toolkit. With matplotlib and seaborn, you can create everything from simple charts to complex dashboards that help you and your stakeholders understand financial data more effectively.

In this post, we've covered:
- Creating basic charts (line, bar, pie, histogram, scatter)
- Customizing your plots with titles, labels, and annotations
- Using advanced features like subplots and dual axes
- Applying seaborn for statistical visualizations
- Building a financial dashboard

As you continue your Python journey, I encourage you to experiment with these visualization techniques on your own financial data. Try recreating some of the charts you currently use in Excel or other tools, and see how Python can enhance your financial analysis workflow.

In the next post, we'll explore object-oriented programming (OOP) in Python, which will help you organize your code more effectively for larger projects.

Until then, happy visualizing!