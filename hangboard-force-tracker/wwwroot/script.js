const ctx = document.getElementById('forceChart').getContext('2d');
const forceChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Force (kg)',
            data: [],
            borderColor: '#e2b714',
            pointBackgroundColor: '#e2b714',
            pointBorderColor: '#e2b714',
            tension: 0.2,
            parsing: false
        }]
    },
    options: {
        responsive: true,
        animation: false,
        scales: {
            x: {
                type: 'linear',
                title: { display: true, text: 'Time (sec)' },
                suggestedMin: 0,
                suggestedMax: 10
            },
            y: {
                title: { display: true, text: 'Force (kg)' },
                suggestedMin: 0,
                suggestedMax: 100
            }
        }
    }
});

// Add interaction to tracking button
let tracking = false;
let interval = null;

document.getElementById("trackingButton").addEventListener("click", async () => {
    tracking = !tracking;

    if (tracking) {
        await deleteData();
        
        // Updates every 250ms
        interval = setInterval(fetchData, 250);
        document.getElementById("trackingButton").textContent = "Stop";
    } else {
        clearInterval(interval); // Can now access it here
        document.getElementById("trackingButton").textContent = "Start";
    }
});

// Kanskje returner Data? så jeg kan sjekke lengden
async function fetchData() {
    const response = await fetch('/latest');
    const data = await response.json();

    console.log(data);
    updateForceVariables(data);

    forceChart.data.datasets[0].data = data.map(point => ({
        x: point.time,
        y: point.force
    }));

    forceChart.update();
}

function updateForceVariables(data) {
    let maxForce = 0;
    let averageForce = 0;
    let currentForce = 0;
    let sum = 0;
    
    for(let i in data) {
        sum += data[i].force
        
        if(data[i].force > maxForce) {
            maxForce = data[i].force;
        }
    }
    
    averageForce = sum / data.length;
    currentForce = data[data.length - 1].force;
    
    document.getElementById("currentForce").innerHTML = currentForce;
    document.getElementById("maxForce").innerHTML = maxForce;
    document.getElementById("averageForce").innerHTML = averageForce;
}

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
    while(data.length < 20) {
        response = await fetch('/latest');
        data = await response.json();
        
        console.log(data);

        forceChart.data.datasets[0].data = data.map(point => ({
            x: point.time,
            y: point.force
        }));
        forceChart.update();
        
        // await sleep(250);
    }
}

/*
Plan:
 - når man trykker på en modus, kalles delete data
 - fetchData, kjører x antall ganger?, kanskje while loop med x som input, hvis ingen input kjører den til noe stopper den?
 */