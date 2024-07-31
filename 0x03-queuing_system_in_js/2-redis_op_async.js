import { createClient, print } from 'redis';
import { promisify } from 'util';

const client = createClient();

/**
 * Event handler for when the Redis client is connected to the server.
 */
client.on('connect', function() {
  console.log('Redis client connected to the server');
});

/**
 * Event handler for when an error occurs with the Redis client.
 * @param {Error} err - The error object.
 */
client.on('error', function (err) {
  console.log(`Redis client not connected to the server: ${err}`);
});

/**
 * Sets a new school name and value in Redis.
 * @param {string} schoolName - The name of the school.
 * @param {string} value - The value associated with the school.
 */
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
};

const get = promisify(client.get).bind(client);

/**
 * Displays the value associated with a school in Redis.
 * @param {string} schoolName - The name of the school.
 */
async function displaySchoolValue(schoolName) {
  const result = await get(schoolName).catch((error) => {
    if (error) {
      console.log(error);
      throw error;
    }
  });
  console.log(result);
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
