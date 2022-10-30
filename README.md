# S3_Full-Stack_Sprint1
# A working command line interface and web server

- Makenzie Roberts
- Kara Balsom
- David Turner
- Glen May

🔐 How to use Command Line Interface: 

 *  Navigate to file directory containing app
 *  Type "npm i" to install required dependencies
 *  Type "node myapp init --all" to initialize and install application
 *  Type "node myapp" for a detailed list of commands that can be used.

🧑🏽‍💻 How to use web-server:
 *  Make sure you've installed the command line interface first!
 *  In a new terminal, navigate to file directory containing app.
 *  Input "node server" to run web server.
 *  Navigate in a web browser to "localhost:3500"
 *  The webform will allow the user to generate, display and search tokens and user records.


💾Logging:
   
 - Files are logged on a daily basis and use the following format:
 - Template: YYYYMMDD 12:00:00 LOGGING_LEVEL  module.FunctionName() Description of Event Emitted.....  {TOKEN STRING}
 - Example:  20221030	20:28:34	TOKEN_WARNING	token.searchRecord()	Token for glen24 was NOT retrieved.	3f710779-d5eb-4601-af74-7be19b2f52d3


🧪 Testing:

- Expiry is handled by both the CLI and web form. Just edit the expiry date of a user object in the token.json array to a date in the past. If a token already exists for a username, but is expired at the time it is referenced, it will be deleted before it can be returned. If a new token is being requested, it will do so without error.

👨‍🏫 TODO:

- Add a function to clear database of expired tokens before they are called ⏰
- Implement additional administrator functions in both web form and CLI 🤓
- Serve custom URLs to our routes using the response parameters. ｛🤯｝
- Figure out how to style the returned JSON text for the local webserver. 🤔


// CLI Commands

- myapp --help                            displays help
- myapp init --all                        creates the folder structure and config file
- myapp init --mk                         creates the folder structure
- myapp init --cat                        creates all the files with default settings
- myapp config --show                     displays a list of the current config settings
- myapp config --reset                    resets the config file with default settings
- myapp config --set                      sets a specific config setting
- myapp token --count                     displays a count of the tokens created
- myapp token --list                      list all the usernames with tokens
- myapp token --new <username>            generates a new token
- myapp token --fetch <username>          fetches a user record for a given username
- myapp token --search u <username>       searches a token for a given username




