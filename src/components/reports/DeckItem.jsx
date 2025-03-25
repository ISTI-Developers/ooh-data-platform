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
import { format, isDate } from "date-fns";
import axios from "axios";
import { MdOutlineArrowRightAlt } from "react-icons/md";

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

  const fetchImage = async (imageLink) => {
    try {
      const response = await axios.get(imageLink, {
        responseType: "blob", // This ensures binary data is received
      });

      const imgUrl = URL.createObjectURL(response.data);
      return imgUrl;
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveSiteImages(site.site_code);
      if (response.status) {
        return;
      }

      const processedImages = [];

      for (const image of response) {
        const upload_path =
          "https://unis.unitedneon.com/unis/" + image.upload_path;
        const imageBlob = await fetchImage(upload_path);
        processedImages.push({
          ...image,
          upload_path: upload_path,
          blob: imageBlob,
        });
      }
      setSiteImages(processedImages);
    };
    setup();
  }, [site]);

  useEffect(() => {
    if (selectedImages.length <= 2) {
      console.log();
      addImages(site.site_code, selectedImages);
    }
  }, [selectedImages, site.site_code]);

  const detail = useMemo(() => {
    if (priceDetails.length === 0) return site;
    let price = parseFloat(site.price);

    const adjustedPrice = priceDetails.find((adj) =>
      adj.sites.some((s) => s.value === "all" || s.value === site.site)
    );

    if (adjustedPrice) {
      let finalPrice = isNaN(adjustedPrice.price)
        ? 0
        : parseFloat(adjustedPrice.price);
      if (adjustedPrice.action === "+") {
        price =
          adjustedPrice.type === "--"
            ? price + finalPrice
            : price * (1 + finalPrice / 100);
      } else {
        price =
          adjustedPrice.type === "--"
            ? price - finalPrice
            : price * (1 - finalPrice / 100);
      }
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
        id={site.site_code}
        {...props}
        className="bg-white p-4 rounded-md shadow"
        data-target="deck-item"
      >
        {/* {console.log(site)} */}
        <header
          role="button"
          onClick={() => toggleShow((prev) => !prev)}
          className="flex justify-between items-center border-main-500"
        >
          <Icon className="text-xl mr-4" />
          <h1 className="font-semibold text-lg text-black mr-auto">
            <span className="font-bold">{site.site_code}</span>{" "}
            {/* {site.site_code !== site.site && `(${site.site})`} */}
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
            <DeckField
              label="address"
              value={capitalizeFirst(
                site.address ?? `${site.city}, ${site.region}`
              )}
            />
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
            <Availability site={site} />

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
                value={
                  <p className="flex items-center gap-1">
                    <span
                      className={classNames(
                        detail.updatedPrice &&
                          parseInt(detail.updatedPrice) !== parseInt(site.price)
                          ? "text-xs text-gray-400"
                          : ""
                      )}
                    >
                      {Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(site.price)}
                    </span>
                    {detail.updatedPrice &&
                      parseInt(detail.updatedPrice) !==
                        parseInt(site.price) && (
                        <>
                          <MdOutlineArrowRightAlt className="text-gray-400" />
                          <span className="text-green-500 font-semibold">
                            {Intl.NumberFormat("en-PH", {
                              style: "currency",
                              currency: "PHP",
                            }).format(detail.updatedPrice)}
                          </span>
                        </>
                      )}
                  </p>
                }
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
                site={site.site_code}
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
            siteID={site.site_code}
            images={siteImages}
            setSelectedImages={setSelectedImages}
            selectedImages={selectedImages}
          />
        </div>
      </div>
    )
  );
};

const Availability = ({ site }) => {
  const [endDate, availableDate] = useMemo(() => {
    if (!site.availability) return [site.end_date, null];

    return [
      format(
        new Date(
          new Date(site.end_date).setDate(new Date(site.end_date).getDate() + 1)
        ),
        "MMMM d, yyyy"
      ),
      format(
        new Date(
          new Date(site.availability).setDate(
            new Date(site.availability).getDate() + 1
          )
        ),
        "MMMM d, yyyy"
      ),
    ];
  }, [site]);
  return (
    <DeckField
      label="availability"
      value={
        <p className="flex items-center gap-1">
          <span
            className={classNames(
              isDate(availableDate) ? "text-xs text-gray-400" : ""
            )}
          >
            {endDate}
          </span>
          {availableDate ? (
            <>
             {endDate !== availableDate &&  <>
              <MdOutlineArrowRightAlt className="text-gray-400" />
              <span className="text-green-500 font-semibold">
                {availableDate}
              </span></>}
            </>
          ) : (
            "TBD"
          )}
        </p>
      }
    />
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
