const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const mammoth = require('mammoth');

async function extractText(buffer, mimetype) {
  if (mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    return cleanText(data.text);
  }

  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    return cleanText(result.value);
  }

  if (mimetype === 'text/plain') {
    return cleanText(buffer.toString('utf-8'));
  }

  throw new Error(`Unsupported file type: ${mimetype}`);
}

function cleanText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

module.exports = { extractText };
