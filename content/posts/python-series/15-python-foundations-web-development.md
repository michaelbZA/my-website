---
title: "Part 15: Web Development Foundations with Python"
date: 2025-08-07
slug: python-web-development-foundations
description: "Explore web development options in Python. Learn Flask for lightweight applications, Django for full-featured sites, or web scraping with requests and BeautifulSoup. Deploy your first web app."
tags: ["python", "web development", "flask", "django", "web scraping", "requests", "beautifulsoup", "deployment"]
categories: ["Python Series"]
series: ["Python Mastery"]
series_order: 16
showToc: true
TocOpen: false
draft: false
#weight: 15
#cover:
    #image: "images/python-series/part15-cover.jpg"
    #alt: "Python Web Development"
    #caption: "Building web applications with Python"
    #relative: false
--- 

# Python Learning Series: Web Development Foundations

*Part 15 of my 17-part series on learning Python as a finance professional*

After exploring all the fundamentals of Python programming, it's time to put those skills to practical use by diving into web development. As a finance manager, I've found that building simple web applications can help automate reports, create interactive dashboards, and share financial data across teams.

In this post, I'll cover three popular approaches to web development with Python:
- **Option A**: Flask - A lightweight web framework
- **Option B**: Django - A full-featured web framework
- **Option C**: Web Scraping - Extracting financial data from websites

Let's explore each option with practical examples relevant to finance work.

## Option A: Flask - Building a Lightweight Financial Dashboard

Flask is perfect when you need a simple web interface without the overhead of a full framework. Let's build a basic financial dashboard that displays company expense data.

### Setting Up Flask

First, we need to install Flask:

```python
# Create and activate your virtual environment first
# Then install Flask
pip install flask
```

Now, let's create a simple Flask application in a file called `app.py`:

```python
from flask import Flask, render_template
import json

app = Flask(__name__)

# Sample financial data (in a real app, this would come from a database)
expense_data = [
    {"month": "January", "marketing": 2400, "operations": 5000, "payroll": 12000},
    {"month": "February", "marketing": 1800, "operations": 5100, "payroll": 12000},
    {"month": "March", "marketing": 2200, "operations": 4800, "payroll": 12500},
    {"month": "April", "marketing": 2500, "operations": 5200, "payroll": 12500}
]

@app.route('/')
def index():
    # Calculate totals
    total_marketing = sum(month["marketing"] for month in expense_data)
    total_operations = sum(month["operations"] for month in expense_data)
    total_payroll = sum(month["payroll"] for month in expense_data)
    grand_total = total_marketing + total_operations + total_payroll
    
    return render_template(
        'dashboard.html', 
        expense_data=expense_data,
        total_marketing=total_marketing,
        total_operations=total_operations,
        total_payroll=total_payroll,
        grand_total=grand_total,
        chart_data=json.dumps(expense_data)
    )

if __name__ == '__main__':
    app.run(debug=True)
```

### Creating Templates

Flask uses templates to generate HTML. Create a `templates` folder in the same directory as your `app.py` file, and add a new file called `dashboard.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Finance Dashboard</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='styles.css') }}">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container">
        <h1>Quarterly Expense Dashboard</h1>
        
        <div class="summary-box">
            <h2>Q1 + April Expense Summary</h2>
            <p>Total Marketing: ${{ total_marketing }}</p>
            <p>Total Operations: ${{ total_operations }}</p>
            <p>Total Payroll: ${{ total_payroll }}</p>
            <p class="grand-total">Grand Total: ${{ grand_total }}</p>
        </div>
        
        <div class="chart-container">
            <canvas id="expenseChart"></canvas>
        </div>
        
        <table class="expense-table">
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Marketing</th>
                    <th>Operations</th>
                    <th>Payroll</th>
                    <th>Monthly Total</th>
                </tr>
            </thead>
            <tbody>
                {% for month in expense_data %}
                <tr>
                    <td>{{ month.month }}</td>
                    <td>${{ month.marketing }}</td>
                    <td>${{ month.operations }}</td>
                    <td>${{ month.payroll }}</td>
                    <td>${{ month.marketing + month.operations + month.payroll }}</td>
                </tr>
                {% endfor %}
            </tbody>
        </table>
    </div>
    
    <script>
        // Parse the data from Flask
        const expenseData = {{ chart_data|safe }};
        
        // Prepare data for Chart.js
        const labels = expenseData.map(item => item.month);
        const marketingData = expenseData.map(item => item.marketing);
        const operationsData = expenseData.map(item => item.operations);
        const payrollData = expenseData.map(item => item.payroll);
        
        // Create the chart
        const ctx = document.getElementById('expenseChart').getContext('2d');
        const expenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Marketing',
                        data: marketingData,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)'
                    },
                    {
                        label: 'Operations',
                        data: operationsData,
                        backgroundColor: 'rgba(255, 206, 86, 0.5)'
                    },
                    {
                        label: 'Payroll',
                        data: payrollData,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        stacked: false
                    },
                    y: {
                        stacked: false,
                        beginAtZero: true
                    }
                }
            }
        });
    </script>
</body>
</html>
```

### Adding CSS Styles

Create a `static` folder in the same directory as your `app.py` file, and add a file called `styles.css`:

```css
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

h1 {
    color: #333;
    text-align: center;
    margin-bottom: 30px;
}

.summary-box {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
}

.grand-total {
    font-weight: bold;
    font-size: 1.2em;
    color: #0066cc;
}

.chart-container {
    margin-bottom: 30px;
    height: 400px;
}

.expense-table {
    width: 100%;
    border-collapse: collapse;
}

.expense-table th, .expense-table td {
    padding: 10px;
    text-align: right;
    border-bottom: 1px solid #ddd;
}

.expense-table th:first-child, .expense-table td:first-child {
    text-align: left;
}

.expense-table th {
    background-color: #f2f2f2;
}

.expense-table tr:hover {
    background-color: #f5f5f5;
}
```

### Running the Flask Application

Run your application by executing:

```python
python app.py
```

Then open your browser to `http://127.0.0.1:5000/` to see your dashboard!

### Project Structure

Your project should have this structure:
```
financial-dashboard/
├── app.py
├── static/
│   └── styles.css
└── templates/
    └── dashboard.html
```

## Option B: Django - Building a Full-Featured Financial Application

Django is a more robust framework that's perfect for complex applications. Let's create a simplified financial transaction tracker.

### Installing Django

```python
pip install django
```

### Creating a New Django Project

```python
django-admin startproject financial_tracker
cd financial_tracker
python manage.py startapp transactions
```

### Defining Models

Edit `transactions/models.py`:

```python
from django.db import models
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    date = models.DateField(default=timezone.now)
    
    def __str__(self):
        return f"{self.description} - ${self.amount}"
```

### Registering the App

Edit `financial_tracker/settings.py` to add the app to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'transactions',  # Add your app here
]
```

### Creating Migrations and Admin Interface

```python
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

Register the models with the admin interface by editing `transactions/admin.py`:

```python
from django.contrib import admin
from .models import Category, Transaction

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('description', 'amount', 'category', 'transaction_type', 'date')
    list_filter = ('category', 'transaction_type', 'date')
    search_fields = ('description',)
    date_hierarchy = 'date'
```

### Creating Views

Edit `transactions/views.py`:

```python
from django.shortcuts import render
from django.db.models import Sum
from .models import Transaction

def dashboard(request):
    # Get recent transactions
    recent_transactions = Transaction.objects.order_by('-date')[:10]
    
    # Calculate summary statistics
    total_income = Transaction.objects.filter(transaction_type='income').aggregate(Sum('amount'))['amount__sum'] or 0
    total_expenses = Transaction.objects.filter(transaction_type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
    net_balance = total_income - total_expenses
    
    # Get monthly data for chart
    from django.db.models.functions import TruncMonth
    monthly_data = Transaction.objects.annotate(month=TruncMonth('date')) \
        .values('month', 'transaction_type') \
        .annotate(total=Sum('amount')) \
        .order_by('month')
    
    # Prepare data for chart
    months = []
    income_data = []
    expense_data = []
    
    current_month = None
    current_income = 0
    current_expense = 0
    
    for item in monthly_data:
        month_str = item['month'].strftime('%b %Y')
        
        if current_month != month_str:
            if current_month is not None:
                months.append(current_month)
                income_data.append(current_income)
                expense_data.append(current_expense)
                
            current_month = month_str
            current_income = 0
            current_expense = 0
        
        if item['transaction_type'] == 'income':
            current_income = float(item['total'])
        else:
            current_expense = float(item['total'])
    
    # Add the last month
    if current_month is not None:
        months.append(current_month)
        income_data.append(current_income)
        expense_data.append(current_expense)
    
    context = {
        'recent_transactions': recent_transactions,
        'total_income': total_income,
        'total_expenses': total_expenses,
        'net_balance': net_balance,
        'months': months,
        'income_data': income_data,
        'expense_data': expense_data,
    }
    
    return render(request, 'transactions/dashboard.html', context)
```

### Setting Up URLs

Create `transactions/urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
]
```

Then edit `financial_tracker/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('transactions.urls')),
]
```

### Creating Templates

Create directories:
```
mkdir -p transactions/templates/transactions
```

Create `transactions/templates/transactions/dashboard.html`:

```html
{% load static %}
<!DOCTYPE html>
<html>
<head>
    <title>Financial Tracker</title>
    <link rel="stylesheet" href="{% static 'transactions/styles.css' %}">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container">
        <h1>Financial Tracker Dashboard</h1>
        
        <div class="summary-container">
            <div class="summary-box income">
                <h3>Total Income</h3>
                <p>${{ total_income }}</p>
            </div>
            
            <div class="summary-box expenses">
                <h3>Total Expenses</h3>
                <p>${{ total_expenses }}</p>
            </div>
            
            <div class="summary-box balance">
                <h3>Net Balance</h3>
                <p>${{ net_balance }}</p>
            </div>
        </div>
        
        <div class="chart-container">
            <canvas id="financialChart"></canvas>
        </div>
        
        <div class="recent-transactions">
            <h2>Recent Transactions</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {% for transaction in recent_transactions %}
                    <tr class="{{ transaction.transaction_type }}">
                        <td>{{ transaction.date }}</td>
                        <td>{{ transaction.description }}</td>
                        <td>{{ transaction.category }}</td>
                        <td>{{ transaction.transaction_type|title }}</td>
                        <td>${{ transaction.amount }}</td>
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
    </div>
    
    <script>
        // Get data from context
        const months = {{ months|safe }};
        const incomeData = {{ income_data|safe }};
        const expenseData = {{ expense_data|safe }};
        
        // Create chart
        const ctx = document.getElementById('financialChart').getContext('2d');
        const financialChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Expenses',
                        data: expenseData,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    </script>
</body>
</html>
```

### Adding Static Files

Create directories:
```
mkdir -p transactions/static/transactions
```

Create `transactions/static/transactions/styles.css`:

```css
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

h1 {
    color: #333;
    text-align: center;
    margin-bottom: 30px;
}

.summary-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
}

.summary-box {
    flex: 1;
    padding: 20px;
    margin: 0 10px;
    border-radius: 5px;
    text-align: center;
}

.income {
    background-color: #d4edda;
    color: #155724;
}

.expenses {
    background-color: #f8d7da;
    color: #721c24;
}

.balance {
    background-color: #cce5ff;
    color: #004085;
}

.summary-box h3 {
    margin-top: 0;
}

.summary-box p {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 0;
}

.chart-container {
    margin-bottom: 30px;
    height: 400px;
}

.recent-transactions h2 {
    margin-bottom: 15px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f2f2f2;
}

tr.income {
    background-color: rgba(212, 237, 218, 0.2);
}

tr.expense {
    background-color: rgba(248, 215, 218, 0.2);
}

tr:hover {
    background-color: #f5f5f5;
}
```

### Running the Django Application

```python
python manage.py runserver
```

Access the admin interface at `http://127.0.0.1:8000/admin/` and add some sample data. Then view your dashboard at `http://127.0.0.1:8000/`.

## Option C: Web Scraping - Extracting Financial Data

Let's create a simple web scraper to extract stock price data.

### Installing Required Libraries

```python
pip install requests beautifulsoup4 pandas matplotlib
```

### Creating a Stock Price Scraper

Create a file named `stock_scraper.py`:

```python
import requests
from bs4 import BeautifulSoup
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

def get_stock_data(ticker):
    """Scrape basic stock information for the given ticker."""
    url = f"https://finance.yahoo.com/quote/{ticker}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise exception for 4XX/5XX responses
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract the company name
        company_name = soup.find('h1', class_='D(ib)').text.strip()
        
        # Extract current price
        current_price = soup.find('fin-streamer', {'data-field': 'regularMarketPrice'}).text
        
        # Extract previous close
        prev_close_label = soup.find('td', text='Previous Close')
        prev_close = prev_close_label.find_next_sibling('td').text if prev_close_label else 'N/A'
        
        # Extract open price
        open_label = soup.find('td', text='Open')
        open_price = open_label.find_next_sibling('td').text if open_label else 'N/A'
        
        # Extract day range
        day_range_label = soup.find('td', text="Day's Range")
        day_range = day_range_label.find_next_sibling('td').text if day_range_label else 'N/A'
        
        # Extract 52 week range
        week_range_label = soup.find('td', text='52 Week Range')
        week_range = week_range_label.find_next_sibling('td').text if week_range_label else 'N/A'
        
        # Extract volume
        volume_label = soup.find('td', text='Volume')
        volume = volume_label.find_next_sibling('td').text if volume_label else 'N/A'
        
        # Extract market cap
        market_cap_label = soup.find('td', text='Market Cap')
        market_cap = market_cap_label.find_next_sibling('td').text if market_cap_label else 'N/A'
        
        # Extract P/E ratio
        pe_ratio_label = soup.find('td', text='PE Ratio (TTM)')
        pe_ratio = pe_ratio_label.find_next_sibling('td').text if pe_ratio_label else 'N/A'
        
        # Create a dictionary with all the data
        stock_data = {
            'Company': company_name,
            'Ticker': ticker,
            'Current Price': current_price,
            'Previous Close': prev_close,
            'Open': open_price,
            'Day Range': day_range,
            '52 Week Range': week_range,
            'Volume': volume,
            'Market Cap': market_cap,
            'PE Ratio (TTM)': pe_ratio,
            'Last Updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        return stock_data
    
    except Exception as e:
        print(f"Error fetching data for {ticker}: {e}")
        return None

def get_historical_data(ticker, period='1mo'):
    """Scrape historical price data for charting."""
    url = f"https://finance.yahoo.com/quote/{ticker}/history"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    # For a proper application, you would use Yahoo Finance API or another service
    # This is a simplified example for demonstration purposes
    
    # Instead of actually scraping (which is complex for the history page),
    # we'll use pandas_datareader which is more reliable for historical data
    import pandas_datareader.data as web
    
    try:
        start_date = pd.Timestamp.now() - pd.DateOffset(months=1)
        if period == '3mo':
            start_date = pd.Timestamp.now() - pd.DateOffset(months=3)
        elif period == '6mo':
            start_date = pd.Timestamp.now() - pd.DateOffset(months=6)
        elif period == '1y':
            start_date = pd.Timestamp.now() - pd.DateOffset(years=1)
        
        end_date = pd.Timestamp.now()
        
        # Get data from Yahoo Finance
        df = web.DataReader(ticker, 'yahoo', start_date, end_date)
        return df
    
    except Exception as e:
        print(f"Error fetching historical data for {ticker}: {e}")
        return None

def plot_stock_price(ticker, period='1mo'):
    """Plot the historical stock price."""
    df = get_historical_data(ticker, period)
    
    if df is None:
        return None
    
    plt.figure(figsize=(12, 6))
    plt.plot(df.index, df['Close'], label=f'{ticker} Close Price')
    plt.title(f'{ticker} Stock Price - Last {period}')
    plt.xlabel('Date')
    plt.ylabel('Price ($)')
    plt.grid(True)
    plt.legend()
    
    # Save the figure
    file_name = f"{ticker}_{period}_price_chart.png"
    plt.savefig(file_name)
    plt.close()
    
    return file_name

def main():
    """Main function to demonstrate the stock scraper."""
    # List of stock tickers to analyze
    tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN']
    
    # Create a DataFrame to store all stock data
    all_data = []
    
    for ticker in tickers:
        print(f"Fetching data for {ticker}...")
        stock_data = get_stock_data(ticker)
        
        if stock_data:
            all_data.append(stock_data)
            
            # Generate and save a price chart
            chart_file = plot_stock_price(ticker, '3mo')
            if chart_file:
                print(f"Chart saved as {chart_file}")
    
    # Convert to DataFrame for easier analysis and display
    if all_data:
        df = pd.DataFrame(all_data)
        print("\nStock Data Summary:")
        print(df)
        
        # Save to CSV
        df.to_csv('stock_data_summary.csv', index=False)
        print("Data saved to stock_data_summary.csv")

if __name__ == "__main__":
    main()
```

### Running the Web Scraper

Execute the script:

```python
pip install pandas-datareader  # Additional dependency for the example
python stock_scraper.py
```

This script will:
1. Fetch current stock data for Apple, Microsoft, Google, and Amazon
2. Generate price charts for each stock
3. Save all data to a CSV file

## Deploying Your Web Application

Once you've built your web application, you'll want to deploy it so others can access it.

### Deploying to Render (Free Alternative to Heroku)

Render is a good free alternative since Heroku no longer offers a free tier.

#### For Flask Applications:

1. Create a `requirements.txt` file:
```
flask==2.0.1
gunicorn==20.1.0
```

2. Create a `Procfile`:
```
web: gunicorn app:app
```

3. Create a new project on GitHub with your app code
4. Sign up for a Render account at render.com
5. Create a new Web Service
6. Connect your GitHub repository
7. Configure settings:
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
8. Click "Create Web Service"

#### For Django Applications:

1. Update `settings.py`:
```python
import os

# Add your Render domain to allowed hosts
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'your-app-name.onrender.com']

# Static files settings
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Configure database (use SQLite for simplicity)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
```

2. Create a `requirements.txt` file:
```
django==4.0.0
gunicorn==20.1.0
whitenoise==5.3.0
```

3. Create a `Procfile`:
```
web: gunicorn financial_tracker.wsgi
```

4. Follow the same steps as Flask to deploy on Render

## Conclusion

In this post, we've covered three different approaches to web development with Python:

1. **Flask** - A lightweight framework perfect for simple financial dashboards and internal tools
2. **Django** - A full-featured framework ideal for complex financial applications with user authentication, database models, and admin interfaces
3. **Web Scraping** - A technique to extract financial data from websites for analysis and visualization

As a finance professional, I've found that these web development skills can significantly enhance your workflow, whether it's creating simple dashboards for expense tracking, building full-featured financial applications, or scraping financial data for analysis.

In the next post, we'll explore building desktop GUI applications with Tkinter, which can be useful for creating financial calculators and other tools that don't require a web interface.

Let me know in the comments which approach you're most interested in exploring further, or if you have any questions about implementing these techniques for your specific financial use case.

*Note: Remember that web scraping should be done responsibly. Always check a website's robots.txt file and terms of service before scraping, and ensure you're not overloading their servers with requests.*