/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { billboardData } from "../../config/siteData";
import classic from "../../assets/classic.png";
import {
  TbBook,
  TbChartArrowsVertical,
  TbWindowMaximize,
  TbWorld,
} from "react-icons/tb";
import digital from "../../assets/digital.png";
import SiteGraph from "./SiteGraph";
import { addMonths, format, getMonth, getWeek, startOfMonth } from "date-fns";
import { Badge } from "flowbite-react";
import { useState } from "react";
import { DateRangePicker } from "../../fragments/AudienceOptions";
import Behaviorals from "./Behaviorals";
import { useParams } from "react-router-dom";
import { useFunction } from "../../config/functions";
function SiteInformation({ location }) {
  const { id } = useParams();
  const { toSpaced } = useFunction();
  const site = toSpaced(id);

  const [dates, setDateRange] = useState({
    from: new Date().setDate(new Date().getDate() - 30),
    to: new Date(),
  });
  const info = billboardData.find(
    (data) => data.location.toLowerCase() === site.toLowerCase()
  );
  const impressions = [
    {
      date: "2023-12-01",
      impressions: 54,
    },
    {
      date: "2023-12-02",
      impressions: 64,
    },
    {
      date: "2023-12-03",
      impressions: 121,
    },
    {
      date: "2023-12-04",
      impressions: 34,
    },
    {
      date: "2023-12-05",
      impressions: 52,
    },
    {
      date: "2023-12-06",
      impressions: 123,
    },
    {
      date: "2023-12-07",
      impressions: 220,
    },
    {
      date: "2023-12-08",
      impressions: 178,
    },
    {
      date: "2023-12-09",
      impressions: 99,
    },
    {
      date: "2023-12-10",
      impressions: 37,
    },
    {
      date: "2023-12-11",
      impressions: 86,
    },
    {
      date: "2023-12-12",
      impressions: 27,
    },
    {
      date: "2023-12-13",
      impressions: 101,
    },
    {
      date: "2023-12-14",
      impressions: 16,
    },
    {
      date: "2023-12-15",
      impressions: 183,
    },
    {
      date: "2023-12-16",
      impressions: 61,
    },
    {
      date: "2023-12-17",
      impressions: 200,
    },
    {
      date: "2023-12-18",
      impressions: 148,
    },
    {
      date: "2023-12-19",
      impressions: 113,
    },
    {
      date: "2023-12-20",
      impressions: 169,
    },
    {
      date: "2023-12-21",
      impressions: 210,
    },
    {
      date: "2023-12-22",
      impressions: 90,
    },
    {
      date: "2023-12-23",
      impressions: 91,
    },
    {
      date: "2023-12-24",
      impressions: 162,
    },
    {
      date: "2023-12-25",
      impressions: 147,
    },
    {
      date: "2023-12-26",
      impressions: 81,
    },
    {
      date: "2023-12-27",
      impressions: 121,
    },
    {
      date: "2023-12-28",
      impressions: 71,
    },
    {
      date: "2023-12-29",
      impressions: 182,
    },
    {
      date: "2023-12-30",
      impressions: 107,
    },
    {
      date: "2023-12-31",
      impressions: 81,
    },
    {
      date: "2024-01-01",
      impressions: 10,
    },
  ];

  const Detail = ({ title, value }) => {
    return (
      <p className="flex flex-col gap-1">
        <span className="font-semibold">{title}</span>
        {typeof value === "object" ? (
          <div className="flex gap-2 capitalize">
            {value.map((type) => (
              <Badge key={type}>{type}</Badge>
            ))}
          </div>
        ) : (
          <span className="capitalize">{value}</span>
        )}
      </p>
    );
  };
  const Card = ({ title, count, logo }) => {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        {logo}
        <p className="text-2xl font-bold">{count}K</p>
        <p className="text-secondary-hover font-semibold">{title}</p>
      </div>
    );
  };
  const calculateWeeklyImpressions = (impressions, weekNumber) => {
    return impressions
      .filter((entry) => getWeek(new Date(entry.date)) === weekNumber)
      .reduce((sum, entry) => sum + entry.impressions, 0);
  };
  const getWeeklyImpressions = () => {
    let currentWeek = null;
    let currentDate = null;
    let weeklyImpressions = [];

    impressions.forEach((entry) => {
      const currentDay = new Date(entry.date);
      const currentEntryWeek = getWeek(currentDay);

      if (currentWeek === null) {
        currentWeek = currentEntryWeek;
      }

      if (currentEntryWeek !== currentWeek) {
        // Start of the next week, save weekly impressions and reset
        weeklyImpressions.push({
          week: entry.date,
          impressions: calculateWeeklyImpressions(impressions, currentWeek),
        });

        currentWeek = currentEntryWeek;
        currentDate = entry.date;
      }
    });

    // Add the last week's impressions
    if (currentWeek !== null) {
      weeklyImpressions.push({
        week: currentDate,
        impressions: calculateWeeklyImpressions(impressions, currentWeek),
      });
    }

    return weeklyImpressions;
  };
  const calculateMonthlyImpressions = (impressions, monthStart) => {
    const monthEnd = addMonths(monthStart, 1);
    return impressions
      .filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= monthStart && entryDate < monthEnd;
      })
      .reduce((sum, entry) => sum + entry.impressions, 0);
  };

  const getMonthlyImpressions = (impressions) => {
    let currentMonthStart = null;
    let monthlyImpressions = [];

    impressions.forEach((entry) => {
      const currentDay = new Date(entry.date);
      const currentEntryMonthStart = startOfMonth(currentDay);

      if (currentMonthStart === null) {
        currentMonthStart = currentEntryMonthStart;
      }

      if (!areDatesInSameMonth(currentEntryMonthStart, currentMonthStart)) {
        // Start of the next month, save monthly impressions and reset
        monthlyImpressions.push({
          monthStart: format(new Date(currentMonthStart), "yyyy-MM-dd"),
          impressions: calculateMonthlyImpressions(
            impressions,
            currentMonthStart
          ),
        });

        currentMonthStart = currentEntryMonthStart;
      }
    });

    // Add the last month's impressions
    if (currentMonthStart !== null) {
      monthlyImpressions.push({
        monthStart: currentMonthStart.toISOString(),
        impressions: calculateMonthlyImpressions(
          impressions,
          currentMonthStart
        ),
      });
    }

    return monthlyImpressions;
  };

  const areDatesInSameMonth = (date1, date2) => {
    return getMonth(date1) === getMonth(date2);
  };
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-4 w-full">
        <div className="w-2/6 bg-white p-4 flex flex-col gap-4 shadow">
          <header className="font-bold text-xl text-main border-b-4 border-secondary pb-2">
            {toSpaced(id)}
          </header>
          <img
            src={info.type === "Classic" ? classic : digital}
            className="w-full"
          />
          <div className="font-semibold text-xl">
            <p>Type: {info.type}</p>
            <p>{`Philippines`}</p>
          </div>
        </div>
        <div className="w-4/6 bg-white p-4 flex flex-col gap-4 shadow">
          <header className="font-bold text-xl text-main border-b-4 border-secondary pb-2">
            Site Details
          </header>
          <div className="flex">
            <div className="w-1/2 flex flex-col gap-4">
              <Detail
                title="Site Owner"
                value={info.site_owner || "United Neon Sign Services"}
              />
              <Detail title="Latitude" value={info.latitude} />
              <Detail title="Longitude" value={info.longitude} />
              <Detail title="Category" value={info.category || "N/A"} />
              <Detail
                title="Venue Type"
                value={info.venue_type || "billboard"}
              />
              <Detail title="Availability" value={info.availability || "No"} />
            </div>
            <div className="w-1/2 flex flex-col gap-4">
              <Detail title="Board Facing" value={info.board_facing || "N/A"} />
              <Detail title="Facing" value={info.facing || "N/A"} />
              <Detail
                title="Access Type"
                value={info.access_type || "public"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-4 justify-evenly bg-white p-4 shadow">
        <Card
          title="Average Daily Impression"
          count={(Math.random() * 100).toFixed(2)}
          logo={<TbWindowMaximize className="text-7xl text-secondary" />}
        />
        <Card
          title="Average Weekly Impression"
          count={(Math.random() + 0.7 * 100).toFixed(2)}
          logo={<TbWorld className="text-7xl text-secondary" />}
        />
        <Card
          title="Average Monthly Impression"
          count={(Math.random() + 1.3 * 100).toFixed(2)}
          logo={<TbBook className="text-7xl text-secondary" />}
        />
        <Card
          title="Highest Monthly Impression"
          count={(Math.random() + 1.3 * 100).toFixed(2)}
          logo={<TbChartArrowsVertical className="text-7xl text-secondary" />}
        />
      </div>
      <DateRangePicker setDates={setDateRange} dates={dates} />
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <SiteGraph
          title="Average Daily Impressions"
          data={impressions}
          className="lg:col-[1/3] xl:col-[1/2]"
        />
        <SiteGraph
          title="Average Weekly Impressions"
          data={getWeeklyImpressions(impressions)}
        />
        <SiteGraph
          title="Average Monthly Impressions"
          data={getMonthlyImpressions(impressions)}
        />
      </div>
      <div className="bg-white p-4 w-full shadow flex flex-col gap-4">
        <p className="font-semibold text-main">Audience Behavior</p>
        <Behaviorals audienceData={info.analytics?.audiences} />
      </div>
    </div>
  );
}

SiteInformation.propTypes = { site: PropTypes.string };

export default SiteInformation;
