import React from 'react';

interface Props {
  text: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

export const TextBlock: React.FC<Props> = ({
  text,
  editable = false,
  onChange = () => {},
}) => {
  return (
    <textarea
      className="resize-none min-h-[160px] md:min-h-[460px] lg:min-h-[460px] w-full bg-[#DCDCDC] p-4 text-base text-black focus:outline-none rounded-lg"
      aria-label="文本输入区"
      value={text}
      onChange={(e) => onChange(e.target.value)}
      disabled={!editable}
    />
  );
};