/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Pagination } from "flowbite-react";
import { useFunction } from "~config/functions";

function GroupedGraphs({ data, CustomYAxisTick }) {
  const { toSpaced, toSentenceCase } = useFunction();
  const [audienceActivity, setAudienceActivity] = useState(null);
  const renderLegend = (props) => {
    const { payload } = props;

    return (
      <ul className="flex items-center justify-center capitalize gap-4">
        {payload.map((entry, index) => (
          <li
            key={`legend-${index}`}
            className="flex gap-1 items-center"
            style={{ color: entry.color }}
          >
            <span
              className="block w-4 h-4"
              style={{ backgroundColor: entry.color }}
            />
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };

  function CustomToolTip({ active, payload }) {
    const question = payload[0]?.payload.question;

    return (
      active && (
        <div className="bg-white shadow p-2 border">
          <p className="font-semibold">{toSentenceCase(toSpaced(question))}</p>
          <div className="flex flex-col gap-1">
            {payload.map((pl, index) => {
              return (
                <div key={index}>
                  <p
                    className="capitalize"
                    style={{ color: pl.fill }}
                  >{`${pl.name}: ${pl.value}`}</p>
                </div>
              );
            })}
          </div>
        </div>
      )
    );
  }
  CustomToolTip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
  };
  function LargeGroupedGraph({ data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculate start and end index
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the array to get the current page items
    const currentItems = data.slice(startIndex, endIndex);
    // Handle next and previous page clicks
    const onPageChange = (page) => setCurrentPage(page);
    return (
      <div className="flex flex-col gap-2 w-full items-end">
        <ResponsiveContainer
          width={"100%"}
          height={
            currentItems.length <= 3
              ? currentItems.length * 85
              : currentItems.length * 55
          }
          className="w-full"
        >
          <BarChart
            data={currentItems}
            layout="vertical"
            margin={{
              left: 150,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis
              dataKey="question"
              type="category"
              interval={0}
              fontSize={12}
              textAnchor="end"
              tick={<CustomYAxisTick />}
            />
            <XAxis type="number" domain={[0, "max"]} />
            <Tooltip content={<CustomToolTip />} />
            <Legend content={renderLegend} />
            {Object.keys(currentItems[0])
              .slice(1, 3)
              .map((key, index) => {
                return (
                  <Bar
                    dataKey={key}
                    key={key + index}
                    fill={index === 0 ? "#84b6d8" : "#5f5c97"}
                    stackId="week"
                  />
                );
              })}
          </BarChart>
        </ResponsiveContainer>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(data.length / 10)}
          onPageChange={onPageChange}
        />
      </div>
    );
  }

  LargeGroupedGraph.propTypes = {
    data: PropTypes.array,
  };
  useEffect(() => {
    const sample = data.reduce((group, question) => {
      let keys = Object.keys(question);

      const choiceKeys = keys.splice(1).join("_");
      if (!group[choiceKeys]) {
        group[choiceKeys] = [];
      }
      group[choiceKeys].push(question);
      return group;
    }, {});
    setAudienceActivity(sample);
  }, [data]);
  return (
    audienceActivity && (
      <div className="w-full flex flex-col lg:flex-row lg:flex-[1_50%] snap-start p-2 bg-slate-100 rounded transition-all duration-200 shadow-sm hover:bg-slate-200 hover:shadow-lg">
        {Object.keys(audienceActivity).map((key, index) => {
          const audience = audienceActivity[key];
          return audience.length <= 10 ? (
            <ResponsiveContainer
              key={index}
              width={"100%"}
              height={
                audience.length <= 3
                  ? audience.length * 85
                  : audience.length * 55
              }
              className="w-full"
            >
              <BarChart
                data={audience}
                layout="vertical"
                margin={{
                  left: 150,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis
                  dataKey="question"
                  type="category"
                  interval={0}
                  fontSize={12}
                  textAnchor="end"
                  tick={<CustomYAxisTick />}
                />
                <XAxis type="number" domain={[0, "max"]} />
                <Tooltip content={<CustomToolTip />} />
                <Legend content={renderLegend} />
                {Object.keys(audience[0])
                  .slice(1, 3)
                  .map((key, index) => {
                    return (
                      <Bar
                        dataKey={key}
                        key={key + index}
                        fill={index === 0 ? "#84b6d8" : "#5f5c97"}
                        stackId="week"
                      />
                    );
                  })}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <LargeGroupedGraph data={audience} />
          );
        })}
      </div>
    )
  );
}

GroupedGraphs.propTypes = {
  data: PropTypes.array,
  CustomYAxisTick: PropTypes.node,
};

export default GroupedGraphs;
