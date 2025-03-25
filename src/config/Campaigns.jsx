import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useService } from "./services";
import axios from "axios";
import { devEndpoints as url } from "./endpoints";
import Cookies from "js-cookie";
import unai from "~assets/unai.png";

const CampaignContext = React.createContext();

export function useCampaigns() {
  return useContext(CampaignContext);
}

export function CampaignProvider({ children }) {
  const { retrieveSites } = useService();
  const [sites, setSites] = useState(null);
  const [reports, setReports] = useState([{ site: null, details: null }]);
  const [charts, setChart] = useState([]);
  const [show, toggleModal] = useState(null);

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

  const addReport = () => {
    setReports([...reports, { site: null, details: null }]);
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
  const removeReport = (index) => {
    setReports((current) => {
      return current.filter((_, i) => i !== index);
    });
    removeChart(index);
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

  useEffect(() => {
    const setup = async () => {
      if (sites !== null) return;
      const results = await retrieveSites();
      setSites(results);
    };
    setup();
  }, []);

  const values = {
    sites,
    reports,
    charts,
    addReport,
    clearSite,
    updateReport,
    removeReport,
    addChart,
    updateChart,
    removeChart,
    show,
    toggleModal,
    generateReport,
    fetchReport,
  };

  return (
    <CampaignContext.Provider value={values}>
      {children}
    </CampaignContext.Provider>
  );
}

CampaignProvider.propTypes = {
  children: PropTypes.node,
};
