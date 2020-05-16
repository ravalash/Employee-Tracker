INSERT INTO department (name)
VALUES
  ("Sales"),
  ("Customer Service"),
  ("Accounting"),
  ("Human Resources");
INSERT INTO role (title, salary, department_id)
VALUES
  ("Sales Agent", 40000.00, 1),
  ("Telesales Agent", 35000.00, 1),
  ("Support Agent", 35000.00, 2),
  ("Tech Support", 38000.00, 2),
  ("Payroll Clerk", 40000.00, 3),
  ("Accounts Manager", 45000.00, 3),
  ("HR Specialist", 42000.00,);
INSERT INTO employee (first_name, last_name, role_id)
VALUES
  ("Carol", "Kirklin", 1),
  ("Curtist", "Rollins", 2),
  ("Charles", "Goings", 3),
  ("Willard", "Watson", 4),
  ("Tammy", "Marshall", 5),
  ("Clement", "Fox", 6),
  ("Jeramy", "Smitherman", 7);