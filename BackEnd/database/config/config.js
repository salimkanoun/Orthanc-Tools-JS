require('dotenv').config();

module.exports=
{
  "development": {
    "dialect": "postgres",
    "url": process.env.DB_DEV_URL
  },
  "test": {
    "dialect": "postgres",
    "url": process.env.DB_TEST_URL
  },
  "production": {
    "dialect": "postgres",
    "url": process.env.DB_URL
  }
}
