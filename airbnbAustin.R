library(ggplot2)
library(jsonlite)


# Define the function
calculate_percentile <- function(data, column, score) {
  if (!is.numeric(score) || score < 1 || score > 5) {
    stop("Score must be a numeric value between 1 and 5.")
  }
  
  if (!column %in% colnames(data)) {
    stop("Specified column does not exist in the data.")
  }
  
  # Calculate the percentile
  percentile <- ecdf(data[[column]])(score) * 100
  
  return(percentile)
}

# Example usage
# Replace 'airbnb_data' with your actual dataframe
# Ensure 'review_score' is the column with review scores
# airbnb_data <- data.frame(review_score = c(4.7, 4.9, 4.5, 4.8, 4.6, 4.7))  # Sample data

airbnb_data <- read.csv('/Users/matthewwilton/Downloads/listings (1) 2.csv')
ratings <- na.omit(airbnb_data$review_scores_rating)

# Convert to JSON
json_file_path <- "/Users/matthewwilton/Desktop/Airbnb Project/percentile-data.json"
write_json(ratings, json_file_path, pretty = TRUE)

cat("JSON file saved to", json_file_path, "\n")

# Input a score (e.g., 4.7) to get its percentile
input_score <- 4.7
percentile <- calculate_percentile(airbnb_data, "review_scores_rating", input_score)

# Output the result
cat(sprintf("The percentile for a review score of %.1f is %.2f%%.\n", input_score, percentile))

# Create a histogram with focused range
ggplot(airbnb_data, aes(x = review_scores_rating)) +
  geom_histogram(binwidth = 0.05, color = "black", fill = "blue", alpha = 0.7) +
  scale_x_continuous(limits = c(4, 5), breaks = seq(4, 5, by = 0.1)) +
  labs(
    title = "Distribution of Review Scores (Focused on 4-5 Range)",
    x = "Review Scores",
    y = "Frequency"
  ) +
  theme_minimal()


# Define the function to find the rating corresponding to a percentile
find_rating_from_percentile <- function(data, column, percentile) {
  if (!is.numeric(percentile) || percentile < 0 || percentile > 100) {
    stop("Percentile must be a numeric value between 0 and 100.")
  }
  
  if (!column %in% colnames(data)) {
    stop("Specified column does not exist in the data.")
  }
  
  # Sort the data
  sorted_data <- sort(data[[column]])
  
  # Calculate the position in the sorted data that corresponds to the given percentile
  index <- ceiling(percentile / 100 * length(sorted_data))
  
  # Handle edge cases
  index <- min(max(index, 1), length(sorted_data))
  
  # Return the corresponding rating
  return(sorted_data[index])
}

# Example usage
# Input a percentile
input_percentile <- 50
rating <- find_rating_from_percentile(airbnb_data, "review_scores_rating", input_percentile)

# Output the result
cat(sprintf("The rating corresponding to the %.1fth percentile is %.2f.\n", input_percentile, rating))
