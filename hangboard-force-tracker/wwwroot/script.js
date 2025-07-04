const ctx = document.getElementById('forceChart').getContext('2d');
const forceChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Force (kg)',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.2
        }]
    },
    options: {
        animation: false,
        scales: {
            x: {
                type: 'linear',
                title: { display: true, text: 'Time (sec)' },
                suggestedMin: 0,
                SuggestedMax: 10
            },
            y: {
                title: { display: true, text: 'Force (kg)' },
                suggestedMin: 0,
                suggestedMax: 100
            }
        }
    }
});

async function fetchData() {
    const response = await fetch('/latest');
    const data = await response.json();
    
    console.log(data);

    // const now = Date.now() / 1000;
    forceChart.data.datasets[0].data = data.map(point => ({
        x: point.t,
        y: point.y
    }));
    forceChart.update();
}

// Updates every 250ms
setInterval(fetchData, 250);