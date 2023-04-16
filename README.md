# Data Protection System based on Encryptation and Anonymization Techniques - Front End

The current version of this System is up on Huawei's Cloud and can be accessed on [this link](http://110.238.69.32/)

This repository contains only the Front end of Web application of the project. You can see the Client Agent part [here](https://github.com/FRIDA-LACNIC-UECE/agent) and the Back end of the Web app [here](https://github.com/FRIDA-LACNIC-UECE/back-end).

<p align="center">
  <a href=#Project>Description</a> -
  <a href=#Installing>Installation</a> -
  <a href=#Technologies>Technologies</a>
</p>

<h4 align="center"> ⚠ This project is in active development and is NOT ready for production use ⚠</h4>

<br/>

# Project Description

This project aims to study techniques and methodologies to propose a system for data protection based on cloud computing, to enable a higher capacity processing without encumbering the computational resources of devices and local servers of companies and government institutions. Thus, the objective is to develop a system for receiving data through a communication API, anonymization configuration considered adequate, protecting data through encryption and returning anonymized data to system users. Finally, the prototype was deployed in a cloud environment to carry out a robust experimental analysis.

The Web application is being built to be a easy way for the final user to use the data protection provided by this project.

## Features
- [x] User Login
- [ ] Admin Page
- [x] Database visualizer page
- [] Anonymization configuration page



# Installing and running

To run this front-end project, you'll need  [Git](git-csm.com) and [Quasar](https://quasar.dev/)

## Running

```bash
# Clone repository with the updated branch

git clone --branch develop https://github.com/FRIDA-LACNIC-UECE/front-end

# Select repository

cd front-end

# Install dependencies

npm install #or yarn install

# Run app

quasar dev

# It will initialize on port: 8080, access http://localhost:8080

```
<br/>

# Technologies used
- [Git](git-csm.com) - Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency.
- [Quasar](https://quasar.dev/) - Open source programming language.
- [Axios](https://axios-http.com/) - Axios is a promise-based HTTP Client for node.js and the browser.
