import "github-markdown-css";
import "./app.css";
import "antd/dist/antd.css";
import Themer from "@components/Themed";
import NavBar from "@components/NavBar";
import { StateProvider } from "../contexts/store";
import Head from "next/head";
import { Layout } from "antd";

const { Content } = Layout;

export default function MyApp({ Component, pageProps }) {
  return (
    <Themer>
      <StateProvider>
        <Head>
          <title>Gitdocs</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <NavBar />
        <Layout style={{ minHeight: "calc(100vh - 50px)" }}>
          <Layout>
            <Content>
              <Component {...pageProps} />
            </Content>
          </Layout>
        </Layout>
      </StateProvider>
    </Themer>
  );
}
