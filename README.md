# Taxplan Admin

  This is the front end for taxplan admin
  You will need a taxplan.api as well to run admin.

##Get Taxplan API

  The taxplan.api project should be in bitbucket as taxplan.api
  Install a local version of taxplan api, and make sure CORS is set up for your api.
  For dev default, CORS needs to allow: "http://localhost:8080".

  Once you have Taxplan API working, create an Admin account.
  To do this, go into the Taxplan.API DB, and change the user's role.
  ```
  UPDATE users SET role="Admin" WHERE id="XXX"
  ```

##Setup

### Get Taxplan.admin

You should already have this, but it should be a repo in bitbucket.  Get development branch using Git.

### Install Node, NPM and libsass
  Taxplan Admin uses node, npm, webpack, and sass. Make sure you have Node (v 6.8+), NPM and libsass (v3.3+) installed. 

  For OSX, if you don't have these installed, you can use Homebrew:
  ```
  brew install node
  node -v
  npm -v
  brew install libsass
  ```

### Install npm packages

  Go to base folder and install npm packages
  ```
    npm install
  ```

### Update config files

  For now, config is at "src/js/config.js". We will move this eventually.  Update the config.js file to point to your taxplan.api server (needed) and taxplan.web server (not needed. Only for reset)

  Make sure your taxplan.api CORS is set up for your dev server (include the base Uri for taxplan.admin as an entry in taxplan.api CORS setting)!


### Run dev server
  With config updated, you should be able to run the dev server. We are using webpack to package all this stuff together, and the webpack dev server to run it.

  There is an npm script set up to run this.  You can see all the set up npm scripts by using npm run

  ``` 
  npm run
  ```

  To run the dev server, run the 'dev' npm script


  ```
  npm run dev

  ```

  The server will automatically run on 8080. If you want to change this, you can override the value with the command:
  ```
  npm config set Taxplan.Admin:port 8082 
  ```
  Remember to make sure you update CORS!

  You can check what you listed for the port by checking config values, and greping for the value


  ```
  npm config list | grep Taxplan.Admin:port
  ```

  the webpack dev server hotloads and reloads new changes.  Yah!


### App Architecture

  We use npm run tasks to run rando scripts
  We use webpack to package js & css for the app
  The app itself is a single page React app, using React Router for client side routing, and Redux for state.
  The app makes calls directly to the API (taxplan.api) (hence why CORS is set up).  After login, the jwt token is passed in headers for all subsequent API calls.


### Run prod
  TODO: We can't do this yet. 

## Resources

  [Webpack page](https://webpack.github.io/) 
  [React page](https://facebook.github.io/react/)
  [Redux page](http://redux.js.org/)
  [Learn React Videos](https://www.youtube.com/watch?v=MhkGQAoc7bc&list=PLoYCgNOIyGABj2GQSlDRjgvXtqfDxKm5b)
