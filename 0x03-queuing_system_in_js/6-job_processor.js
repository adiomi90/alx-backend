import { createQueue } from 'kue';

const queue = createQueue();

/**
 * Sends a notification to a phone number with a given message.
 * @param {string} phoneNumber - The phone number to send the notification to.
 * @param {string} message - The message to include in the notification.
 * @returns {void}
 */
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
};

queue.process('push_notification_code', function(job, done) {
  /**
   * Process a job from the queue and send a notification.
   * @param {Object} job - The job object containing the data for the notification.
   * @param {function} done - The callback function to be called when the job is done processing.
   * @returns {void}
   */
  sendNotification(job.data.phoneNumber, job.data.message);
  done();
});
