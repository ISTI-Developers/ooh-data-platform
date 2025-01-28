import { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { BacklitBookButton, ParapetBookButton, EntryExitButton } from "./buttons/bookButtons";
import { SIZE, STATUS } from "~fragments/generalAssets";
import { RouteDisplay } from "~fragments/RouteDisplay";
import Legend from "./legend";
const Template = ({
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
  const [selectedAssets, setSelectedAssets] = useState([]);

  const handleAssetClick = (id) => {
    if (selectedAssets.includes(id)) {
      setSelectedAssets(selectedAssets.filter((asset) => asset !== id));
    } else {
      setSelectedAssets([...selectedAssets, id]);
    }
  };

  return (
    <>
      <div>
        <header className="flex justify-between items-center mb-5">
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-center">
            {station_name} Station
          </h1>
          <p className="ml-auto">
            Selected:
            {Array.isArray(selectedAssets) ? selectedAssets.join(", ") : selectedAssets}
          </p>
        </header>

        <hr className="h-[3px] bg-black border-none" />
        <br />
        <main>
          {/* SOUTH BOUND */}
          <h1 className="text-2xl font-bold text-center">SOUTH BOUND</h1>
          {/* SOUTH BOUND BACKLIT */}
          <div className="flex justify-evenly gap-1 mb-5">
            {backLitsSB.map((sbBackLit) => {
              return (
                <BacklitBookButton
                  key={sbBackLit.asset_id}
                  text={sbBackLit.asset_sales_order_code === "" ? sbBackLit.asset_id : sbBackLit.asset_sales_order_code}
                  isDisabled={sbBackLit.asset_status === STATUS.UNAVAILABLE ? true : false}
                  isSelected={selectedAssets.includes(sbBackLit.asset_distinction)}
                  onClick={() => {
                    if (sbBackLit.asset_status === STATUS.AVAILABLE) {
                      handleAssetClick(sbBackLit.asset_distinction);
                    }
                  }}
                />
              );
            })}
          </div>
          {/* SOUTH BOUND BACKLIT END*/}

          {/* SOUTH BOUND PARAPET */}
          <div className="flex items-end justify-center gap-1">
            {parapetSB.map((parapet, index) => (
              <Fragment key={parapet.asset_id}>
                <ParapetBookButton
                  text={
                    parapet.asset_status === STATUS.BLOCKED
                      ? ""
                      : parapet.asset_status === STATUS.UNAVAILABLE
                      ? parapet.owner
                      : parapet.owner === ""
                      ? parapet.asset_id
                      : parapet.owner
                  }
                  isBlocked={parapet.asset_status === STATUS.BLOCKED ? true : false}
                  isDisabled={parapet.asset_status === STATUS.UNAVAILABLE ? true : false}
                  isLargeParapet={parapet.asset_size === SIZE.LARGE}
                  isSelected={selectedAssets.includes(parapet.asset_distinction)}
                  onClick={() => {
                    if (parapet.asset_status === STATUS.AVAILABLE) {
                      handleAssetClick(parapet.asset_distinction);
                    }
                  }}
                />
                {SBentryExitButton.includes(index) && <EntryExitButton key={`entry-exit-button-${index}`} />}
              </Fragment>
            ))}
          </div>

          {/* SOUTH BOUND PARAPET END*/}
          {/* SOUTH BOUND END */}

          <div className="w-full flex justify-center my-4">
            <RouteDisplay
              SouthBound={southBound}
              NorthBound={northBound}
              handleNorth={handleNorthClick}
              handleSouth={handleSouthClick}
            />
          </div>

          {/* NORTH BOUND */}
          {/* NORTH BOUND PARAPET */}
          <div className="flex items-start justify-center gap-1">
            {parapetNB.map((parapet, index) => (
              <Fragment key={parapet.asset_id}>
                <ParapetBookButton
                  text={
                    parapet.asset_status === STATUS.BLOCKED
                      ? ""
                      : parapet.asset_status === STATUS.UNAVAILABLE
                      ? parapet.owner
                      : parapet.owner === ""
                      ? parapet.asset_id
                      : parapet.owner
                  }
                  isBlocked={parapet.asset_status === STATUS.BLOCKED ? true : false}
                  isDisabled={parapet.asset_status === STATUS.UNAVAILABLE ? true : false}
                  isLargeParapet={parapet.asset_size === SIZE.LARGE}
                  isSelected={selectedAssets.includes(parapet.asset_distinction)}
                  onClick={() => {
                    if (parapet.asset_status === STATUS.AVAILABLE) {
                      handleAssetClick(parapet.asset_distinction);
                    }
                  }}
                />
                {NBentryExitButton.includes(index) && <EntryExitButton key={`entry-exit-button-${index}`} />}
              </Fragment>
            ))}
          </div>
          {/* NORTH BOUND PARAPET END*/}
          {/* NORTH BOUND BACKLIT */}
          <div className="flex justify-evenly gap-1 mt-5">
            {backLitsNB.map((nbBackLit) => {
              return (
                <BacklitBookButton
                  key={nbBackLit.asset_id}
                  text={nbBackLit.asset_sales_order_code === "" ? nbBackLit.asset_id : nbBackLit.asset_sales_order_code}
                  isDisabled={nbBackLit.asset_status === STATUS.UNAVAILABLE ? true : false}
                  isSelected={selectedAssets.includes(nbBackLit.asset_distinction)}
                  onClick={() => {
                    if (nbBackLit.asset_status === STATUS.AVAILABLE) {
                      handleAssetClick(nbBackLit.asset_distinction);
                    }
                  }}
                />
              );
            })}
          </div>
          {/* NORTH BOUND BACKLIT END */}
          {/* NORTH BOUND END */}
        </main>
      </div>
      <h1 className="text-2xl font-bold text-center">NORTH BOUND</h1>
      <hr className="h-[3px] bg-black border-none" />
      <Legend />
    </>
  );
};

Template.propTypes = {
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
};

export default Template;
