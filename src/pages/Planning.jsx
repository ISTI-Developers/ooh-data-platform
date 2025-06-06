/* eslint-disable react/prop-types */
import { Button, Accordion, ToggleSwitch } from "flowbite-react";
import Title from "~fragments/Title";
import { useEffect, useState } from "react";
import { lightButtonTheme, toggleSwitch } from "~config/themes";
import classNames from "classnames";
import { MdChecklist, MdDelete } from "react-icons/md";
import PlanningModal from "~components/planning/PlanningModal";
import AreaSelectionList from "~components/planning/AreaSelectionList";
import ProfileFilterList from "~components/planning/ProfileFilterList";
import Results from "./Results";
import { useFunction } from "~config/functions";
import { PlanningProvider, usePlanning } from "~config/PlanningContext";
function Planning() {
  const [onProfileFilters, toggleProfileFilters] = useState(false);
  const [onAreasSelected, toggleAreasSelected] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  function PlanningContainer() {
    const {
      profiles,
      setProfiles,
      areas,
      setAreas,
      addDemographics,
      profile,
      setProfile,
      allowedMultiple,
      toggleMultiple,
    } = usePlanning();
    return (
      <>
        <div className="flex flex-col gap-4">
          {windowWidth <= 1024 ? (
            <>
              <div className="bg-white shadow">
                <Accordion flush collapseAll>
                  <Accordion.Panel>
                    <Accordion.Title>Profile Filters</Accordion.Title>
                    <Accordion.Content theme={{ base: "p-0" }}>
                      <ProfileFilterList />
                    </Accordion.Content>
                  </Accordion.Panel>
                  <Accordion.Panel>
                    <Accordion.Title>Area Selection</Accordion.Title>
                    <Accordion.Content theme={{ base: "p-0" }}>
                      <AreaSelectionList />
                    </Accordion.Content>
                  </Accordion.Panel>
                </Accordion>
              </div>
              <div className="flex gap-4">
                <Button
                  color="light"
                  className="relative lg:hidden w-full"
                  onClick={() => toggleProfileFilters(true)}
                >
                  <span>Profile Wishlist</span>
                  {profiles && profiles.length > 0 && (
                    <span className="absolute -top-2 -left-2 min-h-5 min-w-5 bg-secondary text-white rounded-full animate-fade">
                      {profiles.length}
                    </span>
                  )}
                </Button>
                <Button
                  color="light"
                  className="relative lg:hidden w-full"
                  onClick={() => toggleAreasSelected(true)}
                >
                  <span>Selected Areas</span>
                  {areas && areas.length > 0 && (
                    <span className="absolute -top-2 -left-2 min-h-5 min-w-5 bg-secondary text-white rounded-full animate-fade">
                      {areas.length}
                    </span>
                  )}
                </Button>
              </div>
              <Title name="Results" />
              <Results />
            </>
          ) : (
            <>
              <div className="relative flex gap-4">
                <div className="w-[75%] flex flex-col gap-4">
                  <div className="flex flex-row items-start gap-4">
                    <div className="bg-white w-2/5 min-h-[450px] max-h-[450px] overflow-y-auto shadow-md rounded-lg">
                      <ProfileFilterList />
                    </div>
                    <div className="bg-white w-3/5 min-h-[450px] max-h-[450px] overflow-y-auto shadow-md rounded-lg">
                      <AreaSelectionList allowedMultiple={allowedMultiple} />
                    </div>
                  </div>
                  <Title name="Results" />
                  <Results />
                </div>
                <div className="w-[25%] h-full flex flex-col gap-4 sticky top-4">
                  <div className="bg-white w-full shadow-md p-2 py-4 hidden lg:flex flex-col gap-1 rounded-lg">
                    <Header
                      filter={profiles}
                      setFilter={setProfiles}
                      headerName="Profile Wishlist"
                    />
                    <ProfileFilterBody {...{ profiles, setProfiles }} />
                  </div>
                  <div className="bg-white w-full shadow-md p-2 py-4 hidden lg:flex flex-col rounded-lg">
                    <Header
                      filter={areas}
                      setFilter={setAreas}
                      headerName="Selected Areas"
                    />
                    <SelectedAreasBody {...{ areas, setAreas }} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <PlanningModal
          trigger={onProfileFilters}
          toggle={toggleProfileFilters}
          header={
            <Header
              filter={profiles}
              setFilter={setProfiles}
              headerName="Profile Wishlist"
            />
          }
          body={<ProfileFilterBody {...{ profiles, setProfiles }} />}
        />
        <PlanningModal
          trigger={profile}
          toggle={setProfile}
          header={<ProfileHeader {...{ profile }} />}
          isProfile
          body={
            <ProfileBody
              {...{
                addDemographics,
                profiles,
                setProfiles,
                profile,
                allowedMultiple,
                toggleMultiple,
              }}
            />
          }
          footer={
            <Button
              theme={lightButtonTheme}
              color="transparent"
              onClick={() => setProfile(null)}
            >
              Close
            </Button>
          }
          size="xl"
        />
        <PlanningModal
          trigger={onAreasSelected}
          toggle={toggleAreasSelected}
          header={
            <Header
              filter={areas}
              setFilter={setAreas}
              headerName="Selected Areas"
            />
          }
          body={<SelectedAreasBody {...{ areas, setAreas }} />}
        />
      </>
    );
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div className="flex justify-between items-center">
        <Title
          name={
            <>
              Site Planning
              <span className="text-blue-500">
                <MdChecklist />
              </span>
            </>
          }
        />
      </div>
      <PlanningProvider>
        <PlanningContainer />
      </PlanningProvider>
    </>
  );
}
const SelectedAreasBody = ({ areas, setAreas }) => {
  return (
    <>
      {areas?.length > 0 ? (
        <>
          <ul className="p-2 lg:py-0 max-h-[300px] overflow-y-auto flex flex-col gap-2">
            {areas.map((item, index) => {
              return (
                <li
                  key={index}
                  className="flex transition-all items-center justify-between p-2 px-4 bg-slate-50 rounded-lg"
                >
                  <p className="font-semibold text-sm">{item.city}</p>
                  <button
                    className={classNames(
                      "p-1 px-2.5 text-xs border-2 border-red-400 text-red-600 hover:bg-red-300 rounded-md",
                      "transition-all"
                    )}
                    onClick={() => {
                      const updatedAreas = [...areas];
                      updatedAreas.splice(areas.indexOf(item), 1);

                      setAreas(updatedAreas);
                    }}
                  >
                    <MdDelete />
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="w-full text-center font-semibold text-slate-400 p-6">
          No areas selected.
        </p>
      )}
    </>
  );
};
const Header = ({ filter, headerName, setFilter }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="font-semibold text-main text-lg flex gap-1 px-2 items-center justify-center lg:text-sm">
        {headerName}
        {filter && filter.length > 0 && (
          <span className="hidden min-h-5 min-w-5 lg:flex items-center justify-center bg-secondary text-white text-xs rounded-full">
            {filter.length}
          </span>
        )}
      </p>
      {filter && filter.length > 0 && (
        <>
          <Button
            color="transparent"
            onClick={() =>
              headerName === "Selected Areas" ? setFilter([]) : setFilter(null)
            }
            className="text-slate-500"
          >
            Clear
          </Button>
        </>
      )}
    </div>
  );
};
const ProfileFilterBody = ({ profiles, setProfiles }) => {
  const { capitalize } = useFunction();
  return (
    <>
      {profiles?.length > 0 ? (
        <>
          <ul className="p-2 lg:py-0 max-h-[300px] overflow-y-auto flex flex-col gap-2">
            {[...new Set(profiles.map((keys) => keys.question))].map(
              (head, index) => {
                return (
                  <li key={index} className="space-y-2">
                    <header className="text-sm font-semibold">
                      {capitalize(head, "_")}
                    </header>
                    <ul className="flex flex-col gap-2">
                      {profiles
                        .filter((filter) => filter.question === head)
                        .map((item) => (
                          <li
                            key={item.key}
                            className="flex transition-all items-center justify-between p-2 px-4 bg-slate-50 rounded-lg"
                          >
                            <p className="font-semibold text-sm text-slate-600">
                              {capitalize(item.key)}
                            </p>
                            <button
                              className={classNames(
                                "p-1 px-2.5 text-xs border-2 border-red-400 text-red-600 hover:bg-red-300 rounded-md",
                                "transition-all"
                              )}
                              onClick={() => {
                                const filters = [...profiles];
                                filters.splice(filters.indexOf(item), 1);
                                setProfiles(filters);
                              }}
                            >
                              <MdDelete />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </li>
                );
              }
            )}
          </ul>
        </>
      ) : (
        <p className="w-full text-center font-semibold text-slate-400 p-6 flex items-center justify-center text-sm">
          No profiles selected. Create your profile now!
        </p>
      )}
    </>
  );
};
const ProfileHeader = ({ profile }) => {
  const { capitalize, toSpaced } = useFunction();
  return (
    <div className="flex gap-4">
      <p className="font-semibold text-main text-lg flex gap-2">
        {capitalize(toSpaced(profile.key))}
      </p>
    </div>
  );
};
const ProfileBody = ({
  addDemographics,
  profiles,
  setProfiles,
  profile,
  allowedMultiple,
  toggleMultiple,
}) => {
  const { capitalize } = useFunction();
  const { data } = profile;
  return (
    <div className="px-2 flex flex-col gap-2">
      {profile.multi && (
        <div className="flex flex-col border-b p-2 gap-1 w-full max-w-[350px]">
          <ToggleSwitch
            label="Show Exact Match"
            theme={toggleSwitch}
            checked={allowedMultiple.find((key) => key === profile.key)}
            onChange={(checked) => {
              const profileKeyIndex = allowedMultiple.findIndex(
                (key) => key === profile.key
              );

              if (checked && profileKeyIndex === -1) {
                toggleMultiple((prev) => [...prev, profile.key]);
              } else if (!checked && profileKeyIndex !== -1) {
                toggleMultiple((prev) => {
                  const tempKeys = [...prev];
                  tempKeys.splice(profileKeyIndex, 1);
                  return tempKeys;
                });
              }
            }}
          />
          <span className="text-gray-500 text-xs">
            {allowedMultiple.find((key) => key === profile.key)
              ? "Profiles shown will align with ALL selected options"
              : "Profiles shown will align with ANY selected options"}
          </span>
        </div>
      )}
      <p>Please choose from the options below:</p>
      <section className="flex flex-wrap gap-4 pb-2 items-center">
        {data.map((dmg) => {
          return (
            <div key={dmg.key} className="py-1">
              <input
                type="checkbox"
                name={dmg.key}
                id={`${dmg.question}_${dmg.key}`}
                value={dmg.key}
                className="peer hidden"
                checked={profiles?.find((filter) => filter == dmg)}
                onChange={(e) => {
                  if (e.target.checked) {
                    //check
                    addDemographics(dmg);
                  } else {
                    const filters = [...profiles];
                    filters.splice(filters.indexOf(dmg), 1);
                    setProfiles(filters);
                  }
                }}
              />
              <label
                htmlFor={`${dmg.question}_${dmg.key}`}
                className={classNames(
                  "border-2 border-secondary-500 rounded-md text-secondary-hover font-medium",
                  "hover:bg-secondary-500 hover:text-white p-2.5 py-1",
                  "cursor-pointer peer-checked:border-green-300 peer-checked:bg-green-200 peer-checked:text-green-500"
                )}
              >
                {capitalize(dmg.key)}
              </label>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Planning;
