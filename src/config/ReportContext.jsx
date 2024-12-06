import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useService } from "./services";
import axios from "axios";
import { devEndpoints as url } from "./endpoints";
import Cookies from "js-cookie";
import unai from "../assets/unai.png";
import mockup from "../assets/mockup.png";
import bg from "../assets/deckbg-1.png";
import {
  BorderStyle,
  Document,
  Header,
  ImageRun,
  Packer,
  PageOrientation,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import PptxGenJS from "pptxgenjs";
import { v4 } from "uuid";
import { useFunction } from "./functions";

const ReportContext = React.createContext();

export function useReport() {
  return useContext(ReportContext);
}

export function ReportProvider({ children }) {
  const { retrieveSites, retrieveAdditionalSiteDetails } = useService();
  const { capitalizeFirst } = useFunction();
  const [sites, setSites] = useState(null);
  const [reports, setReports] = useState([]);
  const [priceDetails, setPriceDetails] = useState([]);
  const [rates, setRates] = useState([
    { duration: 3, discount: 0, type: "flat" },
    { duration: 6, discount: 0, type: "flat" },
    { duration: 12, discount: 0, type: "flat" },
  ]);
  const [charts, setChart] = useState([]);
  const [show, toggleModal] = useState(null);
  const [showRates, setShow] = useState(false);
  const [selectedLandmarks, setLandmarks] = useState([]);
  const [filters, setFilters] = useState({
    area: [],
    landmarks: [],
    price: {
      from: 0,
      to: 0,
    },
  });

  const margin = 0.4;
  const invisibleBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

  const fetchReport = async (id, from, to) => {
    try {
      const response = await axios.get(url.sites, {
        params: {
          id: id,
          from: from,
          to: to,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (response.data) {
        return response.data;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addReport = (site) => {
    setReports((prev) => [...prev, { site: site, images: [] }]);
  };

  const addPriceAdjustment = () => {
    setPriceDetails((prev) => [...prev, { id: v4(), price: 0, sites: [] }]);
  };
  const addImages = (siteCode, image) => {
    setReports((prevReports) => {
      const updatedReports = prevReports.map((report) => {
        if (report.site.unis_code === siteCode) {
          // Return the updated report with the new images array
          return {
            ...report,
            images: image,
          };
        }

        // If the report doesn't match the siteCode, return it unchanged
        return report;
      });

      return updatedReports;
    });
  };
  const addMapImage = (siteCode, image) => {
    setReports((prevReports) => {
      const updatedReports = prevReports.map((report) => {
        if (report.site.unis_code === siteCode) {
          // Return the updated report with the new images array
          return {
            ...report,
            map: image,
          };
        }

        // If the report doesn't match the siteCode, return it unchanged
        return report;
      });

      return updatedReports;
    });
  };

  const addChart = (site, title, canvas) => {
    setChart((prev) => {
      const temp = [...prev];
      const itemIndex = temp.findIndex((t) => t.site === site);

      if (itemIndex === -1) {
        // If site entry doesn't exist, create a new entry
        const newItem = {
          site: site,
          charts: {
            daily: null,
            weekly: null,
            monthly: null,
          },
        };
        newItem.charts[title] = canvas; // Add canvas to the specified title key
        temp.push(newItem);
      } else {
        // If site entry exists, update the existing entry
        temp[itemIndex].charts[title] = canvas; // Add canvas to the specified title key
      }

      return temp;
    });
  };

  const updateReport = (index, newData) => {
    setReports((items) => {
      const temp = [...items];
      temp[index] = newData;

      return temp;
    });
  };
  const updateChart = (index, newChart) => {
    setChart((items) => {
      const temp = [...items];
      temp[index] = newChart;

      return temp;
    });
  };
  const clearSite = (index) => {
    const tempReports = [...reports];
    const newReports = tempReports.find((_, i) => i === index);
    newReports.site = null;

    setReports(tempReports);
  };
  const removeReport = (code) => {
    setReports((prev) => {
      return prev.filter((report) => report.site.unis_code !== code);
    });
    setPriceDetails((prev) => {
      return prev.filter((report) => report.site !== code);
    });
  };

  const removeChart = (index) => {
    setChart((current) => {
      return current.filter((_, i) => i !== index);
    });
  };

  const generateReport = (
    pdf,
    title,
    site,
    address,
    client,
    impressionDetails,
    columns,
    weeklyImpressions,
    currentChart
  ) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    // const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${title} Impressions`, 15, 15);
    pdf.addImage(unai, "PNG", pageWidth - 15 - 28, 8, 28, 8);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.text(`Site: ${site}`, 15, 24);
    pdf.text(address, pageWidth - 15 - pdf.getTextWidth(address), 24);
    if (client.length > 0) {
      pdf.text(
        `Client: ${client}`,
        pageWidth - 15 - pdf.getTextWidth(`Client: ${client}`),
        30
      );
    }
    pdf.text(impressionDetails, 15, 30);
    pdf.line(15, 33, pageWidth - 15, 33);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Weekly Impressions Breakdown`, 15, 42);
    pdf.autoTable({
      startY: 48, // Starting Y position for the table
      head: [columns.map((col) => col.title)], // Table headers
      body: weeklyImpressions, // Table data
      theme: "grid", // Optional: style the table
      headStyles: { fillColor: [0, 57, 107] }, // Optional: custom header styles
      margin: { top: 10 },
      styles: {
        cellPadding: 2,
        fontSize: 10,
        halign: "center",
        valign: "middle",
      },
      didDrawPage: function (data) {
        // Calculate the position for the next content
        const tableEndY = data.cursor.y + 10;
        pdf.setFont("helvetica", "bold");
        pdf.text("Charts", 15, tableEndY);
        pdf.setFont("helvetica", "normal");
        pdf.addImage(currentChart[0], "PNG", 15, tableEndY + 2, 100, 80);
        pdf.addImage(currentChart[1], "PNG", 15, tableEndY + 82, 100, 80);
        pdf.addImage(currentChart[2], "PNG", 15, tableEndY + 164, 100, 80);
        // pdf.text(`Source:`, 15, 42);
      },
    });

    return pdf;
  };

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
        Cell(items[1], 25, false, "start"),
      ],
    });
  };

  const onPrint = async (siteCode, title = undefined) => {
    const currentReport = reports.find(
      (report) => report.site.unis_code === siteCode
    );

    const { site, images, map } = currentReport;

    const image = await loadImageAsBase64(unai).then((img) => img);
    const siteImages = await Promise.all(
      images.map(async (img) => {
        return await loadImageAsBase64(img.upload_path); // Return the base64 string directly
      })
    );

    const mapShot = await loadImageAsBase64(map);

    const siteLandmarks = selectedLandmarks.find(
      (landmark) => landmark.site === siteCode
    );

    const doc = new Document({
      description: `Site Report of ${site.unis_code}`,
      title: `${site.unis_code} Report`,
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
                width: `${18.49}cm`,
                height: `${27.94}cm`,
                orientation: PageOrientation.LANDSCAPE,
              },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  children: [
                    Text(`${site.unis_code} Specifications`, 14, true),
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
                  data: `${image}`,
                  transformation: {
                    width: 100, // Width of the image in pixels
                    height: 30, // Height of the image in pixels
                  },
                  floating: {
                    horizontalPosition: {
                      offset: 8180000,
                    },
                    verticalPosition: {
                      offset: 444000,
                    },
                  },
                }),
              ],
            }),
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              borders: {
                top: invisibleBorder,
                bottom: invisibleBorder,
                left: invisibleBorder,
                right: invisibleBorder,
                insideHorizontal: invisibleBorder,
                insideVertical: invisibleBorder,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: {
                        size: 50,
                        type: WidthType.PERCENTAGE,
                      },
                      children: [
                        ...siteImages.map((img) => {
                          return new Paragraph({
                            children: [
                              new ImageRun({
                                type: "jpg",
                                data: img,
                                transformation: {
                                  width: 415, // Width of the image in pixels
                                  height: 220, // Height of the image in pixels
                                },
                              }),
                            ],
                          });
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [Text(`Site Details`, 12, true)],
                          style: "defaultStyle",
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
                            top: invisibleBorder,
                            bottom: invisibleBorder,
                            left: invisibleBorder,
                            right: invisibleBorder,
                            insideHorizontal: invisibleBorder,
                            insideVertical: invisibleBorder,
                          },
                          rows: [
                            Row("Name: ", site.unis_code),
                            Row("Type: ", site.type),
                            Row("Size: ", site.size),
                            Row("Segments: ", site.segments),
                            Row(
                              "Price: ",
                              Intl.NumberFormat("en-PH", {
                                style: "currency",
                                currency: "PHP",
                              }).format(site.price)
                            ),
                            Row("City: ", site.city),
                            Row("Region: ", site.region),
                            Row("Address: ", site.address),
                            // Row("Best View: ", site.ideal_view),
                          ],
                        }),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Table({
                          width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                          },

                          rows: [
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        Text("Map Location", 12, true),
                                      ],
                                    }),
                                    new Paragraph({
                                      children: [
                                        new ImageRun({
                                          type: "jpg",
                                          data: mapShot,
                                          transformation: {
                                            width: 200, // Width of the image in pixels
                                            height: 200, // Height of the image in pixels
                                          },
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                new TableCell({
                                  width: {
                                    size: 50,
                                    type: "pct",
                                  },
                                  children: [
                                    new Paragraph({
                                      children: [
                                        Text("Nearby Landmarks", 12, true),
                                      ],
                                    }),
                                    ...siteLandmarks.landmarks.map((lm, i) => {
                                      return new Paragraph({
                                        children: [
                                          Text(
                                            `${i + 1}. ${lm.display_name}`,
                                            10
                                          ),
                                        ],
                                      });
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${title ?? siteCode}.docx`);
    });
  };

  const onGeneratePowerpoint = async () => {
    const pres = new PptxGenJS();
    pres.defineLayout({
      name: "Widescreen",
      width: 13.33,
      height: 7.5,
    });

    pres.layout = "Widescreen";
    reports.forEach((report) => {
      const slide = pres.addSlide();
      slide.background = { path: bg };

      const { site, images } = report;

      const landmarks = selectedLandmarks.find(
        (lm) => site.unis_code === lm.site
      );

      let price = parseFloat(site.price);

      const adjustedPrice = priceDetails.find((adj) =>
        adj.sites.some((s) => s.value === "all" || s.value === site.site)
      );

      if (adjustedPrice) {
        price = price + parseFloat(adjustedPrice.price);
      }

      slide.addText(capitalizeFirst(site.city_name), {
        w: 9,
        h: 0.4,
        x: margin - 0.1,
        y: margin * 1.7,
        fontFace: "Aptos",
        fontSize: 18,
      });
      slide.addText("AVAILABILTY: ", {
        w: 3,
        h: margin,
        x: 10,
        y: margin * 1.73,
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 11,
      });
      slide.addText("FEBRUARY 25, 2025", {
        w: 3.25,
        h: margin,
        x: 9.7,
        y: margin * 1.7,
        align: "right",
        color: "d22735",
        fontFace: "Century Gothic",
        bold: true,
        fontSize: 14,
      });

      slide.addImage({
        path: images[0]?.upload_path ?? mockup,
        x: margin,
        y: margin * 3,
        w: 9.21,
        h: 4.961,
      });

      slide.addImage({
        path: report.map,
        x: 9.81,
        y: margin * 3,
        w: 3.11,
        h: 3.11,
      });

      const mapPosition = margin * 2.3 + 3.11;
      const colWidth = 1.61;

      slide.addText("Google Map Link", {
        hyperlink: {
          url: site.ideal_view,
        },
        w: 3.11,
        h: 0.287,
        x: 9.81,
        y: mapPosition,
        align: "center",
        color: "25589D",
        fontFace: "Aptos",
        fontSize: 11,
        isTextBox: true,
        fill: "F2F2F2",
      });
      slide.addText("SITE CODE:", {
        w: colWidth,
        h: 0.236,
        x: 9.7,
        y: mapPosition + 0.3,
        align: "left",
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 8,
      });
      slide.addText(site.unis_code, {
        w: colWidth * 1.1,
        h: 0.251,
        x: 9.7,
        y: mapPosition + 0.45,
        align: "left",
        color: "1E2C3C",
        bold: true,
        fontFace: "Century Gothic",
        fontSize: 10,
      });

      slide.addText("SIZE:", {
        w: colWidth,
        h: 0.236,
        x: 9.7 + colWidth,
        y: mapPosition + 0.3,
        align: "left",
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 8,
      });
      slide.addText(site.size, {
        w: colWidth * 1.1,
        h: 0.251,
        x: 9.7 + colWidth,
        y: mapPosition + 0.45,
        align: "left",
        color: "1E2C3C",
        bold: true,
        fontFace: "Century Gothic",
        fontSize: 10,
      });

      slide.addText("FACING:", {
        w: colWidth,
        h: 0.236,
        x: 9.7,
        y: mapPosition + 0.3 + 0.35,
        align: "left",
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 8,
      });
      slide.addText(capitalizeFirst(site.facing), {
        w: colWidth * 2,
        h: 0.251,
        x: 9.7,
        y: mapPosition + 0.45 + 0.35,
        align: "left",
        color: "1E2C3C",
        bold: true,
        fontFace: "Century Gothic",
        fontSize: 10,
      });
      slide.addText("BOUND:", {
        w: colWidth,
        h: 0.236,
        x: 9.7,
        y: mapPosition + 0.3 + 0.7,
        align: "left",
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 8,
      });
      slide.addText(capitalizeFirst(site.bound ?? "") || "N/A", {
        w: colWidth * 2,
        h: 0.251,
        x: 9.7,
        y: mapPosition + 0.45 + 0.7,
        align: "left",
        color: "1E2C3C",
        bold: true,
        fontFace: "Century Gothic",
        fontSize: 10,
      });
      slide.addText("TRAFFIC COUNT:", {
        w: colWidth,
        h: 0.236,
        x: 9.7,
        y: mapPosition + 0.3 + 1.05,
        align: "left",
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 8,
      });
      slide.addText(site.traffic_count || "N/A", {
        w: colWidth * 2,
        h: 0.251,
        x: 9.7,
        y: mapPosition + 0.45 + 1.05,
        align: "left",
        color: "1E2C3C",
        bold: true,
        fontFace: "Century Gothic",
        fontSize: 10,
      });
      slide.addText("POPULATION:", {
        w: colWidth,
        h: 0.236,
        x: 9.7,
        y: mapPosition + 0.3 + 1.4,
        align: "left",
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 8,
      });
      slide.addText(site.vicinity_population || "N/A", {
        w: colWidth * 2,
        h: 0.251,
        x: 9.7,
        y: mapPosition + 0.45 + 1.4,
        align: "left",
        color: "1E2C3C",
        bold: true,
        fontFace: "Century Gothic",
        fontSize: 10,
      });
      slide.addText("ADDRESS:", {
        w: colWidth,
        h: 0.236,
        x: 0.3,
        y: 6.15,
        align: "left",
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 8,
      });
      slide.addText(capitalizeFirst(site.address), {
        w: 9.5,
        h: 0.251,
        x: 0.3,
        y: 6.34,
        align: "left",
        color: "1E2C3C",
        bold: true,
        fontFace: "Century Gothic",
        fontSize: 9,
      });
      slide.addText("LANDMARKS:", {
        w: colWidth,
        h: 0.236,
        x: 0.3,
        y: 6.6,
        align: "left",
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 8,
      });
      if (landmarks) {
        const { landmarks: lm } = landmarks;
        const landmarkArray = lm.map((lm) => lm.display_name);
        if (landmarkArray.length > 0) {
          slide.addText(landmarkArray.join(" | "), {
            w: 9,
            h: 0.251,
            x: 0.3,
            y: 6.75,
            align: "left",
            color: "1E2C3C",
            fontFace: "Century Gothic",
            bold: true,
            fontSize: 9,
          });
        }
      }

      if (showRates && rates.some((rate) => rate.discount !== 0)) {
        const rateRows = rates.map((rate) => {
          const { duration, discount, type } = rate;

          const less = type === "percent" ? discount / 100 : discount;
          const finalPrice =
            type === "flat" ? price - less : price - price * less;

          return [
            {
              text: `${duration} Months`,
              options: {
                align: "center",
                fontFace: "Aptos",
                fontSize: 10,
                fill: "FFFFFF",
                color: "1E2C3C",
              },
            },
            {
              text: `${Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(finalPrice)} + VAT`,
              options: {
                align: "center",
                fontFace: "Century Gothic",
                fontSize: 10,
                fill: "FFFFFF",
                color: "1E2C3C",
              },
            },
          ];
        });
        const rows = [
          [
            {
              text: "DURATION",
              options: {
                align: "center",
                fontFace: "Aptos",
                bold: true,
                fontSize: 11,
                fill: "F2F2F2",
                color: "25589D",
              },
            },
            {
              text: "RATE/MONTH",
              options: {
                align: "center",
                fontFace: "Aptos",
                bold: true,
                fontSize: 11,
                fill: "F2F2F2",
                color: "25589D",
              },
            },
          ],
          ...rateRows,
        ];

        slide.addTable(rows, {
          w: 3.11,
          h: 1.08,
          x: 9.81,
          y: 6.2,
          rowH: 0.27,
          border: { color: "F2F2F2", pt: 1 },
        });
      } else {
        slide.addText("PRICE", {
          w: colWidth * 2,
          h: 0.236,
          x: 9.7,
          y: 6.85,
          align: "center",
          color: "76899E",
          bold: true,
          fontFace: "Aptos",
          fontSize: 12,
        });
        slide.addText(
          Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(price),
          {
            w: colWidth * 2,
            h: 0.5,
            x: 9.7,
            y: 6.375,
            align: "center",
            color: "1E2C3C",
            bold: true,
            fontFace: "Century Gothic",
            fontSize: 28,
          }
        );
      }
    });

    pres.writeFile({ fileName: "Sales Billboard Deck" });
  };

  useEffect(() => {
    const setup = async () => {
      const results = await retrieveSites();
      const additionalSiteDetails = await retrieveAdditionalSiteDetails();

      if (results && additionalSiteDetails) {
        const sitesWithAddedDetails = results.map((item) => {
          const structure = additionalSiteDetails.filter((s) =>
            item.unis_code.includes(s.structure_code)
          );
          if (structure.length > 0) {
            const segment = structure.find(
              (s) => s.site_code === item.unis_code
            );
            // console.log(segment);
            if (segment) {
              return {
                ...item,
                ...segment,
              };
            } else {
              return {
                ...item,
                ...structure[0],
              };
            }
          }
        });
        setSites(sitesWithAddedDetails);
      }
      // setSites(results);
    };
    setup();
  }, [retrieveAdditionalSiteDetails, retrieveSites]);

  const values = {
    sites,
    reports,
    charts,
    addReport,
    clearSite,
    onPrint,
    updateReport,
    removeReport,
    addChart,
    addImages,
    addMapImage,
    updateChart,
    removeChart,
    show,
    toggleModal,
    generateReport,
    fetchReport,
    selectedLandmarks,
    filters,
    setFilters,
    setLandmarks,
    addPriceAdjustment,
    priceDetails,
    setPriceDetails,
    onGeneratePowerpoint,
    setRates,
    rates,
    showRates,
    setShow,
  };

  return (
    <ReportContext.Provider value={values}>{children}</ReportContext.Provider>
  );
}

ReportProvider.propTypes = {
  children: PropTypes.node,
};
