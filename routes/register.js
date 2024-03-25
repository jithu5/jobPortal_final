var express = require('express');
var router = express.Router();
var pool = require('../config/db')

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Express' , message:'Enter your details'});
});

router.post('/submit',function(req,res){
  console.log(req.body);
  const { username, first_name, last_name, pwd, email, gender, dob, phone, confirmpwd } = req.body;
  const preference = req.body.preference;
  console.log(preference)
  if(pwd !== confirmpwd){
  res.status(400).json({error: "Passwords do not match"});
  return;
  }
  const usernameCheckQuery = 'SELECT * FROM "user" WHERE username = $1';
  pool.query(usernameCheckQuery, [username], (usernameCheckError, usernameCheckResult) => {
    if (usernameCheckError) {
      console.error('Error checking username existence', usernameCheckError);
      res.status(500).send('Registration Failed');
      return;
    }

    if (usernameCheckResult.rows.length > 0) {
      res.status(401).json({ error: 'Username or email already exists' });
      return;
    }
    const emailCheckQuery = 'SELECT * FROM "user" WHERE email = $1';
    pool.query(emailCheckQuery, [email], (emailCheckError, emailCheckResult) => {
      if (emailCheckError) {
        console.error('Error checking email existence', emailCheckError);
        res.status(500).send('Registration Failed');
        return;
      }

      if (emailCheckResult.rows.length > 0) {
        res.status(401).json({ error: 'username or Email already exists' });
        return;
      }
  const insertQuery = 'INSERT INTO "user" (username,first_name,last_name,password,email,gender,date_of_birth,phone) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)'; 
  const insertValues = [username, first_name, last_name, pwd, email,gender, dob, phone];
  pool.query(insertQuery, insertValues,(insertError,insertResult) => {
    if(insertError){
      console.error('Error inserting data',insertError);
      res.status(500).send('Registration Failed');
    }else{
      console.log('Data inserted succesfully');
      res.status(200).json({ message :'Registration Succesfull'});
    }
  });
  
});

if(preference){
const preferenceQuery = 'INSERT INTO user_preferences (username, preference,priority) VALUES ($1, $2, $3)';
const preferenceValues = [username,preference,'1']; 
pool.query(preferenceQuery, preferenceValues, (preferenceError, preferenceResult) => {
    if (preferenceError) {
        console.error('Error inserting preference data', preferenceError);
        res.status(500).send('Registration Failed');
    } else {
        console.log('Preference data inserted successfully')
    } 
});
}
});
});
router.get('/login', (req, res) => {
  res.render('login', { title: 'Express' });
});


module.exports = router;
