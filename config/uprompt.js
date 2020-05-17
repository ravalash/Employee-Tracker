const inquirer = require("inquirer");

const uprompt = {
  listReturn: async (listChoices) => {
    const questions = {
      message: `Choose an Option:`,
      name: `menuChoice`,
      type: `list`,
      choices: listChoices.choices,
    };
    const { menuChoice } = await inquirer.prompt(questions);
    return menuChoice;
  },

  colChoice: async (field, type, nullOption) => {
    const questions = {
      message: `Enter a Value for ${field}:`,
      name: `valueChoice`,
      type: `input`
    }
    const {valueChoice} = await inquirer.prompt(questions);
    return valueChoice;
  },

  valueChoice: async (valueName) => {
    const questions = {
      message: `Enter a Value for ${valueName}:`,
      name: `valueChoice`,
      type: `input`,
    };
    const { valueChoice } = await inquirer.prompt(questions);
    return valueChoice;
  },

  mainMenu: () => {
    const options = {
      choices: [
        `View Records`,
        `Create a Record`,
        "Modify a Record",
        "Delete a Record",
        "Exit",
      ],
    };
    return uprompt.listReturn(options);
  },

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

  filterChoice: () => {
    const options = {
      choices: [`View All`, `View With Filter`],
    };
    return uprompt.listReturn(options);
  },

  arrayChoice: (array) => {
    const options = {
      choices: array,
    };
    return uprompt.listReturn(options);
  },
};

module.exports = uprompt;
