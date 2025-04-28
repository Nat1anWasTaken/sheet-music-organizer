"use client";

import { ChakraProvider, createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "JetBrains Mono, monospace" },
        body: { value: "JetBrains Mono, monospace" },
        mono: { value: "JetBrains Mono, monospace" },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

export function Provider(props: ColorModeProviderProps) {
  return (
    // 2. Pass the custom theme to ChakraProvider
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
