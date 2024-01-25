/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { useFunction } from "../../config/functions";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import GroupedGraphs from "./GroupedGraphs";
function BehavioralInformation({ audiences = [] }) {
  const { capitalize, toSentenceCase, toSpaced, colors } = useFunction();
  const [audienceResponse, setAudienceResponse] = useState(null);
  const [audienceActivity, setAudienceActivity] = useState(null);

  useEffect(() => {
    const yesNoChoices = ["yes", "no"];
    const weekChoices = ["weekends", "weekdays"];
    let transformedData = [];
    const groupedYesNo = audiences.filter((item) =>
      item.responses.every((response) =>
        yesNoChoices.includes(response.choice.toLowerCase())
      )
    );
    const groupedWeek = audiences.filter((item) =>
      item.responses.every((response) =>
        weekChoices.includes(response.choice.toLowerCase())
      )
    );

    const updatedAudience = audiences.filter(
      (item) =>
        !item.responses.every(
          (response) =>
            yesNoChoices.includes(response.choice.toLowerCase()) ||
            weekChoices.includes(response.choice.toLowerCase())
        )
    );
    if (groupedYesNo.length === 1) {
      updatedAudience.push(...groupedYesNo);
      groupedYesNo.splice(0, 1);
    }
    if (groupedYesNo.length !== 0) {
      transformedData = groupedYesNo.map((item) => {
        const transformedItem = { question: item.question };

        // Initialize counts for each choice
        yesNoChoices.forEach((choice) => {
          transformedItem[choice] = 0;
        });

        // Update counts based on responses
        item.responses.forEach((response) => {
          const choice = response.choice.toLowerCase();
          if (yesNoChoices.includes(choice)) {
            transformedItem[choice] += response.count;
          }
        });

        return transformedItem;
      });
    }
    if (groupedWeek.length !== 0) {
      transformedData.push(
        ...groupedWeek.map((item) => {
          const transformedItem = { question: item.question };

          // Initialize counts for each choice
          weekChoices.forEach((choice) => {
            transformedItem[choice] = 0;
          });

          // Update counts based on responses
          item.responses.forEach((response) => {
            const choice = response.choice.toLowerCase();
            if (weekChoices.includes(choice)) {
              transformedItem[choice] += response.count;
            }
          });

          return transformedItem;
        })
      );
    }

    setAudienceResponse(updatedAudience.length !== 0 ? updatedAudience : null);
    setAudienceActivity(transformedData.length !== 0 ? transformedData : null);
  }, [audiences]);

  const renderLabel = (contents) => {
    return (contents.percent * 100).toFixed(2) + "%";
  };
  const renderLegend = (responses) => {
    return (
      <div className="flex flex-wrap gap-1 text-sm text-slate-600 justify-center">
        {responses.map((entry, index) => (
          <p key={`item-${index}`} className="flex items-center">
            <span
              className="block w-2 h-2 mr-2"
              style={{ backgroundColor: colors[index] }}
            />
            {capitalize(entry.choice)}
          </p>
        ))}
      </div>
    );
  };
  const CustomYAxisTick = ({ x, y, payload }) => {
    // Customize the appearance of the ticks here
    const maxWordsPerLine = 30;
    const textStyle = { fontSize: 12, fill: "#4f4f4f", fontWeight: "bold" };

    // Split the text into multiple lines
    let text = toSentenceCase(toSpaced(payload.value));
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      if (
        (currentLine + words[i]).length <= maxWordsPerLine ||
        currentLine === ""
      ) {
        currentLine += (currentLine === "" ? "" : " ") + words[i];
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);

    return (
      <g transform={`translate(${x},${y})`}>
        {lines.map((line, index) => (
          <text
            key={index}
            x={0}
            y={index * 12} // Adjust spacing between lines
            dy={index === 0 ? 0 : 1.2}
            textAnchor="end"
            style={textStyle}
          >
            {line}
          </text>
        ))}
      </g>
    );
  };
  return audienceActivity || audienceResponse ? (
    <>
      <div className="w-full max-h-[80vh] snap-y snap-mandatory overflow-y-auto flex flex-wrap gap-4 scrollbar-thin scrollbar-thumb-secondary-500 scrollbar-thumb-rounded-full">
        {audienceResponse &&
          audienceResponse.map((res, index) => {
            const { question } = res;
            let rawResponses = res.responses;
            let responses = rawResponses.map((response) => ({
              ...response,
              count: parseInt(response.count),
            }));
            return (
              <div
                key={index}
                className="w-full snap-start flex-[1_50%] md:flex-[1_40%] lg:flex-[1_30%] p-2 bg-slate-100 rounded transition-all duration-200 shadow-sm hover:bg-slate-200 hover:shadow-lg"
              >
                <p className="text-main font-semibold border-b pb-1">
                  {toSentenceCase(toSpaced(question))}
                </p>
                <ResponsiveContainer
                  width={"100%"}
                  height={350}
                  className="w-full"
                >
                  {responses.length <= 6 ? (
                    <PieChart className="outline-none" margin={{ top: 7 }}>
                      <Pie
                        data={responses}
                        dataKey="count"
                        nameKey="choice"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={110}
                        label={renderLabel}
                      >
                        {responses.map((entry, index) => {
                          entry.color = colors[index];
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              className="outline-none"
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip content={<CustomToolTip />} />
                      <Legend
                        verticalAlign="top"
                        content={() => renderLegend(responses)}
                      />
                    </PieChart>
                  ) : (
                    <BarChart data={responses}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="choice"
                        interval={0}
                        height={60}
                        angle={-40}
                        fontSize={12}
                        textAnchor="end"
                      />
                      <YAxis />
                      <Tooltip content={<CustomToolTip />} />
                      <Legend />
                      <Bar dataKey="count" fill={colors[index]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            );
          })}
        {audienceActivity && (
          <GroupedGraphs
            CustomYAxisTick={CustomYAxisTick}
            data={audienceActivity}
          />
        )}
      </div>
    </>
  ) : (
    <></>
  );
}
function CustomToolTip({ active, payload }) {
  return (
    active && (
      <div className="bg-white shadow p-2 border">
        <p className="capitalize">{`${
          payload[0].name === "count"
            ? payload[0].payload.choice
            : payload[0].name
        }: ${Math.round(payload[0]?.value)}`}</p>
      </div>
    )
  );
}
CustomToolTip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};
BehavioralInformation.propTypes = {
  audiences: PropTypes.array,
};

export default BehavioralInformation;
