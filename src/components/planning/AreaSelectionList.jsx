import PropTypes from "prop-types";
import { Label, Select } from "flowbite-react";
import PlanningTable from "./PlanningTable";
import { useFunction } from "~config/functions";

function AreaSelectionList({
  setStartDate,
  setEndDate,
  setRegion,
  selectedRegion,
  selectedAreas,
  setSelectedArea,
}) {
  const { regions } = useFunction();
  return (
    <div className="bg-white p-2 overflow-x-auto overflow-y-visible w-full">
      <div className="w-full">
        <div className="flex flex-row items-center gap-4 py-2 px-1">
          <div>
            <Label htmlFor="start_date" value="From: " />
            <input
              type="date"
              id="start_date"
              className="border-gray-300 rounded-lg bg-gray-100"
              onChange={(e) => setStartDate(e.target.valueAsDate)}
            />
          </div>
          <div>
            <Label htmlFor="end_date" value="To: " />
            <input
              type="date"
              id="end_date"
              className="border-gray-300 rounded-lg bg-gray-100"
              onChange={(e) => setEndDate(e.target.valueAsDate)}
            />
          </div>
          <div>
            <Label htmlFor="regions" value="Filter Region: " />
            <Select id="regions" onChange={(e) => setRegion(e.target.value)}>
              <option value="" selected={selectedRegion === null}>
                Select Region
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
      <div className="max-h-[320px] overflow-y-auto">
        <PlanningTable
          filter={selectedRegion}
          selectedAreas={selectedAreas}
          setSelectedArea={setSelectedArea}
        />
      </div>
    </div>
  );
}

AreaSelectionList.propTypes = {
  setStartDate: PropTypes.func,
  setEndDate: PropTypes.func,
  setRegion: PropTypes.func,
  selectedRegion: PropTypes.array,
  selectedAreas: PropTypes.array,
  setSelectedArea: PropTypes.func,
};

export default AreaSelectionList;
