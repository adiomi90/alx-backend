/**
 * @fileoverview This script creates and manages jobs for sending push notifications.
 * It uses the 'kue' library to create a job queue and adds jobs to the queue.
 * Each job represents a push notification to be sent to a specific phone number with a message.
 */

import { createQueue } from 'kue';

const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account'
  },
  // ... more job objects ...
];

const queue = createQueue();

jobs.forEach((myJob) => {
  /**
   * Creates a new job in the queue to send a push notification.
   * @param {string} type - The type of job, in this case 'push_notification_code_2'.
   * @param {object} data - The data for the job, containing the phoneNumber and message.
   * @returns {object} - The created job object.
   */
  let job = queue.create('push_notification_code_2', myJob).save((error) => {
    if (!error) console.log(`Notification job created: ${job.id}`);
  });

  /**
   * Event listener for when a job is completed.
   */
  job.on('complete', function() {
    console.log(`Notification job ${job.id} completed`);
  })
  /**
   * Event listener for when a job fails.
   * @param {object} error - The error object containing information about the failure.
   */
  .on('failed', function(error) {
    console.log(`Notification job ${job.id} failed: ${error}`);
  })
  /**
   * Event listener for job progress updates.
   * @param {number} progress - The progress percentage of the job.
   * @param {object} data - Additional data related to the job progress.
   */
  .on('progress', function(progress, data) {
    console.log(`Notification job ${job.id} ${progress}% complete`);
  });
});
