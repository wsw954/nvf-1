import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Bizzlle.module.css";

export default function Layout1({
  selectedMake,
  selectedModel,
  categoryConfigurations,
}) {
  return (
    <div>
      {categoryConfigurations.map(
        ({ categoryName, component: CategoryComponent, choices }) => (
          <div key={categoryName}>
            <h3>{categoryName}</h3>
            <CategoryComponent name={categoryName} choices={choices} />
          </div>
        )
      )}
    </div>
  );
}
