import { MediaType } from './type/enum';

export function checkMediaType(url: string) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp']; // Thêm các định dạng hình ảnh khác nếu cần
  const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov']; // Thêm các định dạng video khác nếu cần

  if (!url) {
    return MediaType.UNKNOWN;
  }
  const extension = url.toString().split('.').pop()?.toLowerCase();

  if (extension && imageExtensions.includes(extension)) {
    return MediaType.IMAGE;
  } else if (extension && videoExtensions.includes(extension)) {
    return MediaType.VIDEO;
  }

  return MediaType.IMAGE;
}

export const formatCaption = (caption: string) => {
  const regexTag = /#[a-zA-Z0-9]+/g;
  const regexMention = /@[a-zA-Z0-9]+/g;

  caption = caption.replace(
    regexTag,
    (tag) => `<a style="color: #1677ff;" href='/tag/${tag.slice(1)}'>${tag}</a>`
  );
  caption = caption.replace(
    regexMention,
    (mention) => `<a style="color: #1677ff;" href='/profile/${mention.slice(1)}'>${mention}</a>`
  );
  return <div dangerouslySetInnerHTML={{ __html: caption }}></div>;
};
