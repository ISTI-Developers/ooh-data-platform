import PropTypes from "prop-types";
import classNames from "classnames";
import { TextInput } from "flowbite-react";
import { demographics } from "../config/siteData";
import { FaCheck } from "react-icons/fa";
function PlanningList({
  category,
  handleAddDemographic,
  search,
  searchBuyergraphics,
  profileFilter,
}) {
  const filteredDemographics = category
    ? demographics.filter((item) => item.category === category)
    : demographics;
  return (
    <>
      <div className="py-1">
        <TextInput
          type="search"
          placeholder="Search here"
          onChange={(e) => search(e.target.value)}
        />
      </div>
      <ul className="flex flex-col gap-2 max-h-[325px] overflow-y-auto">
        {searchBuyergraphics(filteredDemographics).map((item, index) => {
          return (
            <li
              key={index}
              className="relative group flex transition-all flex-col p-2 px-4 border-b-2 hover:bg-slate-100"
            >
              <p className="font-semibold text-lg">{item.value}</p>
              <p className="capitalize">{item.key}</p>
              <button
                className={classNames(
                  "transition-all absolute top-1/2 right-10 -translate-y-1/2  rounded-full px-4 py-2 border-2 hover:text-white",
                  profileFilter &&
                    profileFilter.find((filter) => filter === item)
                    ? "pointer-events-none border-green-300 bg-green-300 text-white"
                    : "opacity-0 group-hover:opacity-100 border-secondary text-secondary hover:bg-secondary"
                )}
                onClick={() => {
                  handleAddDemographic(item);
                }}
              >
                {profileFilter &&
                profileFilter.find((filter) => filter === item) ? (
                  <>
                    <FaCheck className="text-xl" />
                  </>
                ) : (
                  "Add"
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

PlanningList.propTypes = {
  category: PropTypes.string,
  profileFilter: PropTypes.array,
  handleAddDemographic: PropTypes.func,
  search: PropTypes.func,
  searchBuyergraphics: PropTypes.func,
};

export default PlanningList;
