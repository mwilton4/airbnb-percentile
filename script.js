let chartInstance = null;

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
            const belowOrEqualCount = sortedRatings.filter((r) => r <= rating).length;
            const totalCount = sortedRatings.length;
            const percentile = (belowOrEqualCount / totalCount) * 100;
            return percentile.toFixed(2);
        }

        const percentile = calculatePercentile(rating, ratings);
        resultDiv.textContent = `Rating: ${rating}, Percentile: ${percentile}%`;

        // Generate histogram
        const ctx = document.getElementById('ratingChart').getContext('2d');
        const bins = 50;
        const binWidth = 5 / bins;
        const histogramData = new Array(bins).fill(0);

        ratings.forEach(r => {
            const binIndex = Math.floor(r / binWidth);
            histogramData[binIndex]++;
        });

        const labels = Array.from({ length: bins }, (_, i) => (i * binWidth).toFixed(2));

        // Destroy existing chart instance if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
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
                        }
                    }
                },
                plugins: {
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                xMin: rating,
                                xMax: rating,
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
    } catch (error) {
        console.error("Error loading ratings data:", error);
        resultDiv.textContent = 'Error loading ratings data. Please try again later.';
    }
}
