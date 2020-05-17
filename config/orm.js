const connection = require("./connection.js");

const orm = {
  endConnection: () => {
    connection.end();
  },

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

  deleteAsync: (tableName, recordID) => {
    return new Promise((resolve, reject) => {
      const queryString = "DELETE FROM ?? WHERE id = ?";
      connection.query(queryString, [tableName, recordID], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  getColumnsAsync: (tableName) => {
    return new Promise((resolve, reject) => {
      const queryString = "SHOW COLUMNS FROM ??";
      connection.query(queryString, [tableName], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
};

// const test = async () => {
//   console.table(await orm.getColumnsAsync("employee"));
// };
// test();
// orm.endConnection;
module.exports = orm;
