import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useService } from "./services";
import { format } from "date-fns";
import { useFunction } from "./functions";
const PlanningContext = React.createContext();

export function usePlanning() {
  return useContext(PlanningContext);
}

export function PlanningProvider({ children }) {
  const [dates, setDates] = useState({
    from: new Date().setDate(new Date().getDate() - 30),
    to: new Date(),
  });
  const [profiles, setProfiles] = useState([]); //selected profiles
  const [areas, setAreas] = useState([]); // selected areas
  const [profile, setProfile] = useState(null); //specific profile
  const [siteResults, setSiteResults] = useState(null);
  const [allowedMultiple, toggleMultiple] = useState([]);
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
      console.log(response, options)
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
