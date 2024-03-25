//routes for displaying search page and search and filter functionalities
var express = require('express');
var router = express.Router();
var pool = require('../config/db');

//render search page

    router.get('/', async function(req, res, next) {
        if (req.session.user) {
                                                                  // If the user is logged in, fetch data from the database
        try {
                console.log(req.session.user);
                let userJobs;
                let confirmlistavl = false;
                let userName = req.session.user.username
                console.log("user : " + userName)
                // Fetch all jobs from the database
        const fetchDataQuery = 'SELECT * FROM joblist';
        const fetchDataResult = await pool.query(fetchDataQuery);
        userJobs = fetchDataResult.rows;

        console.log("userjobs");
        console.log(fetchDataResult.rows);

        // Process each job to add confirmAvl property
        for (const job of userJobs) {
            const countQuery = 'SELECT * FROM applications WHERE job_id = $1 AND status = $2';
            const countResult = await pool.query(countQuery, [job.job_id, 'C']);
            const confirmedWorkersCount = countResult.rowCount
            console.log(job.job_id,job.job,confirmedWorkersCount);
            console.log(job.workers)

            // Check if the number of confirmed workers exceeds the maximum allowed
            job.confirmAvl = confirmedWorkersCount < job.workers;
            console.log(job.confirmAvl);
        }
        
        console.log(userJobs);
        res.render('search', { title: 'Express', user: req.session.user, userJobs });
        
        }catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal server error');
        }
    }
    });
    
//filter

router.post('/selectCat', async(req, res) => {
try {
    const selectedCate = req.body.category;
    const selectedDis = req.body.district;
    const selectedWage = req.body.wage;


    console.log('Selected Category:', selectedCate);
    console.log('Selected District:', selectedDis);
    console.log('Selected Wage:', selectedWage);



    let filterConditions = [];
    let filterValues = [];
    let filter = false;

    if (selectedCate) {
    filterConditions.push(`category = $${filterValues.length + 1}`);
    filterValues.push(selectedCate);
    }

    if (selectedDis) {
    filterConditions.push(`district = $${filterValues.length + 1}`);
    filterValues.push(selectedDis);
    }

    if (selectedWage) {
    filterConditions.push(`wage >= $${filterValues.length + 1}`);
    filterValues.push(selectedWage);
    }

    console.log(filterConditions);
    console.log(filterValues)

    
    let whereClause = '';
    if (filterConditions.length > 0) {
    whereClause += ' WHERE ' + filterConditions.join(' AND ');
    filter=true
    }
    console.log(whereClause)
    
    const filterQuery = 'SELECT * FROM joblist' + whereClause;
    console.log(filterQuery)

    const filterResult = await pool.query(filterQuery, filterValues);

    const filterjob = filterResult.rows;
    console.log('Filtered Jobs:', filterjob.length);
    res.render('search', { userJobs: filterjob ,filter: filter});


} catch (error) {
    console.error('Error:',error);
    res.status(500).json({ error: 'Internal Server Error'})
}
});

//search

router.post('/searchjobs', async(req, res, next) => {

try {
    const searchFactor = req.body.searchFactor;
    const searchQuery = `SELECT * FROM joblist
                        WHERE
                        to_tsvector('english', job || ' ' || category || ' ' || date || ' ' || district || ' ' || city) @@
                        to_tsquery('english', $1);`
    const searchResult = await pool.query(searchQuery,[searchFactor]);

    const searchedJobs = searchResult.rows;
    res.render('search', { userJobs: searchedJobs} );

} catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error'})
}
})
router.post('/clearfilter',async(req,res)=> {
    res.render('search',{userJobs})
})

module.exports = router;




