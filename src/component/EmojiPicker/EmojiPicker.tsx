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
      divRef.current.focus();
      divRef.current.innerText += emojiObject.emoji;
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
        onClick={() => {
          inputRef?.current?.focus();
          divRef?.current?.focus();
          setIsEmojiPickerOpen((prev) => !prev);
        }}
        style={{ width: '22px', height: '22px' }}
        icon={faFaceSmile}
      />
    </div>
  );
};

export default EmojiPickerComponent;
