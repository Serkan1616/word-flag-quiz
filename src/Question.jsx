import { useState } from "react";

function Question({ name, flag, options, onAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    onAnswer(option === name);
  };

  return (
    <div className="flex flex-col gap-5 font-vietnam">
      <p className="flex flex-col gap-2 justify-center items-center">
        <img className="w-[60%] h-[60%]" src={flag} alt={name} />
        <span className="text-center text-lg">
          Which country does this flag belong to?
        </span>
      </p>
      <ul className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <li
            key={index}
            onClick={() => handleOptionClick(option)}
            className="p-3 rounded-2xl text-[18px] flex justify-center items-center text-white cursor-pointer transition-all duration-300"
            style={{
              background: selectedOption
                ? option === name
                  ? "#4CAF50" // Doğru cevap yeşil
                  : option === selectedOption
                  ? "#F44336" // Yanlış seçilen kırmızı
                  : "#393F6E"
                : "#393F6E",
            }}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Question;
