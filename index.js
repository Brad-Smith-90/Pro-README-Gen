import inquirer from 'inquirer';


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
    }
    ]);
}


async function init() {
  try {
    const answers = await promptUser();
    console.log(answers);
  } catch (err) {
    console.error(error);
  }
}

init();