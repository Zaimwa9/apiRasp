const express = require('express');
const app = express();
const Server = require('http').Server(app);
const io = require('socket.io')(Server);
const imu = require('node-sense-hat').Imu;
const fs = require('fs');
const cors = require('cors');

const IMU = new imu.IMU();

app.use(cors());

app.get('/', function (req, res) {
	console.log('received connection');
	var content = fs.readFileSync('./data.json');
	res.send(content);
})

io.on('connect', function (socket) {
	fetchData(socket);
	setInterval(
		() => fetchData(socket),
		1500
	);
/*	IMU.getValue((err, data) => {
		if (err !== null) {
			console.log('error');
			return;
		}
		console.log(data);
*/
//io.emit('fetchData', {data: 'test'});
})

function fetchData(socket) {
	console.log('in fetchdata');
	IMU.getValue((err, data) => {
		console.log(data);
		socket.emit('fetchData', data);
	})
	//setTimeout(fetchData, 2000);
}

Server.listen(3000, function () {
	console.log('Up and running');
})
