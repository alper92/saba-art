import ArtPieceForm from "@/components/AdminArtPieceForm/ArtPieceForm";
import Header from "@/components/Header/Header";
import ArtPiecesList from "@/components/AdminArtPiecesList/AdminArtPiecesList";
import useSWR from "swr";

export default function AdminHomePage({
  artPieces,
  artPieceToEdit,
  handleArtPieceToEdit,
  handleSetArtPieces,
  fileImageUrl,
  handleSetFileImageUrl,
  scrollPercent,
  handleSetScrollPercentage,
}) {
  const { data } = useSWR("/api");
  const maxWidth = 800; // maxWidth of detail page
  const maxHeight = 800; // maxHeight of detail page
  function handleImageUpload(event) {
    const imageFile = event.target.files[0];

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (load) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          } else if (height > maxHeight) {
            width = (maxHeight / height) * width;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const resizedImageData = canvas.toDataURL("image/webp", 0.7);
          console.log(resizedImageData);

          handleSetFileImageUrl(resizedImageData);
        };
        img.src = load.target.result;
      };
      reader.readAsDataURL(imageFile);
    }
  }

  async function handleAddArtPiece(newArtPieceData, id) {
    // if (artPieces.some((piece) => piece.slug === newArtPieceData.slug)) {
    //   window.alert("Name already exists. Please choose a different name.");
    // } else handleSetArtPieces([newArtPieceData, ...artPieces]);
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newArtPieceData),
    });

    if (!response.ok) {
      console.error(response.status);
      return;
    }
  }

  async function handleEditArtPiece(id) {
    // console.log(artPieceToEditData);
    const selectedArtPieceToEdit = data.find((piece) => piece.id === id);
    handleArtPieceToEdit(selectedArtPieceToEdit);
    console.log(artPieceToEdit);
    // try {
    //   const response = await fetch(`/api/${id}`, {
    //     method: "PATCH",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(editedArtPiece),
    //   });

    //   if (response.ok) {
    //     console.log("art piece deleted");
    //   } else console.log("something went wrong");
    // } catch (error) {
    //   console.log("error");
    // }
  }

  async function handleDeleteArtPiece(id) {
    await fetch(`/api/${id}`, {
      method: "DELETE",
    });
  }

  return (
    <>
      <Header scrollPercent={scrollPercent} handleSetScrollPercentage={handleSetScrollPercentage} />
      <main>
        <ArtPieceForm
          handleSetFileImageUrl={handleSetFileImageUrl}
          fileImageUrl={fileImageUrl}
          onSubmit={handleAddArtPiece}
          onChange={handleImageUpload}
        />
        <ArtPiecesList
          artPieceToEdit={artPieceToEdit}
          fileImageUrl={fileImageUrl}
          handleSetFileImageUrl={handleSetFileImageUrl}
          onSubmit={handleEditArtPiece}
          onEdit={handleEditArtPiece}
          onDelete={handleDeleteArtPiece}
          artPieces={artPieces}
          handleSetArtPieces={handleSetArtPieces}
        />
      </main>
    </>
  );
}
