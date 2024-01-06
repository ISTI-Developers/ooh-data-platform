import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { TextInput } from "flowbite-react";
import { demographics } from "../../config/siteData";
function PlanningList({
  category,
  toggleProfile,
  search,
  searchBuyergraphics,
}) {
  const [filteredDemographics, filterDemographics] = useState(null);
  useEffect(() => {
    if (category !== null) {
      filterDemographics(
        demographics.filter((item) => item.category === category)
      );
    } else {
      filterDemographics(demographics);
    }
  }, [category]);

  return (
    filteredDemographics && (
      <>
        <div className="py-1">
          <TextInput
            type="search"
            placeholder="Search here"
            onChange={(e) => search(e.target.value)}
          />
        </div>
        <ul className="flex flex-col gap-2 max-h-[325px] overflow-y-auto">
          {[
            ...new Set(
              searchBuyergraphics(filteredDemographics).map((item) => item.key)
            ),
          ].map((item, index) => {
            return (
              <li
                key={index}
                className="relative group flex transition-all flex-col p-2 px-4 border-b-2 hover:bg-slate-100 cursor-pointer"
                onClick={() => {
                  toggleProfile({
                    key: item,
                    data: filteredDemographics.filter((it) => it.key === item),
                  });
                }}
              >
                <p className="text-lg font-semibold text-main capitalize">
                  {item}
                </p>
                <div className="text-xs text-slate-400">
                  {filteredDemographics
                    .filter((it) => it.key === item)
                    .splice(0, 3)
                    .map((profile, index) => (
                      <>
                        <span key={index} className="pl-1 first:pl-0">
                          {profile.value},
                        </span>
                      </>
                    ))}
                  ...
                </div>
                <div className="absolute top-0 right-0 h-full w-1/4 flex items-center justify-end bg-gradient-to-l from-white from-60% to-[#ffffff00] transition-all ">
                  <button
                    className={classNames(
                      "mr-4 p-1 px-2.5 text-sm border-2 border-secondary-500 text-secondary-hover hover:text-white hover:bg-secondary-500 rounded-md",
                      "transition-all"
                    )}
                    onClick={() => {
                      toggleProfile({
                        key: item,
                        data: filteredDemographics.filter(
                          (it) => it.key === item
                        ),
                      });
                    }}
                  >
                    Add
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
};

export default PlanningList;
