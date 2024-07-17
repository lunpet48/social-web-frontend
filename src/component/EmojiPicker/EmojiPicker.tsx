import React, { useRef, useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons';

const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref]);

  return ref;
};

const EmojiPickerComponent = ({
  inputRef,
  divRef,
}: {
  inputRef?: React.RefObject<HTMLInputElement>;
  divRef?: React.RefObject<HTMLDivElement>;
}) => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const onEmojiClick = (emojiObject: EmojiClickData, event: MouseEvent) => {
    if (inputRef?.current) {
      inputRef.current.focus();
      inputRef.current.value += emojiObject.emoji;
    }

    if (divRef?.current) {
      const selection = window.getSelection();
      if (selection) {
        // Lưu lại vị trí hiện tại của con trỏ
        const range = selection.getRangeAt(0);
        const currentPosition = range.startOffset;

        const textNode = divRef.current.childNodes[0] as Text;

        if (!textNode || textNode.nodeType !== Node.ELEMENT_NODE || !textNode.textContent) {
          // Thêm emojiObject.emoji vào vị trí hiện tại
          const currentText = divRef.current.textContent || '';
          const newText =
            currentText.slice(0, currentPosition) +
            emojiObject.emoji +
            currentText.slice(currentPosition);
          divRef.current.textContent = newText;

          // Đặt lại vị trí con trỏ sau emoji vừa thêm
          range.setStart(divRef.current.childNodes[0], currentPosition + emojiObject.emoji.length);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // Thêm emoji vào vị trí hiện tại của con trỏ
          const newText =
            textNode.textContent.slice(0, currentPosition) +
            emojiObject.emoji +
            textNode.textContent.slice(currentPosition);
          textNode.textContent = newText;

          // Đặt lại vị trí con trỏ vào sau emoji vừa thêm
          range.setStart(textNode, currentPosition + emojiObject.emoji.length);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  };

  const handleClickOutside = () => {
    setIsEmojiPickerOpen(false);
  };

  const ref = useOutsideClick(handleClickOutside);

  return (
    <div ref={ref}>
      <EmojiPicker
        open={isEmojiPickerOpen}
        onEmojiClick={onEmojiClick}
        previewConfig={{ showPreview: false }}
        skinTonesDisabled
        searchDisabled
        width={300}
        height={300}
        style={{ position: 'absolute', transform: 'translateY(-100%)' }}
      />

      <FontAwesomeIcon
        onMouseDown={(e) => {
          e.preventDefault();
          inputRef?.current?.focus();
          divRef?.current?.focus();
          setIsEmojiPickerOpen((prev) => !prev);
        }}
        style={{ width: '22px', height: '22px', cursor: 'pointer' }}
        icon={faFaceSmile}
      />
    </div>
  );
};

export default EmojiPickerComponent;
