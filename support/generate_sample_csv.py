import csv
import random

products = ["product A", "product B", "product C"]

reviews = ["awesome", "awful", "great", "bad", "excellent", "poor"]

def generate_csv(file_name, products, num_rows):
    with open(file_name, mode="w", newline='', encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["product", "reviewer", "review"])

        for i in range(num_rows):
            product = random.choice(products)
            reviewer = i + 1
            review = random.choice(reviews)
            writer.writerow([product, reviewer, review])

generate_csv("products_reviews.csv", products, 1000)

print("csv generated")