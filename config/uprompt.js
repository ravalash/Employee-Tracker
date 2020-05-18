const inquirer = require("inquirer");
const joi = require("joi");
const schema = joi.object().keys({
  name: joi
    .string()
    .regex(/^[a-zA-Z\ \.\d]+$/)
    .min(3),
  int: joi.number().integer().min(1).max(2147483647),
  decimal: joi.number().integer().min(1).max(9999999999)
});

const uprompt = {
  //Returns list prompts from other menus
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

  //Returns confirm choices
  confirmChoice: async () => {
    const questions = {
      message: `Choose an Option:`,
      name: `confirmedChoice`,
      type: `confirm`,
    };
    const { confirmedChoice } = await inquirer.prompt(questions);
    return confirmedChoice;
  },

  //Returns open ended choices. Validates against passed parameters
  colChoice: async (field, type, nullOption, fkValues) => {
    const questions = {
      message: `Enter a Value for ${field}:`,
      name: `valueChoice`,
      type: `input`,
      validate: async function (data) {
        //Checks if a null option is possible.
        if (nullOption === "NO" && data === "") {
          return "This entry can not be blank";
        } else if (nullOption === "YES" && data === "") {
          return true;
        }
        //Checks if foreign key parameters were passed and whether the input meets the requirement
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
        //Checks type from MySql columns and validates using JOI
        if (type.toLowerCase().includes("varchar")) {
          return joi.validate({ name: data }, schema, function (err, value) {
            if (err) {
              return `Value should be a string without special characters`;
            }
            return true;
          });
        }
        if (type.toLowerCase().includes("int")) {
          return joi.validate({ int: data }, schema, function (err, value) {
            if (err) {
              return `Value should be a positive integer`;
            }
            return true;
          });
        }
        if (type.toLowerCase().includes(`decimal(10,0)`)) {
          return joi.validate({ decimal: data }, schema, function (err, value) {
            if (err) {
              return `Value should be a positive number with no decimal points`;
            }
            return true;
          });
        }
      },
    };
    const { valueChoice } = await inquirer.prompt(questions);
    return valueChoice;
  },

  //Value choice without validation
  valueChoice: async (valueName) => {
    const questions = {
      message: `Enter a Value for ${valueName}:`,
      name: `valueChoice`,
      type: `input`,
    };
    const { valueChoice } = await inquirer.prompt(questions);
    return valueChoice;
  },

  //Menus where only the data being passed as choices changes.
  mainMenu: () => {
    const options = {
      choices: [
        `View Records`,
        `Create a Record`,
        "Modify a Record",
        "Delete a Record",
        "View Department Budget",
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
