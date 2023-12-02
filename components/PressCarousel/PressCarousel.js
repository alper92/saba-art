import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import also needed for GalleryCarousel!
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import styled from "styled-components";
import pressCarouselData from "./pressCarouselData";
import { CloseButton, ModalContent } from "../GalleryCarouselPreview/GalleryCarousel";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { pdfjs } from "react-pdf";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

export default function ImageCarousel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  function openModalPressSlider(article) {
    setSelectedArticle(article);
    setIsModalOpen(true);
  }

  function closeModalPressSlider() {
    setSelectedArticle(null);
    setIsModalOpen(false);
  }

  return (
    <section>
      <h2>Presseartikel über Saba:</h2>
      <CarouselWrapper>
        <Carousel
          axis={"horizontal"}
          showIndicators={false}
          dynamicHeight={false}
          showThumbs={false}
          infiniteLoop={true}
          stopSwipingPropagation={true}
          preventMovementUntilSwipeScrollTolerance={true}
          swipeScrollTolerance={100}
        >
          {pressCarouselData.map((article) => (
            <div key={article._id}>
              <StyledImage
                src={article.imageUrl}
                alt={article.name}
                aria-label={article.name}
                priority={true}
                width={1000}
                height={1000}
              />
              <StyledCarouselLinkWrapper onClick={() => openModalPressSlider(article)}>
                <StyledLegend>
                  {article.legendText} - {article.dateOfArticle}
                </StyledLegend>
              </StyledCarouselLinkWrapper>
            </div>
          ))}
        </Carousel>
        {isModalOpen && selectedArticle && (
          <ModalContent>
            <CloseButton onClick={closeModalPressSlider}>
              Schließen <FontAwesomeIcon icon={faXmark} />
            </CloseButton>
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}
            >
              <Viewer fileUrl={selectedArticle.pdfLink} />
            </Worker>
          </ModalContent>
        )}
      </CarouselWrapper>
    </section>
  );
}

const CarouselWrapper = styled.div`
  width: 85%;
  margin: 2rem auto;
  position: relative;
`;

const StyledCarouselLinkWrapper = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
`;

const StyledImage = styled(Image)`
  position: relative;
  object-fit: cover;
  width: 100%;
  height: 60vh;
  opacity: 0.4;
`;

const StyledLegend = styled.span`
  position: absolute;
  text-align: justify;
  color: var(--font-color);
  background-color: var(--box-color);
  display: block;
  padding: 0.5rem;
  border-top: 2px solid var(--tertiary-color);
  bottom: 0px;
  right: 0px;
  width: 100%;
  height: auto;
  opacity: 0.9;
`;

// The model styles are imported from GalleryCarousel.js!
