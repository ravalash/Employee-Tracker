# Employee-Tracker
![Github Issues](https://img.shields.io/github/issues/ravalash/Employee-Tracker)![Github Forks](https://img.shields.io/github/forks/ravalash/Employee-Tracker)![Github Stars](https://img.shields.io/github/stars/ravalash/Employee-Tracker)![Github Issues](https://img.shields.io/github/license/ravalash/Employee-Tracker)

## Description
Unit 12 MySQL Homework: Employee Tracker

## Motivation
This homework will delivery an employee management CLI interface capable of creating, viewing, updating, and deleting records and saving them in a MySql database. This project will serve as a chance to practice using MySql queries in Node Js and constructing inquirer prompts with provided data.

## Code Style
This project is written using JavaScript and uses async functions to gather and present data from both the user and the MySql database. MySql queries, connection commands,  and Inquirer prompts are kept in separate filea to allow for modulation and separation of data. 

Inquirer menus are passed information where the end result is a single returned variable to streamline the process.
```javascript
  createMenu: () => {
    const options = {
      choices: [`Create an Employee`, `Create a Role`, `Create a Department`],
    };
    return uprompt.listReturn(options);
  },

  viewMenu: () => {
    const options = {
      choices: [`View Employees`, `View Roles`, `View Departments`],
    };
    return uprompt.listReturn(options);
  },

  modifyMenu: () => {
    const options = {
      choices: [`Modify an Employee`, `Modify a Role`, `Modify a Department`],
    };
    return uprompt.listReturn(options);
  },
  ```

Commonly used MySql queries are kept and referenced throughout the program with variables passed relevant to the required information.
  ```javascript
  selectWhereAsync: (tableCol, tableName, colName, colValue, sortCol) => {
    return new Promise((resolve, reject) => {
      const queryString = "SELECT ?? FROM ?? WHERE ?? = ? ORDER BY ??";
      connection.query(
        queryString,
        [tableCol, tableName, colName, colValue, sortCol],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  },
  ```

Foreign key values are assessed to determine reference tables and validate records before they are passed to MySql

  ```javascript
 const tableColInfo = await orm.getColumnsAsync(tableName);
  //Arrays to store column names and values
  const createColumns = [];
  const createValues = [];
  for (i = 0; i < tableColInfo.length; i++) {
    if (tableColInfo[i].Extra != "auto_increment") {
      //Pulls forgeign key values for validation 
      let fkValues;
      if (tableColInfo[i].Key === "MUL") {
        const fkData = await orm.getFKAsync(tableName, tableColInfo[i].Field);
        fkValues = await orm.selectAsync(
          fkData[0].REFERENCED_COLUMN_NAME,
          fkData[0].REFERENCED_TABLE_NAME,
          "id"
        );
      }
  ```

Records can be viewed in entirety or with filters applied

![All View Screenshot](/screenshots/view-all.jpg "All View")

![Filtered View Screenshot](/screenshots/view-filter.jpg "Filtered View")

Checks and validations are present to ensure the user does not corrupt their data.

![Confirmation Screenshot](/screenshots/delete-confirm.jpg "Confirmation Screen")

Below is a video demonstrating the functionality of the application including validation of entered text.

<a href="http://www.youtube.com/watch?feature=player_embedded&v=pu4_7VA1SEI" target="_blank"><img src="http://img.youtube.com/vi/pu4_7VA1SEI/0.jpg" 
alt="demonstration of functionality" width="240" height="180" border="10" /></a>

## Features
Validation is handled via the inquirer prompt itself which allows for immediate correction if the provided answer is unacceptable.

Foreign key values are compared against the referenced table to reject inputs if the value does not exist.

Menu options are modular and allow for user choice across all keys.

# How to Use
Dependencies must be installed individually or via package.json file
* inquirer
* joi
* MySql


Execution is completed by running index.js and entering information in the CLI.