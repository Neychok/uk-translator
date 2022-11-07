var translator = require('./lib/American-British-English-Translator');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const stripper = require('string-strip-html');

const fileName = process.argv[2];

try {
	if (fs.existsSync(fileName)) {
		console.log('Translating file: ' + fileName);
		translateCSV(fileName);
		console.log('Translation complete.');

	} else {
		console.log('File does not exist.');
		process.exit();
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
				translations[property].forEach(function(translation) {
					for ( let word in translation ) {
						console.log(word + ' => ' + translation[word].details);
						translatedWords = translatedWords.replaceAll(word, translation[word].details);
					}
				});
				
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
	  spelling: true,
	  american: true
	};

	let translations = translator.translate(words, options);

	if (translations
		&& Object.keys(translations).length > 0
		&& Object.getPrototypeOf(translations) === Object.prototype) {

		return translations;
	}

	return false;
}
