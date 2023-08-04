import React, { ChangeEvent } from "react";

interface PickStrategyProps {
  strategy: string;
  setStrategy: (str: string) => void;
}

export const PickStrategy: React.FC<PickStrategyProps> = (props) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.setStrategy(event.target.value);
  };

  return (
    <ul>
      <li>
        <label>
          <input
            type="radio"
            value="same-count"
            checked={props.strategy === "same-count"}
            onChange={handleChange}
          />
          Same Count
        </label>
      </li>
      <li>
        <label>
          <input
            type="radio"
            value="same-percent"
            checked={props.strategy === "same-percent"}
            onChange={handleChange}
          />
          Same (%)
        </label>
      </li>
      <li>
        <label>
          <input
            type="radio"
            value="same-different"
            checked={props.strategy === "same-different"}
            onChange={handleChange}
          />
          Same minus Different
        </label>
      </li>
      <li>
        <label>
          <input
            type="radio"
            value="same-squared"
            checked={props.strategy === "same-squared"}
            onChange={handleChange}
          />
          Same * Same / (same + different)
        </label>
      </li>
    </ul>
  );
};