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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "flowbite-react";
function SiteInformation({ site }) {
  const info = billboardData.find((data) => data.location === site);
  const impressions = [
    {
      name: "January",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "February",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "March",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "April",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "May",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "June",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "July",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  const survey = [
    {
      name: "Do you currently use a mobile wallet app?",
      yes: 4000,
      no: 2400,
      amt: 2400,
    },
    {
      name: "Do you buy retail footwear like clothes or footwear at least once a month?",
      yes: 3000,
      no: 1398,
      amt: 2210,
    },
    {
      name: "Do you go to the MALLS at least once a month?",
      yes: 2000,
      no: 9800,
      amt: 2290,
    },
    {
      name: "Do you eat at a fastfood restaurant at least once a month?",
      yes: 2780,
      no: 3908,
      amt: 2000,
    },
    {
      name: "Do you visit the drugstore at least once a month?",
      yes: 1890,
      no: 4800,
      amt: 2181,
    },
  ];
  const Detail = ({ title, value }) => {
    return (
      <p className="flex flex-col gap-1">
        <span className="font-semibold">{title}</span>
        <span>{value}</span>
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
  const CustomYAxisLabel = ({ x, y, payload }) => {
    // Customize the content of the Y-axis label as needed
    return (
      <text x={x} y={y} dy={-10} fontSize={12} fill="#333" textAnchor="end">
        {payload.value}
      </text>
    );
  };
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-4 w-full">
        <div className="w-2/6 bg-white p-4 flex flex-col gap-4 shadow">
          <header className="font-bold text-xl text-main border-b-4 border-secondary pb-2">
            {info.location}
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
              <Detail title="Site Owner" value="UNITED NEON SIGN SERVICES" />
              <Detail title="Latitude" value={info.latitude} />
              <Detail title="Longitude" value={info.longitude} />
              <Detail title="Category" value="Not disclosed" />
              <Detail
                title="Venue Type"
                value="Office Buildings, Outdoor, Billboards"
              />
              <Detail title="Availability" value="No" />
            </div>
            <div className="w-1/2 flex flex-col gap-4">
              <Detail title="Board Facing" value="Not disclosed" />
              <Detail title="Facing" value="Not disclosed" />
              <Detail title="Access Type" value="Public" />
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
      <div className="bg-white p-4 shadow flex flex-col gap-4">
        <header className="font-bold text-base text-main border-b-4 border-secondary pb-2">
          Average Daily Impressions
        </header>
        <ResponsiveContainer width={"100%"} height={400}>
          <LineChart width={"100%"} height={250} data={impressions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 shadow flex flex-col gap-4">
        <header className="font-bold text-base text-main border-b-4 border-secondary pb-2">
          Average Weekly Impressions
        </header>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={impressions} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="amt" fill="#29d8a7" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 shadow flex flex-col gap-4">
        <header className="font-bold text-base text-main border-b-4 border-secondary pb-2">
          Average Monthly Impressions
        </header>
        <ResponsiveContainer width={"100%"} height={400}>
          <LineChart width={"100%"} height={250} data={impressions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 shadow flex flex-col gap-4">
        <header className="font-bold text-base text-main border-b-4 border-secondary pb-2">
          Highest Monthly Impressions
        </header>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={impressions} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="amt" fill="#1829" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 shadow flex flex-col gap-4">
        <header className="font-bold text-base text-main border-b-4 border-secondary pb-2">
          Audiences
        </header>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={survey} layout="vertical" margin={{ left: 350 }}>
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" tick={<CustomYAxisLabel />} />
            <Tooltip />
            <Legend />
            <Bar dataKey="yes" fill="#d22735" stackId="a" />
            <Bar dataKey="no" fill="#183145" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

SiteInformation.propTypes = { site: PropTypes.string };

export default SiteInformation;
