const orm = require("./config/orm.js");
const uprompt = require("./config/uprompt.js");
const cTable = require("console.table");


//Main menu for initial choice
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
    case `Delete a Record`:
      deleteMenu();
      break;
    case `View Department Budget`:
      departmentMenu();
      break;
    case `Exit`:
      orm.endConnection();
      return;
    default:
      break;
  }
};

//Specialized function to display budget by department ID
const departmentMenu = async () => {
  const departmentID = await uprompt.valueChoice(
    `the ID Number of the Department to View the Budget for`
  );
  const departmentViewData = await orm.selectWhereAsync(
    `*`,
    `department`,
    `id`,
    departmentID,
    `id`
  );
  //Checks to see if the query returned data
  if (departmentViewData.length === 0) {
    console.log(`ID not found in database. Do you want to try again?`);
    const departmentRetry = await uprompt.confirmChoice();
    if (!departmentRetry) {
      return mainMenu();
    } else {
      return departmentMenu();
    }
  }
  //Queries department data
  const departmentBudgetData = await orm.selectDeptBudget(departmentID);
  console.table(departmentBudgetData);
  console.log(`----------------------------------------`);
  mainMenu();
};

//Function to present delete options
const deleteMenu = async (table) => {
  let tableName;
  //Checks if this is a loop from within the function
  if (typeof table === "undefined") {
    const deleteMenuChoice = await uprompt.deleteMenu();
    switch (deleteMenuChoice) {
      case `Delete an Employee`:
        tableName = `employee`;
        break;
      case `Delete a Role`:
        tableName = `role`;
        break;
      case `Delete a Department`:
        tableName = `department`;
        break;
    }
  } else {
    tableName = table;
  }
  const deleteID = await uprompt.valueChoice(
    `the ID Number of the ${tableName} Record to Delete`
  );
  const deleteViewData = await orm.selectWhereAsync(
    `*`,
    tableName,
    `id`,
    deleteID,
    `id`
  );
  //Checks if the chosen ID number is valid
  if (deleteViewData.length === 0) {
    console.log(`ID not found in database. Do you want to try again?`);
    const deleteRetry = await uprompt.confirmChoice();
    if (!deleteRetry) {
      return mainMenu();
    } else {
      return deleteMenu(tableName);
    }
  }
  //Confirms the record should be deleted
  console.table(deleteViewData);
  console.log(`The above table will be deleted. Do you want to proceed?`);
  const deleteConfirm = await uprompt.confirmChoice();
  if (deleteConfirm) {
    const deleteQuery = await orm.deleteAsync(tableName, deleteID);
    console.log(
      deleteQuery.affectedRows !== 0
        ? `Record deleted successfully`
        : `Record deletion failed`
    );
  } else {
    console.log(`Changes discarded`);
  }
  console.log(`----------------------------------------`);
  mainMenu();
};

//Function to modify existing data
const modifyMenu = async (table) => {
  let tableName;
  //Checks if function is being called from within itself
  if (typeof table === "undefined") {
    const modifyMenuChoice = await uprompt.modifyMenu();
    switch (modifyMenuChoice) {
      case `Modify an Employee`:
        tableName = `employee`;
        break;
      case `Modify a Role`:
        tableName = `role`;
        break;
      case `Modify a Department`:
        tableName = `department`;
        break;
    }
  } else {
    tableName = table;
  }
  const tableColInfo = await orm.getColumnsAsync(tableName);
  const modifyID = await uprompt.valueChoice(
    `the ID Number of the ${tableName} Record to Modify`
  );
  const modifyViewData = await orm.selectWhereAsync(
    `*`,
    tableName,
    `id`,
    modifyID,
    `id`
  );
  //Checks if the ID number chosen is valid
  if (modifyViewData.length === 0) {
    console.log(`ID not found in database. Do you want to try again?`);
    const modifyRetry = await uprompt.confirmChoice();
    if (!modifyRetry) {
      return mainMenu();
    } else {
      return modifyMenu(tableName);
    }
  }
  console.table(modifyViewData);
  const modifyViewArray = [];
  //Chooses columns that can be set by user and not by auto increment
  tableColInfo.forEach((element) => {
    if (element.Extra !== "auto_increment") {
      modifyViewArray.push(element.Field);
    }
  });
  console.log("Which field do you want to modify?");
  const modifyCol = await uprompt.arrayChoice(modifyViewArray);
  let fkValues;
  //Checks to see if any values are tied to foreign keys
  for (i = 0; i < tableColInfo.length; i++) {
    if (tableColInfo[i].Field === modifyCol) {
      if (tableColInfo[i].Key === "MUL") {
        const fkData = await orm.getFKAsync(tableName, modifyCol);
        //Queries possible values for validation
        fkValues = await orm.selectAsync(
          fkData[0].REFERENCED_COLUMN_NAME,
          fkData[0].REFERENCED_TABLE_NAME,
          "id"
        );
      }
      const modifyValue = await uprompt.colChoice(
        modifyCol,
        tableColInfo[i].Type,
        tableColInfo[i].Null,
        fkValues
      );
      //Confirms record modification
      console.log(
        `${tableColInfo[i].Field} will be replaced with ${modifyValue}. Proceed?`
      );
      const modifyConfirm = await uprompt.confirmChoice();
      if (modifyConfirm) {
        const modifyQuery = await orm.updateAsync(
          tableName,
          modifyCol,
          modifyValue,
          modifyID
        );
        //Checks for success of request
        console.log(
          modifyQuery.changedRows !== 0
            ? `Record changed successfully`
            : `Record change failed`
        );
      } else {
        console.log(`Changes discarded`);
      }
      console.log(`----------------------------------------`);
    }
  }
  mainMenu();
};

//Function to handle viewing of data
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
  //Checks to see if filter should be applied
  const viewMenuFilter = await uprompt.filterChoice();
  switch (viewMenuFilter) {
    case `View All`:
      console.table(viewData);
      console.log(`----------------------------------------`);
      break;
    case `View With Filter`:
      console.log(`What do you want to filter by?\n`);
      //Presents existing keys as choices for filter
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
          console.log(
            `No records found matching that criteria\n----------------------------------------`
          );
          break;
        default:
          console.table(filterViewData);
          console.log(`----------------------------------------`);
          break;
      }
      break;
  }
  mainMenu();
};

//Function for creating records
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
  //Pulls existing columns for reference
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
  //Query to create record in MySql
  const createQuery = await orm.createAsync(tableName, createColumns, [
    createValues,
  ]);
  console.log(
    createQuery.affectedRows !== 0
      ? `Record Created`
      : `Record Creation Failed`
  );
  console.log(`----------------------------------------`);
  mainMenu();
};

mainMenu();

