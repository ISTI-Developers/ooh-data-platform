import { format } from "date-fns";
import PropTypes from "prop-types";
import { PiCaretDownBold } from "react-icons/pi";
import { MdCalendarMonth } from "react-icons/md";
import { useState } from "react";
import DatePickerModal from "./DatePickerModal";
import { Label, Select } from "flowbite-react";
import { billboardData } from "../config/siteData";

function AudienceOptions({ dates, setDates, location, setLocation }) {
  const [onSelectDate, toggleDateButton] = useState(false);
  const siteNames = [...new Set(billboardData.map((site) => site.location))];
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="relative">
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
        <DatePickerModal
          show={onSelectDate}
          onClose={() => toggleDateButton(false)}
          setDate={setDates}
        />
      </div>

      <div>
        <Label htmlFor="regions" value="Select Site: " />
        <Select id="regions" onChange={(e) => setLocation(e.target.value)}>
          <option value="" disabled selected={location === null}>
            Site Locations
          </option>
          {siteNames.map((region) => {
            return (
              <option key={region} value={region}>
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
  dates: PropTypes.object,
  location: PropTypes.string,
  setDates: PropTypes.func,
  setLocation: PropTypes.func,
};

export default AudienceOptions;
