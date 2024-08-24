
// markdown.js

import { renderLicenseBadge, renderLicenseSection } from './license.js';

// Function to generate markdown for README
export function generateMarkdown(data) {
  return `# ${data.title}

${renderLicenseBadge(data.license)}

## Description
${data.description}

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Installation
\`\`\`
${data.installation}
\`\`\`

## Usage
${data.usage}

${renderLicenseSection(data.license)}

## Contributing
${data.contributing}

## Tests
\`\`\`
${data.tests}
\`\`\` 

## Questions
If you have any questions about the project, feel free to reach out:
- Github:[${data.github}](https://github.com/${data.github})
- Email: ${data.email}

`;
}
