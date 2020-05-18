const inquirer = require("inquirer");
const joi = require("joi");
const schema = joi.object().keys({
  name: joi
    .string()
    .regex(/^[a-zA-Z\ \.\d]+$/)
    .min(3),
  int: joi.number().min(1).max(10000),
});

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

  confirmChoice: async () => {
    const questions = {
      message: `Choose an Option:`,
      name: `confirmedChoice`,
      type: `confirm`,
    };
    const { confirmedChoice } = await inquirer.prompt(questions);
    return confirmedChoice;
  },

  colChoice: async (field, type, nullOption, fkValues) => {
    const questions = {
      message: `Enter a Value for ${field}:`,
      name: `valueChoice`,
      type: `input`,
      validate: async function (data) {
        if (nullOption === "NO" && data === "") {
          return "This entry can not be blank";
        } else if (nullOption === "YES" && data === "") {
          return true;
        }
        if (typeof fkValues !== "undefined") {
          for (j = 0; j < fkValues.length; j++) {
            if (String(Object.values(fkValues[j])) === String(data)) {
              return true;
            }
          }
          if (nullOption === "NO") {
            return `This value does not match an existing ${field}. Enter a valid ${field} choice.`;
          } else {
            return `This value does not match an existing ${field}. Enter a valid ${field} choice or leave it blank.`;
          }
        }
        if (type.toLowerCase().includes("varchar")) {
          return joi.validate({ name: data }, schema, function (err, value) {
            if (err) {
              return `Value should be a string without special characters`;
            }
            return true;
          });
        }
        if (type.toLowerCase().includes("int")) {
          return joi.validate({ number: data }, schema, function (err, value) {
            if (err) {
              return `Value should be an integer`;
            }
            return true;
          });
        }
      },
    };
    const { valueChoice } = await inquirer.prompt(questions);
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

  modifyMenu: () => {
    const options = {
      choices: [`Modify an Employee`, `Modify a Role`, `Modify a Department`],
    };
    return uprompt.listReturn(options);
  },

  deleteMenu: () => {
    const options = {
      choices: [`Delete an Employee`, `Delete a Role`, `Delete a Department`],
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
