let joint_datas = [];

//Taulukon alustus
const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};
let width = window.innerWidth - margin.left - margin.right
let height = window.innerHeight - margin.top - margin.bottom;
const svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);
let x_scale = d3.scaleTime()
    .range([0, width]);
let y_scale = d3.scaleLinear()
    .domain([-180, 180])
    .range([height, 0]);
let g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
let j1 = d3.line()
    .x((d) => {
        return x_scale(Date.parse(d.time));
    })
    .y((d) => {
        return y_scale(d.joints[0]);
    });

let j2 = d3.line()
    .x((d) => {
        return x_scale(Date.parse(d.time));
    })
    .y((d) => {
        return y_scale(d.joints[1]);
    });

let j3 = d3.line()
    .x((d) => {
        return x_scale(Date.parse(d.time));
    })
    .y((d) => {
        return y_scale(d.joints[2]);
    });

let j4 = d3.line()
    .x((d) => {
        return x_scale(Date.parse(d.time));
    })
    .y((d) => {
        return y_scale(d.joints[3]);
    });

let j5 = d3.line()
    .x((d) => {
        return x_scale(Date.parse(d.time));
    })
    .y((d) => {
        return y_scale(d.joints[4]);
    });

let j6 = d3.line()
    .x((d) => {
        return x_scale(Date.parse(d.time));
    })
    .y((d) => {
        return y_scale(d.joints[5]);
    });

g.append("g").attr("class", "axis x");
g.append("g").attr("class", "axis y");

//J1
g.append("path")
    .datum(joint_datas)
    .attr("class", "j1")
    .attr("d", j1)
    .style('fill', 'none')
    .style('stroke', '#00F');

//J2
g.append("path")
    .datum(joint_datas)
    .attr("class", "j2")
    .attr("d", j2)
    .style('fill', 'none')
    .style('stroke', '#0F0');

//J3
g.append("path")
    .datum(joint_datas)
    .attr("class", "j3")
    .attr("d", j3)
    .style('fill', 'none')
    .style('stroke', '#F00');

//J4
g.append("path")
    .datum(joint_datas)
    .attr("class", "j4")
    .attr("d", j4)
    .style('fill', 'none')
    .style('stroke', '#0FF');

//J5
g.append("path")
    .datum(joint_datas)
    .attr("class", "j5")
    .attr("d", j5)
    .style('fill', 'none')
    .style('stroke', '#FF0');

//J6
g.append("path")
    .datum(joint_datas)
    .attr("class", "j6")
    .attr("d", j6)
    .style('fill', 'none')
    .style('stroke', '#AAA');

const resize = () => {
    width = window.innerWidth - margin.left - margin.right
    height = window.innerHeight - margin.top - margin.bottom;
    d3.select("#chart").select("svg")
        .attr("width", width)
        .attr("height", height);
    x_scale.range([0, width]);
    y_scale.range([height, 0]);
    update_chart();
};
d3.select(window).on('resize', resize);


//update_chart()
const update_chart = () => {
    let x_max = Date.parse(joint_datas[joint_datas.length - 1].time);
    let x_min = x_max - 30000;
    x_scale.domain([x_min, x_max]);
    g.select("g.axis.x")
        .attr("transform", "translate(0," + (height - margin.bottom - margin.top) + ")")
        .call(d3.axisBottom(x_scale).ticks(5));
    g.select("g.axis.y")
        .attr("class", "axis y")
        .call(d3.axisLeft(y_scale));
    svg.select(".j1") // change the line
        .attr("d", j1(joint_datas));

    svg.select(".j2") // change the line
        .attr("d", j2(joint_datas));

    svg.select(".j3") // change the line
        .attr("d", j3(joint_datas));

    svg.select(".j4") // change the line
        .attr("d", j4(joint_datas));

    svg.select(".j5") // change the line
        .attr("d", j5(joint_datas));

    svg.select(".j6") // change the line
        .attr("d", j6(joint_datas));
};

const mqtt_client = mqtt.connect('wss://auoh-mqtt-test.herokuapp.com');
mqtt_client.on('connect', () => {
    console.log('connected to mqtt broker');
    mqtt_client.subscribe('Robot data')
});
mqtt_client.on('message', (topic, message) => {
    const joint_data = JSON.parse(message)
    joint_datas.push(joint_data);
    update_chart();
});