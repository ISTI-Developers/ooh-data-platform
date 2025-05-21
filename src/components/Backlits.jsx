import { BacklitBookButton } from "./buttons/bookButtons";
import { STATUS } from "~misc/generalAssets";
import PropTypes from "prop-types";

const Backlits = ({ direction = "SOUTH", backlitData = [], onClick, icon = "▲" }) => {
  const isSouthBound = direction === "SOUTH";
  return (
    <div className={`flex justify-evenly gap-1 ${!isSouthBound ? "mt-5" : ""}`}>
      {backlitData.map((item) => (
        <div key={item.asset_id} className="flex flex-col justify-center items-center">
          {!isSouthBound && (
            <>
              <div className="text-gray-500 text-sm uppercase tracking-wide">Backlit</div>
              <div className="text-gray-500 text-lg">{icon}</div>
            </>
          )}

          <BacklitBookButton
            text={item.asset_sales_order_code === "" ? item.asset_id : item.asset_sales_order_code}
            isDisabled={item.asset_status === STATUS.TAKEN}
            onClick={
              item.asset_status === STATUS.AVAILABLE || item.asset_status === STATUS.TAKEN
                ? () => onClick(item)
                : undefined
            }
          />

          {isSouthBound && (
            <>
              <div className="text-gray-500 text-lg">{icon}</div>
              <div className="text-gray-500 text-sm uppercase tracking-wide">Backlit</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
Backlits.propTypes = {
  direction: PropTypes.string,
  backlitData: PropTypes.array,
  onClick: PropTypes.func,
  icon: PropTypes.node,
};

export default Backlits;
