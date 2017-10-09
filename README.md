# node-todo-api
a simple API hosted on heroku

routes 

1- /todos (POST)  use postman with raw JSON ==>> adds a new todo 
{
"text": "meet your girlfriend",
"completed" : false,
}
2- /todos (GET) use any browser ==> views all the todos
3- /todos/id (GET) use any browser ==> displays the todo that has the inserted Id. 
4- /todos/delete/id use postman with raw JSON ==>> deletes the spcified todo
5- /todos/update/id use postman with raw JSON ==>> adupdates the specified todo.

