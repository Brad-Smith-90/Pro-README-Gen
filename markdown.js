// markdown.js
import { renderLicenseBadge, renderLicenseSection } from "./license.js";

// Function to generate markdown for README
export function generateMarkdown(data) {
  const badgeSection = data.badges.length > 0 ? data.badges.join(" ") : ""; // Join badges into a single string

  return `# ${data.title}

${badgeSection}  <!-- Add the badges to the top -->

${renderLicenseBadge(data.license)}



## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Description
${data.description}

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
- Github: [${data.github}](https://github.com/${data.github})
- Email: ${data.email}

`;
}
