import { createClient, print } from 'redis';

const client = createClient();

/**
 * Event listener for successful connection to the Redis server.
 * @event connect
 */
client.on('connect', function() {
  console.log('Redis client connected to the server');
});

/**
 * Event listener for connection errors to the Redis server.
 * @event error
 * @param {Error} err - The error object.
 */
client.on('error', function (err) {
  console.log(`Redis client not connected to the server: ${err}`);
});

/**
 * Sets a new school name and its corresponding value in Redis.
 * @param {string} schoolName - The name of the school.
 * @param {string} value - The value associated with the school.
 */
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
};

/**
 * Retrieves and displays the value associated with a school name from Redis.
 * @param {string} schoolName - The name of the school.
 */
function displaySchoolValue(schoolName) {
  client.get(schoolName, function(error, result) {
    if (error) {
      console.log(error);
      throw error;
    }
    console.log(result);
  });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
