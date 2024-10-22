Set up and Run Instructions:

npm install express sqlite3 sqlite path nodemon

To Run the code:

use nodemon app.js

put request:
The put request first takes the date in json format
by using the request.body we get the data from the 
request and write a sqlite code to put the data into
the table and successfully completing it will send us
data successfully sent message

get request:
It is used to get the entire data from the table

get request by id:
By using this api we get a specified data from the
table based on id

put request:
It will be used to update data in the existing table

delete request:
If we want to delete a particular data from a 
table we use the delete api 
