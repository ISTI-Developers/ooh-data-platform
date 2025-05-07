import { useState, useRef, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { BacklitBookButton, ParapetBookButton, EntryExitButton } from "./buttons/bookButtons";
import { SIZE, STATUS } from "~misc/generalAssets";
import { RouteDisplay } from "~misc/RouteDisplay";
import Legend from "./legend";
import backlitPic from "../assets/backlit_pic.jpg";
import { useStations } from "~/config/LRTContext";
import ContractTable from "./contractTable";
import { format } from "date-fns";
const Template = ({
  station_id,
  station_name,
  backLitsSB,
  backLitsNB,
  parapetSB,
  parapetNB,
  SBentryExitButton,
  NBentryExitButton,
  southBound,
  northBound,
  handleSouthClick,
  handleNorthClick,
}) => {
  const { updateAsset, queryContracts, attachContract, queryAssetContracts, attachedContract } = useStations();

  return (
    <div className="container">
      <header className="flex justify-center items-center mb-5">
        <h1 className="text-2xl font-bold text-center">{station_name} Station</h1>
      </header>
      <hr className="h-[3px] bg-black border-none" />
      <div>
        <h1 className="text-2xl font-bold text-center">SOUTH BOUND</h1>
        <div className="flex justify-evenly gap-1 mb-5">
          {backLitsSB.map((sbBackLit) => {
            return (
              <BacklitBookButton
                key={sbBackLit.asset_id}
                text={sbBackLit.asset_sales_order_code === "" ? sbBackLit.asset_id : sbBackLit.asset_sales_order_code}
                isDisabled={sbBackLit.asset_status === STATUS.TAKEN ? true : false}
              />
            );
          })}
        </div>
        <div className="flex items-end justify-center gap-1">
          {parapetSB.map((parapet, index) => (
            <Fragment key={parapet.asset_id}>
              <ParapetBookButton
                text={
                  parapet.asset_status === STATUS.BLOCKED
                    ? ""
                    : parapet.asset_status === STATUS.TAKEN
                    ? parapet.owner
                    : parapet.owner === ""
                    ? parapet.asset_id
                    : parapet.owner
                }
                isBlocked={parapet.asset_status === STATUS.BLOCKED ? true : false}
                isDisabled={parapet.asset_status === STATUS.TAKEN ? true : false}
                isLargeParapet={parapet.asset_size === SIZE.LARGE}
                isPending={parapet.asset_status === STATUS.PENDING ? true : false}
                widthLabel={parapet.asset_dimension_width}
                heightLabel={parapet.asset_dimension_height}
              />
              {SBentryExitButton.includes(index) && <EntryExitButton key={`entry-exit-button-${index}`} />}
            </Fragment>
          ))}
        </div>
        <div className="w-full flex justify-center my-4">
          <RouteDisplay
            SouthBound={southBound}
            NorthBound={northBound}
            handleNorth={handleNorthClick}
            handleSouth={handleSouthClick}
          />
        </div>
        <div className="flex items-start justify-center gap-1">
          {parapetNB.map((parapet, index) => (
            <Fragment key={parapet.asset_id}>
              <ParapetBookButton
                text={
                  parapet.asset_status === STATUS.BLOCKED
                    ? ""
                    : parapet.asset_status === STATUS.TAKEN
                    ? parapet.owner
                    : parapet.owner === ""
                    ? parapet.asset_id
                    : parapet.owner
                }
                isBlocked={parapet.asset_status === STATUS.BLOCKED ? true : false}
                isDisabled={parapet.asset_status === STATUS.TAKEN ? true : false}
                isLargeParapet={parapet.asset_size === SIZE.LARGE}
                isPending={parapet.asset_status === STATUS.PENDING ? true : false}
                widthLabel={parapet.asset_dimension_width}
                heightLabel={parapet.asset_dimension_height}
              />
              {NBentryExitButton.includes(index) && <EntryExitButton key={`entry-exit-button-${index}`} />}
            </Fragment>
          ))}
        </div>

        <div className="flex justify-evenly gap-1 mt-5">
          {backLitsNB.map((nbBackLit) => {
            return (
              <BacklitBookButton
                key={nbBackLit.asset_id}
                text={nbBackLit.asset_sales_order_code === "" ? nbBackLit.asset_id : nbBackLit.asset_sales_order_code}
                isDisabled={nbBackLit.asset_status === STATUS.TAKEN ? true : false}
              />
            );
          })}
        </div>
      </div>
      <h1 className="text-2xl font-bold text-center">NORTH BOUND</h1>
      <hr className="h-[3px] bg-black border-none" />
      <Legend />
    </div>
  );
};

Template.propTypes = {
  station_id: PropTypes.number.isRequired,
  station_name: PropTypes.string.isRequired,
  backLitsSB: PropTypes.array,
  backLitsNB: PropTypes.array,
  parapetSB: PropTypes.array,
  parapetNB: PropTypes.array,
  SBentryExitButton: PropTypes.array,
  NBentryExitButton: PropTypes.array,
  southBound: PropTypes.string,
  northBound: PropTypes.string,
  handleSouthClick: PropTypes.func,
  handleNorthClick: PropTypes.func,
  onParapetClick: PropTypes.func,
};

export default Template;
