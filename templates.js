// These templates are called on during the initialization project to allow for file writing.

// Folders required
const folders = ["json", "views", "logs"];

const configjson = {
  name: "AppConfigCLI",
  version: "1.0.0",
  description: "The Command Line Interface for MyApp.",
  main: "myapp.js",
  superuser: "adm1n",
  database: "exampledb",
};

const tokenjson = [];

const usagetxt = `

node myapp <command> <option>

Usage:

myapp --help                                        displays help

myapp init --all                                    creates the folder structure and config file
myapp init --mk                                     creates the folder structure
myapp init --cat                                    creates all the files with default settings
                                                    such as dot json files and dot txt files

myapp config --show                                 displays the current config settings
myapp config --reset                                resets the config file with default settings
myapp config --set    <attribute name> <new value>  sets a specific value to a named attribute
myapp config --new    <attribute name>              adds a new attribute to the config file

myapp token --count                                 displays a count of the tokens created
myapp token --list                                  list all the usernames with tokens
myapp token --new       <username>                  generates a token for a given username, saves tokens to the json file
myapp token --fetch     <username>                  fetches a user record for a given username
myapp token --search u  <username>                  searches a token for a given username

`;

const inittxt = `

node myapp init <command>

Usage:

myapp init --all                                    creates the folder structure and config file
myapp init --mk                                     creates the folder structure
myapp init --cat                                    creates all the files with default settings
                                                    such as dot json files and dot txt files

`;

const configtxt = `

node myapp <command> <option> <option>

Usage:

myapp config --show                                 displays the current config settings
myapp config --reset                                resets the config file with default settings
myapp config --set    <attribute name> <new value>  sets a specific value to a named attribute
myapp config --new    <attribute name>              adds a new attribute to the config file

`;

const tokentxt = `

node myapp <command> <option>

Usage:

myapp token --count                                 displays a count of the tokens created
myapp token --list                                  list all the usernames with tokens
myapp token --new       <username>                  generates a token for a given username, saves tokens to the json file
myapp token --fetch     <username>                  fetches a user record for a given username
myapp token --search u  <username>                  searches a token for a given username




`;

module.exports = {
  folders,
  configjson,
  tokenjson,
  usagetxt,
  inittxt,
  configtxt,
  tokentxt,
};
