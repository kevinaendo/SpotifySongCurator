const { Client } = require('pg');
connection = {
  connectionString: "postgres://dbadihyxyevseu:3e4e35227151cabc3d1d4cc95b70d8d974105a095ed8f28cb95f573b9612de6e@ec2-54-225-205-79.compute-1.amazonaws.com:5432/dcumq2f3lhmd5n",
  ssl: true
};

//test query
 // client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  //   if (err) throw err;
  //   for (let row of res.rows) {
  //     console.log(JSON.stringify(row));
  //   }
  //   client.end();
  // });


const getPlaylists = (request, response) => {
  const client = new Client(connection);
  client.connect();
  const result = client.query('SELECT * FROM playlists', (error, results) => {
    if (error) {
       throw error;
     }
    console.log(results);
    client.end();
    response.status(200).json(results.rows);
  });
  console.log('end');
};


const createPlaylist = (request, response) => {
  const client = new Client(connection);
  client.connect();

  const { spotify_id } = request.body;
  console.log(spotify_id);

  const result = client.query('INSERT INTO playlists(spotify_id) VALUES($1)', [spotify_id], (error, results) => {
     if (error) {
       throw error;
     }
     client.end();
     response.status(201).send(`User added with ID: ${results.insertId}`);
  })
};

const getUserById = (request, response) => async function() {
  const id = parseInt(request.params.id);

  const client = new Client(connection);
  await client.connect();
  const result = await client.query('SELECT * FROM playlists WHERE id = $1')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))
  .then(() => client.end());


  // pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
  //   if (error) {
  //     throw error
  //   }
  //   response.status(200).json(results.rows)
  // })

  // create playlist query
  // await client.query('INSERT INTO playlists(spotify_id) VALUES ($1)', spotify_id,
  // (error, results) => {
  //   if (error) {
  //     throw error;
  //   }
  //   response.status(201).send(`User added with ID: ${results.insertId}`);
  // });
  // client.end();
};



module.exports = {
  getPlaylists,
  createPlaylist,
  getUserById,
};
