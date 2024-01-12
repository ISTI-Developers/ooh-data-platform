import { format } from "date-fns";
import PropTypes from "prop-types";
import { PiCaretDownBold } from "react-icons/pi";
import { MdCalendarMonth } from "react-icons/md";
import { useState } from "react";
import DatePickerModal from "./DatePickerModal";
import { Label, Select } from "flowbite-react";
import { billboardData } from "../config/siteData";
import { useNavigate } from "react-router-dom";
import { useFunction } from "../config/functions";

function AudienceOptions({ location, setLocation }) {
  const navigate = useNavigate();
  const { toUnderscored } = useFunction();
  const siteNames = [...new Set(billboardData.map((site) => site.location))];
  return (
    <div className="flex flex-row items-center gap-4">
      <div>
        <Label htmlFor="regions" value="Select Site: " />
        <Select
          id="regions"
          onChange={(e) => {
            console.log(e.target.value);
            navigate(`./${toUnderscored(e.target.value)}`);
            setLocation(e.target.value);
            localStorage.setItem("location", e.target.value);
          }}
        >
          <option
            value=""
            disabled
            selected={location === null || !localStorage.getItem("location")}
          >
            Site Locations
          </option>
          {siteNames.map((region) => {
            return (
              <option
                key={region}
                value={region}
                selected={
                  localStorage.getItem("location") &&
                  localStorage.getItem("location") === region
                }
              >
                {region}
              </option>
            );
          })}
        </Select>
      </div>
    </div>
  );
}

AudienceOptions.propTypes = {
  location: PropTypes.string,
  setLocation: PropTypes.func,
};

export function DateRangePicker({ dates, setDates }) {
  const [onSelectDate, toggleDateButton] = useState(false);

  return (
    <div className="relative w-fit">
      <p className="font-semibold">Dates: </p>
      <div
        className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-300 cursor-pointer select-none"
        onClick={() => toggleDateButton((prev) => !prev)}
      >
        <MdCalendarMonth className="text-gray-700" />
        <p className="flex items-center gap-2 text-gray-700">
          <span>{format(new Date(dates.from), "MMMM d, yyy")}</span>
          <span>-</span>
          <span>{format(new Date(dates.to), "MMMM d, yyy")}</span>
        </p>
        <PiCaretDownBold className="text-gray-500 font-bold" />
      </div>
      {onSelectDate && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-[#00000000] z-[1] pointer-events-auto"
          onClick={() => toggleDateButton(false)}
        />
      )}
      <DatePickerModal
        show={onSelectDate}
        onClose={() => toggleDateButton(false)}
        setDate={setDates}
      />
    </div>
  );
}
DateRangePicker.propTypes = {
  dates: PropTypes.object,
  setDates: PropTypes.func,
};
export default AudienceOptions;
