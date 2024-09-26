import * as XLSX from 'xlsx';
import * as csv from 'csv-parse/sync';
import { BulkLinkData } from '../types/interfaces';
import ValidationError from '../errors/ValidationError';
import BadRequestError from '../errors/BadRequestError';

export const extractLinksFromFile = (
  fileBuffer: Buffer,
  fileName: string
): BulkLinkData[] => {
  let data: string[][];

  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  if (!fileExtension) {
    throw new BadRequestError('Unable to determine file extension');
  }

  if (fileExtension === 'xlsx' || fileExtension === 'xls') {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
  } else if (fileExtension === 'csv') {
    const csvData = fileBuffer.toString();
    data = csv.parse(csvData, { columns: false, skip_empty_lines: true });
  } else {
    throw new ValidationError('Unsupported file type');
  }

  const rows = data.slice(1); // Skip the header row

  const links: BulkLinkData[] = rows
    .filter(row => row[0]) // Filter out rows where originalUrl is missing
    .map(row => ({
      originalUrl: row[0],
      prefix: row[1] || null,
      suffix: row[2] || null,
      linkTag1: row[3] || null,
      linkTag2: row[4] || null,
      linkTag3: row[5] || null,
      linkTag4: row[6] || null,
      linkTag5: row[7] || null,
    }));

  if (links.length === 0) {
    throw new ValidationError('No valid links found in the file');
  }

  return links;
};
