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
    case `Delete a Record`:
      deleteMenu();
      break;
    case `Exit`:
      orm.endConnection();
      return;
    default:
      break;
  }
};

const deleteMenu = async (table) => {
  let tableName;
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
  console.log(tableName);
  const deleteID = await uprompt.valueChoice(
    `the ID Number of the ${tableName} Record to Delete`
  );
  console.log(deleteID);
  const deleteViewData = await orm.selectWhereAsync(`*`, tableName, `id`, deleteID, `id`);
  console.log(deleteViewData);


  
  if (deleteViewData.length === 0) {
    console.log(`ID not found in database. Do you want to try again?`);
    const deleteRetry = await uprompt.confirmChoice();
    if (!deleteRetry) {
      console.log("no");
      return mainMenu();
    } else {
      console.log("yes");
      return deleteMenu(tableName);
    }
  }
  console.table(deleteViewData);
  console.log(`The above table will be deleted. Do you want to proceed?`);
  const deleteConfirm = await uprompt.confirmChoice();
      if (deleteConfirm) {
        const deleteQuery = await orm.deleteAsync (tableName,  deleteID);
        console.log(deleteQuery)
        console.log(deleteQuery.affectedRows !== 0 ? `Record deleted successfully`: `Record deletion failed`);
      }
      else{
        console.log(`Changes discarded`)
      }

  mainMenu();
}

const modifyMenu = async (table) => {
  let tableName;
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
  console.table(tableColInfo);
  console.log(tableColInfo);
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
  if (modifyViewData.length === 0) {
    console.log(`ID not found in database. Do you want to try again?`);
    const modifyRetry = await uprompt.confirmChoice();
    if (!modifyRetry) {
      console.log("no");
      return mainMenu();
    } else {
      console.log("yes");
      return modifyMenu(tableName);
    }
  }
  console.table(modifyViewData);
  const modifyViewArray = [];
  tableColInfo.forEach((element) => {
    if (element.Extra !== "auto_increment") {
      modifyViewArray.push(element.Field);
    }
  });
  console.log("Which field do you want to modify?");
  const modifyCol = await uprompt.arrayChoice(modifyViewArray);
  console.log(modifyCol);
  let fkValues;
  for (i = 0; i < tableColInfo.length; i++) {
    if (tableColInfo[i].Field === modifyCol) {
      if (tableColInfo[i].Key === "MUL") {
        const fkData = await orm.getFKAsync(tableName, modifyCol);
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
      console.log(
        `${tableColInfo[i].Field} will be replaced with ${modifyValue}. Proceed?`
      );
      const modifyConfirm = await uprompt.confirmChoice();
      if (modifyConfirm) {
        const modifyQuery = await orm.updateAsync (tableName, modifyCol, modifyValue, modifyID);
        console.log(modifyQuery.changedRows !== 0 ? `Record changed successfully`: `Record change failed`);
      }
      else{
        console.log(`Changes discarded`)
      }
    }
  }
  mainMenu();
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
          console.log(
            `No records found matching that criteria\n--------------------`
          );
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
    createQuery.affectedRows !== 0
      ? `Record Created\n--------------------`
      : `Record Creation Failed\n--------------------`
  );
  mainMenu();
};


mainMenu();

// orm.endConnection();
