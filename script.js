let chart; // Global variable to store the chart instance

// Function to calculate the percentile and render the histogram
async function calculatePercentile() {
    const ratingInput = document.getElementById('rating');
    const resultDiv = document.getElementById('result');
    const rating = parseFloat(ratingInput.value);

    if (isNaN(rating) || rating < 0 || rating > 5) {
        resultDiv.textContent = 'Please enter a valid rating between 0 and 5.';
        return;
    }

    try {
        // Load the ratings data from the JSON file
        const response = await fetch('percentile-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const ratings = await response.json();
        console.log("Ratings data loaded", ratings);

        // Calculate percentile
        function calculatePercentileValue(rating, ratings) {
            const sortedRatings = ratings.slice().sort((a, b) => a - b);
            const belowOrEqualCount = sortedRatings.filter((r) => r <= rating).length;
            const totalCount = sortedRatings.length;
            const percentile = (belowOrEqualCount / totalCount) * 100;
            return percentile.toFixed(2);
        }

        const percentile = calculatePercentileValue(rating, ratings);
        resultDiv.textContent = `Rating: ${rating}, Percentile: ${percentile}%`;

        // Create histogram data
        const bins = 50;
        const binWidth = 5 / bins;
        const histogramData = new Array(bins).fill(0);
        ratings.forEach(r => {
            const binIndex = Math.min(Math.floor(r / binWidth), bins - 1);
            histogramData[binIndex]++;
        });

        const labels = Array.from({ length: bins }, (_, i) => (i * binWidth).toFixed(2));

        // Render the chart
        generateChart(ratings, binWidth, bins, labels, histogramData, rating);
    } catch (error) {
        console.error("Error loading ratings data:", error);
        resultDiv.textContent = 'Error loading ratings data. Please try again later.';
    }
}

// Function to create or update the histogram chart
function generateChart(ratings, binWidth, bins, labels, histogramData, rating) {
    if (chart) {
        chart.destroy(); // Destroy the existing chart
    }

    const ctx = document.getElementById('ratingChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ratings',
                data: histogramData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Rating'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frequency'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            xMin: Math.min(Math.floor(rating / binWidth), bins - 1),
                            xMax: Math.min(Math.floor(rating / binWidth), bins - 1),
                            borderColor: 'red',
                            borderWidth: 2,
                            label: {
                                content: `Rating: ${rating}`,
                                enabled: true,
                                position: 'top'
                            }
                        }
                    }
                }
            }
        }
    });
}
