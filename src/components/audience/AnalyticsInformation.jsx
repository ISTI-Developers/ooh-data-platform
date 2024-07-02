import Select from "react-select";
import { Label } from "flowbite-react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import makeAnimated from "react-select/animated";

import { DateRangePicker } from "~fragments/AudienceOptions";
import SiteGraph from "./SiteGraph";
import Behaviorals from "./Behaviorals";
import { useService } from "~config/services";
import { useParams } from "react-router-dom";
import { useFunction } from "~config/functions";
import { format } from "date-fns";

function AnalyticsInformation() {
  const [dates, setDateRange] = useState({
    from: new Date("11-01-2023"),
    to: new Date(),
  });

  return (
    <>
      <SiteAnalytics dates={dates} setDateRange={setDateRange} />
      <SiteBehaviors dates={dates} />
    </>
  );
}

function SiteAnalytics({ dates, setDateRange }) {
  const [onFetching, toggleFetching] = useState(false);
  const { id } = useParams();
  const [impressions, setImpressions] = useState(null);
  const { retrieveSiteAnalytics } = useService();
  const impressionKeys = [
    "average_daily_impressions",
    "average_weekly_impressions",
    "average_monthly_impressions",
    // "highest_monthly_impression",
  ];
  const { capitalize } = useFunction();
  useEffect(() => {
    const setup = async () => {
      const response = await retrieveSiteAnalytics(id, dates);
      console.log(response);
      if (response) {
        setImpressions(response.analytics);
        console.log(response.analytics)
        toggleFetching(false);
      }
    };
    setup();
  }, [dates, id, retrieveSiteAnalytics]);

  if (!impressions) {
    return <>Loading impressions...</>;
  }

  if (impressions.error) {
    return <>Impressions not found for the selected dates</>;
  }

  return (
    <>
      <div className="flex w-full gap-4 bg-white p-4 py-8 shadow overflow-x-auto snap-x snap-mandatory">
        {impressionKeys.map((key) => {
          return (
            <Card
              key={key}
              count={impressions[key]}
              title={`Total ${capitalize(key, "_")}`}
            />
          );
        })}
      </div>
      <DateRangePicker
        setDates={setDateRange}
        dates={dates}
        showLoader={toggleFetching}
      />
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {Object.keys(impressions.impressions).map((impression) => {
          return (
            <SiteGraph
              key={impression + "_graph"}
              title={`Average ${capitalize(impression)} Impression`}
              data={impressions.impressions[impression]}
              className={
                impression === "daily" ? "lg:col-[1/3] xl:col-[1/2]" : ""
              }
              isFetching={onFetching}
            />
          );
        })}
      </div>
    </>
  );
}

function SiteBehaviors({ dates }) {
  const [onFetching, toggleFetching] = useState(false);
  const [question, searchQuestion] = useState(null);
  const [audiences, setAudiences] = useState(null);
  const { id } = useParams();
  const { retrieveSitesBehaviors } = useService();

  useEffect(() => {
    const setup = async () => {
      const { from, to } = dates;
      const response = await retrieveSitesBehaviors({
        id: id,
        from: format(new Date(from), "MM-dd-yyyy"),
        to: format(new Date(to), "MM-dd-yyyy"),
        category: "Profile",
      });
      setAudiences(response);

      toggleFetching(false);
    };
    setup();
  }, [dates, id, retrieveSitesBehaviors, toggleFetching]);
  return (
    audiences && (
      <div className="bg-white p-4 w-full shadow flex flex-col gap-4">
        <p className="font-semibold text-main">Audience Behavior</p>
        <BehaviorSearch
          questions={question}
          audiences={audiences}
          searchQuestion={searchQuestion}
        />
        <Behaviorals
          audienceData={
            question
              ? audiences.filter((audience) =>
                  question.includes(audience.question)
                )
              : audiences
          }
          isFetching={onFetching}
        />
      </div>
    )
  );
}

function BehaviorSearch({ questions, audiences, searchQuestion }) {
  const animatedComponents = makeAnimated();
  const options = audiences.map((item) => ({
    value: item.question,
    label: item.question,
  }));
  const values = questions?.map((question) => ({
    value: question,
    label: question,
  }));
  return (
    <div className="z-[2]">
      <Label htmlFor="areas" value={`Search questions`} />
      <Select
        id="areas"
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti
        value={values}
        className="min-w-[200px]"
        options={options}
        onChange={(e) => {
          const questions = [...new Set(e.map((f) => f.value))];
          if (questions.length > 0) {
            searchQuestion(questions);
          } else {
            searchQuestion(null);
          }
        }}
      />
    </div>
  );
}

function Card({ title, count }) {
  const countLength = count.toString().split(".")[0].length;
  let amount = count;
  if (countLength > 3 && countLength < 7) {
    amount /= 1000;
  } else if (countLength >= 7) {
    amount /= 1000000;
  }
  return (
    <div className="w-full min-w-full sm:min-w-[50%] lg:min-w-[unset] flex flex-col items-center justify-center gap-2 snap-start">
      <p className="text-5xl font-bold text-main-500">{`${amount.toFixed(2)}${
        countLength >= 7 ? "M" : countLength >= 4 && countLength <= 6 ? "K" : ""
      }`}</p>
      <p className="text-secondary-hover xl:text-lg font-semibold text-center">
        {title}
      </p>
    </div>
  );
}

BehaviorSearch.propTypes = {
  questions: PropTypes.object,
  audiences: PropTypes.object,
  searchQuestion: PropTypes.func,
};
SiteBehaviors.propTypes = {
  dates: PropTypes.object,
  onFetching: PropTypes.bool,
  toggleFetching: PropTypes.func,
};
export default AnalyticsInformation;
