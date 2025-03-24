import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useReport } from "~config/ReportContext";
import { defaultTextTheme, mainButtonTheme } from "~config/themes";
import { format } from "date-fns";
import "jspdf-autotable";
import { AiOutlineLoading } from "react-icons/ai";
import jsPDF from "jspdf";
import unai from "../../assets/unai.png";
import mockup from "../../assets/mockup.png";
import {
  BorderStyle,
  Document,
  Header,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import { useCampaigns } from "~config/Campaigns";

export default function ReportModal() {
  const { show, toggleModal, reports, charts, generateReport } = useCampaigns();
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [currentChart, setCurrentChart] = useState([]);
  const [dates, setDates] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [currentReport, setCurrentReport] = useState(null);
  const invisibleBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

  useEffect(() => {
    const tempReport = reports[show];
    console.log(charts)
    if (show !== null && tempReport) {
      setCurrentChart(Object.values(charts[show].charts));

      setCurrentReport(tempReport);
      setTitle(tempReport.site.site);
      setDates(tempReport.details.dates);
    }
  }, [charts, reports, show]);

  const loadImageAsBase64 = async (filePath) => {
    const response = await fetch(filePath);
    const blob = await response.blob();
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onloadend = () => res(reader.result.split(",")[1]);
      reader.onerror = rej;
      reader.readAsDataURL(blob);
    });
  };

  const Text = (text, size, bold = false, color = "#000000") => {
    return new TextRun({
      text: text,
      font: "Aptos",
      size: `${size}pt`,
      bold: bold,
      color: color,
    });
  };

  const Cell = (label, size = 15, bold = false, alignment = "end") => {
    return new TableCell({
      width: { size: size, type: WidthType.PERCENTAGE },
      children: [
        new Paragraph({
          children: [Text(label, 10, bold)],
          alignment: alignment,
        }),
      ],
      margins: {
        top: 25,
        bottom: 25,
        left: alignment === "end" && bold ? 50 : 25,
        right: alignment === "end" && !bold ? 50 : 25,
      },
      verticalAlign: VerticalAlign.TOP,
    });
  };

  const Row = (...items) => {
    return new TableRow({
      children: [
        Cell(items[0], 10, true, "start"),
        Cell(items[1], 25),
        Cell(items[2], 10, true, "start"),
        Cell(items[3], 55),
      ],
    });
  };

  // const onPrint = () => {
  //   const weeklyImpressions = currentReport.details.entries.weekly.map(
  //     (item) => {
  //       return [item.period, item.impressions.toLocaleString()];
  //     }
  //   );
  //   const columns = [
  //     { title: "Week", dataKey: "period" },
  //     { title: "Impressions", dataKey: "impressions" },
  //   ];
  //   const impressionDetails = `Impressions Period: ${format(
  //     new Date(dates.from),
  //     "MMMM d, yyyy"
  //   )} - ${format(new Date(dates.to), "MMMM d, yyyy")}`;
  //   const address = `Address: ${currentReport.site.city}, ${currentReport.site.region}`;
  //   const site = currentReport.site.site;
  //   let pdf = new jsPDF("p", "mm", "legal");

  //   pdf = generateReport(
  //     pdf,
  //     title,
  //     site,
  //     address,
  //     client,
  //     impressionDetails,
  //     columns,
  //     weeklyImpressions,
  //     currentChart
  //   );
  //   pdf.save(`${title}.pdf`);
  // };
  const onPrint = async () => {
    if (!currentReport) return;
    console.log(currentReport)
    const { site, details } = currentReport;

    const image = await loadImageAsBase64(unai).then((img) => img);
    const siteImage = await loadImageAsBase64(mockup).then((img) => img);
    console.log(siteImage);
    const doc = new Document({
      description: `Site Report of ${site.site_code}`,
      title: `${site.site_code} Report`,
      styles: {
        paragraphStyles: [
          {
            id: "defaultStyle",
            name: "Default Style",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            paragraph: {
              spacing: {
                before: 50, // 200 twips space before paragraph
                after: 50, // 200 twips space after paragraph
              },
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              size: {
                width: `${21.59}cm`,
                height: `${35.56}cm`,
              },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  children: [
                    Text(`${site.site_code} Specifications`, 14, true),
                  ],
                }),
              ],
            }),
          },
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  type: "png",
                  data: `data:image/png;base64,${image}`,
                  transformation: {
                    width: 100, // Width of the image in pixels
                    height: 30, // Height of the image in pixels
                  },
                  floating: {
                    horizontalPosition: {
                      offset: 5704400,
                    },
                    verticalPosition: {
                      offset: 454400,
                    },
                  },
                }),
                Text(`Site Details`, 12, true),
              ],
              style: "defaultStyle",
            }),
            new Paragraph({
              children: [
                new ImageRun({
                  type: "jpg",
                  data: siteImage,
                  transformation: {
                    width: 350, // Width of the image in pixels
                    height: 200, // Height of the image in pixels
                  },
                }),
              ],
            }),
            new Paragraph({
              children: [Text(``, 12, true)],
            }),
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              borders: {
                left: invisibleBorder,
                right: invisibleBorder,
                insideHorizontal: invisibleBorder,
                insideVertical: invisibleBorder,
              },
              rows: [
                Row(
                  "Name: ",
                  site.site_code,
                  "Price: ",
                  Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(site.price)
                ),
                Row("Type: ", site.type, "City: ", site.city),
                Row("Size: ", site.size, "Region: ", site.region),
                Row("Segments: ", site.segments, "Address: ", site.address),
              ],
            }),
            new Paragraph({
              children: [Text(`Site Impressions`, 12, true)],
              spacing: {
                before: 200,
                after: 150,
              },
            }),
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          children: [Text("Week", 10, false, "#FFFFFF")],
                          alignment: "center",
                        }),
                      ],
                      shading: {
                        fill: "0474ae",
                      },
                    }),
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          children: [Text("Impressions", 10, false, "#FFFFFF")],
                          alignment: "center",
                        }),
                      ],
                      shading: {
                        fill: "0474ae",
                      },
                    }),
                  ],
                }),
                ...details.entries.weekly.map((item) => {
                  return new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [Text(item.period, 10)],
                            alignment: "center",
                          }),
                        ],
                        margins: {
                          top: 30,
                          bottom: 30,
                          left: 30,
                          right: 30,
                        },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              Text(
                                Intl.NumberFormat("en-PH", {
                                  style: "decimal",
                                  maximumFractionDigits: 0,
                                }).format(item.impressions),
                                10
                              ),
                            ],
                            alignment: "center",
                          }),
                        ],
                        margins: {
                          top: 30,
                          bottom: 30,
                          left: 30,
                          right: 30,
                        },
                      }),
                    ],
                  });
                }),
              ],
            }),
            new Paragraph({
              children: [Text("Charts", 10, true)],
              spacing: {
                before: 200,
                after: 150,
              },
            }),
            new Paragraph({
              children: [
                ...currentChart.map((chart) => {
                  return new ImageRun({
                    type: "png",
                    data: chart,
                    transformation: {
                      width: 300, // Width of the image in pixels
                      height: 225, // Height of the image in pixels
                    },
                  });
                }),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${title}.docx`);
    });
  };
  if (show !== null && show !== "all") {
    return (
      <Modal show={show !== null} dismissible onClose={() => toggleModal(null)}>
        <Modal.Header>
          Print {reports[show]?.site.site} Impressions
        </Modal.Header>
        <Modal.Body>
          {show !== null && (
            <>
              <form className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="title" value="Title" required />
                  <TextInput
                    id="title"
                    value={title}
                    theme={defaultTextTheme}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="client" value="Client Name" />
                  <TextInput
                    id="client"
                    value={client}
                    theme={defaultTextTheme}
                    placeholder="optional"
                    onChange={(e) => setClient(e.target.value)}
                  />
                </div>
              </form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            color="warning"
            processingSpinner={
              <AiOutlineLoading className="h-6 w-6 animate-spin" />
            }
            theme={mainButtonTheme}
            className="bg-[#ec9912] w-[150px] ml-auto"
            onClick={onPrint}
          >
            Export
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
