import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useFunction } from "~config/functions";
import { usePlanning } from "~config/PlanningContext";
import { MdAdd } from "react-icons/md";
function PlanningList({ category, data }) {
  const [demographics, setDemographics] = useState(null);
  const [search, setSearch] = useState(null);
  const { capitalize, toSpaced } = useFunction();
  const { findDemographics, setProfile } = usePlanning();
  useEffect(() => {
    if (category !== "all") {
      setDemographics(data.filter((item) => item.category === category));
    } else {
      setDemographics(data);
    }
  }, [category]);

  return (
    demographics && (
      <>
        <div className="p-4 pb-2">
          <input
            type="search"
            placeholder="Search here"
            className="w-full text-sm border-gray-200 bg-gray-50 shadow rounded-lg"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ul className="flex flex-col p-4 pt-0 max-h-[325px] overflow-y-auto scrollbar-thin">
          {[
            ...new Set(
              findDemographics(search, demographics).map(
                (item) => item.question
              )
            ),
          ].map((item, index) => {
            return (
              <li
                key={index}
                className="relative group flex flex-col py-4 border-b-2 hover:bg-slate-100 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setProfile({
                    key: item,
                    data: demographics.filter((it) => it.question === item),
                    multi: demographics
                      .filter((it) => it.question === item)
                      ?.every((choice) => choice.multi === true),
                  });
                }}
              >
                <p className="font-medium text-main">
                  {capitalize(toSpaced(item))}
                </p>
                <div className="text-xs text-slate-400">
                  {demographics
                    .filter((it) => it.question === item)
                    .splice(0, 3)
                    .map((profile, index) => (
                      <>
                        <span key={index} className="pl-1 first:pl-0">
                          {profile.key},
                        </span>
                      </>
                    ))}
                  ...
                </div>
                <div className="absolute top-0 right-0 h-full w-1/4 hidden items-center justify-end group-hover:flex group-hover:bg-slate-100">
                  <button
                    tabIndex={-1}
                    className={classNames(
                      "mr-4 p-1 px-3 text-sm border-2 border-secondary-500 text-secondary-hover hover:text-white hover:bg-secondary-500 rounded-lg"
                    )}
                  >
                    <MdAdd />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </>
    )
  );
}

PlanningList.propTypes = {
  category: PropTypes.string,
  toggleProfile: PropTypes.func,
  search: PropTypes.func,
  searchBuyergraphics: PropTypes.func,
  data: PropTypes.array,
};

export default PlanningList;
