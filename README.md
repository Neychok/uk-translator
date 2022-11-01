# US to UK translator for Weglot
This is a simple script that takes an export from Weglot, runs it through a dictionary, and outputs a new file with the translations.

>  **This package requires Node 18 +**

## Installation
1. Clone the repo
2. Run `npm install`

## How to use
1. Export your translations from Weglot in the same directory as the script.
2. Run the script with the following command: `npm start <path to export file>`.
3. The script will output a new file called `<name of export>-translated.csv`.
4. Import the new file into Weglot.