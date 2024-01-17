import { Tabs } from "flowbite-react";
import PropTypes from "prop-types";
import { tabTheme } from "../../config/themes";
import BehavioralInformation from "./BehavioralInformation";
import Loader from "~fragments/Loader";

function Behaviorals({ audienceData, isFetching }) {
  if (isFetching) {
    return (
      <div>
        <Loader height="33rem" />
      </div>
    );
  }
  if (!audienceData || audienceData?.length === 0) {
    return (
      <div className="w-full bg-slate-300 p-8 flex items-center justify-center rounded">
        <p className="text-slate-600 font-semibold">No information found.</p>
      </div>
    );
  }
  const categories = [...new Set(audienceData.map((data) => data.category))];
  return (
    <Tabs
      style="default"
      className="w-full bg-white p-2 border-b-2 border-default animate-fade"
      theme={tabTheme}
    >
      {categories.map((category) => {
        const audiences = audienceData.filter(
          (data) => data.category === category
        );
        return (
          <Tabs.Item title={category} key={category}>
            <BehavioralInformation audiences={audiences} />
          </Tabs.Item>
        );
      })}
    </Tabs>
  );
}

Behaviorals.propTypes = {
  isFetching: PropTypes.bool,
  audienceData: PropTypes.array,
};

export default Behaviorals;
