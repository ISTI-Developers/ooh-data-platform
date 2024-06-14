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

function BillboardGraph({ data, title }) {
  return (
    <div className="bg-white shadow p-4 w-full flex flex-col gap-4">
      <header className="text-xl font-bold text-main">{title}</header>
      <div className="flex gap-2 overflow-x-auto">
        <div className=" min-w-[768px] w-full">
          <ResponsiveContainer width={"100%"} height={500}>
            <BarChart data={data} margin={{ bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis type="number" />
              <XAxis
                type="category"
                dataKey="region"
                interval={0}
                tick={<CustomizedAxisTick />}
              />
              <Tooltip />
              <Legend verticalAlign="top" />
              <Bar dataKey="digital" fill="#183145" stackId={"1"} />
              <Bar dataKey="classic" fill="#0692da" stackId={"1"} />
              <Bar dataKey="banner" fill="#ec9912" stackId={"1"} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
const CustomizedAxisTick = ({ x, y, payload }) => {
  let label = payload.value;

  // Check if label has parenthesis and extract the content inside
  // const matches = label.match(/\(([^)]+)\)/);
  // if (matches) {
  //   label = matches[1];
  // }

  const MAX_CHARS_PER_LINE = 18;

  function wrapText(text, maxCharsPerLine) {
    const words = text.split(" ");
    let lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if (currentLine.length + word.length <= maxCharsPerLine) {
        currentLine += (currentLine === "" ? "" : " ") + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine !== "") {
      lines.push(currentLine);
    }

    return lines;
  }

  const lines = wrapText(label, MAX_CHARS_PER_LINE);

  // Calculate total height of wrapped text
  const totalHeight = lines.length * 12; // Assuming each line has a height of 12 units

  // Calculate total width of wrapped text
  // const totalWidth = lines.reduce(
  //   (max, line) => Math.max(max, line.length * 6),
  //   0
  // ); // Assuming each character has a width of 6 units

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={0}
          y={totalHeight / 2 - (lines.length - index - 1) * 14} // Centering calculation
          transform={`rotate(-45, 0, ${
            totalHeight / 2 - (lines.length - index - 1) * 14
          })`} // Rotate text diagonally
          textAnchor="end"
          fill="#666"
          fontSize={12}
        >
          {line}
        </text>
      ))}
    </g>
  );
};

BillboardGraph.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
};

CustomizedAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
};

export default BillboardGraph;
