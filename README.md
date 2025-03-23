# csv-handler

![demo](https://github.com/nash1111/csv-handler/blob/master/csv-handler.gif)

## Overview

csv-handler is a web application that allows you to easily manipulate CSV files and perform sentiment analysis on text data.

Main features:
- Upload and display CSV files
- Perform sentiment analysis on text data using Google Cloud Natural Language API
- Add new columns
- Download processed data as CSV

## Requirements

To use this application, you need a **Google Cloud Natural Language API** key.

### How to obtain a Google Cloud Natural Language API key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and log in to your account
2. Create or select a project
3. Navigate to "APIs & Services" > "Library"
4. Search for "Cloud Natural Language API" and enable it
5. Go to "APIs & Services" > "Credentials"
6. Click "Create Credentials" > "API key"
7. Copy the created API key (for security, it's recommended to set restrictions on your API key)

## How to use

1. Launch the application
2. Enter your Google Cloud Natural Language API key and click the "save api key" button
3. Upload a CSV file
4. Select the column containing text you want to analyze ("Select text column") and the column where you want to store the results ("Select target column")
5. Click the "Run Sentiment Analysis" button to perform sentiment analysis
6. Add new columns as needed
7. Click the "Download CSV" button to download the processed data

## About Sentiment Analysis Scores

Sentiment analysis scores range from -1.0 to 1.0:
- Negative values (closer to -1.0): Negative sentiment
- Values close to 0: Neutral sentiment
- Positive values (closer to 1.0): Positive sentiment
