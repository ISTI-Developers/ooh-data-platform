import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useService } from "./services";

const ReportContext = React.createContext();

export function useReport() {
  return useContext(ReportContext);
}

export function ReportProvider({ children }) {
  const { retrieveSites } = useService();
  const [sites, setSites] = useState(null);
  const [reports, setReports] = useState([{ site: null, details: null }]);
  const [charts, setChart] = useState([]);
  const [show, toggleModal] = useState(null);
  const addReport = () => {
    setReports([...reports, { site: null, details: null }]);
  };

  const addChart = (site, canvas) => {
    setChart((prev) => {
      const temp = [...prev];
      const item = temp.find((t) => t.site === site);

      if (!item) {
        temp.push({ site: site, charts: [canvas] });
      } else {
        item.charts.push(canvas);
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
  };

  const removeChart = (index) => {
    setChart((current) => {
      return current.filter((_, i) => i !== index);
    });
  };

  useEffect(() => {
    const setup = async () => {
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
  };

  return (
    <ReportContext.Provider value={values}>{children}</ReportContext.Provider>
  );
}

ReportProvider.propTypes = {
  children: PropTypes.node,
};
