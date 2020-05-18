const connection = require("./connection.js");

const orm = {
  endConnection: () => {
    connection.end();
  },

  //Function for selecting any columns from table
  selectAsync: (tableCol, tableName, sortCol) => {
    return new Promise((resolve, reject) => {
      const queryString = "SELECT ?? FROM ?? ORDER BY ??";
      connection.query(
        queryString,
        [tableCol, tableName, sortCol],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  },

  //Function for selecting any columns from table with single where condition
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

  //Function to display the budget and count of employees for a department.
  selectDeptBudget: (deptID) => {
    return new Promise((resolve, reject) => {
      const queryString =
        "select department.id, sum(salary) AS Salary, count(employee.id) as Employees , department.name AS 'Department Name' from employee join role on employee.role_id = role.id join department on role.department_id = department.id where department.id = ?";
      connection.query(queryString, [deptID], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  //Function to create records given a table name, columns, and values
  createAsync: (tableName, colName, colValue) => {
    return new Promise((resolve, reject) => {
      const queryString = "INSERT INTO ?? (??) VALUES ?";
      connection.query(
        queryString,
        [tableName, colName, colValue],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  },

  //Function to modify one column entry of a record in a table
  updateAsync: (tableName, colName, colValue, recordID) => {
    return new Promise((resolve, reject) => {
      const queryString = "update ?? SET ?? = ? where id = ?";
      connection.query(
        queryString,
        [tableName, colName, colValue, recordID],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  },

  //Function to delete a record in a table
  deleteAsync: (tableName, recordID) => {
    return new Promise((resolve, reject) => {
      const queryString = "DELETE FROM ?? WHERE id = ?";
      connection.query(queryString, [tableName, recordID], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  //Function to return column data for a table
  getColumnsAsync: (tableName) => {
    return new Promise((resolve, reject) => {
      const queryString = "SHOW COLUMNS FROM ??";
      connection.query(queryString, [tableName], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  //Function to return foreign key data from a column
  getFKAsync: (tableName, colName) => {
    return new Promise((resolve, reject) => {
      const queryString =
        "SELECT DISTINCT a.REFERENCED_TABLE_NAME, a.COLUMN_NAME, a.REFERENCED_COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE a JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS b USING (CONSTRAINT_NAME) WHERE a.TABLE_SCHEMA = 'employees_db' AND a.TABLE_NAME = ? AND a.COLUMN_NAME =?";
      connection.query(queryString, [tableName, colName], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
};

module.exports = orm;
