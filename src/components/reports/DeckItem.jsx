/* eslint-disable react/prop-types */
import classNames from "classnames";
import { Tooltip } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";
import { useFunction } from "~config/functions";
import { useMap } from "~config/MapsContext";
import { useReport } from "~config/ReportContext";
import { useService } from "~config/services";
import NearbyLandmarks from "./NearbyLandmarks";
import LandmarkMap from "./LandmarkMap";
import DeckImageManager from "./DeckImageManager";

const DeckItem = ({ site, onClose, ...props }) => {
  const { addImages, priceDetails, rates, showRates } = useReport();
  const { retrieveSiteImages } = useService();
  const [siteImages, setSiteImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showDetails, toggleShow] = useState(true);
  const { landmarks } = useMap();
  const { haversineDistance, capitalizeFirst } = useFunction();
  const [coordinates] = useState({
    lat: parseFloat(site.latitude),
    lng: parseFloat(site.longitude),
  });

  const nearbyLandmarks = useMemo(() => {
    return landmarks.filter((landmark) => {
      const { latitude, longitude } = landmark;
      const landmarkCoordinates = { lat: latitude, lng: longitude };
      const distance = haversineDistance(coordinates, landmarkCoordinates);

      return distance <= 100;
    });
  }, [coordinates, landmarks, haversineDistance]);

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveSiteImages(site.unis_code);
      if (response.status) {
        return;
      }
      setSiteImages(
        response.map((item) => {
          return {
            ...item,
            upload_path: "http://unis.unitedneon.com/unis/" + item.upload_path,
          };
        })
      );
    };
    setup();
  }, [site]);

  useEffect(() => {
    if (selectedImages.length <= 2) {
      addImages(site.unis_code, selectedImages);
    }
  }, [selectedImages, site.unis_code]);

  const detail = useMemo(() => {
    if (priceDetails.length === 0) return site;
    let price = parseFloat(site.price);

    const adjustedPrice = priceDetails.find((adj) =>
      adj.sites.some((s) => s.value === "all" || s.value === site.site)
    );

    if (adjustedPrice) {
      price = price + parseFloat(adjustedPrice.price);
    }

    return { ...site, updatedPrice: price };
  }, [priceDetails, site]);

  const siteRates = useMemo(() => {
    if (rates.every((rate) => rate.discount === 0)) return [];

    return rates.map((rate) => {
      const { duration, discount, type } = rate;
      const price = detail.updatedPrice ?? detail.price;

      const less = type === "percent" ? discount / 100 : discount;
      const finalPrice = type === "flat" ? price - less : price - price * less;

      return {
        duration: duration,
        price: finalPrice,
      };
    });
  }, [detail.price, detail.updatedPrice, rates]);

  const Icon = useMemo(() => {
    return showDetails ? RxCaretUp : RxCaretDown;
  }, [showDetails]);
  return (
    site && (
      <div
        id={site.unis_code}
        {...props}
        className="bg-white p-4 rounded-md shadow"
        data-target="deck-item"
      >
        <header
          role="button"
          onClick={() => toggleShow((prev) => !prev)}
          className="flex justify-between items-center border-main-500"
        >
          <Icon className="text-xl mr-4" />
          <h1 className="font-semibold text-lg text-black mr-auto">
            <span className="font-bold">{site.unis_code}</span> ({site.site})
          </h1>
          <Tooltip content="Remove" arrow={false}>
            <button
              onClick={onClose}
              className="bg-white text-red-500 rounded-full p-1 transition-all hover:text-white hover:bg-red-500"
            >
              <IoMdClose />
            </button>
          </Tooltip>
        </header>
        <div
          className={classNames(
            "space-y-4",
            showDetails ? "pt-4 h-auto" : "h-0 overflow-hidden"
          )}
        >
          <section className="grid grid-cols-2 grid-flow-row gap-1.5 bg-slate-50 p-4 rounded-md">
            <DeckField label="type" value={site.type} />
            <DeckField label="size" value={site.size} />
            <DeckField label="area" value={capitalizeFirst(site.city_name)} />
            <DeckField label="address" value={capitalizeFirst(site.address)} />
            <DeckField label="facing" value={capitalizeFirst(site.facing)} />
            <DeckField
              label="bound"
              value={site.bound?.length === 0 ? "N/A" : site.bound ?? "N/A"}
            />
            <DeckField label="traffic count" value={site.traffic_count} />
            <DeckField
              label="vicinity population"
              value={
                site.vicinity_population?.length === 0
                  ? "N/A"
                  : site.vicinity_population ?? "N/A"
              }
            />
            <DeckField label="availability" value="-TBD-" />

            {siteRates.length === 3 && showRates ? (
              <DeckField label="price">
                <table className="border">
                  <thead className="border uppercase bg-">
                    <th className="border px-2">Duration</th>
                    <th className="border px-2">Discounted Rate</th>
                  </thead>
                  <tbody>
                    {siteRates.map((rate, index) => {
                      return (
                        <tr key={index} className="border">
                          <td className="border text-center">
                            {rate.duration} Months
                          </td>
                          <td className="border text-center">
                            {Intl.NumberFormat("en-PH", {
                              style: "currency",
                              currency: "PHP",
                            }).format(rate.price)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </DeckField>
            ) : (
              <DeckField
                label="price"
                value={Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(detail.updatedPrice ?? site.price)}
              />
            )}
          </section>
          <section className="grid grid-cols-2 gap-4 bg-slate-50 rounded-md p-4">
            <div>
              <div>
                <p className="font-semibold">Nearby Landmarks</p>
                <p className="text-sm text-gray-500">
                  Select all the landmarks you want to show to the billboard
                  deck.
                </p>
              </div>
              <NearbyLandmarks
                nearbyLandmarks={nearbyLandmarks}
                site={site.unis_code}
                asBadge
              />
            </div>
            <div>
              <div>
                <p className="font-semibold">Map Preview</p>
              </div>
              <LandmarkMap site={site} />
            </div>
          </section>
          <DeckImageManager
            siteID={site.unis_code}
            images={siteImages}
            setSelectedImages={setSelectedImages}
            selectedImages={selectedImages}
          />
        </div>
      </div>
    )
  );
};

const DeckField = ({ label, value, children = null }) => {
  return (
    <div className="grid grid-cols-[1.75fr_7fr] gap-2">
      <p className="font-bold capitalize whitespace-nowrap text-xs pt-0.5">
        {label}:{" "}
      </p>
      {children ? children : <p className="capitalize text-sm">{value}</p>}
    </div>
  );
};

export default DeckItem;
