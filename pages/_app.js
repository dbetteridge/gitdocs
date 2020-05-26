import "github-markdown-css";
import "./app.css";
import Themer from "../components/Themed";
import NavBar from "../components/NavBar";
import { Flex } from "rebass";
import { StateProvider } from "../contexts/store";

export default function MyApp({ Component, pageProps }) {
  return (
    <Themer>
      <StateProvider>
        <Flex width={1} height={"100%"} flexDirection={"column"}>
          <NavBar />
          <Component {...pageProps} />
        </Flex>
      </StateProvider>
    </Themer>
  );
}
