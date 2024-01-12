import PropTypes from "prop-types";
import PlanningList from "./PlanningList";
import { useEffect, useState } from "react";
import { useService } from "../../config/services";
import Tabs from "../../fragments/Tabs";

function ProfileFilterList({
  toggleProfile,
  setSearchQuery,
  searchBuyergraphics,
}) {
  const { retrievePlanning } = useService();
  const [demographics, setDemographics] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const setup = async () => {
      const data = await retrievePlanning("demographics");
      setDemographics(data);
    };
    setup();
  }, []);
  return (
    demographics && (
      <Tabs
        tabs={["all", ...new Set(demographics.map((item) => item.category))]}
        content={
          <PlanningList
            category={activeTab}
            toggleProfile={toggleProfile}
            search={setSearchQuery}
            searchBuyergraphics={searchBuyergraphics}
            data={demographics}
          />
        }
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    )
  );
}

ProfileFilterList.propTypes = {
  toggleProfile: PropTypes.func,
  setSearchQuery: PropTypes.func,
  searchBuyergraphics: PropTypes.func,
};

export default ProfileFilterList;
