var translator = require('./lib/American-British-English-Translator');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const stripper = require('string-strip-html');

const fileName = process.argv[2];

try {
	if (fs.existsSync(fileName)) {
		translateCSV(fileName);
	}
} catch(err) {
	console.error(err)
}

function translateCSV(file) {
	fs.createReadStream(path.resolve(__dirname, file))
	.pipe(csv.parse({ headers: true }))
	.pipe(csv.format({ headers: true }))
	.transform((row, next) => {

		let translatedWords = row.word_from;
		let translations = translateWords(stripper.stripHtml(row.word_from).result);

		if ( false !== translations ) {
			for (let property in translations) {
				for ( let word in translations[property][0] ) {
					translatedWords = translatedWords.replaceAll(word, translations[property][0][word].details);
				}
			};
		}

		row.word_to = translatedWords;

		return next(null, row);
	})
	.pipe(fs.createWriteStream(path.resolve(__dirname, file.replace('.csv', '-translated.csv'))))
	.on('end', () => process.exit());

}

function translateWords(words) {

	var options = {
	  spelling: true
	};

	let translations = translator.translate(words, options);

	if (translations
		&& Object.keys(translations).length > 0
		&& Object.getPrototypeOf(translations) === Object.prototype) {

		return translations;
	}

	return false;
}
