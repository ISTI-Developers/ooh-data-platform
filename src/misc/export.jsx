import * as XLSX from "xlsx";

export function exportToExcel(results) {
  // Create a new array where we format the 'ideal view' field as a hyperlink
  const formattedResults = results.map((row) => {
    const newRow = { ...row };

    if (newRow["ideal_view"]) {
      const url = newRow["ideal_view"];

      // Format using Excel's HYPERLINK formula
      newRow["ideal_view"] =
        url.length > 255
          ? url
          : { f: `HYPERLINK("${url}", "Visit Ideal View")` };
    }

    newRow["price"] = parseInt(newRow["price"] ?? 0);

    return newRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedResults, {
    cellFormula: true,
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "results.xlsx");
}
