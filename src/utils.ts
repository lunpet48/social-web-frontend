import { MediaType } from "./type/enum";

export function checkMediaType(url: string) {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"]; // Thêm các định dạng hình ảnh khác nếu cần
  const videoExtensions = ["mp4", "webm", "ogg", "avi", "mov"]; // Thêm các định dạng video khác nếu cần

  if (!url) {
    return MediaType.UNKNOWN;
  }
  const extension = url.toString().split(".").pop()?.toLowerCase();

  if (extension && imageExtensions.includes(extension)) {
    return MediaType.IMAGE;
  } else if (extension && videoExtensions.includes(extension)) {
    return MediaType.VIDEO;
  }

  return MediaType.UNKNOWN;
}
