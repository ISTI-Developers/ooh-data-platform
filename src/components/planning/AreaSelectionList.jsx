import PropTypes from "prop-types";
import { Label, Select } from "flowbite-react";
import PlanningTable from "./PlanningTable";
import { useFunction } from "~config/functions";
import { format } from "date-fns";
import { useState } from "react";

function AreaSelectionList({
  setStartDate,
  setEndDate,
  dates,
  selectedAreas,
  setSelectedArea,
  selectedFilters,
}) {
  const { regions } = useFunction();
  const [selectedRegion, setRegion] = useState("all");
  return (
    <div className="bg-white p-2 overflow-x-auto overflow-y-visible w-full">
      <div className="w-full">
        <div className="flex flex-row items-center gap-4 py-2 px-1">
          <div>
            <Label htmlFor="start_date" value="From: " />
            <input
              type="date"
              id="start_date"
              value={format(new Date(dates.start), "yyyy-MM-dd")}
              className="border-gray-300 rounded-lg bg-gray-100"
              onChange={(e) => setStartDate(e.target.valueAsDate)}
            />
          </div>
          <div>
            <Label htmlFor="end_date" value="To: " />
            <input
              type="date"
              id="end_date"
              value={format(new Date(dates.end), "yyyy-MM-dd")}
              className="border-gray-300 rounded-lg bg-gray-100"
              onChange={(e) => setEndDate(e.target.valueAsDate)}
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
          dates={dates}
          filter={selectedRegion}
          selectedAreas={selectedAreas}
          setSelectedArea={setSelectedArea}
          profileFilters={selectedFilters}
        />
      </div>
    </div>
  );
}

AreaSelectionList.propTypes = {
  setStartDate: PropTypes.func,
  setEndDate: PropTypes.func,
  setRegion: PropTypes.func,
  dates: PropTypes.object,
  selectedRegion: PropTypes.array,
  selectedAreas: PropTypes.array,
  setSelectedArea: PropTypes.func,
  selectedFilters: PropTypes.array,
};

export default AreaSelectionList;
