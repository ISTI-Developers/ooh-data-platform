import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useService } from "./services";
import { format, set } from "date-fns";
import { useFunction } from "./functions";
import axios from "axios";
import { devEndpoints as url } from "./endpoints";
import Cookies from "js-cookie";
const PlanningContext = React.createContext();

export function usePlanning() {
  return useContext(PlanningContext);
}

export function PlanningProvider({ children }) {
  const [dates, setDates] = useState({
    // from: new Date().setDate(new Date().getDate() - 30),
    from: new Date("01-01-2025"),
    to: new Date(),
  });
  const [profiles, setProfiles] = useState([]); //selected profiles
  const [areas, setAreas] = useState([]); // selected areas
  const [profile, setProfile] = useState(null); //specific profile
  const [siteResults, setSiteResults] = useState(null);
  const [allowedMultiple, toggleMultiple] = useState([]);
  const [impressions, setImpressions] = useState(null);
  const { toUnderscored } = useFunction();
  const { retrievePlanning } = useService();

  const addDemographics = (item) => {
    if (profiles) {
      if (profiles.find((filter) => filter === item)) return;

      setProfiles((prev) => [...prev, item]);
    } else {
      setProfiles([item]);
    }
  };

  const findDemographics = (query, demographics) => {
    if (!query) {
      return demographics;
    }

    if (query.length < 2) {
      return demographics;
    }
    return demographics.filter(
      (item) =>
        toUnderscored(item.question.toLowerCase()).includes(
          toUnderscored(query.toLowerCase())
        ) ||
        toUnderscored(item.key.toLowerCase()).includes(
          toUnderscored(query.toLowerCase())
        )
    );
  };
  const getImpressions = async (dates) => {
    try {
      const response = await axios.get(url.impressions + `?dates=${JSON.stringify(dates)}`, {
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

  useEffect(() => {
    const setup = async () => {
      const response = await getImpressions(dates);
      setImpressions(response);
    };
    setup();
  }, [dates]);

  useEffect(() => {
    const groupFilters = () => {
      if (!profiles) return;

      const groupedData = profiles.reduce((result, current) => {
        const question = current.question;

        if (!result[question]) {
          result[question] = {
            allowMultiple: false,
            choices: [],
          };
        }

        result[question].choices.push(current.key);

        // Update allowMultiple based on allowedMultiple array
        if (allowedMultiple && allowedMultiple.length > 0) {
          // Check if the question key is in allowedMultiple
          result[question].allowMultiple = allowedMultiple.includes(question);
        }

        return result;
      }, {});
      return groupedData;
    };

    const setup = async () => {
      const options = {
        ...groupFilters(),
        dates: {
          from: format(new Date(dates.from), "MM-dd-yyyy"),
          to: format(new Date(dates.to), "MM-dd-yyyy"),
        },
      };
      const response = await retrievePlanning("areas", options);
      setSiteResults(response);
    };
    setup();
  }, [profiles, dates, allowedMultiple]);

  const value = {
    areas,
    dates,
    siteResults,
    profiles,
    profile,
    allowedMultiple,
    setAreas,
    setDates,
    setProfile,
    setProfiles,
    toggleMultiple,
    addDemographics,
    findDemographics,
    impressions,
  };

  return (
    <PlanningContext.Provider value={value}>
      {children}
    </PlanningContext.Provider>
  );
}

PlanningProvider.propTypes = {
  children: PropTypes.node,
};
