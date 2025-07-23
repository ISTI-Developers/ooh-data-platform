/* eslint-disable react/prop-types */
import classNames from "classnames";
import { Checkbox, Label, Tooltip } from "flowbite-react";
import { useMemo, useState } from "react";
import { IoOptions } from "react-icons/io5";
import { useReport } from "~config/ReportContext";
import { tooltip } from "~config/themes";
import { v4 } from "uuid";
import Select from "react-select";
import Tabs from "~fragments/Tabs";
import { FaMinusSquare } from "react-icons/fa";

const DeckOptions = () => {
  const { setPriceDetails } = useReport();
  const [open, setOpen] = useState();
  const [activeTab, setActiveTab] = useState("price_adjustment");

  const tabs = [
    {
      name: "price_adjustment",
      content: PriceAdjustment,
    },
    {
      name: "rate_generator",
      content: RateGenerator,
    },
    {
      name: "currency_change",
      content: CurrencyChange,
    },
  ];
  return (
    <>
      <div className="relative">
        <Tooltip
          theme={tooltip}
          content="Deck Options"
          arrow={false}
          className="whitespace-nowrap"
        >
          <div
            className="rounded-md text-2xl"
            role="button"
            onClick={() => {
              setOpen((prev) => !prev);
              setPriceDetails((prev) => {
                if (prev.length === 0) {
                  return [
                    {
                      id: v4(),
                      price: 0,
                      action: "+",
                      type: "--",
                      sites: [
                        {
                          label: "All",
                          value: "all",
                        },
                      ],
                    },
                  ];
                }
                return prev;
              });
            }}
          >
            <IoOptions className="text-slate-700" />
          </div>
        </Tooltip>
        <div
          className={classNames(
            "absolute top-0 right-0 min-w-[600px] p-4 bg-white border border-gray-300 shadow-md transition-all translate-y-10 rounded space-y-4",
            open
              ? "opacity-100 pointer-events-auto z-[3]"
              : "opacity-0 pointer-events-none"
          )}
        >
          <Tabs
            tabs={tabs.map((tab) => tab.name)}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            content={
              <>
                <section
                  className={classNames(
                    tabs.find((tab) => tab.name === activeTab) !== undefined
                      ? "block space-y-2 p-2"
                      : "hidden"
                  )}
                >
                  {tabs.map((tab) => {
                    const Content = tab.content;

                    return activeTab === tab.name && <Content key={tab.name} />;
                  })}
                </section>
              </>
            }
          />
        </div>
      </div>
      <div
        onClick={() => setOpen(false)}
        className={classNames(
          "fixed top-0 left-0 bg-black w-full h-full opacity-0",
          open ? "pointer-events-auto z-[2]" : "pointer-events-none z-[1]"
        )}
      />
    </>
  );
};

const PriceAdjustment = () => {
  const { reports, priceDetails, addPriceAdjustment } = useReport();
  const canAddAnotherAdjustment = useMemo(() => {
    if (priceDetails.length === 0 || reports.length === 0) return false;

    if (priceDetails.some((details) => details.sites.length === 0))
      return false;

    if (priceDetails[0].sites.some((site) => site.value === "all")) {
      return false;
    }

    const adjustedSites = priceDetails.flatMap((detail) => detail.sites);

    if (adjustedSites.length < reports.length) return true;

    return false;
  }, [priceDetails, reports.length]);
  return (
    priceDetails.length > 0 && (
      <>
        {priceDetails.map((detail, index) => {
          return (
            <PriceAdjustmentItem details={detail} index={index} key={index} />
          );
        })}
        <button
          onClick={addPriceAdjustment}
          disabled={!canAddAnotherAdjustment}
          className={classNames(
            "ml-auto float-end w-fit px-2 py-1  rounded",
            canAddAnotherAdjustment
              ? "text-white bg-[#ec9912] cursor-pointer"
              : "text-gray-500 bg-gray-200 cursor-not-allowed"
          )}
        >
          Add new
        </button>
      </>
    )
  );
};

const RateGenerator = () => {
  const { rates, setRates, showRates: show, setShow } = useReport();

  return (
    <>
      <div className="flex items-center gap-2">
        <Checkbox
          id="rates"
          onChange={(e) => {
            setShow(e.target.checked);
          }}
        />
        <Label htmlFor="rates">Generate rates per month</Label>
      </div>
      {show && (
        <div className="flex flex-col gap-4">
          <section className="grid grid-cols-[.5fr_1fr_auto] gap-4 items-center font-bold uppercase">
            <p>Duration</p>
            <p>Discount</p>
          </section>
          {rates.map((rate, index) => {
            return (
              <section
                key={index}
                className="grid grid-cols-[.5fr_1fr_auto] items-center gap-4"
              >
                <p>{rate.duration} months</p>
                <input
                  type="number"
                  step={rate.type === "flat" ? 1000 : 1}
                  min={0}
                  max={rate.type === "percent" ? 100 : undefined}
                  value={rate.discount}
                  onChange={(e) =>
                    setRates((prev) => {
                      const updatedPrev = [...prev];
                      updatedPrev[index] = {
                        ...updatedPrev[index],
                        discount: e.target.valueAsNumber,
                      };

                      return updatedPrev;
                    })
                  }
                />
                <select
                  value={rate.type}
                  onChange={(e) =>
                    setRates((prev) => {
                      const updatedPrev = [...prev];
                      updatedPrev[index] = {
                        ...updatedPrev[index],
                        discount:
                          updatedPrev[index].discount > 100
                            ? 100
                            : updatedPrev[index].discount,
                        type: e.target.value,
                      };

                      return updatedPrev;
                    })
                  }
                >
                  <option value="flat">---</option>
                  <option value="percent">%</option>
                </select>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
};

const CurrencyChange = () => {
  const { curExchange, setCurExchange } = useReport();

  const currencyOptions = [
    { label: "PHP", value: "PHP" },
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
    { label: "JPY", value: "JPY" },
  ];

  return (
    <section className="flex flex-col gap-4">
      <p>
        Choose your preferred currency and its conversion rate to PHP. For
        reference, see the{" "}
        <a
          className="underline text-sky-500"
          href="https://www.bsp.gov.ph/sitepages/statistics/exchangerate.aspx"
        >
          BSP Exchange Rate
        </a>{" "}
        for up-to-date values.
      </p>
      <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
        <Label htmlFor="currency" value="Currency: " />
        <Select
          id="currency"
          options={currencyOptions}
          value={currencyOptions.find(
            (option) => option.value === curExchange.currency
          )}
          onChange={(newValue) => {
            setCurExchange((prev) => {
              if (newValue.value === "PHP") return { currency: "PHP", rate: 1 };

              return {
                ...prev,
                currency: newValue.value,
              };
            });
          }}
          className="w-full"
        />
        <Label htmlFor="rate" value="Peso Equivalent: " />
        <input
          type="number"
          min={1}
          step={0.01}
          value={curExchange.rate}
          onChange={(e) => {
            setCurExchange((prev) => {
              if (prev.currency === "PHP") return { ...prev, rate: 1 };

              return {
                ...prev,
                rate: e.target.valueAsNumber,
              };
            });
          }}
          className="border-gray-300 rounded"
        />
      </div>
    </section>
  );
};

const PriceAdjustmentItem = ({ details, index }) => {
  const { priceDetails, reports, setPriceDetails } = useReport();

  const reportOptions = useMemo(() => {
    if (!reports) return [];

    const selectedSites = priceDetails.flatMap((detail) => detail.sites);

    const options = reports.map((report) => ({
      label: report.site.site_code,
      value: report.site.site,
      isDisabled: details.sites.some((site) => site.value === "all"),
    }));

    return options.filter(
      (option) => !selectedSites.some((site) => site.value === option.value)
    );
  }, [details.sites, priceDetails, reports]);

  const options = useMemo(() => {
    return index === 0
      ? [
          {
            label: "All",
            value: "all",
          },
          ...reportOptions,
        ]
      : [...reportOptions];
  }, [index, reportOptions]);

  return (
    <div className="grid grid-cols-[.5fr_1fr_.5fr_1.5fr_auto] gap-4">
      <div>
        <Label htmlFor={`action_${index}`}>Action</Label>
        <select
          id={`action_${index}`}
          className="border-gray-300 rounded h-10 text-xs"
          value={details.action}
          onChange={(e) =>
            setPriceDetails((prev) => {
              console.log(prev);
              const updatedPrev = [...prev];
              updatedPrev[index] = {
                ...updatedPrev[index],
                action: e.target.value,
              };

              return updatedPrev;
            })
          }
        >
          <option value="+" className="text-xs">
            + (Add)
          </option>
          <option value="-" className="text-xs">
            — (Minus)
          </option>
        </select>
      </div>
      <div>
        <Label htmlFor={`price_${index}`}>Price</Label>
        <div className="w-full border border-gray-300 h-10 rounded flex items-center overflow-hidden">
          <p className="border-r text-lg px-2">₱</p>
          <input
            type="number"
            value={details.price}
            min={0}
            step={details.type === "--" ? 1000 : 1}
            max={details.type === "%" ? 100 : undefined}
            onChange={(e) =>
              setPriceDetails((prev) => {
                // Create a new array to avoid direct mutation
                const updatedPrices = [...prev];

                // Update the specific index
                updatedPrices[index] = {
                  ...updatedPrices[index], // Spread the existing values
                  price: e.target.valueAsNumber, // Update the price
                };

                return updatedPrices; // Return the updated array
              })
            }
            className="w-full border-none focus:ring-0 focus:outline-none focus:border-none"
          />
        </div>
      </div>
      <div>
        <Label htmlFor={`type_${index}`}>Type</Label>
        <select
          id={`type_${index}`}
          className="border-gray-300 rounded h-10"
          value={details.type}
          onChange={(e) =>
            setPriceDetails((prev) => {
              console.log(prev);
              const updatedPrev = [...prev];
              updatedPrev[index] = {
                ...updatedPrev[index],
                price:
                  updatedPrev[index].price > 100
                    ? 100
                    : updatedPrev[index].price,
                type: e.target.value,
              };

              return updatedPrev;
            })
          }
        >
          <option value="--">---</option>
          <option value="%">%</option>
        </select>
      </div>
      <div>
        <Label htmlFor={`site_${index}`}>Sites</Label>
        <Select
          value={details.sites}
          options={options}
          isMulti
          closeMenuOnSelect={false}
          onChange={(value) =>
            setPriceDetails((prev) => {
              const updatedSites = [...prev];
              const isAll = value.some((option) => option.value === "all");

              console.log(options.filter((option) => option.value !== "all"));
              updatedSites[index] = {
                ...updatedSites[index],
                sites: isAll
                  ? [{ label: "All", value: "all" }]
                  : index === 0 &&
                    options.filter((option) => option.value !== "all")
                      .length === 1
                  ? [{ label: "All", value: "all" }]
                  : value,
              };

              if (isAll) {
                return updatedSites.filter((item) =>
                  item.sites.some((site) => site.value === "all")
                );
              } else {
                return updatedSites;
              }
            })
          }
        />
      </div>
      <button
        type="button"
        disabled={priceDetails.length === 1}
        onClick={() =>
          setPriceDetails((prev) => {
            return prev.filter((_, i) => i !== index);
          })
        }
        className="text-red-700 mt-4 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        <FaMinusSquare />
      </button>
    </div>
  );
};

export default DeckOptions;
