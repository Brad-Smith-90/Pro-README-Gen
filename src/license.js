// TODO: Create a function that returns a license badge based on which license is passed in
export function renderLicenseBadge(license) {
    if (!license || license === 'None') {
      return '';
    }

    const badges = {
        'MIT': '![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)',
        'GPLv2': '![License: GPL v2](https://img.shields.io/badge/License-GPLv2-blue.svg)',
        'Apache': '![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)',
        'BSD 3-Clause': '![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)'
      };
    
      return badges[license];
    }
    
    // Function to return the license link
    export function renderLicenseLink(license) {
      if (!license || license === 'None') {
        return '';
      }
    
      const links = {
        'MIT': 'https://opensource.org/licenses/MIT',
        'GPLv2': 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html',
        'Apache': 'https://opensource.org/licenses/Apache-2.0',
        'BSD 3-Clause': 'https://opensource.org/licenses/BSD-3-Clause'
      };
    
      return links[license];
    }
    
    // Function to return the license section of README
    export function renderLicenseSection(license) {
      if (!license || license === 'None') {
        return '';
      }
    
      return `## License
    
    This project is licensed under the ${license} license. For more information, see the [license documentation](${renderLicenseLink(license)}).
    `;
    }