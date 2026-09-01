const PRODUCT_IMAGE_ROOT = "/api/images/posts/";
const RESPONSIVE_IMAGE_SUFFIX = /-(320|640|960)$/i;

const getImageName = (image) =>
  typeof image === "string" ? image : image?.image_name;

export const getProductImageUrl = (image, size) => {
  const imageName = getImageName(image);

  if (!imageName) return "";

  const nameWithoutExtension = imageName.replace(/\.[^/.]+$/, "");
  const hasResponsiveVersion = RESPONSIVE_IMAGE_SUFFIX.test(
    nameWithoutExtension,
  );
  const baseName = nameWithoutExtension.replace(RESPONSIVE_IMAGE_SUFFIX, "");
  const requestedSize = hasResponsiveVersion && size ? `-${size}` : "";

  return `${PRODUCT_IMAGE_ROOT}${baseName}${requestedSize}.webp`;
};
