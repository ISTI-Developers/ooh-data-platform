/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import { TbCircleCheck } from "react-icons/tb";
import { useReport } from "~config/ReportContext.backup";

const DeckImageManager = ({
  siteID,
  images,
  selectedImages,
  setSelectedImages,
}) => {
  const [show, toggleShow] = useState(false);
  const [hasSelected, setSelected] = useState(false);

  const siteImages = useMemo(() => {
    // Return the sorted images, or limit the number based on 'show'
    return show ? images : images.slice(0, 5);
  }, [images, show]);

  return (
    <section
      id={siteID}
      className="bg-slate-50 w-full p-4 rounded-md flex flex-col gap-4"
    >
      <h1 className="">Site Images</h1>
      <div className="flex flex-wrap gap-4">
        {siteImages.map((image) => {
          const imageIndex = selectedImages.findIndex(
            (img) => JSON.stringify(img) === JSON.stringify(image)
          );

          return (
            <div
              role="checkbox"
              key={image.upload_id}
              className="relative select-none"
            >
              <ImageItem
                hasSelected={hasSelected}
                setSelected={setSelected}
                image={image}
                setSelectedImages={setSelectedImages}
                imageIndex={imageIndex}
              />
            </div>
          );
        })}
        {images.length > 5 && (
          <button onClick={() => toggleShow((prev) => !prev)}>
            {show ? "Collapse" : "Expand"}
          </button>
        )}
      </div>
    </section>
  );
};

const ImageItem = ({
  hasSelected,
  setSelected,
  image,
  setSelectedImages,
  imageIndex,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create a new Image object and load the image into it
    const img = new Image();
    img.src = image.upload_path;
    img.crossOrigin = "anonymous"; // Ensure CORS compliance if needed

    img.onload = () => {
      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Get pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      let lightPixelCount = 0;
      let mapColorPixelCount = 0;
      let totalPixelCount = 0;

      // Loop through the pixels
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Light background pixels (white or light gray)
        if (r > 200 && g > 200 && b > 200) {
          lightPixelCount++;
        }

        // Map-like colors (green or blue)
        if ((g > 100 && b < 100) || (b > 100 && g < 100)) {
          mapColorPixelCount++;
        }

        totalPixelCount++;
      }

      const lightRatio = lightPixelCount / totalPixelCount;
      const mapColorRatio = mapColorPixelCount / totalPixelCount;

      if (!(lightRatio > 0.5 || mapColorRatio > 0.2)) {
        if (!hasSelected) {
          setSelectedImages((prev) => {
            const newItems = [...prev, image];

            if (newItems.length === 1) {
              return newItems;
            }
            return prev;
          });
          setSelected(true);
        } else {
          console.log("NAKASELECT NA");
        }
      }
    };
  }, [image, hasSelected]);

  return (
    <>
      {/* Display the image */}
      <img
        loading="lazy"
        src={image.upload_path}
        alt=""
        className="h-full max-h-[125px]"
        onClick={() => {
          setSelectedImages((prev) => {
            const newItems = [...prev, image];

            if (newItems.length <= 2) {
              return newItems;
            } else {
              alert("You can only select 2 images");
              return prev;
            }
          });
        }}
      />
      {/* Overlay for selected images */}
      {imageIndex !== -1 && (
        <div
          id={`selected-${imageIndex}`}
          role="checkbox"
          className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center"
          onClick={() =>
            setSelectedImages((prev) => {
              return prev.filter((item) => item.upload_id !== image.upload_id);
            })
          }
        >
          <TbCircleCheck className="text-white text-7xl" />
        </div>
      )}
      {/* Hidden canvas for image analysis */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </>
  );
};

export default DeckImageManager;
