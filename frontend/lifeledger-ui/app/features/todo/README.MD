

Create	POST	/api/v1/todos/create
Get all	GET	/api/v1/todos/getAll
Get all by userId	GET	/api/v1/todos/getByUserId/{userId}
Get by Id GET /api/v1/todos/getById/{id}
Update	PUT	/api/v1/todos/updateById/{id}
Complete	PATCH	/api/v1/todos/toggleCompletion/{id}
Delete	DELETE	/api/v1/todos/deleteById{id}


password manager
1. Password Manager APIs
Method	API	Purpose
POST	/api/v1/passpasswordManagerords/create/?userId=1	Create/save credentials
GET	/api/v1/passwordManager/user/{userId}	Get all credentials for user
PUT api/v1/passwordManager/updateById/{id}	Update credential
DELETE	/api/v1/passwordManager/deleteById/{id}	Delete credential