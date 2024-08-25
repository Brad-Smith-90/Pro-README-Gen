import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import colors from 'colors';
import { generateMarkdown } from './markdown.js';


// Function to create a colored version of the color names for the prompt
function getColorChoices() {
  return [
    colors.brightGreen('brightgreen'),
    colors.green('green'),
    colors.yellow('yellow'),
    colors.green('yellowgreen'),
    colors.red('orange'),
    colors.red('red'),
    colors.blue('blue'),
    colors.grey('lightgrey'),
    colors.yellow('gold'),
    colors.magenta('magenta'),
    colors.magenta('pink'),
    colors.cyan('lightblue'),
    colors.magenta('purple'),
    colors.cyan('cyan'),
    colors.grey('grey'),
    colors.black('black'),
    colors.red('important'),
    'Cancel'
  ];
}

 // Function to extract the color name from a colored text
function extractColorName(coloredText) {
  return coloredText.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, '');
}

// Function to prompt user for custom badges
function promptForBadges(badges = [], callback) {
  const colorChoices = getColorChoices();
  const styleChoices = [
    'plastic',
    'flat',
    'flat-square',
    'for-the-badge',
    'social'
  ];

  inquirer.prompt([
    {
      type: 'confirm',
      name: 'addBadge',
      message: colors.bold.yellow('Would you like to add a custom badge?'),
      default: false,
    },
  ]).then(({ addBadge }) => {
    if (addBadge) {
      console.log(colors.bold.red('\nNote: Some prompt colors may not exactly represent the chosen color.\nFor example, "orange" is displayed as red in the prompt, but the actual badge color will be orange.\n'));

      inquirer.prompt([
        {
          type: 'input',
          name: 'label',
          message: colors.bold.green('Enter the badge label:'),
        },
        {
          type: 'input',
          name: 'message',
          message: colors.bold.blue('Enter the badge message:'),
        },
        {
          type: 'list',
          name: 'color',
          message: colors.bold.magenta('Choose the badge background color:'),
          choices: colorChoices,
        },
        {
          type: 'list',
          name: 'labelColor',
          message: colors.bold.cyan('Choose the badge label (text) color:'),
          choices: colorChoices,
          default: 'white',
        },
        {
          type: 'list',
          name: 'style',
          message: colors.bold.yellow('Choose the badge shape:'),
          choices: styleChoices,
          default: 'flat',
        },
      ]).then(({ label, message, color, labelColor, style }) => {
        // Extract the raw color names for the badge URL
        const rawColor = extractColorName(color);
        const rawLabelColor = extractColorName(labelColor);

        if (rawColor !== 'Cancel' && rawLabelColor !== 'Cancel') {
          const badge = `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${encodeURIComponent(rawColor)}.svg?labelColor=${encodeURIComponent(rawLabelColor)}&style=${style})`;
          badges.push(badge);
        }
        promptForBadges(badges, callback); // Recursively prompt for more badges
      });
    } else {
      callback(badges); // No more badges, continue with the rest of the prompts
    }
  });
}

// Function to prompt user for information
async function promptUser() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: colors.bold.green("What's the title of your project?"),
    },
    {
      type: 'input',
      name: 'description',
      message: colors.bold.blue('Provide a description of your project:'),
    },
    {
      type: 'input',
      name: 'installation',
      message: colors.bold.yellow('How do you install your project?'),
    },
    {
      type: 'input',
      name: 'usage',
      message: colors.bold.cyan('Provide instructions and examples for use:'),
    },
    {
      type: 'input',
      name: 'contributing',
      message: colors.bold.magenta('Provide guidelines on how others can contribute to your project:'),
    },
    {
      type: 'input',
      name: 'tests',
      message: colors.bold.red('Provide examples on how to run tests for your project:'),
    },
    {
      type: 'list',
      name: 'license',
      message: colors.bold.white('Choose a license for your project:'),
      choices: ['MIT', 'GPLv2', 'Apache', 'BSD 3-Clause', 'None'],
    },
    {
      type: 'input',
      name: 'github',
      message: colors.bold.green('Enter your GitHub username:'),
    },
    {
      type: 'input',
      name: 'email',
      message: colors.bold.yellow('Enter your email address:'),
    },
    {
      type: 'input',
      name: 'filename',
      message: colors.bold.blue('Enter the filename for the generated README (default: README.md):'),
      default: 'README.md',
    },
  ]);
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
    promptForBadges([], async (badges) => {
      const answers = await promptUser();
      answers.badges = badges; // Include badges in the answers
      const markdown = generateMarkdown(answers);
      writeToFile(answers.filename, markdown);
    });
  } catch (err) {
    console.error(colors.bold.red('Error! Unable to generate README.'), err);
  }
}

init();
