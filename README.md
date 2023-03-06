# Node Authentication

A Node Authentication App are created using express, ejs and mongoDb. A user can register and login using email
and Google login / register.

Following features are implementd in the app which is given below : 

* Login and signup with re-captcha
* Google signIn/ SignUp feature included
* Change password using link (in case of forgot password)
* Upate password while logged in (by re-verifing yourself);
* User's password has been stored in encrypted manner
* Password change link will be sent as a parallel job (priority based)
* Show real-time notification while login or signup and password change process.


## Version
- body-parser - v1.20.2
- connect-mongo - v4.6.0
- cookie-parser - v1.4.6
- crypto - v1.0.1
- ejs - v3.1.8
- node - v16.14.2
- dotenv - v16.0.3
- connect-flash - v0.1.1
- express - v4.18.2
- express-ejs-layouts - v2.5.1
- express-session - v1.17.3
- isomorphic-fetch - v3.0.0
- kue - v0.11.6
- mongoose - v6.8.4
- mongoose-long - v0.6.0
- nocache - v3.0.4
- nodemailer - v6.9.1
- nodemon - v2.0.20
- passport - v0.6.0
- passport-google-oauth - v2.0.0
- passport-local - v1.0.0

### Built With

This project is build with various libraries and frameworks. Some of them is listed below

* [Node Js](https://nodejs.org/en/)
* [Express Js](http://expressjs.com/)
* [Nodemailer](http://nodemailer.com/about/)
* [Redis](https://redis.io/)
* [Bootstrap](https://getbootstrap.com/)


## Getting Started

For start the project you need to have some prerequisites.

### Prerequisites
npm is mandatory for install and runing the project

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

Clone the project from Git and install all the required libraries for the project

1. Clone the repo
   ```sh
   git clone https://github.com/nazir1007/nodeAuthentication.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Configure

Here you have to make some configuraiton to run this project on your system
1. Install nodemon using npm (Ignore if already Installed)
    ```
    npm install nodemon
    ```

2. Install Redis-server  on your system
    * If you are a windows user do below steps
    * Step Up WSL
        * Run Windows Powershell as Administrator
        * Run the following command
            ```
            Enable-WindowsOptionalFeature -Online -FeatureName  Microsoft-Windows-Subsystem-Linux
            ```
        * Reboot Windows after making the change
        * Download Ubuntu Distros from windows store 
            ```
            https://apps.microsoft.com/store/detail/ubuntu-1804-on-windows/ 9N9TNGVNDL3Q?hl=en-us&gl=us
            ```
    * Install and run redis
        * Launch the downloaded distro and run the following
commands
            ```
            sudo apt-get update
            sudo apt-get upgrade
            sudo apt-get install redis-server
            redis-cli -v
            ```
    * <b>Remember</b> : Run redis server by using command <b>Redis-sever</b> before runing project

3. Register the application on google-cloud to get OAuth2 keys, you can replace yours with mine. <b>How to generate? Please Google it</b>
    * Client Id
    * Client Secret
    * Callback URL
    * add all this keys in config/app_keys.js file

4. Register the application to google re-captcha, <b>Don't know how to register? Google It</b>
    * Site-key
    * screte-key
    * Add this screte-key in config/app_keys.js file

5. Create an app password for this application to use nodemailer, Steps are
    * Sign In to google
    * Click on manage your google account
    * Click on Security
    * Go to Signing in to Google section
    * Create a new App password
    * A new encrypted password will be generated use this password and your email Id as username in config/app_keys.js file

6. Now all configurations has been completed, run below command in terminal to run the application
    ```
    npm start
    ```
7. On browser write URL <b>localhost:8000</b>
