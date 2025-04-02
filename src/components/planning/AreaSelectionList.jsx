import PropTypes from "prop-types";
import { Label } from "flowbite-react";
import PlanningTable from "./PlanningTable";
import { useFunction } from "~config/functions";
import { format } from "date-fns";
import { useState } from "react";
import { usePlanning } from "~config/PlanningContext";

function AreaSelectionList() {
  const { regionList } = useFunction();
  const { dates, setDates } = usePlanning();
  const [selectedRegion, setRegion] = useState("all");

  const updateDate = (event) => {
    setDates((current) => {
      return {
        ...current,
        [event.target.id]: event.target.valueAsDate,
      };
    });
  };
  return (
    <div className="bg-white overflow-x-auto overflow-y-visible w-full">
      <div className="w-full flex items-center gap-4 p-4 pt-2">
        <div>
          <Label htmlFor="from" value="From: " />
          <input
            type="date"
            id="from"
            value={format(new Date(dates.from), "yyyy-MM-dd")}
            className="border border-gray-200 rounded-lg shadow bg-gray-50"
            onChange={updateDate}
          />
        </div>
        <div>
          <Label htmlFor="to" value="To: " />
          <input
            type="date"
            id="to"
            value={format(new Date(dates.to), "yyyy-MM-dd")}
            className="border border-gray-200 rounded-lg shadow bg-gray-50"
            onChange={updateDate}
          />
        </div>
        <div>
          <Label htmlFor="regions" value="Filter Region: " />
          <select className="w-full rounded-lg border-gray-200 bg-gray-50 shadow" id="regions" onChange={(e) => setRegion(e.target.value)}>
            <option value="all" selected={selectedRegion === null}>
              All Regions
            </option>
            {regionList.map((region) => {
              return (
                <option key={region} value={region}>
                  {region}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-secondary-500 scrollbar-thumb-rounded-full p-4 pt-0">
        <PlanningTable filter={selectedRegion} />
      </div>
    </div>
  );
}

AreaSelectionList.propTypes = {
  setRegion: PropTypes.func,
  selectedRegion: PropTypes.array,
  selectedAreas: PropTypes.array,
  setSelectedArea: PropTypes.func,
  allowedMultiple: PropTypes.array,
  selectedFilters: PropTypes.array,
};

export default AreaSelectionList;
