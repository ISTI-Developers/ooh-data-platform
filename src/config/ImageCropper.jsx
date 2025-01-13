import { useRef, useState } from "react";

const useFixedImageCrop = () => {
  const canvasRef = useRef(document.createElement("canvas"));
  const [croppedImage, setCroppedImage] = useState(null);

  const cropImage = (imageSrc, removePixels) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const newWidth = image.width - removePixels * 2;
      const newHeight = image.height;

      const cropX = removePixels;
      const cropY = 0;

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(
        image,
        cropX,
        cropY,
        newWidth,
        newHeight,
        0,
        0,
        newWidth,
        newHeight
      );

      const dataURL = canvas.toDataURL("image/png");
      setCroppedImage(dataURL);
    };
  };

  return { cropImage, croppedImage };
};

export default useFixedImageCrop;
