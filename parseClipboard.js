function parseSingleColumnData(lines) {
  const integers = [];
  lines.forEach((line) => {
    const numbers = line.split(/[\t,;]/);
    numbers.forEach((number) => {
      const parsedNumber = parseInt(number, 10);
      if (!isNaN(parsedNumber)) {
        integers.push(parsedNumber);
      }
    });
  });
  return integers;
}

function parseTwoColumnData(lines) {
  const integers = [];
  const names = [];

  lines.forEach((line, index) => {
    const columns = line.split(/[\t,;]/);
    if (index === 0 && isNaN(parseFloat(columns[1]))) {
      // Skip header row
      return;
    }

    if (columns.length === 2) {
      const parsedNumber = parseInt(columns[1], 10);
      if (!isNaN(parsedNumber)) {
        names.push(columns[0]);
        integers.push(parsedNumber);
      }
    }
  });

  return { names, integers };
}

export function parseClipboardText(text) {
  const lines = text.split(/\r\n|\n|\r/);

  if (lines.length > 0) {
    const firstLineColumns = lines[0].split(/[\t,;]/);
    if (firstLineColumns.length === 2) {
      return parseTwoColumnData(lines);
    }
  }

  const integers = parseSingleColumnData(lines);
  return { names: [], integers };
}