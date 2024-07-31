import { createClient } from 'redis';
import { createQueue } from 'kue';
import { promisify } from 'util';
import express from 'express';

/**
 * Redis client for connecting to the server.
 * @type {RedisClient}
 */
const redisClient = createClient();

redisClient.on('connect', function() {
  console.log('Redis client connected to the server');
});

redisClient.on('error', function (err) {
  console.log(`Redis client not connected to the server: ${err}`);
});

/**
 * Promisified version of the Redis client's get function.
 * @type {Function}
 */
const asyncGet = promisify(redisClient.get).bind(redisClient);

/**
 * Reserves a seat by updating the available_seats value in Redis.
 * @param {number} number - The number of available seats to set.
 */
function reserveSeat(number) {
  redisClient.set('available_seats', number);
}

/**
 * Retrieves the current number of available seats from Redis.
 * @returns {Promise<number>} The number of available seats.
 */
async function getCurrentAvailableSeats() {
  const seats = await asyncGet('available_seats');
  return seats;
}

/**
 * Flag indicating whether seat reservation is enabled or not.
 * @type {boolean}
 */
let reservationEnabled = true;

/**
 * Kue queue for processing seat reservation jobs.
 * @type {Queue}
 */
const queue = createQueue();

/**
 * Express app for handling HTTP requests.
 * @type {Express}
 */
const app = express();

/**
 * Endpoint for retrieving the number of available seats.
 */
app.get('/available_seats', async function (req, res) {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({"numberOfAvailableSeats": availableSeats});
});

/**
 * Endpoint for reserving a seat.
 */
app.get('/reserve_seat', function (req, res) {
  if (!reservationEnabled) {
    res.json({"status": "Reservation are blocked"});
    return;
  }
  const job = queue.create('reserve_seat', {'seat': 1}).save((error) => {
    if (error) {
      res.json({"status": "Reservation failed"});
      return;
    } else {
      res.json({"status": "Reservation in process"});
      job.on('complete', function () {
      console.log(`Seat reservation job ${job.id} completed`);
      });
      job.on('failed', function(error) {
        console.log(`Seat reservation job ${job.id} failed: ${error}`);
      });
    }
  });
});

/**
 * Endpoint for processing the seat reservation queue.
 */
app.get('/process', function (req, res) {
    res.json({"status": "Queue processing"});
    queue.process('reserve_seat', async function(job, done) {
	const seat = Number(await getCurrentAvailableSeats());
	if (seat === 0) {
	    reservationEnabled = false;
	    done(Error('Not enough seats available'));
	} else {
	    reserveSeat(seat - 1);
	    done();
	}
    });
});

const port = 1245;
app.listen(port, () => {
    console.log(`app is listening http://localhost:${port}`);
});

// Initial seat reservation
reserveSeat(50);
