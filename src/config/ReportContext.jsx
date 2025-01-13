import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useService } from "./services";
import axios from "axios";
import { devEndpoints as url } from "./endpoints";
import Cookies from "js-cookie";
import unai from "../assets/unai.png";
import mockup from "../assets/mockup.png";
import bg from "../assets/finalbg.png";
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

  const Inches = (number) => number / 2.54;

  function cropImageFromURL(imageURL, cropLeft, cropRight) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = function () {
        // Get original image dimensions
        const imgWidth = img.width;
        const imgHeight = img.height;

        // Calculate the new width after cropping the left and right sides
        const cropX = cropLeft; // Pixels to crop from the left side
        const cropWidth = imgWidth - cropLeft - cropRight; // New width after cropping both sides
        const cropHeight = imgHeight; // Keep the original height

        // Ensure valid cropping dimensions
        if (cropWidth <= 0) {
          reject(
            new Error("Crop dimensions result in zero or negative width.")
          );
          return;
        }

        // Create a canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set the canvas size to the new width and original height
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        // Draw the image onto the canvas, cropping the left and right sides
        ctx.drawImage(
          img,
          cropX,
          0,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );

        // Convert the cropped image to a Data URL
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL); // Resolve the Promise with the Data URL
      };

      img.onerror = function () {
        reject(new Error("Failed to load image."));
      };

      img.src = imageURL;
      img.crossOrigin = "anonymous"; // Ensure cross-origin compatibility for external images
    });
  }

  const onGeneratePowerpoint = async () => {
    const pres = new PptxGenJS();
    pres.defineLayout({
      name: "Widescreen",
      width: 13.33,
      height: 7.5,
    });

    pres.layout = "Widescreen";
    for (const report of reports) {
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
      const area = `Billboard Site in ${capitalizeFirst(site.city_name)}`;
      const headerHeight = Inches(1.93);
      const detailsSection = Inches(21.48);
      const contentSection = headerHeight + Inches(0.8);

      slide.addText(area, {
        w: Inches(33.23),
        h: headerHeight,
        x: 0,
        y: 0,
        fontFace: "Aptos",
        fontSize: 18,
        bold: true,
        align: "right",
        color: "FFFFFF",
      });
      slide.addText("AVAILABILTY: ", {
        w: 3,
        h: margin,
        x: detailsSection,
        y: contentSection - Inches(0.2),
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 11,
      });
      slide.addText("FEBRUARY 25, 2025", {
        w: 3,
        h: margin,
        x: detailsSection + Inches(2.6),
        y: contentSection - Inches(0.25),
        color: "d22735",
        fontFace: "Century Gothic",
        bold: true,
        fontSize: 14,
      });

      let imageURL = images[0].upload_path;
      imageURL = String(imageURL).replace(
        "unis.unitedneon.com",
        "192.168.10.10"
      );
      imageURL = String(imageURL).replace("https", "http");
      const image = await cropImageFromURL(imageURL, 150, 150).then((url) => url);

      console.log(image);

      slide.addImage({
        data: image,
        x: Inches(0.8),
        y: contentSection,
        w: Inches(20.09),
        h: Inches(15.35),
      });

      const colWidth = Inches(5.9);
      const lineHeight = Inches(0.4);
      const textHeight = Inches(0.55);
      const detailHeight = lineHeight + textHeight;

      slide.addText("SITE CODE:", {
        w: colWidth,
        h: textHeight,
        x: detailsSection,
        y: contentSection + textHeight,
        align: "left",
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 8,
      });
      slide.addText(site.unis_code, {
        w: colWidth,
        h: textHeight,
        x: detailsSection,
        y: contentSection + detailHeight,
        align: "left",
        color: "1E2C3C",
        bold: true,
        fontFace: "Century Gothic",
        fontSize: 10,
      });
      slide.addText("SIZE (H x W):", {
        w: colWidth,
        h: textHeight,
        x: detailsSection + colWidth,
        y: contentSection + textHeight,
        align: "left",
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 8,
      });
      slide.addText(site.size, {
        w: colWidth,
        h: textHeight,
        x: detailsSection + colWidth,
        y: contentSection + detailHeight,
        align: "left",
        color: "1E2C3C",
        bold: true,
        fontFace: "Century Gothic",
        fontSize: 10,
      });

      slide.addText("FACING:", {
        w: colWidth,
        h: textHeight,
        x: detailsSection,
        y: contentSection + textHeight + detailHeight,
        align: "left",
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 8,
      });
      slide.addText(capitalizeFirst(site.facing), {
        w: colWidth * 2,
        h: textHeight,
        x: detailsSection,
        y: contentSection + textHeight + detailHeight + lineHeight,
        align: "left",
        color: "1E2C3C",
        bold: true,
        fontFace: "Century Gothic",
        fontSize: 10,
      });

      slide.addText("BOUND:", {
        w: colWidth,
        h: textHeight,
        x: detailsSection,
        y: contentSection + textHeight + detailHeight * 2,
        align: "left",
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 8,
      });
      slide.addText(capitalizeFirst(site.bound ?? "") || "N/A", {
        w: colWidth * 2,
        h: textHeight,
        x: detailsSection,
        y: contentSection + textHeight + detailHeight * 2 + lineHeight,
        align: "left",
        color: "1E2C3C",
        bold: true,
        fontFace: "Century Gothic",
        fontSize: 10,
      });
      slide.addText("TRAFFIC COUNT:", {
        w: colWidth,
        h: textHeight,
        x: detailsSection,
        y: contentSection + textHeight + detailHeight * 3,
        align: "left",
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 8,
      });
      slide.addText(site.traffic_count || "N/A", {
        w: colWidth * 2,
        h: textHeight,
        x: detailsSection,
        y: contentSection + textHeight + detailHeight * 3 + lineHeight,
        align: "left",
        color: "1E2C3C",
        bold: true,
        fontFace: "Century Gothic",
        fontSize: 10,
      });
      slide.addText("POPULATION:", {
        w: colWidth,
        h: textHeight,
        x: detailsSection + colWidth,
        y: contentSection + textHeight + detailHeight * 3,
        align: "left",
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 8,
      });
      slide.addText(site.vicinity_population || "N/A", {
        w: colWidth * 2,
        h: textHeight,
        x: detailsSection + colWidth,
        y: contentSection + textHeight + detailHeight * 3 + lineHeight,
        align: "left",
        color: "1E2C3C",
        bold: true,
        fontFace: "Century Gothic",
        fontSize: 10,
      });
      slide.addText("ADDRESS:", {
        w: colWidth * 2,
        h: textHeight,
        x: detailsSection,
        y: contentSection + textHeight + detailHeight * 4,
        align: "left",
        color: "76899E",
        fontFace: "Aptos",
        fontSize: 8,
      });
      const addressHeight =
        site.address.length > 140
          ? textHeight * 2 + lineHeight
          : site.address.length > 74
          ? textHeight + lineHeight
          : textHeight;
      slide.addText(capitalizeFirst(site.address), {
        w: colWidth * 2,
        h: addressHeight,
        x: detailsSection,
        y: contentSection + textHeight + detailHeight * 4 + lineHeight,
        align: "left",
        valign: "top",
        color: "1E2C3C",
        bold: true,
        fontFace: "Century Gothic",
        fontSize: 9,
      });

      const afterAddressPosition =
        contentSection + detailHeight * 4 + lineHeight + addressHeight;
      if (landmarks) {
        slide.addText("LANDMARKS:", {
          w: colWidth,
          h: textHeight,
          x: detailsSection,
          y: afterAddressPosition + lineHeight + Inches(0.05),
          align: "left",
          color: "76899E",
          fontFace: "Aptos",
          fontSize: 8,
        });
        const { landmarks: lm } = landmarks;
        const landmarkArray = lm.map((lm) => lm.display_name);
        if (landmarkArray.length > 0) {
          const landmarkHeight =
            landmarkArray.join(" | ").length > 65
              ? textHeight + lineHeight
              : lineHeight;
          slide.addText(landmarkArray.join(" | "), {
            w: colWidth * 2,
            h: landmarkHeight,
            x: detailsSection,
            y: afterAddressPosition + Inches(0.1) + lineHeight * 2,
            align: "left",
            color: "1E2C3C",
            fontFace: "Century Gothic",
            fontSize: 9,
          });
        }
      }

      const landmarksLength = landmarks
        ? landmarks.landmarks.map((lm) => lm.display_name).join(" | ").length
        : 0;
      const ratesPosition =
        afterAddressPosition +
        detailHeight +
        (landmarksLength != 0
          ? landmarksLength > 65
            ? textHeight + lineHeight
            : lineHeight
          : 0);
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
                color: "1E2C3C",
              },
            },
            {
              text: "MONTHLY RATE",
              options: {
                align: "center",
                fontFace: "Aptos",
                bold: true,
                fontSize: 11,
                fill: "F2F2F2",
                color: "1E2C3C",
              },
            },
          ],
          ...rateRows,
        ];

        slide.addTable(rows, {
          w: Inches(11.55),
          h: 1.08,
          x: detailsSection,
          y: ratesPosition + Inches(0.2),
          rowH: 0.27,
          border: { color: "F2F2F2", pt: 1 },
        });
      } else {
        slide.addText("MONTHLY RATE: ", {
          w: colWidth,
          h: textHeight,
          x: detailsSection,
          y: ratesPosition + Inches(0.2),
          align: "left",
          bold: true,
          color: "1E2C3C",
          fontFace: "Aptos",
          fontSize: 10,
        });
        slide.addText(
          Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(price) + " + VAT",
          {
            w: colWidth * 1.5,
            h: textHeight + Inches(0.2),
            x: detailsSection + Inches(3),
            y: ratesPosition,
            align: "left",
            valign: "top",
            color: "1E2C3C",
            bold: true,
            fontFace: "Century Gothic",
            fontSize: 14,
          }
        );
      }

      const hasMonthlyRateDuration =
        showRates && rates.some((rate) => rate.discount !== 0);
      const mapSize = hasMonthlyRateDuration ? Inches(5.54) : Inches(7.5);

      console.log(report.map);
      slide.addImage({
        path: report.map,
        x: detailsSection + Inches(0.2),
        y: ratesPosition + detailHeight + (hasMonthlyRateDuration ? 1 : 0),
        w: mapSize,
        h: mapSize,
      });

      slide.addText("View Google Map", {
        hyperlink: {
          url: site.ideal_view,
        },
        w: mapSize,
        h: Inches(0.68),
        x: detailsSection + Inches(0.2),
        y:
          ratesPosition +
          detailHeight +
          mapSize -
          Inches(0.8) +
          (hasMonthlyRateDuration ? 1 : Inches(0.1)),
        align: "center",
        color: "25589D",
        fontFace: "Aptos",
        fontSize: 11,
        isTextBox: true,
        fill: "F2F2F2",
      });
    }

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
