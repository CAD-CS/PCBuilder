const path = require('path');
const express = require('express');
const app = express();
const pool = require('./database/db');

//define server host & port number
const host = 'localhost';
const port = 3000;

//set the client front end location as the client folder
const clientApp = path.join(__dirname, 'client/build');

//allow server to serve static webpages from client folder
app.use('/', express.static(clientApp, {extension: ['html']}));

//use urlencoded middleware to get information from requests
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//start server
app.listen(port, () => {
    console.log(`${new Date()} App listening on port ${host}:${port} serving ${clientApp}`);
})

//INSERT QUERY
app.post('/component', async (req, res) => {
  const { cid, name, manufacturer, cost, type, speed, cores, capacity } = req.body;
  try {
    console.log('Inserting new component');
    const insertComponent = 'INSERT INTO component_makes (cid, component_name, manufacturer_name, cost) VALUES ($1, $2, $3, $4)';
    result = await pool.query(insertComponent, [cid, name, manufacturer, cost]);
    
    res.status(201).json({message: 'Component created successfully', cid: cid});
  } catch (err) {
    console.error( err.message);
    res.status(500).json({ error: err.message });
  }
});

//DELETE QUERY
app.delete('/deleteComponent/cid/:cid', async (req, res) => {
  const { cid } = req.params; // Extract the cid from the request URL
  
  try {
      const deleteQuery = 'DELETE FROM Component_Makes WHERE cid = $1 RETURNING *;'; // SQL query to delete a component
      const response = await pool.query(deleteQuery, [cid]); // Execute the query with the cid parameter

      if (response.rows.length > 0) {
          // If the component was deleted, response.rows will contain the deleted rows
          res.status(200).json({ message: 'Component deleted successfully.', component: response.rows[0] });
        } else {
          // If no rows were deleted, it means the component wasn't found
          res.status(404).json({error: 'Component not found.' });
      }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message }); // Send a server error response if something goes wrong
  }
});

//UPDATE QUERY
app.put('/updateComponent/cid/:cid', async (req, res) => {
  const { cid } = req.params; //
  const { component_name, cost, manufacturer_name } = req.body; 

  try {
      const updateQuery = `
          UPDATE Component_Makes 
          SET 
              component_name = COALESCE($1, component_name), 
              cost = COALESCE($2, cost), 
              manufacturer_name = COALESCE($3, manufacturer_name)
          WHERE cid = $4
          RETURNING *;`; // Returning the updated row
      
      // Execute the UPDATE query
      const response = await pool.query(updateQuery, [component_name, cost, manufacturer_name, cid]);

      if (response.rows.length > 0) {
          // If the component was successfully updated
          res.status(200).json({ message: 'Component updated successfully.', component: response.rows[0] });
      } else {
          // If no component was found (and thus not updated)
          res.status(404).json({ error: 'Component not found.' });
      }
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: err.message });
  }
});

//SELECTION QUERY
app.get('/components/component_name/:component_name', async (req, res) => {
  const { component_name } = req.params;

  const query = 'SELECT * FROM Component_Makes WHERE component_name = $1';

  try {
    const result = await pool.query(query, [component_name]);
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({error: 'Component not found'});
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({error: err.message});
  }
});

//PROJECTION QUERY
app.get('/components/projection/:projection', async (req, res) => {
  const { projection } = req.params; // Extract the projection parameter from the URL
  const validColumns = ['cid', 'component_name', 'cost', 'manufacturer_name']; // List of valid column names
  const requestedColumns = projection.split(',').filter(col => validColumns.includes(col));

  if (requestedColumns.length === 0) {
      return res.status(400).json({ error: 'Invalid projection requested.' });
  }

  try {
      // Construct the SELECT SQL query dynamically based on the requested projection
      const projection = `
          SELECT ${requestedColumns.join(', ')}
          FROM Component_Makes`;

      const result =  await pool.query(projection);
      // Send the result back
      res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

//JOIN QUERY
app.get('/builds/components/:buildName', async (req, res) => {
  const { buildName } = req.params;

  const query = `
    SELECT B.name AS build_name, CM.component_name, CM.cost, CM.manufacturer_name
    FROM Build B
    JOIN Is_In II ON B.bid = II.bid
    JOIN Component_Makes CM ON II.cid = CM.cid
    WHERE B.name = $1;
  `;

  try {
    const result = await pool.query(query, [buildName]);
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({error: 'No components found for the specified build.'});
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error: err.message});
  }
});


//AGGREGATION WITH GROUP BY QUERY
app.get('/componentCostPerManufacturer', async (req, res) => {
  try {
    const componentCostPerManufacturer = 
    `SELECT Manufacturer_Name, AVG(Component_Makes.Cost)
    FROM Component_Makes
    GROUP BY Manufacturer_Name;`;
    const result = await pool.query(componentCostPerManufacturer);

    res.json(result.rows);
  } catch {
    console.log(err.message);
    res.status(500).json({error: err.message});
  }
});

//AGGREGATION WITH HAVING QUERY
app.get('/Users/postsNum/:postsNum', async (req, res) => {
  try {
    //CONCAT(U.fname, ' ', U.lname) AS name
    const aggregationWithHaving = `
      SELECT U.fname, U.lname, U.uid 
      FROM Users U, Review_Wrote_On RWO
      WHERE U.uid=RWO.uid 
      GROUP BY U.uid 
      HAVING COUNT(*) >= $1`;

    const result = await pool.query(aggregationWithHaving, [req.params.postsNum]);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

//NESTED AGGREGATION WITH GROUP BY QUERY
app.get('/minComponentPricePerManufacturer', async (req, res) => {
  try {
    let result = await pool.query(`
    SELECT CM1.manufacturer_name, CM1.component_name, CM1.cost
    FROM Component_Makes CM1
    WHERE CM1.cost = (
      SELECT MIN(Cost)
      FROM Component_Makes CM2
      WHERE CM1.manufacturer_name=CM2.manufacturer_name
      GROUP BY CM2.manufacturer_name)
    `)

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error: err.message});
  }
})

//DIVISION QUERY
app.get('/buildsPassingAllTests/:game', async (req, res) => {
  const { game } = req.params;
  try {
    const division = 
    `
    SELECT B.Bid, B.Name
    FROM Build B
    WHERE NOT EXISTS (
      -- Select builds that have any failing tests for the specified game
      SELECT 1 FROM R2
      WHERE R2.Game_Name = $1
      AND R2.Bid = B.Bid
      AND R2.Passes = '0'
    )
    AND EXISTS (
      -- Ensure the build has at least one passing test for the game to exclude builds with no tests
      SELECT 1 FROM R2
      WHERE R2.Game_Name = $1
      AND R2.Bid = B.Bid
      AND R2.Passes = '1'
    );
  `;
    const result = await pool.query(division, [game]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error: err.message});
  }
});

//utility query not required by rubric
app.get('/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT Game_Name FROM Game')
    res.json(result.rows)
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error: err.message});
  }
})

//utility query not required by rubric
app.get('/builds', async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM build')
    res.json(result.rows)
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error: err.message});
  }
})