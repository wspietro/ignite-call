import type { AppProps } from 'next/app'
import { globalStyles } from '../styles/global'

globalStyles(); // Carregado apenas uma única vez

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
