/**
 * Creates push notification jobs and adds them to the queue.
 * @param {Array} jobs - An array of jobs to be created.
 * @param {Object} queue - The queue object to add the jobs to.
 * @throws {Error} If jobs is not an array.
 */
function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw Error('Jobs is not an array');
  }

  jobs.forEach((myJob) => {
    let job = queue.create('push_notification_code_3', myJob);

    job.on('complete', function() {
      console.log(`Notification job ${job.id} completed`);
    }).on('failed', function(error) {
      console.log(`Notification job ${job.id} failed: ${error}`);
    }).on('progress', function(progress, data) {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });
    job.save((error) => {
      if (!error) console.log(`Notification job created: ${job.id}`);
    });
  });
}

module.exports = createPushNotificationsJobs;
