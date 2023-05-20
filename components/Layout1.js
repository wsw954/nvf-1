import { useState, useEffect, useContext } from "react";
import styles from "../styles/Bizzlle.module.css";
import AppContext from "/state/AppContext";

export default function Layout1({ selectedMake, selectedModel }) {
  console.log("Line 6 in Layout");
  console.log(selectedModel);
  // const [configuration, setConfiguration] = useState(null);
  // const { state, dispatch } = useContext(AppContext);

  // useEffect(() => {
  //   if (selectedMake && selectedModel) {
  //     const kebabCaseModelName = selectedModel.name
  //       .replace(/([a-z])([A-Z])/g, "$1-$2")
  //       .replace(/\s+/g, "-")
  //       .toLowerCase();
  //     import(
  //       `../configurations/${selectedMake.toLowerCase()}/${kebabCaseModelName}`
  //     ).then((config) => setConfiguration(config.default));
  //   }
  // }, [selectedMake, selectedModel]);

  // const handleChange = (choice) => {
  //   dispatch({
  //     type: "SELECT_CHOICE",
  //     payload: { choice: choice },
  //   });
  // };

  return (
    <div>
      Layout1
      {/* {configuration &&
        configuration.map(
          ({ categoryName, component: CategoryComponent, choices }) => {
            return (
              <div key={categoryName}>
                <h3>{categoryName}</h3>
                <CategoryComponent
                  categoryName={categoryName}
                  choices={choices}
                  onChange={handleChange}
                />
              </div>
            );
          }
        )} */}
    </div>
  );
}
