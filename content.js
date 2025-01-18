(async () => {
    console.log("Content script running");
    try {
        const response = await fetch(chrome.runtime.getURL("percentile-data.json"));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const ratings = await response.json();
        console.log("Ratings data loaded", ratings);

        // Update the selector to match the correct element
        const reviewScoreElement = document.querySelector('div[aria-hidden="true"]');
        if (!reviewScoreElement) {
            console.error("Review score not found.");
            return;
        }
        console.log("Review score element found", reviewScoreElement);

        const reviewScoreText = reviewScoreElement.textContent.trim();
        console.log("Review score text:", reviewScoreText);

        const reviewScore = parseFloat(reviewScoreText);
        if (isNaN(reviewScore)) {
            console.error("Failed to parse review score.");
            return;
        }
        console.log("Review score parsed", reviewScore);

        function calculatePercentile(rating, ratings) {
            const sortedRatings = ratings.slice().sort((a, b) => a - b);
            const belowCount = sortedRatings.filter((r) => r < rating).length;
            const totalCount = sortedRatings.length;
            return ((belowCount / totalCount) * 100).toFixed(2);
        }

        const percentile = calculatePercentile(reviewScore, ratings);
        console.log("Percentile calculated", percentile);

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
        console.log("Badge added to the page");

        setTimeout(() => {
            badge.remove();
            console.log("Badge removed from the page");
        }, 10000);
    } catch (error) {
        console.error("Error loading ratings data:", error);
    }
})();
