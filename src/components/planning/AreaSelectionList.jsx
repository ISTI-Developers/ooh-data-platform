import PropTypes from "prop-types";
import { Label, Select } from "flowbite-react";
import PlanningTable from "./PlanningTable";
import { useFunction } from "~config/functions";
import { format } from "date-fns";
import { useState } from "react";
import { usePlanning } from "~config/PlanningContext";

function AreaSelectionList() {
  const { regions } = useFunction();
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
    <div className="bg-white p-2 overflow-x-auto overflow-y-visible w-full">
      <div className="w-full">
        <div className="flex flex-row items-center gap-4 py-2 px-1">
          <div>
            <Label htmlFor="from" value="From: " />
            <input
              type="date"
              id="from"
              value={format(new Date(dates.from), "yyyy-MM-dd")}
              className="border-gray-300 rounded-lg bg-gray-100"
              onChange={updateDate}
            />
          </div>
          <div>
            <Label htmlFor="to" value="To: " />
            <input
              type="date"
              id="to"
              value={format(new Date(dates.to), "yyyy-MM-dd")}
              className="border-gray-300 rounded-lg bg-gray-100"
              onChange={updateDate}
            />
          </div>
          <div>
            <Label htmlFor="regions" value="Filter Region: " />
            <Select id="regions" onChange={(e) => setRegion(e.target.value)}>
              <option value="all" selected={selectedRegion === null}>
                All Regions
              </option>
              {regions.map((region) => {
                return (
                  <option key={region} value={region}>
                    {region}
                  </option>
                );
              })}
            </Select>
          </div>
        </div>
      </div>
      <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-secondary-500 scrollbar-thumb-rounded-full">
        <PlanningTable
          filter={selectedRegion}
        />
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
