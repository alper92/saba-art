import "@fortawesome/fontawesome-svg-core/styles.css";
import GlobalStyle from "../styles";
import { useState } from "react";
import { SWRConfig } from "swr";
import useSWR from "swr";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const { data } = useSWR("/api", fetcher, { fallbackData: [] });

  const [artPieceToEdit, setArtPieceToEdit] = useState([]);
  const [fileImageUrl, setfileImageUrl] = useState("/img/preview.png");

  const [filteredCategory, setFilteredCategory] = useState(data);

  const [scrollPercent, setScrollPercent] = useState(0);

  const [activeCategory, setActiveCategory] = useState();

  const [previewoption, setpreviewoption] = useState("slideShow");

  const [currentFormData, setCurrentFormData] = useState({
    name: "",
    date: "",
    description: "",
    category: "Impression",
    technique: "Oil",
    widthReal: "",
    heightReal: "",
  });

  const [currentTheme, setCurrentTheme] = useLocalStorageState("mode", { defaultValue: "dark" });

  const [theme, setTheme] = useLocalStorageState("theme-color-set", {
    defaultValue: {
      primarycolor: "white",
      fontcolor: "black",
      secondarycolor: "#391b0e",
      tertiarycolor: "#a48676",
      boxcolor: "#f4f4f4",
      boxshadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
      coolbrown: "#d9cbc4",
      highlight: "#dee1e6",
    },
  });

  function handleSetArtPieceToEdit(artPieceToEdit) {
    setArtPieceToEdit(artPieceToEdit);
  }

  function handleSetFileImageUrl(fileImageUrl) {
    setfileImageUrl(fileImageUrl);
  }

  function handleSetFilteredCategory(filteredCategory) {
    setFilteredCategory(filteredCategory);
  }

  function handleSetScrollPercentage(scrollPercent) {
    setScrollPercent(scrollPercent);
  }

  function handleSetActiveCategory(activeCategory) {
    setActiveCategory(activeCategory);
  }

  function handleSetPreviewOption(previewoption) {
    setpreviewoption(previewoption);
  }

  function handleSetCurrentFormData(currentFormData) {
    setCurrentFormData(currentFormData);
  }

  function handleSetTheme(theme) {
    setTheme(theme);
  }

  function handleSetCurrentTheme(currentTheme) {
    setCurrentTheme(currentTheme);
  }

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor && theme && theme.coolbrown) {
      metaThemeColor.setAttribute("content", theme.coolbrown);
    }
  }, [theme]);

  return (
    <>
      <GlobalStyle
        $primarycolor={theme.primarycolor}
        $fontcolor={theme.fontcolor}
        $secondarycolor={theme.secondarycolor}
        $tertiarycolor={theme.tertiarycolor}
        $boxcolor={theme.boxcolor}
        $boxshadow={theme.boxshadow}
        $coolbrown={theme.coolbrown}
        $highlight={theme.highlight}
      />

      <SWRConfig value={{ fetcher }}>
        <SessionProvider session={session}>
          <Component
            {...pageProps}
            artPieceToEdit={artPieceToEdit}
            filteredCategory={filteredCategory}
            fileImageUrl={fileImageUrl}
            scrollPercent={scrollPercent}
            activeCategory={activeCategory}
            previewoption={previewoption}
            currentTheme={currentTheme}
            handleSetCurrentTheme={handleSetCurrentTheme}
            currentFormData={currentFormData}
            handleSetPreviewOption={handleSetPreviewOption}
            handleSetFileImageUrl={handleSetFileImageUrl}
            handleSetArtPieceToEdit={handleSetArtPieceToEdit}
            handleSetFilteredCategory={handleSetFilteredCategory}
            handleSetScrollPercentage={handleSetScrollPercentage}
            handleSetActiveCategory={handleSetActiveCategory}
            handleSetCurrentFormData={handleSetCurrentFormData}
            handleSetTheme={handleSetTheme}
          />
        </SessionProvider>
      </SWRConfig>
    </>
  );
}
