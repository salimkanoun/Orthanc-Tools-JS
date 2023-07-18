import React, { useEffect, useState } from "react";
import apis from "../../../services/apis";
import { errorMessage } from "../../../tools/toastify";
import { Buffer } from 'buffer/';

export default ({ orthancInstanceID }) => {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    apis.instances
      .getPreview(orthancInstanceID)
      .then((data) => {
        let srcValue =  URL.createObjectURL(data)
        console.log(srcValue)
        setImageData(data);
      })
      .catch((error) => {console.log(error) ;errorMessage("Preview loading failed")});
  }, [orthancInstanceID]);

  return <img src={imageData}></img>;
};
