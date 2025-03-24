/* eslint-disable react/prop-types */
import { Label, TextInput, Tooltip } from "flowbite-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFunction } from "~config/functions";
import { useMap } from "~config/MapsContext";
import Select from "react-select";
import { useService } from "~config/services";
import classNames from "classnames";
import { useReport } from "~config/ReportContext";
import { useClick } from "~config/ClickProvider";
import { FaFilter, FaMinus } from "react-icons/fa";
import { tooltip } from "~config/themes";

const SiteOptions = ({ setQuery }) => {
  const { setFilters, filters } = useReport();
  const { position, isInside } = useClick();
  const { retrieveAreas } = useService();
  const { landmarks } = useMap();
  const { toSpaced } = useFunction();
  const popUpRef = useRef(null);
  const componentRef = useRef(null);

  const [areas, setAreas] = useState([]);
  const [open, setOpen] = useState(false);

  const landmarkTypes = useMemo(() => {
    if (!landmarks) return [];
    const types = landmarks
      .map((lm) => {
        return [...lm.types];
      })
      .flat();

    const interestList = [...new Set(types)];

    return interestList.map((item) => {
      return {
        value: item,
        label: toSpaced(item),
      };
    });
  }, [landmarks]);

  useEffect(() => {
    if (popUpRef.current && componentRef.current) {
      const rect = popUpRef.current.getBoundingClientRect();
      const rect2 = componentRef.current.getBoundingClientRect();

      if (open) {
        if (!isInside(rect2) && !isInside(rect)) {
          setOpen(false);
        }
      }
    }
  }, [position]);

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveAreas();

      if (Array.isArray(response)) {
        setAreas(
          response.map((item) => ({
            value: item.city_id,
            label: item.city_name,
          }))
        );
      }
    };

    setup();
  }, []);

  return (
    <div
      ref={componentRef}
      id="siteOptions"
      className="grid grid-cols-[fit-content(100px)_1fr] items-center transition-all pt-2 z-[2]"
    >
      <section className="relative">
        <Tooltip theme={tooltip} content="Filter" arrow={false}>
          <div
            className="bg-white hover:bg-gray-100 transition-all border border-gray-300 rounded-md p-2 py-[.4rem] mr-4 whitespace-nowrap text-2xl"
            role="button"
            onClick={() => setOpen((prev) => !prev)}
          >
            <FaFilter />
          </div>
        </Tooltip>
        <div
          ref={popUpRef}
          className={classNames(
            "absolute top-0 left-0 min-w-[400px] p-4 bg-white border border-gray-300 shadow-md transition-all translate-y-14 rounded space-y-4",
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex gap-4">
            <section>
              <Label htmlFor="area" value="Filter Area" />
              <Select
                id="area"
                value={filters.area}
                options={areas}
                onChange={(value) =>
                  setFilters((prev) => {
                    return {
                      ...prev,
                      area: value,
                    };
                  })
                }
                className="min-w-[300px] capitalize"
                isMulti
              />
            </section>
            <section>
              <Label htmlFor="landmark" value="Filter nearby landmarks" />
              <Select
                id="landmark"
                value={filters.landmarks}
                options={landmarkTypes}
                onChange={(value) =>
                  setFilters((prev) => {
                    return {
                      ...prev,
                      landmarks: value,
                    };
                  })
                }
                className="min-w-[300px] capitalize"
                isMulti
              />
            </section>
          </div>
          <section>
            <Label htmlFor="price" value="Filter price" />
            <div className="flex gap-4 items-center">
              <div className="w-full border border-gray-300 h-10 rounded flex items-center overflow-hidden">
                <p className="border-r text-lg px-4">₱</p>
                <input
                  type="number"
                  value={filters.price.from}
                  min={0}
                  step={50000}
                  onChange={(e) =>
                    setFilters((prev) => {
                      return {
                        ...prev,
                        price: {
                          ...prev.price,
                          from: e.target.valueAsNumber,
                        },
                      };
                    })
                  }
                  className="w-full border-none focus:ring-0 focus:outline-none focus:border-none"
                />
              </div>
              <FaMinus />
              <div className="w-full border border-gray-300 h-10 rounded flex items-center overflow-hidden">
                <p className="border-r text-lg px-4">₱</p>
                <input
                  type="number"
                  value={filters.price.to}
                  min={0}
                  step={50000}
                  onChange={(e) =>
                    setFilters((prev) => {
                      return {
                        ...prev,
                        price: {
                          ...prev.price,
                          to: e.target.valueAsNumber,
                        },
                      };
                    })
                  }
                  className="w-full border-none focus:ring-0 focus:outline-none focus:border-none"
                />
              </div>
            </div>
          </section>
        </div>
      </section>
      <TextInput
        type="search"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Looking for a site?"
      />
    </div>
  );
};

export default SiteOptions;
