var express = require('express');
var router = express.Router();
var pool = require('../../config/db');



router.get('/adminReg',async function (req, res, next) {
    res.render('adminViews/adminReg', { title: 'Express' });
});


router.post('/register', async (req, res) => {
    try {
        const { username, email, pwd, confirmPwd } = req.body;
        console.log(req.body)
        const pass=req.body.pwd
        const confirmpass=req.body.confirmpwd
        console.log(pass)
        console.log(confirmpass)
        // Check if password and confirm password match
        if (pass !== confirmpass) {
            return res.status(400).json({ error: 'Password and Confirm Password do not match' });
        }

        // Check if the username already exists
        const usernameExistsQuery = 'SELECT * FROM admin WHERE user_name = $1';
        const existingUser = await pool.query(usernameExistsQuery, [username]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }


        // Insert new admin into the database
        const insertQuery = 'INSERT INTO admin (user_name, email, password) VALUES ($1, $2, $3) RETURNING *';
        const values = [username, email, pwd];

        const result = await pool.query(insertQuery, values);

        // Send a success response
        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        // Handle errors, e.g., duplicate entry
        console.error(error);
        res.status(400).json({ error: 'Registration failed' });
    }
});




router.get('/adminLogin', async function (req, res, next) {
    res.render('adminviews/adminLogin', { title: 'Express' });
});
router.post('/admin/adminLogin',async (req, res) => {
    const { username, pwd } = req.body;
    console.log(req.body)
    const adminloginQuery=`SELECT * FROM admin WHERE user_name= $1 and password= $2`
    const adminQueryResult=await pool.query(adminloginQuery,[username,pwd])
    console.log(adminQueryResult.rowCount)
    if(adminQueryResult.rowCount>0){
    console.log("admin",adminQueryResult.rows)

    req.session.admin = adminQueryResult.rows
    console.log( req.session.admin);
    res.redirect('/admin/dashboard')
    
    }
    else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
    
});
    
    
router.post('/Logout', function(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).send('Internal server error');
    } else {
      res.redirect('/admin/adminLogin');
    }
    console.log("hi")
  });
});
    



router.get('/dashboard', function (req, res, next) {
    console.log("hi");
    try {
        if(req.session.admin){
            console.log("Working");
            res.render('adminViews/dashboard', { user: req.session.admin });
            
        }else{
            //res.redirect('/admin/adminLogin')
            console.log("no");
        }
    
    } catch (error) {
        res.json({err:error.message})
    }

    
    console.log("hello");
});


router.get('/joblist',async function (req, res, next) {
    try {
        let joblist;

        const joblistQuery=`SELECT * FROM alljobs`
        const joblistResult=await pool.query(joblistQuery)
        console.log(joblistResult);
        joblist=joblistResult.rows
        console.log("joblist",joblist)
    
        res.render('adminViews/joblist', { title: 'Express',joblist }); 
    } catch (error) {
        res.json({err:error.message})
    }

});

router.get('/users',async function (req, res, next) {
    try {
        let users;

        const userQuery=`SELECT * FROM "user" `
        const userResult=await pool.query(userQuery)
        users=userResult.rows
        
    
        res.render('adminViews/users', { title: 'Express' ,users});
    } catch (error) {
        res.json({err:error.message})
    }

    
});


router.get('/applications',async function (req, res, next) {
    try {
        let application;

        const applicationQuery=`SELECT * FROM applications`
        const applicationResult=await pool.query(applicationQuery)
        
        application=applicationResult.rows
        
    
        res.render('adminViews/applications', { title: 'Express' ,application});
    } catch (error) {
        res.json({err:error.message})
    }

    
});
router.post('/delete-jobs',async function (req, res, next) {
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

  router.post('/delete-users',async function (req, res, next) {
    try {
      const username=req.body.username;
      console.log(username)
      const deleteQuery = 'DELETE FROM "user" WHERE username = $1';
      const deleteResult = await pool.query(deleteQuery, [username]);
      console.log(deleteResult.rows)
      
      
      if (deleteResult.rowCount > 0) {
        // Send a success response
        res.sendStatus(200);
      } else {
        // If no rows were deleted, send a not found response
        res.sendStatus(404);
      }
    } catch (error) {
      
    }
  
  });

  router.post('/delete-applic',async function (req, res, next) {
    try {
      const username=req.body.username;
      console.log(username)
      const deleteQuery = 'DELETE FROM applications WHERE user_name = $1';
      const deleteResult = await pool.query(deleteQuery, [username]);
      console.log(deleteResult.rows)
      
      
      if (deleteResult.rowCount > 0) {
        // Send a success response
        res.sendStatus(200);
      } else {
        // If no rows were deleted, send a not found response
        res.sendStatus(404);
      }
    } catch (error) {
      
    }
  
  });


  router.post('/usersprofile', async function(req, res, next) {

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
  
    res.render('adminViews/usersprofile', { title: 'Express',userProfile });
    }catch (error) {
    console.error('Error fetching profile', error);
    res.status(500).json({ error: 'Internal server error'});
    }
  
  });
  

module.exports = router