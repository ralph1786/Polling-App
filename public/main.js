const form = document.querySelector('#vote-form');

//Form submit Event.
form.addEventListener('submit', (e) => {
    e.preventDefault();
    //getting the checked value using querySelector.
    const choice = document.querySelector('input[name=os]:checked').value;
    const data = {os: choice};
    fetch('http://localhost:3000/poll', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'content-type': 'application/json'
        })
    }).then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));  
});

fetch('http://localhost:3000/poll')
    .then(res => res.json())
    .then(data => {
        const votes = data.votes;
        const totalVotes = votes.length;
        //Count vote points
        const voteCounts = votes.reduce(
            (acc, vote) => ((acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)
        ), acc), {});
        //Use LET because dataPoints will change.
        let dataPoints = [{
                label: 'Windows',
                y: voteCounts.Windows
            },
            {
                label: 'MacOs',
                y: voteCounts.MacOs
            },
            {
                label: 'Linux',
                y: voteCounts.Linux
            },
            {
                label: 'Other',
                y: voteCounts.Other
            }
        ];

        const chartContainer = document.querySelector('#chartContainer');
        //Following code creates the chart using CanvasJS.
        if (chartContainer) {
            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme1',
                title: {
                    text: `Total Votes ${totalVotes}`
                },
                data: [{
                    type: 'pie',
                    dataPoints: dataPoints
                }]
            });
            chart.render();

            // Enable pusher logging - don't include this in production
            //Following code was copied from pusher site.
            Pusher.logToConsole = true;

            var pusher = new Pusher('3d9b731c28b5dc4e412c', {
                cluster: 'us2',
                encrypted: true
            });

            var channel = pusher.subscribe('os-poll');
            channel.bind('os-vote', function (data) {
                dataPoints = dataPoints.map(x => {
                    if (x.label == data.os) {
                        x.y += data.points;
                        return x;
                    } else {
                        return x;
                    }
                });
                chart.render();
            });
        };
    });


