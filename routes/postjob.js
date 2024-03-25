//routes for rendering postjob page and posting a job
var express = require('express');
var router = express.Router();
var pool = require('../config/db');
const session = require('express-session');
const uuid = require('uuid');
const cron = require('node-cron');

//postjob

router.get('/', async function(req, res, next) {

    res.render('postjob', { title: 'Express' });
});
    router.post('/postjob', async function(req, res) {
    try {
    const userId = req.session.user.username;                        // Access username from the session
    const userQuery = 'SELECT * FROM "user" WHERE username = $1';
    const userResult = await pool.query(userQuery, [userId]);
    const id = uuid.v4();
    const jobId = id.substring(0, 10);
    const expirationTime = new Date();
                            expirationTime.setHours(expirationTime.getHours() + 24);
    if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        const {job, cate, desc, datee, stime, etime,wage, ph1, ph2, wno, distri, city, street, building, landmark, pin} = req.body;
        console.log(req.body)
        const insertQuery = `INSERT INTO joblist
                            (job_id,user_name,job,category,description,date,start_time,end_time,wage,phone,alter_phone,workers,district,city,street,building,landmark,pin,expiration_time,expired )
                                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,false)`;
        const insertValues = [jobId,userId, job, cate, desc, datee, stime, etime,wage, ph1, ph2, wno, distri, city, street, building, landmark, pin,expirationTime];
        const allJobsInsertQuery = `
                                    INSERT INTO alljobs (
                                                job_id,
                                                user_name,
                                                job,
                                                category,
                                                description,
                                                date,
                                                start_time,
                                                end_time,
                                                wage,
                                                phone,
                                                alter_phone,
                                                workers, 
                                                district,
                                                city,
                                                street,
                                                building,
                                                landmark,
                                                pin
                                            )VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`; 
    const alljobsInsertValues = [jobId,userId, job, cate, desc, datee, stime, etime,wage, ph1, ph2, wno, distri, city, street, building, landmark, pin]
    const alljobsInsertResult = await pool.query(allJobsInsertQuery,alljobsInsertValues)

    await Promise.all([
        pool.query(insertQuery, insertValues),
        pool.query(allJobsInsertQuery, alljobsInsertValues)
    ]);

    // Send success message to client
    res.status(200).json({ status: 'success', message: 'Job Posted Successfully!' });
    }
    
} catch (error) {
    console.error('Error during post job:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

        /*move expired jobs into alljobs table to record history.this 
                        runs each hour*/
                        async function markExpiredJobs() {
                            let jobsToCheck;
                            const currentTimestamp = new Date();
                            console.log("time :" ,currentTimestamp )
                            const markExpiredQuery = 'UPDATE joblist SET expired = true WHERE expiration_time < $1 AND expired = false RETURNING *';
                            //const markExpiredValues = [currentTimestamp];
                        
                            try {
                                const result = await pool.query(markExpiredQuery,[currentTimestamp]);
                                console.log('Cron job executed');
                                console.log(result.rows)
                                    const jobsCheckQuery = 'SELECT * FROM joblist';
                                    const jobsCheckResult = await pool.query(jobsCheckQuery);
                                    jobsToCheck=jobsCheckResult.rows
                                    console.log(jobsToCheck)
                                    for (const job of jobsToCheck) {
                                        console.log("status",job.expired)
                                        if (job.expired === true) {
                                            

                                            
                                        
                                            const deleteJobQuery = 'DELETE FROM joblist WHERE job_id = $1';
                                            const deleteJobValues = [job.job_id];
                                            await pool.query(deleteJobQuery, deleteJobValues);
                                            console.log(`Job with job_id ${job.job_id} deleted from joblist.`);
                                        }
                                    }
                            } catch (markExpiredError) {
                                console.error('Error marking jobs as expired:', markExpiredError);
                            }
                        }

                        cron.schedule('0 * * * *', markExpiredJobs);    
module.exports = router;