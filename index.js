const orm = require("./config/orm.js");
const uprompt = require("./config/uprompt.js");
const cTable = require("console.table");

const mainMenu = async () => {
  const mainMenuChoice = await uprompt.mainMenu();
  switch (mainMenuChoice) {
    case `View Records`:
      viewMenu();
      break;
    case `Create a Record`:
      createMenu();
      break;
     case `Modify a Record`:
       modifyMenu();
       break; 
    case `Exit`:
      orm.endConnection();
      return;
    default:
      break;
  }
};

const viewMenu = async () => {
  const viewMenuChoice = await uprompt.viewMenu();
  let viewData;
  let tableName;
  switch (viewMenuChoice) {
    case `View Employees`:
      viewData = await orm.selectAsync("*", "employee", "id");
      tableName = `employee`;
      break;
    case `View Roles`:
      viewData = await orm.selectAsync("*", "role", "id");
      tableName = `role`;
      break;
    case `View Departments`:
      viewData = await orm.selectAsync("*", "department", "id");
      tableName = `department`;
      break;
  }
  const viewMenuFilter = await uprompt.filterChoice();
  switch (viewMenuFilter) {
    case `View All`:
      console.table(viewData);
      console.log(`--------------------`);
      break;
    case `View With Filter`:
      console.log(`What do you want to filter by?\n`);
      const viewCol = await uprompt.arrayChoice(Object.keys(viewData[0]));
      const viewValue = await uprompt.valueChoice(viewCol);
      const filterViewData = await orm.selectWhereAsync(
        "*",
        tableName,
        viewCol,
        viewValue,
        `id`
      );
      switch (filterViewData.length) {
        case 0:
          console.log(`No records found matching that criteria\n--------------------`);
          break;
        default:
          console.table(filterViewData);
          console.log(`--------------------`);
          break;
      }
      break;
  }
  mainMenu();
};

const createMenu = async () => {
  const createMenuChoice = await uprompt.createMenu();
  let tableName;
  switch (createMenuChoice) {
    case `Create an Employee`:
      tableName = `employee`;
      break;
    case `Create a Role`:
      tableName = `role`;
      break;
    case `Create a Department`:
      tableName = `department`;
      break;
  }
  const tableColInfo = await orm.getColumnsAsync(tableName);
  console.log(tableColInfo);
  const createColumns = [];
  const createValues = [];
  for (i = 0; i < tableColInfo.length; i++) {
    if (tableColInfo[i].Extra != "auto_increment") {
      let fkValues;
      if (tableColInfo[i].Key === "MUL") {
        const fkData = await orm.getFKAsync(tableName, tableColInfo[i].Field);
        fkValues = await orm.selectAsync(
          fkData[0].REFERENCED_COLUMN_NAME,
          fkData[0].REFERENCED_TABLE_NAME,
          "id"
        );
      }
      const createValue = await uprompt.colChoice(
        tableColInfo[i].Field,
        tableColInfo[i].Type,
        tableColInfo[i].Null,
        fkValues
      );
      if (createValue !== "") {
        createValues.push(createValue);
        createColumns.push(tableColInfo[i].Field);
      }
    }
  }
  const createQuery = await orm.createAsync(tableName, createColumns, [
    createValues,
  ]);
  console.log(
    createQuery.affectedRows !== 0 ? `Record Created\n--------------------` : `Record Creation Failed\n--------------------`
  );
  mainMenu();
};

const viewEmployees = async () => {};

const viewRoles = async () => {};

const viewDepartments = async () => {};
mainMenu();

// orm.endConnection();
