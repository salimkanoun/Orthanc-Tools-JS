import React, { useEffect, useState } from "react";
import apis from "../../../services/apis";
import { errorMessage } from "../../../tools/toastify";

export default ({ orthancInstanceID }) => {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    apis.instances
      .getPreview(orthancInstanceID)
      .then((data) => {
        let base64ImageString = Buffer.from(data, "binary").toString("base64");
        let srcValue = "data:image/png;base64," + base64ImageString;
        setImageData(srcValue);
      })
      .catch((error) => {console.log(error) ;errorMessage("Preview loading failed")});
  }, [orthancInstanceID]);

  return <img src={imageData}></img>;
};
