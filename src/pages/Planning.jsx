import PropTypes from "prop-types";
import { Table, Tabs } from "flowbite-react";
import Title from "../fragments/Title";
import { useRef, useState } from "react";
import { tabTheme } from "../config/themes";
import { siteData, demographics } from "../config/siteData";
import { Link, Route, Routes } from "react-router-dom";
import Results from "./Results";
import classNames from "classnames";

function Planning() {
  const [activeTab, setTab] = useState(0);
  const [profileFilter, setFilter] = useState(null);
  const [selectedAreas, setSelectedArea] = useState([]);
  const tabs = useRef(null);

  const headers = [
    "area",
    "# fits profile",
    "% fits profile",
    "total impressions",
  ];

  const handleAddDemographic = (category, subcategory, item) => {
    // Check if the selected demographic already exists in the state
    if (profileFilter) {
      const selectedCategory = Object.keys(profileFilter).find(
        (cat) => cat === category
      );
      if (selectedCategory) {
        const sub = profileFilter[selectedCategory][subcategory];
        if (sub) {
          if (!sub.includes(item)) {
            // Update existing data
            setFilter((prev) => {
              return {
                ...prev,
                [category]: {
                  ...prev[category],
                  [subcategory]: [...sub, item],
                },
              };
            });
          }
        } else {
          // Add new subcategory
          setFilter((prev) => {
            return {
              ...prev,
              [category]: {
                ...prev[category],
                [subcategory]: [item],
              },
            };
          });
        }
      } else {
        // Add new category
        setFilter((prev) => {
          return {
            ...prev,
            [category]: {
              [subcategory]: [item],
            },
          };
        });
      }
    } else {
      // Add entirely new item
      const newItem = {
        [category]: {
          [subcategory]: [item],
        },
      };
      setFilter(newItem);
    }
  };
  const countSitesByArea = (siteData) => {
    const areaCountMap = {};

    // Iterate through the siteData array
    siteData.forEach((site) => {
      const area = site.area;

      // If the area already exists in the map, increment the count
      if (areaCountMap[area]) {
        areaCountMap[area]++;
      } else {
        // If the area doesn't exist, initialize the count to 1
        areaCountMap[area] = 1;
      }
    });

    return areaCountMap;
  };

  return (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              <Title name="Site Planning" />

              <div className="grid grid-cols-[70fr_30fr] gap-4">
                <Tabs
                  ref={tabs}
                  style="default"
                  className="w-full bg-white p-2 border-b-2 border-default"
                  theme={tabTheme}
                  onActiveTabChange={(e) => setTab(e)}
                >
                  <Tabs.Item title="All">
                    <ul className="flex flex-col gap-2 max-h-[375px]">
                      {Object.keys(demographics).map((category) => {
                        return Object.keys(demographics[category]).map(
                          (subcategory) => {
                            return demographics[category][subcategory].map(
                              (item) => {
                                return (
                                  <li
                                    key={item}
                                    className="relative group flex transition-all flex-col p-2 px-4 border-b-2 hover:bg-slate-100"
                                  >
                                    <p className="font-semibold text-lg">
                                      {item}
                                    </p>
                                    <p className="capitalize">{subcategory}</p>
                                    <button
                                      className="transition-all absolute top-1/2 right-10 -translate-y-1/2 opacity-0 group-hover:opacity-100 border-2 border-secondary text-secondary rounded-full px-4 py-2 hover:text-white hover:bg-secondary"
                                      onClick={() => {
                                        handleAddDemographic(
                                          category,
                                          subcategory,
                                          item
                                        );
                                      }}
                                    >
                                      Add
                                    </button>
                                  </li>
                                );
                              }
                            );
                          }
                        );
                      })}
                    </ul>
                  </Tabs.Item>
                  <Tabs.Item title="Demographics">
                    <PlanningList
                      category="basic"
                      handleAddDemographic={handleAddDemographic}
                    />
                  </Tabs.Item>
                  <Tabs.Item title="Purchase Behavior">
                    <PlanningList
                      category="purchase behavior"
                      handleAddDemographic={handleAddDemographic}
                    />
                  </Tabs.Item>
                  <Tabs.Item title="Media Consumption Behavior">
                    <PlanningList
                      category="media consumption"
                      handleAddDemographic={handleAddDemographic}
                    />
                  </Tabs.Item>
                </Tabs>
                <div className="bg-white w-full shadow p-2 flex flex-col gap-4">
                  <p className="font-semibold text-main">Profile Wishlist</p>
                  {profileFilter && (
                    <>
                      <ul className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                        {Object.keys(profileFilter).map((category) => {
                          return Object.keys(profileFilter[category]).map(
                            (subcategory) => {
                              return profileFilter[category][subcategory].map(
                                (item) => {
                                  return (
                                    <li
                                      key={item}
                                      className="relative group flex transition-all flex-col p-2 px-4 border-b-2 hover:bg-slate-100"
                                    >
                                      <p className="font-semibold text-lg">
                                        {item}
                                      </p>
                                      <p className="capitalize">
                                        {subcategory}
                                      </p>
                                    </li>
                                  );
                                }
                              );
                            }
                          );
                        })}
                      </ul>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-[70fr_30fr] gap-4">
                <div>
                  <Table className="border bg-white rounded-md">
                    <Table.Head className="shadow-md">
                      {headers.map((header, index) => {
                        return (
                          <Table.HeadCell key={index} className="text-main">
                            {header}
                          </Table.HeadCell>
                        );
                      })}
                    </Table.Head>
                    <Table.Body>
                      {Object.keys(countSitesByArea(siteData)).map(
                        (area, index) => {
                          const count = 100 - (13 * (index + 1)) / 4;
                          return (
                            <Table.Row key={area} className="relative group">
                              <Table.Cell>
                                <p className="flex flex-col">
                                  <span>{area}</span>
                                  <span>
                                    No. of Sites:{" "}
                                    {countSitesByArea(siteData)[area]}
                                  </span>
                                </p>
                              </Table.Cell>
                              <Table.Cell>{count}</Table.Cell>
                              <Table.Cell>{count}%</Table.Cell>
                              <Table.Cell>{Math.round(count * 13)}</Table.Cell>
                              <button
                                onClick={() => {
                                  if (!selectedAreas.includes(area)) {
                                    setSelectedArea((prev) => [...prev, area]);
                                  }
                                }}
                                className="transition-all absolute top-1/2 right-10 -translate-y-1/2 opacity-0 group-hover:opacity-100 border-2 border-secondary text-secondary rounded-full px-4 py-2 hover:text-white hover:bg-secondary"
                              >
                                Add
                              </button>
                            </Table.Row>
                          );
                        }
                      )}
                    </Table.Body>
                  </Table>
                </div>

                <div className="bg-white w-full shadow p-2 flex flex-col gap-4">
                  <p className="font-semibold text-main">Selected Areas</p>
                  {selectedAreas && (
                    <>
                      <ul className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                        {selectedAreas.map((item, index) => {
                          return (
                            <li
                              key={index}
                              className="relative group flex transition-all flex-col p-2 px-4 border-b-2 hover:bg-slate-100"
                            >
                              <p className="font-semibold text-lg">{item}</p>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </div>
              </div>
              <Link
                to="/results"
                className={classNames(
                  "w-[30%] ml-auto p-2 px-4 rounded-full text-white hover:bg-main transition-all text-center",
                  selectedAreas.length === 0 || profileFilter === null
                    ? "pointer-events-none bg-gray-700 cursor-not-allowed"
                    : "pointer-events-auto bg-secondary"
                )}
              >
                Show Results
              </Link>
            </>
          }
        />
        <Route
          path="/results"
          element={
            <Results
              profileFilters={profileFilter}
              selectedAreas={selectedAreas}
            />
          }
        />
      </Routes>
    </>
  );
}

function PlanningList({ category, handleAddDemographic }) {
  return (
    <ul className="flex flex-col gap-2 max-h-[375px]">
      {Object.keys(demographics[category]).map((subcategory) => {
        return demographics[category][subcategory].map((item) => {
          return (
            <li
              key={item}
              className="relative group flex transition-all flex-col p-2 px-4 border-b-2 hover:bg-slate-100"
            >
              <p className="font-semibold text-lg">{item}</p>
              <p className="capitalize">{subcategory}</p>
              <button
                onClick={() => {
                  handleAddDemographic(category, subcategory, item);
                }}
                className="transition-all absolute top-1/2 right-10 -translate-y-1/2 opacity-0 group-hover:opacity-100 border-2 border-secondary text-secondary rounded-full px-4 py-2 hover:text-white hover:bg-secondary"
              >
                Add
              </button>
            </li>
          );
        });
      })}
    </ul>
  );
}

PlanningList.propTypes = {
  category: PropTypes.string,
  handleAddDemographic: PropTypes.func,
};

export default Planning;
