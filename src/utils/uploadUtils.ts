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

  const rows = data.slice(1);

  const links = rows.map(row => {
    const originalUrl = row[0];
    if (!originalUrl) {
      throw new ValidationError('originalUrl is required');
    }

    return {
      originalUrl,
      prefix: row[1] || null,
      suffix: row[2] || null,
      linkTag1: row[3] || null,
      linkTag2: row[4] || null,
      linkTag3: row[5] || null,
      linkTag4: row[6] || null,
      linkTag5: row[7] || null,
    };
  });

  return links;
};
