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

// TODO: skal ikke kjøre hele tiden?
// Kanskje returner Data? så jeg kan sjekke lengden
async function fetchData() {
    const response = await fetch('/latest');
    const data = await response.json();
    
    console.log(data);

    forceChart.data.datasets[0].data = data.map(point => ({
        x: point.t,
        y: point.y
    }));
    forceChart.update();
}

// TODO: blir nå tømt av en knapp, men kanskje alle knappene skal tømme, eks mål 5 sek average,
async function deleteData() {
    await fetch('/deleteData', {
        method: 'DELETE'
    });
}

async function fiveSecAvg() {
    await deleteData();

    let response = await fetch('/latest');
    let data = await response.json();

    // Every 0.25s > 5 * 4 = 20
    while(data.Length < 20) {
        response = await fetch('/latest');
        data = await response.json();
        
        console.log(data);

        forceChart.data.datasets[0].data = data.map(point => ({
            x: point.t,
            y: point.y
        }));
        forceChart.update();
        
        await sleep(250);
    }
}

// Updates every 250ms
// TODO: fjern?
setInterval(fetchData, 250);

/*
Plan:
 - når man trykker på en modus, kalles delete data
 - fetchData, kjører x antall ganger?, kanskje while loop med x som input, hvis ingen input kjører den til noe stopper den?
 */