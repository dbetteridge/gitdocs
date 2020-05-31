import "github-markdown-css";
import "./app.css";
import Themer from "../components/Themed";
import NavBar from "../components/NavBar";
import { Flex } from "rebass";
import { StateProvider } from "../contexts/store";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return (
    <Themer>
      <StateProvider>
        <Head>
          <title>My page title</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Flex width={1} height={"100%"} flexDirection={"column"}>
          <NavBar />
          <Component {...pageProps} />
        </Flex>
      </StateProvider>
    </Themer>
  );
}
