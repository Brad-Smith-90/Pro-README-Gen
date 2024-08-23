import inquirer from 'inquirer';
import fs from 'fs';
import { generateMarkdown } from './markdown.js';

// Function to prompt user for information
async function promptUser() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: "What's the title of your project?"
    },
    {
      type: 'input',
      name: 'description',
      message: 'Provide a description of your project:'
    },
    {
        type: 'input',
        name: 'description',
        message: 'Provide a description of your project:'
      },
      {
        type: 'input',
        name: 'installation',
        message: 'How do you install your project?'
      },
      {
        type: 'input',
        name: 'usage',
        message: 'Provide instructions and examples for use:'
      },
      {
        type: 'input',
        name: 'contributing',
        message: 'Provide guidelines on how others can contribute to your project:'
      },
      {
        type: 'input',
        name: 'tests',
        message: 'Provide examples on how to run tests for your project:'
      },
      {
        type: 'list',
        name: 'license',
        message: 'Choose a license for your project:',
        choices: ['MIT', 'GPLv2', 'Apache', 'BSD 3-Clause', 'None']
      },
      {
        type: 'input',
        name: 'github',
        message: 'Enter your GitHub username:'
      },
      {
        type: 'input',
        name: 'email',
        message: 'Enter your email address:'
      }
    ]);
}


 function writeToFile(fileName, data) {
    fs.writeFileSync(fileName, data);
  }









async function init() {
  try {
    const answers = await promptUser();
    const markdown = generateMarkdown(answers);
    writeToFile('README.md', markdown);
    console.log('Generate README.md...Success!');
  } catch (err) {
    console.error('Error! Unable to generate README.md.');
  }
}

init();