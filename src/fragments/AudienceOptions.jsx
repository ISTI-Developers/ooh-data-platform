import { format } from "date-fns";
import PropTypes from "prop-types";
import { PiCaretDownBold } from "react-icons/pi";
import { MdCalendarMonth } from "react-icons/md";
import { useEffect, useState } from "react";
import DatePickerModal from "./DatePickerModal";
import { Label, Table, TextInput } from "flowbite-react";
import { useService } from "~config/services";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { defaultTextTheme } from "~config/themes";
import { useFunction } from "~config/functions";
import { useLocation, useNavigate } from "react-router-dom";

function AudienceOptions({ filterOptions, setQuery }) {
  const { retrieveSites } = useService();
  const { searchItems, toUnderscored } = useFunction();
  const location = useLocation();
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();
  const filters = [
    { value: "all", label: "All" },
    { value: "banner", label: "Banner" },
    { value: "classic", label: "Classic" },
    { value: "digital", label: "Digital" },
  ];

  const [siteNames, setSiteNames] = useState(null);
  const [results, setResults] = useState(null);
  const [options, setOptions] = useState({
    regions: [],
    areas: [],
    cities: [],
  });
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [city, setCity] = useState([]);
  const [filter, setFilter] = useState(filters[0]);

  const revertOptions = (key, value) => {
    filterOptions((prev) => ({
      ...Object.fromEntries(
        ["region", "city", "area"].map((k) => [k, k === key ? value : []])
      ),
      type: prev.type,
    }));
  };

  useEffect(() => {
    const setup = async () => {
      const data = await retrieveSites();
      if (filter.value !== "all") {
        setSiteNames(
          data.filter((site) => site.type.toLowerCase() === filter.value)
        );
      } else {
        setSiteNames(data);
      }

      setOptions((prev) => ({
        ...prev,
        regions: data
          .map((item) => ({ value: item.region, label: item.region }))
          .filter(
            (item, index, self) =>
              index ===
              self.findIndex(
                (t) => t.value === item.value && t.label === item.label
              )
          ),
      }));
    };
    setup();
  }, [filter.value, retrieveSites]);
  useEffect(() => {
    if (siteNames) {
      if (region.length !== 0) {
        const regions = [...new Set(region.map((reg) => reg.value))];
        setOptions((prev) => ({
          ...prev,
          cities: siteNames
            .filter((site) => regions.includes(site.region))
            .map((item) => ({ value: item.city, label: item.city }))
            .filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) => t.value === item.value && t.label === item.label
                )
            ),
        }));
      } else {
        setOptions((prev) => ({ ...prev, cities: [] }));
      }
    }
  }, [region, siteNames]);

  useEffect(() => {
    if (siteNames) {
      if (city.length !== 0) {
        const cities = [...new Set(city.map((reg) => reg.value))];
        setOptions((prev) => ({
          ...prev,
          areas: siteNames
            .filter((site) => cities.includes(site.city))
            .map((item) => ({ value: item.area, label: item.area }))
            .filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) => t.value === item.value && t.label === item.label
                )
            ),
        }));
      } else {
        setOptions((prev) => ({ ...prev, areas: [] }));
      }
    }
  }, [city, siteNames]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Label value="Search site" />
        <TextInput
          type="search"
          theme={defaultTextTheme}
          onChange={(e) => {
            if (e.target.value.length >= 3) {
              setQuery(e.target.value);
              setResults(searchItems(siteNames, e.target.value));
            } else {
              setQuery(null);
              setResults(null);
            }
          }}
        />
        {location.pathname.split("/").length !== 2 && (
          <>
            {results && results.length !== 0 && (
              <div className="absolute w-full bg-white shadow z-[1]">
                <Table>
                  <Table.Body>
                    {results.map((site) => {
                      return (
                        <Table.Row
                          key={site.site_id}
                          className="cursor-pointer hover:bg-slate-50"
                          onClick={() => {
                            setQuery(null);
                            setResults(null);
                            navigate(`./${toUnderscored(site.site)}`);
                          }}
                        >
                          <Table.Cell>
                            <div>
                              <p className="font-semibold text-black">
                                {site.site}
                              </p>
                              <div className="text-xs">
                                <p>{site.region}</p>
                                <p>{site.city}</p>
                                <p>{site.area}</p>
                              </div>
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <div>
                              <p>{site.latitude}</p>
                              <p>{site.longitude}</p>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="capitalize">
                            {site.type}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div>
          {/* {console.log(options)}x */}
          <Label htmlFor="type" value="Site Type " />
          <Select
            id="type"
            closeMenuOnSelect
            isSearchable={false}
            value={filter}
            components={animatedComponents}
            className="min-w-[200px]"
            options={filters}
            onChange={(e) => {
              setSiteNames(null);
              setFilter(e);
              filterOptions((prev) => {
                return {
                  ...prev,
                  type: e.value,
                };
              });
            }}
          />
        </div>
        <div>
          <Label htmlFor="regions" value={`Select Region`} />
          <Select
            id="regions"
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            className="min-w-[200px]"
            value={region}
            options={options?.regions}
            onChange={(e) => {
              const regions = [...new Set(e.map((e) => e.value))];
              if (regions.length > 0) {
                filterOptions((prev) => {
                  return {
                    ...prev,
                    region: regions,
                  };
                });
                setRegion(e);
                setCity((cities) => {
                  const updatedCity = [...cities];
                  const siteCities = siteNames
                    .filter((site) => regions.includes(site.region))
                    .map((site) => site.city);
                  const updatedCities = updatedCity.filter((city) =>
                    siteCities.includes(city.value)
                  );
                  setArea((areas) => {
                    const mappedCities = updatedCities.map(
                      (city) => city.value
                    );
                    const updated = [...areas];
                    const sites = siteNames
                      .filter((site) => mappedCities.includes(site.city))
                      .map((site) => site.area);
                    const updatedAreas = updated.filter((area) =>
                      sites.includes(area.value)
                    );
                    return updatedAreas;
                  });
                  return updatedCities;
                });
              } else {
                revertOptions("region", regions);
                setRegion(e);
                setCity([]);
                setArea([]);
              }
            }}
          />
        </div>
        <div>
          <Label htmlFor="cities" value={`Select City`} />
          <Select
            id="cities"
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            className="min-w-[200px]"
            value={city}
            isDisabled={options.cities.length === 0}
            options={options?.cities}
            onChange={(e) => {
              const cities = [...new Set(e.map((e) => e.value))];
              if (cities.length > 0) {
                filterOptions((prev) => {
                  return {
                    ...prev,
                    city: cities,
                  };
                });
                setCity(e);
                setArea((areas) => {
                  const updated = [...areas];
                  const sites = siteNames
                    .filter((site) => cities.includes(site.city))
                    .map((site) => site.area);
                  const updatedAreas = updated.filter((area) =>
                    sites.includes(area.value)
                  );
                  return updatedAreas;
                });
              } else {
                revertOptions("city", cities);
                setCity([]);
                setArea([]);
              }
            }}
          />
        </div>
        <div>
          <Label htmlFor="areas" value={`Select Area`} />
          <Select
            id="areas"
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            isDisabled={options.areas.length === 0}
            value={area}
            className="min-w-[200px]"
            options={options?.areas}
            onChange={(e) => {
              const areas = [...new Set(e.map((e) => e.value))];
              filterOptions((prev) => {
                return {
                  ...prev,
                  area: areas,
                };
              });
              setArea(e);
            }}
          />
        </div>
      </div>
    </div>
  );
}

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
        onClose={() => {
          toggleDateButton(false);
        }}
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

AudienceOptions.propTypes = {
  filterOptions: PropTypes.func,
  setQuery: PropTypes.func,
};

export default AudienceOptions;
