import React, { useEffect, useState } from "react";
import apis from "../../../services/apis";
import { errorMessage } from "../../../tools/toastify";
import { Buffer } from "buffer/";
import Spinner from "../../CommonComponents/Spinner";

export default ({ orthancInstanceID }) => {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    apis.instances
      .getPreview(orthancInstanceID)
      .then((data) => {
        let srcValue = URL.createObjectURL(data);
        setImageData(srcValue);
      })
      .catch(() => {
        errorMessage("Preview loading failed");
      });
  }, [orthancInstanceID]);

  if (!imageData) return <Spinner />;
  return (
    <img style={{ maxWidth: "100%", maxHeight: "100%" }} src={imageData}></img>
  );
};
