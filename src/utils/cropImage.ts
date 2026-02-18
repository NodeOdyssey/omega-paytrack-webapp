export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getCroppedImg = (
  imageSrc: string,
  crop: CropArea,
  outputWidth = 600,
  outputHeight = 600
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No canvas context');

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        outputWidth,
        outputHeight
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject('Canvas empty');
        resolve(blob);
      }, 'image/jpeg');
    };
    image.onerror = (err) => reject(err);
  });
};
