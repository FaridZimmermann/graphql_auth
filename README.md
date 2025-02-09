# GraphQLAuth - Full stack authentication system using GraphQL with MongoDB && React/Redux


<h4>[Important]:</h4>
To setup demo usage a working MongoDB connection is required.
Setup your own MongoDB instance or connect to your cloud-based solution, then add in the root of the project an ".env" file with the key [MONGO_URI=YourDatabaseURI]. Also please create a secret key for the password token creation to work flawlessly and enter into into your .env file. [SECRET_KEY=examplekey]
</br>

<h4>[Usage]:</h4>
</br>


<h3>Objective:</h3> To create a full-stack web application that allows the user to signup, login and logout. Also OAuth should be implemented.
 
</br>
<h3>Main Challenges/Learning Experience:</h3> 

**BACKEND** - Integrating OAuth with GraphQL </br>

**FRONTEND** - Issue implementing tests, especially configuration with jest as there seems to be some unwanted behaviour due to multithreads run by jest itself (missing console.logs for instance) Not solution found as of yet.
