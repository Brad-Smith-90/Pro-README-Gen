import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import colors from 'colors';
import { generateMarkdown } from './markdown.js';

// Function to extract the color name from a colored text
function extractColorName(coloredText) {
  return coloredText.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, '');
}

// Function to create a colored version of the color names for the prompt
function getColorChoices() {
  return [
    colors.brightGreen('brightgreen'),
    colors.green('green'),
    colors.green('yellowgreen'),
    colors.yellow('yellow'),
    colors.yellow('gold'),
    colors.red('orange'),
    colors.red('red'),
    colors.cyan('cyan'),
    colors.blue('blue'),
    colors.magenta('magenta'),
    colors.magenta('purple'),
    colors.grey('lightgrey'),
    colors.grey('grey'),
    colors.black('black'),
    'Go Back',
    'Cancel'
  ];
}

// Function to prompt user for custom badges
async function promptForBadges(badges = [], callback) {
  const colorChoices = getColorChoices();
  const styleChoices = [
    'rounded',
    'flat-rounded',
    'flat-square',
    'flat-square-lg',
    'social',
    'Go Back',
    'Cancel'
  ];

  const { addBadge } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addBadge',
      message: colors.bold.yellow('Would you like to add a custom badge?'),
      default: false,
    },
  ]);

  if (addBadge) {
    console.log(colors.bold.blue('\nNote: Some prompt colors may not exactly represent the chosen color.\nFor example, "orange" is displayed as red in the prompt, but the actual badge color will be orange.\n'));

    const badgeResponses = await inquirer.prompt([
      {
        type: 'input',
        name: 'label',
        message: colors.bold.green('Enter the badge label:'),
      },
      {
        type: 'input',
        name: 'message',
        message: colors.bold.yellow('Enter the badge message:'),
      },
      {
        type: 'list',
        name: 'color',
        message: colors.bold.green('Choose the badge background color:'),
        choices: colorChoices,
      },
      {
        type: 'list',
        name: 'labelColor',
        message: colors.bold.yellow('Choose the badge label color:'),
        choices: colorChoices,
        default: 'white',
      },
      {
        type: 'list',
        name: 'style',
        message: colors.bold.green('Choose the badge shape:'),
        choices: styleChoices,
        default: 'flat',
      },
    ]);

    // Handle "Go Back" or "Cancel" option for each badge response
    for (const [key, value] of Object.entries(badgeResponses)) {
      if (value === 'Go Back') {
        return promptForBadges(badges, callback); // Restart the badge prompt.
      } else if (value === 'Cancel') {
        console.log(colors.bold.red('Badge creation canceled.'));
        return callback(badges); // Exit the badge creation.
      }
    }

    // If "Go Back" or "Cancel" is not selected, proceed with creating the badge
    const rawColor = extractColorName(badgeResponses.color);
    const rawLabelColor = extractColorName(badgeResponses.labelColor);

    const badge = `![${badgeResponses.label}](https://img.shields.io/badge/${encodeURIComponent(badgeResponses.label)}-${encodeURIComponent(badgeResponses.message)}-${encodeURIComponent(rawColor)}.svg?labelColor=${encodeURIComponent(rawLabelColor)}&style=${badgeResponses.style})`;
    badges.push(badge);

    return promptForBadges(badges, callback); // Recursively prompt for more badges
  } else {
    return callback(badges);
  }
}

// Function to prompt user for information
async function promptUser() {
  const questions = [
    {
      type: 'input',
      name: 'title',
      message: colors.bold.yellow("What's the title of your project? (or type 'Cancel' to exit)"),
    },
    {
      type: 'input',
      name: 'description',
      message: colors.bold.green('Provide a description of your project: (or type "Cancel" to exit)'),
    },
    {
      type: 'input',
      name: 'installation',
      message: colors.bold.yellow('How do you install your project? (or type "Cancel" to exit)'),
    },
    {
      type: 'input',
      name: 'usage',
      message: colors.bold.green('Provide instructions and examples for use: (or type "Cancel" to exit)'),
    },
    {
      type: 'input',
      name: 'contributing',
      message: colors.bold.yellow('Provide guidelines on how others can contribute to your project: (or type "Cancel" to exit)'),
    },
    {
      type: 'input',
      name: 'tests',
      message: colors.bold.green('Provide examples on how to run tests for your project: (or type "Cancel" to exit)'),
    },
    {
      type: 'list',
      name: 'license',
      message: colors.bold.yellow('Choose a license for your project: (or type "Cancel" to exit)'),
      choices: [
        'MIT',
        'GPLv2',
        'Apache',
        'BSD 3-Clause',
        'None',
        'Cancel'  // If the user wants to cancel the process
      ],
      filter: (input) => extractColorName(input),
    },
  ];

  let answers = {};
  for (let question of questions) {
    const answer = await inquirer.prompt(question);
    if (Object.values(answer)[0] === 'Cancel') {
      console.log(colors.bold.red('Process canceled by the user.'));
      process.exit(0); // Exit the process
    }
    Object.assign(answers, answer);
  }

  // Prompt for custom badges after license selection
  await promptForBadges([], (badges) => {
    answers.badges = badges;
  });

  // Resume with GitHub and other details
  const githubQuestions = [
    {
      type: 'input',
      name: 'github',
      message: colors.bold.yellow('Enter your GitHub username: (or type "Cancel" to exit)'),
    },
    {
      type: 'input',
      name: 'email',
      message: colors.bold.green('Enter your email address: (or type "Cancel" to exit)'),
    },
    {
      type: 'input',
      name: 'filename',
      message: colors.bold.yellow('Enter the filename for the generated README (default: README.md): (or type "Cancel" to exit)'),
      default: 'README.md',
    }
  ];

  for (let question of githubQuestions) {
    const answer = await inquirer.prompt(question);
    if (Object.values(answer)[0] === 'Cancel') {
      console.log(colors.bold.red('Process canceled by the user.'));
      process.exit(0); // Exit the process
    }
    Object.assign(answers, answer);
  }

  return answers;
}

// Function to write README file
function writeToFile(fileName, data) {
  const targetDir = path.join(process.cwd(), 'Gen-README'); 
  const filePath = path.join(targetDir, fileName);
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true }); 
  }

  fs.writeFileSync(filePath, data, 'utf8');
  console.log(colors.bold.green(`Successfully generated ${filePath}`));
}

// Function to initialize the app
async function init() {
  try {
    const answers = await promptUser(); // First, prompt for the main information, including license and custom badges
    const markdown = generateMarkdown(answers);
    writeToFile(answers.filename, markdown);
  } catch (err) {
    console.error(colors.bold.red('Error! Unable to generate README.'), err);
  }
}

init();
