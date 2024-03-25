var express = require('express');
var router = express.Router();
var pool = require('../config/db');
const session = require('express-session');
const uuid = require('uuid');
const { or } = require('sequelize');
const path = require('path');
const multer = require('multer');
const { log } = require('console');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads'); //destination of uploaded profile image
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const nodemailer = require('nodemailer');

router.get('/notifications',async function(req,res,next){
  const userId = req.session.user.username
  const notificationQuery = `SELECT * FROM notifications WHERE user_name = $1`
  const notificationResult = await pool.query(notificationQuery,[userId])
  const notifications = notificationResult.rows
  console.log(notifications)
  for(const notes of notifications){
    notes.jobid = notes.job_id
    console.log(notes.jobid)
    notes.notification = notes.notification
    notes.time = notes.time
    notes.date = notes.date
    console.log(notes.notification,notes.time,notes.date)
  }
  res.render('notification',{notifications})
})

//route to display user details in profile page

router.get('/profile', async function(req, res, next) {

  try{

  if(!req.session.user){
    return res.status(401).json({ error: 'Unauthorized'});
  }
  
  const userId = req.session.user.username;
  let userProfile; 

  const profileQuery = 'SELECT * FROM "user" WHERE username = $1';
  const profileResult = await pool.query(profileQuery,[userId]);
  if (profileResult.rows === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

    
  userProfile = profileResult.rows[0];     // Extract user details from the result
  console.log(userProfile);

  
  if (userProfile.profilephoto) {
    userProfile.profilephoto = userProfile.profilephoto.replace(/\\/g, '/');
    console.log(userProfile.profilephoto)
  }
const preferenceQuery = `SELECT * FROM user_preferences WHERE username =$1`
const preferenceResult = await pool.query(preferenceQuery,[userId])
const preference = preferenceResult.rows
console.log(preference)
for(const pref of preference){
  console.log(pref.preference)
}

  res.render('profile', { title: 'Express',userProfile ,preference });
  }catch (error) {
  console.error('Error fetching profile', error);
  res.status(500).json({ error: 'Internal server error'});
  }

});

router.post('/editpref',async function(req,res,next){

  const userId = req.session.user.username
  const { pref1, pref2, pref3 } = req.body;
  console.log("user",userId)
  console.log("body",req.body)

  try {
    // Delete existing job preferences for the user
    await pool.query('DELETE FROM user_preferences WHERE username = $1', [userId]);

    // Insert new job preferences for the user
  
    // Insert data into the database
    const preferences = [];
    if (pref1) preferences.push({pref: pref1, priority: 1});
    if (pref2) preferences.push({pref: pref2, priority: 2});
    if (pref3) preferences.push({pref: pref3, priority: 3});
  
    // Insert each preference as a new row into the database
    const query = {
      text: 'INSERT INTO user_preferences(username, preference, priority) VALUES($1, $2, $3)',
    };
  
    const insertPromises = preferences.map(preference => {
      return pool.query(query, [userId, preference.pref, preference.priority],);
    });
  
    Promise.all(insertPromises)
      .then(() => {
        console.log('Preferences inserted successfully');
      })
      .catch(err => {
        console.error('Error inserting preferences:', err);
      });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Internal server error.');
  }

})




router.post('/profile', upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.session.user.username;

    const imagePath = path.join('images/uploads', req.file.filename);

    // Save the imagePath to the database 
    const updateProfileQuery = 'UPDATE "user" SET profilephoto = $1 WHERE username = $2';
    await pool.query(updateProfileQuery, [imagePath, userId]);

    res.redirect('/profile'); // Redirect to the profile page after updating
  } catch (error) {
    console.error('Error updating profile', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//route for displaying jobs in index page

router.get('/', async function(req, res, next) {
  try {
      console.log(req.session.user);
      let userJobs;
      let prefJobs = []; // Initialize prefJobs as an array
      let confirmlistavl = false;
      let userName = req.session.user.username
      console.log("user : " + userName)

      if (req.session.user) {
          // Fetch preferred jobs only if they exist
          const preferredJobQuery = `SELECT * FROM user_preferences WHERE username = $1`
          const preferredJobResult = await pool.query(preferredJobQuery, [userName])

          if (preferredJobResult.rowCount > 0) {
              for (const row of preferredJobResult.rows) {
                const fetchedPref = row.preference
                const userPref = fetchedPref.toUpperCase();

                  console.log("User preference: " + userPref);
                  // Fetch jobs based on user preference category
                  const userPrefQuery = `SELECT * FROM joblist WHERE category = $1`;
                  const userPrefResult = await pool.query(userPrefQuery, [userPref]);
                  console.log("preferred jobs",userPrefResult.rows);
                  // Push fetched jobs into prefJobs array
                  prefJobs.push(...userPrefResult.rows);

                  for (const eachjob of prefJobs){
                    const countQuery = 'SELECT * FROM applications WHERE job_id = $1 AND user_name = $2';
                    const countResult = await pool.query(countQuery, [eachjob.job_id, userName]);
                    const alreadyAppliedCount = countResult.rowCount
                    console.log("pref");
                    console.log(eachjob.job_id,eachjob.job,alreadyAppliedCount);
                    console.log(eachjob.workers);
                    eachjob.alreadyApplied = alreadyAppliedCount > 0
                  }
                  console.log(prefJobs,"hi")
              }
          }
          // Fetch all jobs from the database
          const fetchDataQuery = 'SELECT * FROM joblist';
          const fetchDataResult = await pool.query(fetchDataQuery);
          userJobs = fetchDataResult.rows;

          console.log("userjobs");
          console.log(fetchDataResult.rows);

          // Process each job to add confirmAvl property
          for (const job of userJobs) {
              const countQuery = 'SELECT * FROM applications WHERE job_id = $1 AND user_name = $2';
              const countResult = await pool.query(countQuery, [job.job_id, userName]);
              const alreadyAppliedCount = countResult.rowCount
              console.log(job.job_id,job.job,alreadyAppliedCount);
              console.log(job.workers);
              job.alreadyApplied = alreadyAppliedCount > 0
              
          }
          console.log(userJobs);

          // Separate prefJobs and userJobs

          res.render('index', { title: 'Express', user: req.session.user, userJobs, prefJobs });
      } else {
          // If not logged in, render the home page without user details
          res.render('index', { title: 'Express' });
      }
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal server error');
  }
  console.log("end");
});




//route for logging out

router.post('/logout', function(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).send('Internal server error');
    } else {
      res.redirect('/login');
    }
    console.log("hi")
  });
});


// route to get login page and login using user details


const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
                                                                    // User is logged in, redirect to the home page
    return res.redirect('/');
  }
                                                                    // User is not logged in, continue to the next route
  next();
};

router.get('/login',isAuthenticated, function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/login',isAuthenticated,async function(req,res, next){
  console.log(req.body)
  const { username, pwd} = req.body;
try{
    const result =await pool.query('SELECT * FROM "user" WHERE username=$1 AND password=$2 ',[username, pwd]);
    console.log(result.rows);
    if(result.rowCount>0) {
      req.session.user = result.rows[0];//session starting
      console.log("user",req.session.user)
      res.status(200).redirect('/');
    }
    else{
      res.status(400).json({error: "Invalid username or password"});
    }
  }catch (error){
    console.error('Error during login:',error);
    res.status(500).send('Internal server error');
  }
});

router.get('/register',isAuthenticated, (req, res, next) => {
  res.render('register', { title: 'Express' });
}); 


//route for applying for a job


  router.post('/apply', async function (req, res) {
    try {
      // Access details from the request body
      const jobId = req.body.jobId;
      const jobCat = req.body.jobCat;
      const job = req.body.job;
      const noOfWorkers = req.body.noOfWorkers;
      console.log("details",jobId,jobCat,job,noOfWorkers)
  
      // Get the user details from the session
      const userId = req.session.user.username;
      const user_name = req.session.user.first_name;
      const user_email = req.session.user.email;
      const user_phone = req.session.user.phone;
      
      let status;
      let currentStatus;
      let jobOwner = ''; 
      // Check if the user already applied
      const appliedQuery = 'SELECT * FROM applications WHERE job_id = $1 AND user_name = $2';
      const appliedResult = await pool.query(appliedQuery, [jobId, userId]);
      const ownerQuery = 'SELECT * FROM joblist WHERE job_id = $1';
      const ownerResult = await pool.query(ownerQuery, [jobId]);
      const Owner=ownerResult.rows
      console.log(Owner)
      jobOwner = Owner.map(job => job.user_name);
      console.log("id",userId)
      console.log(jobOwner);
      if (appliedResult.rowCount <= 0 && userId!=jobOwner){
  
        const applicationQuery =
          'INSERT INTO applications (job_id, job, category, user_name, first_name, email, phone) VALUES ($1, $2, $3, $4, $5, $6, $7)';
        const applicationValues = [jobId, job, jobCat, userId, user_name, user_email, user_phone];
        await pool.query(applicationQuery, applicationValues);
        console.log("applied")
  
        res.status(201).json({message :"success"})
        return 0;
      }else if (userId == jobOwner) {
        res.status(402).json({message : "cannot apply for own job"})
      } else if(appliedResult.rowCount>0){
        res.status(403).json({message : "You have already applied"})
      } 
    } catch (error) {
      console.error('Error during job application:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  


//display posted jobs in profile
router.get('/appliedjobs',async function(req, res, next) {
  
  try{

    if(!req.session.user){
      return res.status(401).json({ error: 'Unauthorized'});
    }
    
    const userId = req.session.user.username;
    
    let appliedJob;
    console.log(userId);
  
    const fetchappliedJobQuery = 'SELECT job_id FROM applications WHERE user_name = $1';
    const fetchappliedJobResult = await pool.query(fetchappliedJobQuery,[userId]);
    const applied=fetchappliedJobResult.rows.map(row => row.job_id);
    console.log("applied",applied);
    
    const appliedJobId = applied.map(job => job.job_id);

    console.log(appliedJobId);


    const appliedJobsQuery = 'SELECT * FROM joblist WHERE job_id = ANY($1)';
    const appliedJobsResult = await pool.query(appliedJobsQuery,[applied]);
    console.log(appliedJobsResult)
    appliedJob=appliedJobsResult.rows
    console.log(appliedJob);
    res.render('appliedjobs', { title: 'Posted Jobs' ,user: req.session.user, appliedJob});
    }catch (error) {
    console.error('Error fetching posted details', error);
    res.status(500).json({ error: 'Internal server error'});
    }
});
  
router.post('/cancel', (req, res, next) => {
  try {
    const username=req.session.user.username;
  const jobId=req.body.jobid;
  const deleteQuery = 'DELETE FROM applications WHERE user_name = $1 AND job_id= $2';
    const deleteResult =  pool.query(deleteQuery, [username,jobId]);
    
  } catch (error) {
    res.sendStatus(500,error)
  }
  
}); 


router.get('/postedjobs', async function(req, res, next) {
  try{
    const userId=req.session.user.username
    if(!req.session.user){
      return res.status(401).json({ error: 'Unauthorized'});
    }
    const jobsQuery = `SELECT * FROM joblist WHERE user_name=$1 `
    const jobsResult= await pool.query(jobsQuery,[userId])
    jobsList = jobsResult.rows
    console.log(jobsList)

    for(const jobs of jobsList){
      const jobId = jobs.job_id
      console.log(jobId)
      const appliedUsersQuery = `SELECT * FROM applications WHERE job_id = $1`
      const appliedUsersResult = await pool.query(appliedUsersQuery,[jobId])
      jobs.applications = appliedUsersResult.rows
      console.log(jobs.applications)
    }
    res.render('postedjobs', { jobsList });
    }catch (error) {
    console.error('Error fetching List details', error);
    res.status(500).json({ error: 'Internal server error'});
    }
});

//route to display user details in profile page

router.post('/userprofile', async function(req, res, next) {

  try{

  
  console.log("profile",req.body)
  const userId = req.body.username;
  let userProfile; 

  const profileQuery = 'SELECT * FROM "user" WHERE username = $1';
  const profileResult = await pool.query(profileQuery,[userId]);
  if (profileResult.rows === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

    
  userProfile = profileResult.rows[0];     // Extract user details from the result
  console.log(userProfile);

  
  if (userProfile.profilephoto) {
    userProfile.profilephoto = userProfile.profilephoto.replace(/\\/g, '/');
    console.log(userProfile.profilephoto)
  }

  res.render('userprofiles', { title: 'Express',userProfile });
  }catch (error) {
  console.error('Error fetching profile', error);
  res.status(500).json({ error: 'Internal server error'});
  }

});



router.post('/delete-user', function (req, res, next) {
  try {
    const username=req.body.username;
    console.log(username)
    const deleteQuery = 'DELETE FROM applications WHERE user_name = $1';
    const deleteResult =  pool.query(deleteQuery, [username]);
    console.log(deleteResult.rows)
    const jobid=req.body.jobid;
    const jobowner = req.session.user.username;
    const notification = `Your Application for job ${jobid} posted by ${jobowner} was rejected`
    console.log(notification)
    const currentTime = new Date();

// Extract date components
const year = currentTime.getFullYear();
const month = currentTime.getMonth() + 1; // Months are 0-indexed
const date = currentTime.getDate();

// Extract time components
const hours = currentTime.getHours();
const minutes = currentTime.getMinutes();
const seconds = currentTime.getSeconds();
const dateString = `${year}-${month}-${date}`;
const timeString = `${hours}:${minutes}:${seconds}`;

    const notificationInsertQuery = `INSERT INTO notifications (user_name,job_id,notification,time,date) VALUES ($1,$2,$3,$4,$5)`
    const notificationInsertResult =  pool.query(notificationInsertQuery,[username,jobid,notification,timeString,dateString])
    console.log("true",notificationInsertResult)

    
  } catch (error) {
    res.sendStatus(500,error)
  }

});

router.post('/delete-job',async function (req, res, next) {
  try {
    const jobid=req.body.jobid;
    console.log(jobid)
    const deleteQuery = 'DELETE FROM joblist WHERE job_id = $1';
    const deleteResult = await pool.query(deleteQuery, [jobid]);
    const deleteallQuery = 'DELETE FROM alljobs WHERE job_id = $1';
    const deleteallResult = await pool.query(deleteallQuery, [jobid]);
    console.log(deleteResult.rows)
    
    
    if (deleteallResult.rowCount > 0) {
      // Send a success response
      res.sendStatus(200);
    } else {
      // If no rows were deleted, send a not found response
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(500,error)
  }

});
router.post('/accept-user',async function(req,res,next){
  console.log(req.body);
  const jobid = req.body.jobid;
  const username = req.body.username;
  const email = req.body.email;
  const jobowner = req.session.user.username;
  const currentTime = new Date();

// Extract date components
const year = currentTime.getFullYear();
const month = currentTime.getMonth() + 1; // Months are 0-indexed
const date = currentTime.getDate();

// Extract time components
const hours = currentTime.getHours();
const minutes = currentTime.getMinutes();
const seconds = currentTime.getSeconds();
const dateString = `${year}-${month}-${date}`;
const timeString = `${hours}:${minutes}:${seconds}`;
    
  
 const statusQuery = `UPDATE applications SET status =$1 WHERE user_name = $2 AND job_id = $3`
  const statusResult = await pool.query(statusQuery,['C',username,jobid])
  console.log("confirmed")
  const notification = `Your Application for job ${jobid} posted by ${jobowner} was Accepted`
  console.log(notification)
  const confirmNotificationQuery =`INSERT INTO notifications (user_name,job_id,notification,time,date) VALUES ($1,$2,$3,$4,$5)`
  const confrimNotificationResult = await pool.query(confirmNotificationQuery,[username,jobid,notification,timeString,dateString])
  
})

module.exports = router