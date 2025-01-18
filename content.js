(async () => {
    // Load ratings data from JSON
    const response = await fetch(chrome.runtime.getURL("ratings.json")); // Replace with your data file
    const ratings = await response.json();
  
    // Find the review score on the page
    const reviewScoreElement = document.querySelector('[data-testid="rating-badge"]');
    if (!reviewScoreElement) {
      console.error("Review score not found.");
      return;
    }
  
    // Extract the review score
    const reviewScore = parseFloat(reviewScoreElement.textContent);
    if (isNaN(reviewScore)) {
      console.error("Failed to parse review score.");
      return;
    }
  
    // Calculate the percentile dynamically
    function calculatePercentile(rating, ratings) {
      const sortedRatings = ratings.slice().sort((a, b) => a - b); // Sort ratings in ascending order
      const belowCount = sortedRatings.filter((r) => r < rating).length;
      const totalCount = sortedRatings.length;
      return ((belowCount / totalCount) * 100).toFixed(2);
    }
  
    const percentile = calculatePercentile(reviewScore, ratings);
  
    // Display the percentile
    const badge = document.createElement("div");
    badge.style.position = "fixed";
    badge.style.bottom = "10px";
    badge.style.right = "10px";
    badge.style.padding = "10px";
    badge.style.backgroundColor = "blue";
    badge.style.color = "white";
    badge.style.borderRadius = "5px";
    badge.style.zIndex = 10000;
    badge.textContent = `Rating: ${reviewScore}, Percentile: ${percentile}%`;
    document.body.appendChild(badge);
  
    // Remove the badge after 10 seconds
    setTimeout(() => badge.remove(), 10000);
  })();
  