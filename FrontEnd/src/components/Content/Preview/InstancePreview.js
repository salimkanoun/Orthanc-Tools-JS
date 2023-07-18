import React, { useEffect, useState } from "react";
import apis from "../../../services/apis";
import { errorMessage } from "../../../tools/toastify";

export default ({ orthancInstanceUID }) => {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    apis.instances
      .getPreview(orthancInstanceUID)
      .then((data) => setImageData(data))
      .catch(() => errorMessage("Preview loading failed"));
  }, [orthancInstanceUID]);

  return <img src={imageData}></img>;
};
