require('dotenv').config();
const url_base = "postgres://"+process.env.DB_USERNAME+":"+process.env.DB_PASSWORD+"@"+process.env.DB_HOST+":"+process.env.DB_PORT+"/"
module.exports=
{
  "development": {
    "dialect": "postgres",
    "url": url_base+process.env.DB_DEV_NAME
  },
  "test": {
    "dialect": "postgres",
    "url": url_base+process.env.DB_TEST_NAME
  },
  "production": {
    "dialect": "postgres",
    "url": url_base+process.env.DB_NAME
  }
}
