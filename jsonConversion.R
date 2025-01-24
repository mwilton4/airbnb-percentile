# Load required library
library(jsonlite)

# Define the input folder containing CSV files
input_folder <- "/Users/matthewwilton/Desktop/Airbnb Project/CityCSVs/"
output_folder <- "/Users/matthewwilton/Desktop/Airbnb Project/CityJSONs/"

# Ensure the output folder exists
if (!dir.exists(output_folder)) {
  dir.create(output_folder)
}

# Get a list of all CSV files in the input folder
csv_files <- list.files(input_folder, pattern = "\\.csv$", full.names = TRUE)

# Loop through each CSV file and convert to JSON
for (csv_file in csv_files) {
  # Extract the city name from the file name
  file_name <- basename(csv_file) # Extracts the file name
  city_name <- gsub("_Listings_.*", "", file_name) # Removes "_Listings_*"
  
  # Convert city name to desired format (e.g., Albany -> lowercase + "-percentile-data")
  city_name <- paste0(city_name, "-percentile-data")
  # Read the CSV file
  ratings_data <- read.csv(csv_file)
  ratings_data <- na.omit(ratings_data$review_scores_rating)

  # Convert to JSON
  json_file_path <- file.path(output_folder, paste0(city_name, ".json"))
  write_json(ratings_data, json_file_path, pretty = TRUE)
  
  # Notify user
  cat("JSON file saved to", json_file_path, "\n")
}