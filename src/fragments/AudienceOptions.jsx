import { format } from "date-fns";
import PropTypes from "prop-types";
import { PiCaretDownBold } from "react-icons/pi";
import { MdCalendarMonth } from "react-icons/md";
import { useEffect, useState } from "react";
import DatePickerModal from "./DatePickerModal";
import { Label, Select } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFunction } from "~config/functions";
import { useService } from "~config/services";

function AudienceOptions({ setLocation }) {
  const url = useLocation();
  const navigate = useNavigate();
  const { toUnderscored } = useFunction();
  const { retrieveSites } = useService();

  const [siteNames, setSiteNames] = useState(null);
  const [filter, setFilter] = useState("all");

  const selectedLocation = url.pathname.split("/")[2];
  useEffect(() => {
    const setup = async () => {
      const data = await retrieveSites();
      if (filter !== "all") {
        setSiteNames(
          data
            .filter((item) => item.type === filter)
            .map((item) => ({
              site_id: item.site_id,
              site: item.site,
              type: item.type,
            }))
        );
      } else {
        setSiteNames(
          data.map((item) => ({
            site_id: item.site_id,
            site: item.site,
            type: item.type,
          }))
        );
      }
    };
    setup();
  }, [filter]);
  return (
    <div className="flex flex-row items-center gap-4">
      <div>
        <Label htmlFor="regions" value="Filter Site: " />
        <Select
          id="regions"
          onChange={(e) => {
            setSiteNames(null);
            setFilter(e.target.value);
          }}
        >
          <option value="all" selected={!filter} defaultChecked>
            All
          </option>
          <option value="classic">Classic</option>
          <option value="digital">Digital</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="regions" value="Select Site: " />
        <Select
          id="regions"
          onChange={(e) => {
            navigate(`./${toUnderscored(e.target.value)}`);
            setLocation(e.target.value);
          }}
        >
          {!siteNames ? (
            <option value="" selected={!selectedLocation} defaultChecked>
              Loading options...
            </option>
          ) : siteNames.length === 0 ? (
            <option value="" selected={!selectedLocation} defaultChecked>
              No sites available
            </option>
          ) : (
            <>
              <option
                value=""
                disabled
                selected={!selectedLocation}
                defaultChecked
              >
                --Select--
              </option>
              {siteNames.map((region) => {
                return (
                  <option
                    key={region.site_id}
                    value={region.site}
                    selected={selectedLocation === region.site}
                  >
                    {region.site}
                  </option>
                );
              })}
            </>
          )}
        </Select>
      </div>
    </div>
  );
}

AudienceOptions.propTypes = {
  location: PropTypes.string,
  setLocation: PropTypes.func,
};

export function DateRangePicker({ dates, setDates, showLoader }) {
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
        showLoader={showLoader}
        currentDates={dates}
      />
    </div>
  );
}
DateRangePicker.propTypes = {
  dates: PropTypes.object,
  setDates: PropTypes.func,
  showLoader: PropTypes.func,
};
export default AudienceOptions;
