import * as css from "../Styles/CodeAreaStyles";
import BtnCustom from "./BtnCustom";
import EditorComponent, { EditorThemes } from "./EditorComponent";
import { Context } from "../Data/Context";
import {
  updateDivWidth,
  handleFontSize,
  handleCopy,
  handleConvert,
  handleDebug,
  handleCheckQuality,
} from "../Data/Action";

import { useEffect, useState, useContext } from "react";
import {
  Box,
  Select,
  useTheme,
  Image,
  Text,
  useToast,
  Spinner,
} from "@chakra-ui/react";

import { FaJava as Java } from "react-icons/fa6";
import { DiRuby as Ruby } from "react-icons/di";
import { VscDebug as DebugIcon } from "react-icons/vsc";
import {
  LiaExchangeAltSolid as ConvertIcon,
  LiaClipboardCheckSolid as QualityIcon,
} from "react-icons/lia";
import {
  MdOutlineImagesearchRoller as ThemeIcon,
  MdContentCopy as Copy,
} from "react-icons/md";
import {
  BiPlus as IncIcon,
  BiMinus as DecIcon,
  BiFontSize as FontSizeIcon,
} from "react-icons/bi";
import {
  SiJavascript as JavaScript,
  SiPython as Python,
  SiCplusplus as CPlusPlus,
  SiCplusplus as CSharp,
  SiSwift as Swift,
  SiTypescript as TypeScript,
  SiPhp as PHP,
  SiKotlin as Kotlin,
  SiRust as Rust,
} from "react-icons/si";

const CodeArea = () => {
  const toast = useToast();
  const theme = useTheme();
  const ContextColors = theme.colors;
  const {
    dispatch,
    ConvertLoading,
    DebugLoading,
    QualityLoading,
    reqActive,
    codeInpVal,
    outputVal,
  } = useContext(Context);
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>("JavaScript");
  const [fontSize, setFontSize] = useState<number>(16);
  const [currImg, setCurrImg] = useState(Languages[0].img);
  const [currentTheme, setTheme] = useState<string>("monokai");
  const [divWidth, setDivWidth] = useState<number | null>(null);

  // useEffect for changing the Editor's Width for responsiveness.
  useEffect(() => {
    updateDivWidth(setDivWidth);
    setFontSize(16);
    const handleResize = () => {
      updateDivWidth(setDivWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // useEffect for changing current language icon in language select menu.
  useEffect(() => {
    let selectedImg = Languages.filter((item: any) => {
      if (item.name == selectedLanguage) {
        return item.img;
      }
    });
    setCurrImg(selectedImg[0].img);
  }, [selectedLanguage]);

  // Change Input Code Editor value
  const handleInpEditorChange = (inpVal: any) => {
    dispatch({ type: "CODEINPCHANGE", payload: inpVal });
  };

  return (
    <Box css={css.Outer}>
      {/* Input Component */}
      <Box
        bg="bgA"
        boxShadow="shadowA"
        id="myDiv"
        css={css.BothEditorContainers}
      >
        <Box css={css.InputBtnsContainer}>
          <BtnCustom
            onClick={() =>
              handleConvert(
                dispatch,
                reqActive,
                toast,
                codeInpVal,
                selectedLanguage
              )
            }
          >
            Convert
            {ConvertLoading ? <Spinner /> : <Image as={ConvertIcon} />}
          </BtnCustom>

          <BtnCustom
            onClick={() => handleDebug(dispatch, reqActive, toast, codeInpVal)}
          >
            Debug
            {DebugLoading ? <Spinner /> : <Image as={DebugIcon} />}
          </BtnCustom>

          <BtnCustom
            onClick={() =>
              handleCheckQuality(dispatch, reqActive, toast, codeInpVal)
            }
          >
            Check Quality
            {QualityLoading ? <Spinner /> : <Image as={QualityIcon} />}
          </BtnCustom>

          <Box color="primary" css={css.FontBtnOuterBox(ContextColors.primary)}>
            <Image as={FontSizeIcon} />
            <Box>
              <Image
                onClick={() => handleFontSize(setFontSize, fontSize, -1)}
                as={DecIcon}
                color={fontSize <= 14 ? "blackB" : "blackA"}
              />
              <Text>{fontSize}</Text>
              <Image
                onClick={() => handleFontSize(setFontSize, fontSize, 1)}
                as={IncIcon}
                color={fontSize >= 42 ? "blackB" : "blackA"}
              />
            </Box>
          </Box>
        </Box>

        {/* Input Editor */}
        <EditorComponent
          name={"Input Code Editor"}
          fontSize={fontSize}
          currentTheme={currentTheme}
          divWidth={divWidth}
          readOnly={false}
          mode="javascript"
          placeholder="Type or Paste your Code here"
          value={codeInpVal}
          handleOnChange={handleInpEditorChange}
        />
      </Box>

      {/* Output Component */}
      <Box bg="bgA" boxShadow="shadowA" css={css.BothEditorContainers}>
        <Box css={css.OutputBtnsContainer}>
          <Box>
            <Select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
              }}
              icon={currImg}
              focusBorderColor={"none"}
              css={css.SelectTagCss(
                ContextColors.primary,
                ContextColors.primary,
                500
              )}
            >
              {Languages.map((item: any, ind: number) => (
                <option value={item.name} key={ind}>
                  {item.name}
                </option>
              ))}
            </Select>
          </Box>

          <Box display={["flex"]} gap={["10px"]} alignItems="center">
            <BtnCustom onClick={() => handleCopy(outputVal)}>
              <Image as={Copy} />
            </BtnCustom>

            <Select
              value={currentTheme}
              onChange={(e) => {
                setTheme(e.target.value);
              }}
              icon={<ThemeIcon />}
              focusBorderColor={"none"}
              css={css.SelectTagCss(
                ContextColors.primary,
                ContextColors.primary,
                400
              )}
            >
              {EditorThemes.map((item: any, ind: number) => (
                <option value={item.theme} key={ind}>
                  {item.name}
                </option>
              ))}
            </Select>
          </Box>
        </Box>

        <EditorComponent
          name={"Output Editor"}
          fontSize={fontSize}
          currentTheme={currentTheme}
          divWidth={divWidth}
          readOnly={true}
          mode="xml"
          placeholder="Your Output Will Come here..."
          value={outputVal}
        />
      </Box>
    </Box>
  );
};

export default CodeArea;

// Languages Array
export const Languages = [
  {
    img: <JavaScript />,
    name: "JavaScript",
  },
  {
    img: <Python />,
    name: "Python",
  },
  {
    img: <Java />,
    name: "Java",
  },
  {
    img: <CPlusPlus />,
    name: "C++",
  },
  {
    img: <CSharp />,
    name: "C#",
  },
  {
    img: <Ruby />,
    name: "Ruby",
  },
  {
    img: <Swift />,
    name: "Swift",
  },
  {
    img: <TypeScript />,
    name: "TypeScript",
  },
  {
    img: <PHP />,
    name: "PHP",
  },
  {
    img: <Kotlin />,
    name: "Kotlin",
  },
  {
    img: <Rust />,
    name: "Rust",
  },
];
