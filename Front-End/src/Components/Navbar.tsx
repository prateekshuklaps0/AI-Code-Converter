import * as css from "../Styles/NavbarStyles";
import Logo from "../Data/code.webp";
import NoDataImg from "../Data/NoData.svg";
import NoUserFoundImg from "../Data/NoUserFound.svg";
import ImportLogo from "../Data/ImportLogo.svg";

import {
  Box,
  Text,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Progress,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import {
  GoRepoForked as RepoIconOutline,
  GoFile as FileIconOutline,
} from "react-icons/go";
import { HiOutlineCode as ImportCodeIcon } from "react-icons/hi";
import { TbArrowBack as GoBackIcon } from "react-icons/tb";
import {
  FaFolderOpen as FolderIconFilled,
  FaRegFolderOpen as FolderIconOutline,
  FaFile as FileIconFilled,
  FaGithub as GithubIconFilled,
} from "react-icons/fa";
import { MdClose as CloseIcon } from "react-icons/md";
import { CiImport as ImportIcon } from "react-icons/ci";
import { MdSearch as SearchIcon } from "react-icons/md";
import { HiUser as UserFilled } from "react-icons/hi2";
import { LuDownload as ImportCodeIcon2 } from "react-icons/lu";
import { FiLoader as LoaderIcon } from "react-icons/fi";
import {
  FileClickReq,
  FolderClickReq,
  GetLsData,
  GetRepoContents,
  SearchGithubUser,
  SetLsData,
} from "../Data/Action";
import {
  CLEAR_USERNAME_INP,
  CODEINPCHANGE,
  Context,
  HIDE_TOGGLE_TO_FILE,
  SHOW_REPO_TOGGLE,
} from "../Data/Context";

const Navbar = ({ isBelow480px }: any) => {
  const {
    dispatch,
    loadingImport,
    errorImport,
    reposList,
    importMessage,
    contentsArr,
    toggleToFile,
    clickedFileData,
    downloadFileLink,
    clickedFileName,
    currentRepoName,
    pathsArr,
  } = useContext(Context);
  const chakraToast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef<HTMLInputElement>(null);
  const [userNameInp, setInpVal] = useState(GetLsData()?.githubId || "");
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Submit Username Search
  const userNameSubmit = async (e: any) => {
    e.preventDefault();
    if (!loadingImport) {
      SearchGithubUser(dispatch, userNameInp);
    }
  };

  // Repo Path Click handler
  const repoClick = (repoName: string) => {
    if (!loadingImport) {
      GetRepoContents(dispatch, chakraToast, repoName);
    }
  };

  // Folder Click handler
  const folderClickHandler = (folderPath: string) => {
    if (!loadingImport) {
      FolderClickReq(dispatch, chakraToast, currentRepoName, folderPath);
    }
  };

  // File Click handler
  const fileClickHandler = (filePath: string) => {
    if (!loadingImport) {
      FileClickReq(dispatch, chakraToast, currentRepoName, filePath);
    }
  };

  // Download File
  const handleDownloadFile = async () => {
    setDownloadLoading(true);
    const response = await fetch(downloadFileLink);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = clickedFileName;
    link.click();
    setDownloadLoading(false);
  };

  // Clear Function
  const handleClear = () => {
    setInpVal("");
    dispatch({ type: CLEAR_USERNAME_INP });
    const editorTheme = GetLsData()?.editorTheme || "Cobalt";
    SetLsData({ editorTheme });
  };

  useEffect(() => {
    console.log("pathsArr :", pathsArr);
  }, [pathsArr]);

  return (
    <Box css={css.Outer}>
      <Box css={css.TopNavBox}>
        <Box css={css.Title}>
          <Image src={Logo} />
          <Box>
            <Text fontFamily="var(--megrim)">CodeWizard</Text>
            {isBelow480px && <Text css={css.SecondTitle}>AI Code Editor</Text>}
          </Box>
        </Box>
        {!isBelow480px && <Text css={css.SecondTitle}>AI Code Editor</Text>}
        <Button onClick={onOpen} css={css.ImportBtn}>
          <GithubIconFilled />
          <Text>Import</Text>
        </Button>

        <Modal
          isCentered
          isOpen={isOpen}
          onClose={onClose}
          blockScrollOnMount={true}
          initialFocusRef={initialRef}
          size={["xs", "md", "2xl", "3xl"]}
        >
          <ModalOverlay
            bg="blackAlpha.300"
            backdropFilter="blur(10px) hue-rotate(90deg)"
          />
          <ModalContent css={css.ModalContentCss}>
            <ModalHeader css={css.ModalHeaderCss}>
              {GetLsData()?.userName && (
                <Text className="userNameCss">
                  Hi, <span>{GetLsData()?.userName || ""}</span>
                </Text>
              )}
              <Text className="importCodeHeader">
                <ImportIcon /> Import Code from Github <GithubIconFilled />
              </Text>
              <CloseIcon onClick={onClose} />
            </ModalHeader>

            <ModalBody css={css.ModalBodyCss}>
              <form onSubmit={userNameSubmit}>
                <Box
                  onClick={() =>
                    initialRef.current && initialRef.current.focus()
                  }
                >
                  {(function () {
                    const userAvatar = GetLsData()?.avatar_url || "";
                    return userAvatar ? (
                      <Image src={userAvatar} />
                    ) : (
                      <UserFilled />
                    );
                  })()}
                </Box>
                <input
                  ref={initialRef}
                  value={userNameInp}
                  onChange={(e) => {
                    setInpVal(e.target.value);
                    dispatch({ type: HIDE_TOGGLE_TO_FILE });
                  }}
                  placeholder="Enter Github Username"
                  required
                  type="text"
                  disabled={loadingImport}
                  style={{ cursor: loadingImport ? "not-allowed" : "text" }}
                />
                <Button
                  isDisabled={loadingImport}
                  style={{ cursor: loadingImport ? "wait" : "pointer" }}
                  type="submit"
                >
                  <SearchIcon />
                </Button>
                <Button
                  style={{ cursor: loadingImport ? "wait" : "pointer" }}
                  isDisabled={loadingImport}
                  onClick={handleClear}
                  type="button"
                >
                  <CloseIcon />
                </Button>
              </form>

              {loadingImport && !errorImport && (
                <Box css={css.Loader1OuterDiv}>
                  <Progress
                    colorScheme="var(--bgC)"
                    isIndeterminate
                    className="importCodeProgess"
                  />
                  <Box>
                    <Box css={css.Loader1}></Box>
                  </Box>
                </Box>
              )}

              {!loadingImport && errorImport && (
                <Box css={css.ErrorBoxCss}>
                  {importMessage == "Not Found" ? (
                    <Box>
                      <Image src={NoUserFoundImg} alt={importMessage} />
                      <Text>
                        No user found with username ' <span>{userNameInp}</span>{" "}
                        '
                      </Text>
                    </Box>
                  ) : (
                    <Box>
                      <Image src={NoDataImg} alt={importMessage} />
                      <Text>{importMessage}</Text>
                    </Box>
                  )}
                </Box>
              )}

              {!loadingImport && !errorImport && (
                <Box flexGrow={1} overflow="hidden">
                  {reposList.length == 0 &&
                    contentsArr.length == 0 &&
                    !toggleToFile && (
                      <Box css={css.ContentDivOuter}>
                        <Image src={ImportLogo} alt="Import from Github" />
                      </Box>
                    )}

                  {/* Repos */}
                  {reposList.length > 0 &&
                    contentsArr.length == 0 &&
                    !toggleToFile && (
                      <Box css={css.RepoListOuterDiv}>
                        <Box className="selectRepoTextDiv">
                          <RepoIconOutline />
                          <Text>Select Repository</Text>
                        </Box>
                        <Box className="containerDiv">
                          {reposList?.map(
                            (repoListItem: any, repoListInd: number) => (
                              <Box
                                key={repoListItem?.id + repoListInd}
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  repoClick(repoListItem?.name);
                                }}
                              >
                                <RepoIconOutline />
                                <Text>{repoListItem?.name}</Text>
                              </Box>
                            )
                          )}
                        </Box>
                      </Box>
                    )}

                  {/* Folders */}
                  {reposList.length == 0 &&
                    contentsArr.length > 0 &&
                    !toggleToFile && (
                      <Box css={css.RepoListOuterDiv}>
                        <Box className="selectRepoTextDiv">
                          <RepoIconOutline />
                          <Box>
                            <Text
                              onClick={(e: any) => {
                                e.stopPropagation();
                                if (pathsArr.length > 0) {
                                  repoClick(currentRepoName);
                                }
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              {currentRepoName}
                            </Text>
                            {pathsArr.length > 0 &&
                              pathsArr?.map(
                                (pathItem: any, pathInd: number) => (
                                  <>
                                    /
                                    <Text
                                      onClick={(e: any) => {
                                        e.stopPropagation();
                                        if (
                                          pathItem?.index !=
                                          pathsArr.length - 1
                                        ) {
                                          folderClickHandler(pathItem?.path);
                                        }
                                      }}
                                      style={{
                                        cursor:
                                          pathItem?.index != pathsArr.length - 1
                                            ? "pointer"
                                            : "not-allowed",
                                      }}
                                      key={pathItem?.name + pathInd}
                                    >
                                      {pathItem?.name || ""}
                                    </Text>
                                  </>
                                )
                              )}
                          </Box>
                        </Box>

                        <Box className="containerDiv">
                          {contentsArr?.map(
                            (contentsArrItem: any, contentsArrInd: number) => (
                              <Box
                                onClick={() =>
                                  contentsArrItem?.type == "dir"
                                    ? folderClickHandler(contentsArrItem?.path)
                                    : fileClickHandler(contentsArrItem?.path)
                                }
                                key={contentsArrItem?.sha + contentsArrInd}
                              >
                                {contentsArrItem?.type == "dir" ? (
                                  <FolderIconOutline />
                                ) : (
                                  <FileIconOutline />
                                )}
                                <Text>{contentsArrItem?.name}</Text>
                              </Box>
                            )
                          )}
                        </Box>
                      </Box>
                    )}

                  {/* File */}
                  {reposList.length == 0 &&
                    contentsArr.length == 0 &&
                    toggleToFile && (
                      <Box css={css.RepoListOuterDiv}>
                        <Box className="selectRepoTextDiv">
                          <RepoIconOutline />
                          <Box>
                            <Text
                              onClick={(e: any) => {
                                e.stopPropagation();
                                repoClick(currentRepoName);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              {currentRepoName}
                            </Text>
                            {pathsArr.length > 0 &&
                              pathsArr?.map(
                                (pathItem: any, pathInd: number) => (
                                  <>
                                    /
                                    <Text
                                      onClick={(e: any) => {
                                        e.stopPropagation();
                                        if (
                                          pathItem?.index !=
                                          pathsArr.length - 1
                                        ) {
                                          folderClickHandler(pathItem?.path);
                                        }
                                      }}
                                      style={{
                                        cursor:
                                          pathItem?.index != pathsArr.length - 1
                                            ? "pointer"
                                            : "not-allowed",
                                      }}
                                      key={pathItem?.name + pathInd}
                                    >
                                      {pathItem?.name || ""}
                                    </Text>
                                  </>
                                )
                              )}
                          </Box>
                        </Box>

                        <Box className="containerDiv">
                          <pre>{clickedFileData}</pre>
                        </Box>
                      </Box>
                    )}
                </Box>
              )}
            </ModalBody>

            <ModalFooter
              style={{
                justifyContent: toggleToFile ? "space-between" : "flex-end",
              }}
              css={css.ImportFooterCss}
            >
              {toggleToFile && (
                <Box>
                  <Button
                    onClick={() => {
                      dispatch({
                        type: CODEINPCHANGE,
                        payload: clickedFileData,
                      });
                      onClose();
                    }}
                    type="button"
                  >
                    <ImportCodeIcon />
                    Import Code
                  </Button>
                  <Button
                    onClick={handleDownloadFile}
                    isDisabled={downloadLoading}
                    type="button"
                  >
                    {downloadLoading ? <LoaderIcon /> : <ImportCodeIcon2 />}
                    {downloadLoading ? "Downloading..." : "Download File"}
                  </Button>
                </Box>
              )}

              <Box>
                {pathsArr.length > 0 && reposList.length == 0 && (
                  <Button
                    onClick={(e: any) => {
                      e.stopPropagation();
                      if (pathsArr.length >= 2) {
                        folderClickHandler(pathsArr[pathsArr.length - 2]?.path);
                      } else {
                        repoClick(currentRepoName);
                      }
                    }}
                    type="button"
                  >
                    <GoBackIcon />
                    Go Back
                  </Button>
                )}

                {reposList.length == 0 &&
                  (contentsArr.length > 0 || toggleToFile) && (
                    <Button
                      onClick={(e: any) => {
                        dispatch({ type: SHOW_REPO_TOGGLE });
                        userNameSubmit(e);
                      }}
                      type="button"
                    >
                      <RepoIconOutline />
                      All Repos
                    </Button>
                  )}
              </Box>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default Navbar;
