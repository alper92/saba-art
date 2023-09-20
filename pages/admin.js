import ArtPieceForm from "@/components/AdminArtPieceForm/ArtPieceForm";
import Header from "@/components/Header/Header";
import ArtPiecesList from "@/components/AdminArtPiecesList/AdminArtPiecesList";
import useSWR from "swr";
import { useRouter } from "next/router";
import ScrollUp from "@/components/ScrollUpButton/ScrollUpButton";
import Head from "next/head";

export default function AdminHomePage({
  artPieceToEdit,
  handleSetFilteredCategory,
  filteredCategory,
  active,
  handleSetActive,
  handleSetArtPieceToEdit,
  fileImageUrl,
  handleSetFileImageUrl,
  scrollPercent,
  handleSetScrollPercentage,
  handleSetCurrentFormData,
  currentFormData,
  handleSetTheme,
  handleSetCurrentTheme,
  currentTheme,
}) {
  const router = useRouter();
  const { data } = useSWR("/api", { fallbackData: [] });
  const maxWidth = 800; // maxWidth of detail page
  const maxHeight = 800; // maxHeight of detail page

  function handleImageUpload(event) {
    let imageFile = event.target.files[0];
    // console.log(imageFile);

    if (imageFile === undefined) {
      return;
    }

    if (imageFile.type === "image/vnd.microsoft.icon" || imageFile.type === "image/gif") {
      return alert(
        `Your image file type is not allowed. Valid image file types are .png, .jpg/jpeg, and webp files!`
      );
    }

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (load) {
        const img = new Image();
        img.onload = function () {
          if (imageFile.type !== "image/webp") {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            if (height <= maxHeight && width <= maxWidth) {
              return alert(
                `Your image width or height is smaller than 800px. To preserve quality, upload a larger-sized image!`
              );
            }

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

            const resizedImageData = canvas.toDataURL("image/webp");
            alert(
              `You successfully created webp image file, which is ready for the gallery! Fill out the form to add the art piece to the gallery.`
            );

            handleSetFileImageUrl(resizedImageData);
          } else {
            alert(
              `You successfully uploaded a webp image file, which is ready for the gallery! Fill out the form to add the art piece to the gallery.`
            );
            handleSetFileImageUrl(load.target.result);
            // console.log(load.target.result);
          }
        };
        img.src = load.target.result;
      };
      reader.readAsDataURL(imageFile);
    }
  }

  async function handleAddArtPiece(newArtPieceData) {
    if (data.some((piece) => piece.slug === newArtPieceData.slug)) {
      alert("Name already exists. Please choose a different name.");
    } else if (data.some((piece) => piece.imageUrl === newArtPieceData.imageUrl)) {
      window.alert(
        "Image file is already exsiting in the art gallery. Please choose a different image!"
      );
    } else if (newArtPieceData.imageUrl === "/img/preview.png" || !newArtPieceData) {
      alert("You cannot add an art piece without an image!");
    } else {
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
      router.push(`/art-pieces/${newArtPieceData.name}`);
    }
  }

  function handleArtPieceToEdit(id) {
    const selectedArtPieceToEdit = data.find((piece) => piece._id === id);
    handleSetArtPieceToEdit(selectedArtPieceToEdit);
  }

  async function handleDeleteArtPiece(id) {
    const artPieceToDelete = data.find((piece) => piece._id === id);
    const sureToDelete = confirm(`Are you sure you want to delete "${artPieceToDelete.name}"?`);
    if (sureToDelete) {
      await fetch(`/api/${id}`, {
        method: "DELETE",
      });
      alert(`You successfully deleted ${artPieceToDelete.name}!`);
    }
    const artPiecesWithoutDeletedArtPiece = filteredCategory.filter((piece) => piece._id !== id);
    handleSetFilteredCategory(artPiecesWithoutDeletedArtPiece);
  }

  return (
    <>
      <Head>
        <title>saba-art - Bilder sind Erinnerungen</title>
        <meta name="description" content="Die online Kunst-Galerie von Saba." />
      </Head>
      <Header
        scrollPercent={scrollPercent}
        handleSetScrollPercentage={handleSetScrollPercentage}
        handleSetTheme={handleSetTheme}
        handleSetCurrentTheme={handleSetCurrentTheme}
        currentTheme={currentTheme}
      />
      <main>
        <ArtPieceForm
          handleSetFileImageUrl={handleSetFileImageUrl}
          handleSetCurrentFormData={handleSetCurrentFormData}
          fileImageUrl={fileImageUrl}
          onSubmit={handleAddArtPiece}
          onChange={handleImageUpload}
          currentFormData={currentFormData}
        />
        <ArtPiecesList
          handleSetFilteredCategory={handleSetFilteredCategory}
          handleSetScrollPercentage={handleSetScrollPercentage}
          filteredCategory={filteredCategory}
          handleSetActive={handleSetActive}
          active={active}
          artPieceToEdit={artPieceToEdit}
          handleSetArtPieceToEdit={handleSetArtPieceToEdit}
          fileImageUrl={fileImageUrl}
          handleSetFileImageUrl={handleSetFileImageUrl}
          onEdit={handleArtPieceToEdit}
          onDelete={handleDeleteArtPiece}
        />
        <ScrollUp scrollPercent={scrollPercent} />
      </main>
    </>
  );
}
