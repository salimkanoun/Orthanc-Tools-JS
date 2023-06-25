/**
Copyright (c) 2021 - 2022 Pixilib
 */

import React from "react";
import GaelOContext from "./GaelOContext";

export default ({ studyName, token, userId, children }) => {
  return (
    <GaelOContext.Provider
      value={{
        studyName: studyName,
        token: token,
        userId: userId,
      }}
    >
      {children}
    </GaelOContext.Provider>
  );
};
