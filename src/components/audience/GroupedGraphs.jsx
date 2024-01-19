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

function GroupedGraphs({ data, CustomYAxisTick }) {
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
          let textLength =
            audience.reduce((sum, item) => {
              return (sum += item.question.length);
            }, 0) + 20;
          textLength *= audience.length <= 3 ? 2 : 1;
          return (
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
                  left: textLength,
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
                <Tooltip />
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
