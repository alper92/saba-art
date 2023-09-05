import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import ImageCropDialog from "../ImageCropDialog/ImageCropDialog";

export default function AdminImagePreview({
  handleSetFileImageUrl,
  fileImageUrl,
  crop,
  zoom,
  rotation,
}) {
  const [selectedImageToCrop, setSelectedImageToCrop] = useState(null);

  function onCancel() {
    setSelectedImageToCrop(null);
    handleSetFileImageUrl("/img/preview.png");
  }

  return (
    <StyledPreview>
      {fileImageUrl === "/img/preview.png" ? "Upload preview:" : "Crop your image:"}
      {selectedImageToCrop && (
        <ImageCropDialog
          fileImageUrl={fileImageUrl}
          handleSetFileImageUrl={handleSetFileImageUrl}
          cropInit={crop}
          zoomInit={zoom}
          rotationInit={rotation}
          onCancel={onCancel}
          setSelectedImageToCrop={setSelectedImageToCrop}
        />
      )}
      <StyledImage
        src={fileImageUrl}
        alt="image preview and crop functioniality"
        height={50}
        width={50}
        onClick={
          fileImageUrl === "/img/preview.png"
            ? () => alert("Upload an image to start the cropping!")
            : () => setSelectedImageToCrop(fileImageUrl)
        }
      />
    </StyledPreview>
  );
}

const StyledPreview = styled.article`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  align-items: center;
`;

const StyledImage = styled(Image)`
  border-radius: 50%;
`;
