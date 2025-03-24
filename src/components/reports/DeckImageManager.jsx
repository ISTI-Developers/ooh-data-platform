/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { TbCircleCheck } from "react-icons/tb";
// import useFixedImageCrop from "~config/ImageCropper";
// import mockup from "../../assets/mockup.png";
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
            (img) => img.upload_id === image.upload_id
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

const ImageItem = ({ setSelected, image, setSelectedImages, imageIndex }) => {
  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   const img = new Image();
  //   img.src = imagePath;
  //   // img.crossOrigin = "anonymous"; // Ensure CORS compliance if needed

  //   img.onload = () => {
  //     canvas.width = img.width;
  //     canvas.height = img.height;

  //     ctx.drawImage(img, 0, 0);

  //     try {
  //       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  //       const pixels = imageData.data;

  //       let lightPixelCount = 0;
  //       let mapColorPixelCount = 0;
  //       let totalPixelCount = pixels.length / 4;

  //       for (let i = 0; i < pixels.length; i += 4) {
  //         const [r, g, b] = [pixels[i], pixels[i + 1], pixels[i + 2]];

  //         if (r > 200 && g > 200 && b > 200) lightPixelCount++;
  //         if ((g > 100 && b < 100) || (b > 100 && g < 100))
  //           mapColorPixelCount++;
  //       }

  //       const lightRatio = lightPixelCount / totalPixelCount;
  //       const mapColorRatio = mapColorPixelCount / totalPixelCount;

  //       if (!(lightRatio > 0.5 || mapColorRatio > 0.2)) {
  //         if (!hasSelected) {
  //           setSelectedImages((prev) => {
  //             const newItems = [...prev, imagePath];
  //             return newItems.length === 1 ? newItems : prev;
  //           });
  //           setSelected(true);
  //         } else {
  //           console.log("NAKASELECT NA");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("CORS Issue:", error);
  //     }
  //   };

  //   return () => {
  //     URL.revokeObjectURL(imagePath);
  //   };
  // }, [imagePath, hasSelected]);
  return (
    <>
      {/* Display the image */}
      <img
        loading="lazy"
        src={image.blob}
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
          setSelected(true);
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
    </>
  );
};

export default DeckImageManager;
