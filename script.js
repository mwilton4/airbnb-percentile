async function calculatePercentile() {
    const ratingInput = document.getElementById('rating');
    const resultDiv = document.getElementById('result');
    const rating = parseFloat(ratingInput.value);

    if (isNaN(rating) || rating < 0 || rating > 5) {
        resultDiv.textContent = 'Please enter a valid rating between 0 and 5.';
        return;
    }

    try {
        const response = await fetch('percentile-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const ratings = await response.json();
        console.log("Ratings data loaded", ratings);

        function calculatePercentile(rating, ratings) {
            const sortedRatings = ratings.slice().sort((a, b) => a - b);
            const belowCount = sortedRatings.filter((r) => r < rating).length;
            const totalCount = sortedRatings.length;
            return ((belowCount / totalCount) * 100).toFixed(2);
        }

        const percentile = calculatePercentile(rating, ratings);
        resultDiv.textContent = `Rating: ${rating}, Percentile: ${percentile}%`;
    } catch (error) {
        console.error("Error loading ratings data:", error);
        resultDiv.textContent = 'Error loading ratings data. Please try again later.';
    }
}
