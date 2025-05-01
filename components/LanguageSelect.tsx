import type { FC } from 'react';

interface Props {
  language: string;
  onChange: (value: string) => void;
}

export const LanguageSelect: FC<Props> = ({ language, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex justify-center items-center">
      <span className="mr-2 w-1/10">选择语言 :</span>
      <select
        className="flex-1 rounded-md bg-[#1F2937] px-4 py-2 text-neutral-200"
        value={language}
        onChange={handleChange}>
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>{lang.label}</option>
        ))}
      </select>
    </div>
  );
};

export const languages = [
  { value: '自然语言', label: '自然语言' },
  { value: 'ArkTs',label:'ArkTs'},
  { value: 'Android', label: 'Android Code' },
  { value: 'Assembly Language', label: 'Assembly Language' },
  { value: 'Bash', label: 'Bash' },
  { value: 'Binary Code', label: 'Binary Code' },
  { value: 'C', label: 'C' },
  { value: 'C#', label: 'C#' },
  { value: 'C++', label: 'C++' },
  { value: 'COBOL', label: 'COBOL' },
  { value: 'CSS', label: 'CSS' },
  { value: 'Clojure', label: 'Clojure' },
  { value: 'CoffeeScript', label: 'CoffeeScript' },
  { value: 'Dart', label: 'Dart' },
  { value: 'Decimal Code', label: 'Decimal Code' },
  { value: 'Elixir', label: 'Elixir' },
  { value: 'Fortran', label: 'Fortran' },
  { value: 'Go', label: 'Go' },
  { value: 'Groovy', label: 'Groovy' },
  { value: 'Haskell', label: 'Haskell' },
  { value: 'Hex Code', label: 'Hex Code' },
  { value: 'HTML', label: 'HTML' },
  { value: 'Java', label: 'Java' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'Julia', label: 'Julia' },
  { value: 'Kotlin', label: 'Kotlin' },
  { value: 'Lisp', label: 'Lisp' },
  { value: 'Lua', label: 'Lua' },
  { value: 'Matlab', label: 'Matlab' },
  { value: 'Morse Code', label: 'Morse Code' },
  { value: 'NoSQL', label: 'NoSQL' },
  { value: 'Objective-C', label: 'Objective-C' },
  { value: 'Pascal', label: 'Pascal' },
  { value: 'Perl', label: 'Perl' },
  { value: 'PHP', label: 'PHP' },
  { value: 'PL/SQL', label: 'PL/SQL' },
  { value: 'Powershell', label: 'Powershell' },
  { value: 'Python', label: 'Python' },
  { value: 'R', label: 'R' },
  { value: 'Racket', label: 'Racket' },
  { value: 'Ruby', label: 'Ruby' },
  { value: 'Rust', label: 'Rust' },
  { value: 'SAS', label: 'SAS' },
  { value: 'SQL', label: 'SQL' },
  { value: 'Scala', label: 'Scala' },
  { value: 'Swift', label: 'Swift' },
  { value: 'SwiftUI', label: 'SwiftUI' },
  { value: 'TSX', label: 'TSX' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Visual Basic .NET', label: 'Visual Basic .NET' },
];
