import inquirer from 'inquirer';
import fs from 'fs';
import { generateMarkdown } from './markdown.js';

// Function to prompt user for information
async function promptUser() {
  const questions = [
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
    ];


let answers = await inquirer.prompt(questions);
let isConfirmed = false;

while (!isConfirmed) {
  console.log('\nReview your answers:');
  console.log(answers);
    

     // Ask if the answers are correct
    const { confirm } = await inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      message: 'Are these answers correct?',
    });

    if (confirm) {
      isConfirmed = true;
    } else {
      // Ask which answer they want to change
      const { keyToChange } = await inquirer.prompt({
        type: 'list',
        name: 'keyToChange',
        message: 'Which answer would you like to change?',
        choices: [...Object.keys(answers), 'None'],
      });

      
      if (keyToChange !== 'None') {
        const updatedAnswer = await inquirer.prompt(questions.find(q => q.name === keyToChange));
        answers[keyToChange] = updatedAnswer[keyToChange];
      } else {
        isConfirmed = true; // If the user selects 'None', exit the loop
      }
    }
  }

  return answers;
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