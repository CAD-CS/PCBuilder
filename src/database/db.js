const { Pool } = require('pg');
const express = require('express');


const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'cs304',
  password: '1234',
  port: 5432,
});

module.exports = pool;