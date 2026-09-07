import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName = "Bhasa_Word_Contributions.xlsx") => {
  // Data ko clean karke simple format mein convert karte hain
  const formattedData = data.map((item, index) => ({
    "S.No": index + 1,
    "Kokborok Word": item.word,
    "English Meaning": item.eng,
    "Hindi Meaning": item.hindi,
    "Bengali Meaning": item.bengali,
    "Submitted By": item.contributor || "Anonymous",
    "Submitted Date": item.time,
    "Status": item.status,
    "Votes": item.votes || 0
  }));

  // Worksheet aur Workbook create karein
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");

  // Excel File download trigger karein
  XLSX.writeFile(workbook, fileName);
};