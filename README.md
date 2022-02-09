# ng-crud
Table and form for CRUD with angularjs
It's usefull for CRUD application as it easily populates a table or creates a form within a angularJS application.
All you have to do is call the tag within the routes, for example to a posts CRUD:

      .when('/posts', {
				template: "<div x-db-table edit-url='/#/post/' limit=24 page=1 last_page=1 backend='posts/' table-url='app/templates/pages/posts/table.html' page-title='Posts' open-items-new-tab='true'></div>"
			})
			.when('/post/', {
				template: "<div x-db-form edit-url='/#/post/' backend='posts/' form-url='app/templates/pages/posts/form.html' id-name='post_id' force-load='true'></div>"
			})
			.when('/post/:post_uuid', {
				template: "<div x-db-form backend='posts/' form-url='app/templates/pages/posts/form.html' id-name='post_uuid' redirect-not-found='/posts'></div>"
			})


Where:
x-db-table: creates a table
edit-url: the url to be redirected when an item is clicked (it will be composed of this value+the id of each row)
limit: number of items to display
page: the page to be displayed when page loads
backend: the address of the backend that will process the data
table-url: the url of the HTML containing the table
page-title: title of the page
open-items-new-tab: when false opens in the same tab, when true opens in a new tab
x-db-form: creates a form
form-url: the html file for the form
id-name: the id field from the backend, used to compose redirecting URL and the backend URL
force-load: when true makes a call to the backend, usefull because sometimes we need to read some data that will be used to build the form
redirect-not-found: url to redirect when quired item isn't found
